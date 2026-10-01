import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Check if already logged in
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } catch (e) {
        navigate('/home');
      }
    }

    // Generate Minimal Floating Bubbles
    const bubbleCount = Math.floor(Math.random() * 5) + 6;
    const newBubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 6 + 6;
      const maxOpacity = Math.random() * 0.2 + 0.15;
      
      let left;
      if (Math.random() > 0.5) {
        left = Math.random() * 25; // Left side
      } else {
        left = Math.random() * 25 + 75; // Right side
      }
      
      const drift = (Math.random() * 40 - 20) + 'px';
      const delay = Math.random() * 6;
      
      newBubbles.push({
        id: i,
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        '--duration': `${duration}s`,
        '--max-opacity': maxOpacity,
        '--drift': drift,
        animationDelay: `${delay}s`,
      });
    }
    setBubbles(newBubbles);
  }, [navigate]);

  return (
    <div className="bg-brandBg min-h-screen text-gray-800 flex flex-col">
      {/* Header specific to landing page */}
      <header className="w-full py-6 px-6 sm:px-12 flex justify-between items-center z-50 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/loundery logo.png" alt="Laundry Logo" className="h-12 w-12 rounded-md bg-white p-1 shadow-sm" />
          <div>
            <h1 className="font-bold text-xl leading-none text-brand">ELITE</h1>
            <p className="font-medium text-sm leading-none text-brand">CLEAN</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-brand font-semibold hover:text-orangeBtn transition">Login</Link>
          <Link to="/signup" className="bg-brand text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand/90 transition shadow-md">Sign Up</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 sm:px-12 pb-12 pt-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <p className="text-orangeBtn uppercase tracking-widest font-semibold text-sm mb-4">Your Premium Laundry Partner</p>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black text-brand leading-[1.05] mb-6 tracking-tight">
              Fresh Clothes,<br />Zero Hassle.
            </h2>
            <p className="text-brandLight text-lg mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Compare and book nearby laundry partners through one platform. Pickup, cleaning, and delivery — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
              <Link to="/signup" className="bg-orangeBtn hover:bg-orangeHover text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orangeBtn/30 hover:scale-[1.02] text-center">Get Started Now</Link>
              <Link to="/login" className="bg-white text-brand border border-brand/20 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-gray-50 shadow-sm text-center">Login to Account</Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-2xl mx-auto md:mx-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand"><i className="ri-truck-line text-lg"></i></div>
                <span className="font-medium text-brand text-sm">Pickup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand"><i className="ri-store-2-line text-lg"></i></div>
                <span className="font-medium text-brand text-sm">Partners</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand"><i className="ri-time-line text-lg"></i></div>
                <span className="font-medium text-brand text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand"><i className="ri-map-pin-time-line text-lg"></i></div>
                <span className="font-medium text-brand text-sm">Live Tracking</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-[45%] flex justify-center mt-12 md:mt-0 relative hero-img-container">
            {/* Background radial glow */}
            <div className="hero-glow-bg w-full max-w-md mx-auto"></div>

            {/* Idle Animation Wrapper */}
            <div className="hero-idle-anim relative w-full max-w-md">
              {/* Particle Layer for Bubbles */}
              <div className="particle-layer" id="particles">
                {bubbles.map(bubble => (
                  <div key={bubble.id} className="bubble" style={bubble}></div>
                ))}
              </div>

              {/* Main Image Wrapper with Gradient Border */}
              <div className="hero-img-wrapper">
                <div className="hero-img-inner">
                  <img src="/indin women washing.jpg" alt="Premium Laundry Service" className="w-full h-auto object-cover aspect-[4/5]" />
                  <div className="hero-shine"></div>
                </div>
                {/* Sparkles */}
                <div className="hero-sparkle"></div>
                <div className="hero-sparkle"></div>
                <div className="hero-sparkle"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
