import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createHotel } from '../store/hotelsSlice';
import HotelForm from '../components/HotelForm';

const AddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddSubmit = async (data) => {
    try {
      await dispatch(createHotel(data)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to add hotel:', error);
    }
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>Add New Hotel | Stayora</title>
      </Helmet>
      
      <div className="form-container">
        <h1>Add New Hotel</h1>
        <HotelForm onSubmit={handleAddSubmit} isEdit={false} />
      </div>
    </div>
  );
};

export default AddPage;
