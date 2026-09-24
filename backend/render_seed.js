import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://stayora_user:2Rbh6LhZPWNlOjmOsqjAuNAdbdh8KSqp@dpg-daqcna3ncjis739gku10-a.ohio-postgres.render.com/stayora',
  ssl: { rejectUnauthorized: false }
});

const images = [
  'https://images.unsplash.com/photo-1542314831-c6a4d14eff50?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618773928120-2e15dc3ce8aa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1562790998-54c330c8dc82?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592229505726-2eb1e57c1c71?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574643156929-51fa098b0394?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554647286-f365d7defc2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'
];

const specificHotels = [
  { title: 'The Taj Mahal Palace', desc: 'Iconic sea-facing luxury hotel offering panoramic views of the Arabian Sea.', lat: 18.9217, lng: 72.8332, price: 22000 },
  { title: 'ITC Grand Chola', desc: 'A palatial tribute to Southern India\'s greatest empires, this luxury collection hotel offers regal accommodations.', lat: 13.0104, lng: 80.2206, price: 18500 },
  { title: 'Rambagh Palace', desc: 'Experience the finest traditions of Rajput hospitality in this magnificent palace originally built in 1835.', lat: 26.8973, lng: 75.8078, price: 45000 },
  { title: 'Taj Lake Palace', desc: 'Floating like a jewel in the middle of Lake Pichola, this 18th-century palace provides a breathtaking setting.', lat: 24.5753, lng: 73.6797, price: 38000 },
  { title: 'The Leela Palace Bengaluru', desc: 'Nestled amidst lush gardens, this palace hotel perfectly captures the essence of India\'s rich royal heritage.', lat: 12.9602, lng: 77.6485, price: 21000 },
  { title: 'Taj Falaknuma Palace', desc: 'Elevated 2000 feet above the city, this enchanting 19th-century palace was formerly the residence of the Nizam.', lat: 17.3299, lng: 78.4673, price: 42000 },
  { title: 'Grand Hyatt Kochi', desc: 'A spectacular waterfront resort on Bolgatty Island overlooking the serene backwaters of Lake Vembanad.', lat: 9.9822, lng: 76.2711, price: 12500 },
  { title: 'The Imperial New Delhi', desc: 'An iconic luxury hotel offering a unique blend of Victorian, Colonial, and Art Deco styles.', lat: 28.6234, lng: 77.2185, price: 24000 },
  { title: 'Vivanta by Taj Coimbatore', desc: 'A contemporary luxury hotel located perfectly in the heart of the city, bringing modern styling and traditional warmth.', lat: 11.0045, lng: 76.9616, price: 8500 },
  { title: 'Heritage Madurai', desc: 'Experience the ancient city of Madurai from this tranquil resort offering sprawling banyan trees and temple-inspired architecture.', lat: 9.9390, lng: 78.1155, price: 9500 },
  { title: 'Kumarakom Lake Resort', desc: 'Heritage luxury retreat situated by the backwaters of Kerala, featuring traditional Keralan villas.', lat: 9.6171, lng: 76.4293, price: 18000 },
  { title: 'Evolve Back Coorg', desc: 'Tucked within a 300-acre working coffee and spice plantation, offering private pool villas.', lat: 12.3375, lng: 75.8069, price: 26000 },
  { title: 'The Oberoi Amarvilas', desc: 'Located just 600 meters from the Taj Mahal, providing uninterrupted views of the monument from every room.', lat: 27.1751, lng: 78.0421, price: 52000 },
  { title: 'ITC Windsor', desc: 'A majestic luxury hotel reminiscent of the British Regency era, featuring elegant architecture.', lat: 12.9868, lng: 77.5847, price: 15500 },
  { title: 'Trident Nariman Point', desc: 'Standing tall on the famous Marine Drive, offering impeccable service and stunning panoramic views.', lat: 18.9274, lng: 72.8211, price: 16500 },
  { title: 'Wildflower Hall', desc: 'A fairy-tale luxury resort set in a dense cedar forest at 8000 feet, offering spectacular views of the Himalayas.', lat: 31.1048, lng: 77.1734, price: 32000 },
  { title: 'Taj Exotica Resort & Spa', desc: 'Mediterranean-style luxury resort set along the pristine Benaulim beach in South Goa.', lat: 15.2570, lng: 73.9142, price: 21500 },
  { title: 'Sujan Jawai', desc: 'An extraordinary wilderness camp nestled between dramatic granite boulders, offering a luxurious safari experience.', lat: 25.0744, lng: 73.1368, price: 65000 },
  { title: 'Umaid Bhawan Palace', desc: 'One of the world\'s largest private residences, this golden-hued desert sandstone monument is magnificent.', lat: 26.2804, lng: 73.0471, price: 58000 },
  { title: 'The Leela Kovalam', desc: 'India\'s only cliff-top beach resort offering breathtaking panoramic views of the Kovalam coastline.', lat: 8.3853, lng: 76.9746, price: 19500 },
  { title: 'The Oberoi Udaivilas', desc: 'Located on the banks of Lake Pichola, this luxury resort offers unparalleled grand architecture and serene courtyards.', lat: 24.5772, lng: 73.6765, price: 48000 },
  { title: 'Taj Lands End', desc: 'Overlooking the Arabian Sea and the Bandra Worli Sea Link, this hotel provides a tranquil escape in Mumbai.', lat: 19.0435, lng: 72.8193, price: 17500 },
  { title: 'JW Marriott Mussoorie', desc: 'A luxury resort in the Himalayas offering majestic views, a sprawling spa, and elegant accommodations.', lat: 30.4704, lng: 78.0583, price: 21000 },
  { title: 'The Tamara Coorg', desc: 'Experience nature at its best at this eco-friendly luxury resort nestled in the hills of Coorg.', lat: 12.2223, lng: 75.6444, price: 25000 },
  { title: 'Ananda in the Himalayas', desc: 'A world-renowned luxury wellness retreat situated in the foothills of the Himalayas overlooking Rishikesh.', lat: 30.1555, lng: 78.3090, price: 55000 },
  { title: 'The Khyber Himalayan Resort', desc: 'Located in Gulmarg, this premium resort offers stunning views of the Affarwat peaks and luxurious comfort.', lat: 34.0487, lng: 74.3805, price: 30000 },
  { title: 'Taj Fisherman\'s Cove', desc: 'Built on the ramparts of an old Dutch fort, this charming beach resort offers a relaxing coastal getaway.', lat: 12.7844, lng: 80.2452, price: 16000 },
  { title: 'The Oberoi New Delhi', desc: 'A sophisticated luxury hotel with state-of-the-art facilities, fine dining, and beautiful views of the Delhi Golf Course.', lat: 28.5982, lng: 77.2384, price: 27000 },
  { title: 'The Serai Jaisalmer', desc: 'A luxury desert camp inspired by the royal caravan sites of Rajputana, offering an unforgettable experience.', lat: 26.9157, lng: 70.9083, price: 40000 },
  { title: 'Aman-i-Khás', desc: 'An exclusive luxury wildlife camp offering tented accommodations on the threshold of Ranthambore National Park.', lat: 26.0173, lng: 76.5026, price: 85000 },
];

const seedRenderDB = async () => {
  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        latitude NUMERIC(10, 8),
        longitude NUMERIC(11, 8),
        price NUMERIC(10, 2) NOT NULL,
        image VARCHAR(255)
      )
    `);
    
    await client.query('TRUNCATE hotels RESTART IDENTITY');

    let count = 0;
    for (let i = 0; i < specificHotels.length; i++) {
      const h = specificHotels[i];
      const img = images[i % images.length];
      await client.query(
        'INSERT INTO hotels (title, description, latitude, longitude, price, image) VALUES ($1, $2, $3, $4, $5, $6)',
        [h.title, h.desc, h.lat, h.lng, h.price, img]
      );
      count++;
    }
    console.log(`Successfully migrated and seeded ${count} specific luxury hotels to Render!`);
    client.release();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
  process.exit();
};

seedRenderDB();
