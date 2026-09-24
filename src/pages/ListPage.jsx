import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import { fetchHotels, removeHotel } from '../store/hotelsSlice';

const ListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: hotels, totalCount, status } = useSelector((state) => state.hotels);

  const searchTerm = searchParams.get('search') || '';
  const priceRange = {
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || ''
  };
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('limit') || '10', 10);

  const [toast, setToast] = useState('');

  const updateParams = (updates) => {
    setSearchParams(prev => {
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (value === '' || value === null || (key === 'page' && value === 1)) {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
      });
      return prev;
    }, { replace: true });
  };

  const setSearchTerm = (term) => updateParams({ search: term, page: 1 });
  const setPriceRange = (range) => updateParams({ min: range.min, max: range.max, page: 1 });
  const setCurrentPage = (page) => updateParams({ page });
  const setItemsPerPage = (limit) => updateParams({ limit, page: 1 });

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      dispatch(fetchHotels({
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        page: currentPage,
        limit: itemsPerPage
      }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [dispatch, searchTerm, priceRange.min, priceRange.max, currentPage, itemsPerPage]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      await dispatch(removeHotel(id));
      setToast('Hotel deleted successfully.');
      setTimeout(() => setToast(''), 3000);
      
      dispatch(fetchHotels({
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        page: currentPage,
        limit: itemsPerPage
      }));
    }
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>Hotels List | Stayora</title>
        <meta name="description" content="Browse our selection of beautiful hotels." />
      </Helmet>
      
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">Discover hotels, heritage stays and modern resorts across India.</p>
        </div>
      </div>

      <div className="list-layout">
        <FilterSidebar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClearFilters={handleClearFilters}
        />
        
        <main className="content">
          <header className="content-header">
            <h1>Total Number of Hotels: {totalCount}</h1>
            <p>Showing {hotels.length} hotels in this page</p>
          </header>
          
          <div className="hotel-list">
            {status === 'loading' ? (
              <p>Loading hotels...</p>
            ) : hotels.length > 0 ? (
              hotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No hotels found matching your criteria.</p>
              </div>
            )}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </main>
      </div>

      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ListPage;
