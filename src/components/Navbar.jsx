import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Stayora</NavLink>
      </div>
      <nav className="navbar-nav">
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active-link' : ''}
              end
            >
              Hotels
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add"
              className={({ isActive }) => isActive ? 'active-link' : ''}
            >
              Add Hotel
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
