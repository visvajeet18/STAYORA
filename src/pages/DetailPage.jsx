import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { fetchHotelById } from '../store/hotelsSlice';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const hotelFromState = useSelector(state => state.hotels.items.find(h => h.id == id));
  
  const [hotel, setHotel] = useState(hotelFromState);
  const [loading, setLoading] = useState(!hotelFromState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelFromState) {
      setLoading(true);
      dispatch(fetchHotelById(id))
        .unwrap()
        .then((data) => {
          setHotel(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Hotel not found');
          setLoading(false);
        });
    } else {
      setHotel(hotelFromState);
    }
  }, [id, hotelFromState, dispatch]);

  if (loading) {
    return <div className="page-container"><div className="empty-state"><h2>Loading...</h2></div></div>;
  }

  if (error || !hotel) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>{error || 'Hotel not found'}</h2>
          <br />
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const backendBaseUrl = import.meta.env.PROD ? 'https://stayora-89i1.onrender.com' : 'http://localhost:5000';
  const imgUrl = hotel.image ? (hotel.image.startsWith('/') ? `${backendBaseUrl}${hotel.image}` : hotel.image) : '';
  const position = [hotel.latitude, hotel.longitude];

  return (
    <div className="page-container">
      <Helmet>
        
        <title>{hotel.title} | Stayora</title>
        <meta name="description" content={hotel.description.substring(0, 150)} />
      </Helmet>
      
      <div className="detail-header">
        <Link to="/" className="btn btn-outline">&larr; Back to List</Link>
        <div className="action-group">
          <Link to={`/edit/${hotel.id}`} className="btn btn-primary">Edit Hotel</Link>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-image-container">
            <img src={imgUrl} alt={hotel.title} className="detail-image" />
          </div>
          
          <div className="detail-info" style={{ marginTop: '2rem' }}>
            <div className="detail-title-row">
              <div>
                <h1>{hotel.title}</h1>
              </div>
              <span className="detail-price">₹{Number(hotel.price).toLocaleString('en-IN')} / night</span>
            </div>
            <p className="detail-description">{hotel.description}</p>
          </div>
        </div>

        <div className="detail-map-section">
          <h2>Location Map</h2>
          <p className="map-coordinates">Latitude: {hotel.latitude}, Longitude: {hotel.longitude}</p>
          <div className="map-container">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  {hotel.title}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
