import { useState, useEffect } from 'react';

const HotelForm = ({ initialData, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    latitude: '',
    longitude: '',
    image: null,
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        image: null,
        imageUrl: initialData.image && !initialData.image.startsWith('/') ? initialData.image : ''
      });
      if (initialData.image) {
        setPreview(initialData.image.startsWith('/') ? `http://localhost:5000${initialData.image}` : initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url, image: null }));
    setPreview(url);
    if (errors.image) setErrors(prev => ({ ...prev, image: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, imageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.image) setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.latitude === '' || isNaN(formData.latitude) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.longitude === '' || isNaN(formData.longitude) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    if (!isEdit && !formData.image && !formData.imageUrl.trim()) {
      newErrors.image = 'An image file or URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('price', formData.price);
      fd.append('latitude', formData.latitude);
      fd.append('longitude', formData.longitude);
      
      if (formData.image) {
        fd.append('image', formData.image);
      } else if (formData.imageUrl.trim()) {
        fd.append('image', formData.imageUrl.trim());
      }
      
      onSubmit(fd);
    }
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <label>Hotel Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Taj Mahal Palace" />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Price (₹ per night)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" placeholder="e.g. 3500" />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label>Latitude (-90 to 90)</label>
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} step="any" placeholder="e.g. 18.5204" />
        {errors.latitude && <span className="error-text">{errors.latitude}</span>}
      </div>

      <div className="form-group">
        <label>Longitude (-180 to 180)</label>
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} step="any" placeholder="e.g. 73.8567" />
        {errors.longitude && <span className="error-text">{errors.longitude}</span>}
      </div>

      <div className="form-group full-width">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Briefly describe the hotel..." />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group full-width">
        <label>Hotel Image</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>OR</div>
          <input 
            type="text" 
            name="imageUrl" 
            value={formData.imageUrl} 
            onChange={handleImageUrlChange} 
            placeholder="Paste image URL here (e.g., https://example.com/image.jpg)" 
          />
        </div>
        {errors.image && <span className="error-text">{errors.image}</span>}
        
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
          </div>
        )}
      </div>

      <div className="form-actions full-width">
        <button type="submit" className="btn btn-primary btn-large">{isEdit ? 'Save Changes' : 'Add Hotel'}</button>
      </div>
    </form>
  );
};

export default HotelForm;

