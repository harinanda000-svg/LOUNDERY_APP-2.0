import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Do not render Navbar on landing, login, or signup pages
  if (['/', '/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleScroll = (id) => {
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link to="/home" className="flex items-center gap-2 group">
          <img src="/loundery logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 rounded bg-brandBg p-1 shadow-sm group-hover:shadow-md transition-all" />
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-none text-brand">ELITE</h1>
            <p className="font-medium text-xs md:text-sm leading-none text-brandLight">CLEAN</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => handleScroll('home')} className="text-sm font-semibold text-brand hover:text-orangeBtn transition-colors">Home</button>
          <button onClick={() => handleScroll('how-it-works')} className="text-sm font-semibold text-gray-500 hover:text-orangeBtn transition-colors">How It Works</button>
          <button onClick={() => handleScroll('partners')} className="text-sm font-semibold text-gray-500 hover:text-orangeBtn transition-colors">Partners</button>
          <button onClick={() => handleScroll('services')} className="text-sm font-semibold text-gray-500 hover:text-orangeBtn transition-colors">Services</button>
          <button onClick={() => handleScroll('tracking')} className="text-sm font-semibold text-gray-500 hover:text-orangeBtn transition-colors">Track Order</button>
          <Link to="/customers" className="text-sm font-semibold text-gray-500 hover:text-orangeBtn transition-colors">Customers</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative group">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
            <input type="text" placeholder="Search partners..." className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none text-sm w-48 focus:w-64 transition-all" />
          </div>
          <button onClick={handleLogout} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2">
            <i className="ri-logout-box-r-line"></i> Logout
          </button>
        </div>
        
        {/* Mobile menu toggle (placeholder for responsiveness) */}
        <div className="lg:hidden">
          <button className="text-gray-500 hover:text-brand text-2xl">
            <i className="ri-menu-3-line"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
