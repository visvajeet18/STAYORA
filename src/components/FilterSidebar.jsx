const FilterSidebar = ({ searchTerm, setSearchTerm, priceRange, setPriceRange, onClearFilters }) => {
  return (
    <aside className="sidebar">
      <h2>Search & Filter</h2>

      <div className="filter-group">
        <label htmlFor="search">Search by Title</label>
        <input
          type="text"
          id="search"
          placeholder="Your Choice"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        
        <input 
          type="range" 
          min="0" 
          max="10000" 
          step="500"
          value={priceRange.min || 0} 
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          style={{ width: '100%', margin: '15px 0' }}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
            <span style={{ fontSize: '14px', marginBottom: '5px', color: '#555' }}>Min</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}>
              <span style={{ color: '#666' }}>₹</span>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{ width: '100%', padding: '8px 4px', border: 'none', outline: 'none' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
            <span style={{ fontSize: '14px', marginBottom: '5px', color: '#555' }}>Max</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}>
              <span style={{ color: '#666' }}>₹</span>
              <input
                type="number"
                placeholder="100000"
                min="0"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{ width: '100%', padding: '8px 4px', border: 'none', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-outline" onClick={onClearFilters} style={{ width: '100%', marginTop: '1rem' }}>
        Clear Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
