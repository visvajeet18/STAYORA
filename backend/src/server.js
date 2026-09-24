import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { checkConnection, query } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/hotels', upload.single('image'), async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const insertQuery = `
      INSERT INTO hotels (title, description, latitude, longitude, price, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, description, latitude, longitude, price, image];
    
    const result = await query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    let { search, minPrice, maxPrice, page, limit } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    if (pageNum < 1 || limitNum < 1) {
       return res.status(400).json({ error: 'Invalid page or limit values' });
    }

    const minPriceNum = minPrice ? parseFloat(minPrice) : null;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

    if ((minPrice && isNaN(minPriceNum)) || (maxPrice && isNaN(maxPriceNum))) {
       return res.status(400).json({ error: 'Invalid price filters' });
    }

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`title ILIKE $${paramIndex}`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (minPriceNum !== null) {
      conditions.push(`price >= $${paramIndex}`);
      values.push(minPriceNum);
      paramIndex++;
    }

    if (maxPriceNum !== null) {
      conditions.push(`price <= $${paramIndex}`);
      values.push(maxPriceNum);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM hotels ${whereClause}`;
    const countResult = await query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    const offset = (pageNum - 1) * limitNum;
    const dataQuery = `
      SELECT * FROM hotels 
      ${whereClause} 
      ORDER BY id ASC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    const dataValues = [...values, limitNum, offset];

    const result = await query(dataQuery, dataValues);

    res.json({
      hotels: result.rows,
      currentPage: pageNum,
      limit: limitNum,
      totalCount,
      totalPages
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM hotels WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/hotels/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const existingHotelResult = await query('SELECT image FROM hotels WHERE id = $1', [id]);
    if (existingHotelResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    const oldImage = existingHotelResult.rows[0].image;

    let image = req.body.image !== undefined ? req.body.image : oldImage;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updateQuery = `
      UPDATE hotels
      SET title = $1, description = $2, latitude = $3, longitude = $4, price = $5, image = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [title, description, latitude, longitude, price, image, id];

    const result = await query(updateQuery, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/hotels/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM hotels WHERE id = $1 RETURNING *;';
    const result = await query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const deletedHotel = result.rows[0];
    if (deletedHotel.image && deletedHotel.image.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), deletedHotel.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const startServer = async () => {
  await checkConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
