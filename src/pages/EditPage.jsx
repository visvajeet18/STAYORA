import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { updateHotel, fetchHotelById } from '../store/hotelsSlice';
import HotelForm from '../components/HotelForm';

const EditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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

  const handleEditSubmit = async (data) => {
    try {
      await dispatch(updateHotel({ id, formData: data })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to update hotel', err);
    }
  };

  if (loading) return <div className="page-container"><div className="empty-state">Loading...</div></div>;
  if (error || !hotel) return <div className="page-container"><div className="empty-state">{error || 'Hotel not found'}</div></div>;

  return (
    <div className="page-container">
      <Helmet>
        <title>Edit Hotel | Stayora</title>
      </Helmet>
      
      <div className="form-container">
        <h1>Edit Hotel</h1>
        <HotelForm initialData={hotel} onSubmit={handleEditSubmit} isEdit={true} />
      </div>
    </div>
  );
};

export default EditPage;
