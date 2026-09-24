import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      
      <a href="https://visvajeet.vercel.app/" target="_blank" rel="noopener noreferrer" className="floating-credit">
        VISVAJEET
      </a>
    </div>
  );
}

export default App;
