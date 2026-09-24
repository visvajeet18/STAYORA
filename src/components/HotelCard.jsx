import { Link } from 'react-router-dom';

const HotelCard = ({ hotel, onDelete }) => {
  const backendBaseUrl = import.meta.env.PROD ? 'https://stayora-89i1.onrender.com' : 'http://localhost:5000';
  const imgUrl = hotel.image ? (hotel.image.startsWith('/') ? `${backendBaseUrl}${hotel.image}` : hotel.image) : '';

  const descriptionSnippet = hotel.description?.length > 100 
    ? `${hotel.description.substring(0, 100)}...` 
    : hotel.description;

  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img 
          src={imgUrl} 
          alt={hotel.title} 
          className="slider-img active"
        />
      </div>
      
      <div className="hotel-details">
        <div className="hotel-title-group">
          <h3>{hotel.title}</h3>
          <div className="hotel-location-pin">
            <span className="pin-icon">📍</span>
            <span className="coords">{Number(hotel.latitude).toFixed(2)}° N, {Number(hotel.longitude).toFixed(2)}° E</span>
          </div>
        </div>
        
        <p className="hotel-description">{descriptionSnippet}</p>
        
        <div className="hotel-price-block">
          <span className="hotel-price">₹{hotel.price?.toLocaleString('en-IN')} / night</span>
        </div>
        
        <div className="hotel-actions">
          <Link to={`/hotel/${hotel.id}`} className="btn btn-secondary">
            View Details
          </Link>
          <div className="action-group">
            <Link to={`/edit/${hotel.id}`} className="btn btn-outline">Edit</Link>
            <button onClick={() => onDelete(hotel.id)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
