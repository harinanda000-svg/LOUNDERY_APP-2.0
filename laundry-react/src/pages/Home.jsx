import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
    }

    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, [navigate]);

  const showToast = (message, type = "success") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-4 text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform transition-all duration-500 translate-x-10 opacity-0 flex items-center gap-2 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    toast.innerHTML = `<i class="${type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} text-xl"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-10', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-10', 'opacity-0');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.suburb || data.address.county || "Your Location";
              setLocation(city);
              localStorage.setItem('userLocation', city);
              showToast(`Location detected and saved: ${city}`);
            })
            .catch(() => {
              const coords = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
              setLocation(coords);
              localStorage.setItem('userLocation', coords);
              showToast("Coordinates saved successfully");
            })
            .finally(() => {
              setIsDetecting(false);
            });
        },
        (error) => {
          setIsDetecting(false);
          showToast("Unable to retrieve location. Please check browser permissions.", "error");
        }
      );
    } else {
      showToast("Geolocation is not supported by your browser.", "error");
    }
  };

  const copyToClipboard = (elementId) => {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;
    const textToCopy = textElement.innerText;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const toast = document.getElementById('copy-toast');
        if (toast) {
          toast.classList.remove('opacity-0');
          setTimeout(() => {
            toast.classList.add('opacity-0');
          }, 3000);
        }
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Fallback copy: " + textToCopy);
      });
    } else {
      alert("Copied to clipboard: " + textToCopy);
    }
  };

  const sendNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/loundery logo.png"
      });
    } else {
      showToast(body);
    }
  };

  const handleTrackerClick = (index) => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    const messages = [
      { title: "Order Placed", msg: "Your laundry order has been successfully placed." },
      { title: "Partner Assigned", msg: "A nearby elite laundry partner has been assigned." },
      { title: "Pickup Confirmed", msg: "Our executive has picked up your laundry." },
      { title: "Laundry Processing", msg: "Your clothes are currently being washed and cared for." },
      { title: "Ironing", msg: "Your clothes are being pressed to perfection." },
      { title: "Out for Delivery", msg: "Your fresh laundry is out for delivery!" },
      { title: "Delivered", msg: "Your laundry has been delivered. Enjoy the freshness!" }
    ];
    if (messages[index]) {
      sendNotification(`Elite Clean: ${messages[index].title}`, messages[index].msg);
    }
  };

  const handleBookNow = (partnerName) => {
    localStorage.setItem('selectedPartner', partnerName);
    navigate(`/booking?partner=${encodeURIComponent(partnerName)}`);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      
      {/* Hero Section */}
      <div id="home" className="hero-container min-h-screen flex flex-col pb-20">
        <div className="custom-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex flex-col pt-16 md:pt-20">
          <main className="flex-grow flex items-center pt-4 md:pt-8">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left Column: Text */}
              <div className="w-full md:w-1/2 text-center md:text-left pt-10">
                <p className="text-orangeBtn uppercase tracking-widest font-semibold text-xs md:text-sm mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-2">
                  <i className="ri-shield-star-line"></i> Trusted Laundry Aggregator Platform
                </p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand leading-[1.05] mb-4 md:mb-6 tracking-tighter">
                  Find the Best<br />Laundry Services<br />Near You
                </h1>
                <p className="text-brandLight text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                  Compare ratings, prices &amp; delivery times from multiple laundry partners in your area. Book a pickup in seconds — we handle the rest.
                </p>
                {/* Location Search */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mb-6 mx-auto md:mx-0">
                  <div className="flex-grow relative flex items-center">
                    <i className="ri-map-pin-line absolute left-4 text-orangeBtn text-lg"></i>
                    <input 
                      id="location-search" 
                      type="text" 
                      placeholder={isDetecting ? "Detecting your location..." : "Enter your location or area..."}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                    />
                    <button 
                      onClick={handleDetectLocation}
                      className={`absolute right-3 text-brandLight hover:text-brand transition-colors ${isDetecting ? 'animate-pulse text-brand' : ''}`}
                      title="Detect Location"
                    >
                      <i className="ri-gps-line text-lg"></i>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleBookNow('Elite Clean Platform')}
                    className="bg-orangeBtn hover:bg-orangeHover text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orangeBtn/30 flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.03] active:scale-[.98]">
                    <i className="ri-truck-line text-lg"></i> Book Pickup
                  </button>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-brandLight">
                  <span className="flex items-center gap-1"><i className="ri-user-star-line text-orangeBtn"></i> 10,000+ Happy Customers</span>
                  <span className="flex items-center gap-1"><i className="ri-store-2-line text-orangeBtn"></i> 200+ Laundry Partners</span>
                  <span className="flex items-center gap-1"><i className="ri-time-line text-orangeBtn"></i> 24hr Delivery</span>
                </div>
              </div>

              {/* Right Column: Hero Image */}
              <div className="w-full md:w-[55%] flex justify-center md:justify-end mt-12 md:mt-0">
                <div className="relative z-20 max-w-2xl w-full">
                  <div className="hero-accent hero-accent-1"></div>
                  <div className="hero-accent hero-accent-2"></div>
                  <div className="hero-accent hero-accent-3"></div>
                  <div className="hero-img-wrapper">
                    <img src="/indin women washing.jpg" alt="Customer relaxing" className="w-full h-auto object-cover aspect-[4/3]" />
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand/40 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                      <div className="w-8 h-8 bg-orangeBtn rounded-lg flex items-center justify-center shrink-0">
                        <i className="ri-sparkling-line text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="text-brand text-xs font-bold leading-tight">Tired of laundry day?</p>
                        <p className="text-brandLight text-[10px] leading-tight">Let our partners handle it for you</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-brandBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <p className="text-orange-500 uppercase tracking-widest font-semibold mb-2">INSIDE ELITE CLEAN</p>
              <h2 className="text-5xl font-bold text-blue-800">Our Gallery</h2>
            </div>
            <button className="bg-white px-8 py-4 rounded-full shadow-md text-blue-700 font-semibold mt-4 md:mt-0">View All Photos</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg">
              <img src="/LOUNDERY 1.jpg" className="w-full h-full object-cover" alt="Gallery 1" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-40 md:h-48">
              <img src="/LOUNDERY 2.jpg" className="w-full h-full object-cover" alt="Gallery 2" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-40 md:h-48">
              <img src="/LOUNDERY 3.webp" className="w-full h-full object-cover" alt="Gallery 3" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-40 md:h-48">
              <img src="/LOUNDERY 2.webp" className="w-full h-full object-cover" alt="Gallery 4" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md h-40 md:h-48">
              <img src="/loundery4.jpeg" className="w-full h-full object-cover" alt="Gallery 5" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal visible">
            <p className="text-orangeBtn uppercase tracking-widest font-semibold text-sm mb-2">Simple &amp; Fast</p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand">How It Works</h2>
            <p className="text-brandLight text-sm mt-3 max-w-xl mx-auto">Get your laundry done in 4 easy steps — from your phone to your doorstep.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="reveal visible text-center group">
              <div className="w-20 h-20 mx-auto bg-brandBg rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand group-hover:shadow-lg transition-all duration-300">
                <i className="ri-smartphone-line text-3xl text-brand group-hover:text-white transition-colors"></i>
              </div>
              <div className="bg-orangeBtn text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto -mt-10 mb-4 relative z-10 shadow-md">1</div>
              <h3 className="text-lg font-bold text-brand mb-2">Place Order</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Enter your location, select services, and schedule a convenient pickup time.</p>
            </div>
            <div className="reveal visible text-center group" style={{transitionDelay: '.1s'}}>
              <div className="w-20 h-20 mx-auto bg-brandBg rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand group-hover:shadow-lg transition-all duration-300">
                <i className="ri-links-line text-3xl text-brand group-hover:text-white transition-colors"></i>
              </div>
              <div className="bg-orangeBtn text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto -mt-10 mb-4 relative z-10 shadow-md">2</div>
              <h3 className="text-lg font-bold text-brand mb-2">Match with Partner</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We instantly match you with the best-rated laundry partner near your location.</p>
            </div>
            <div className="reveal visible text-center group" style={{transitionDelay: '.2s'}}>
              <div className="w-20 h-20 mx-auto bg-brandBg rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand group-hover:shadow-lg transition-all duration-300">
                <i className="ri-hand-heart-line text-3xl text-brand group-hover:text-white transition-colors"></i>
              </div>
              <div className="bg-orangeBtn text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto -mt-10 mb-4 relative z-10 shadow-md">3</div>
              <h3 className="text-lg font-bold text-brand mb-2">Pickup &amp; Cleaning</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our partner picks up your clothes, washes, irons, and packs them with care.</p>
            </div>
            <div className="reveal visible text-center group" style={{transitionDelay: '.3s'}}>
              <div className="w-20 h-20 mx-auto bg-brandBg rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand group-hover:shadow-lg transition-all duration-300">
                <i className="ri-truck-line text-3xl text-brand group-hover:text-white transition-colors"></i>
              </div>
              <div className="bg-orangeBtn text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto -mt-10 mb-4 relative z-10 shadow-md">4</div>
              <h3 className="text-lg font-bold text-brand mb-2">Delivery to You</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Freshly cleaned clothes delivered straight to your doorstep, on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEARBY LAUNDRY PARTNERS SECTION */}
      <section id="partners" className="py-20 bg-brandBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 reveal visible">
            <div>
              <p className="text-orangeBtn uppercase tracking-widest font-semibold text-sm mb-2">Explore Partners</p>
              <h2 className="text-4xl md:text-5xl font-bold text-brand">Nearby Laundry Partners</h2>
            </div>
            <button className="mt-4 md:mt-0 bg-white px-6 py-3 rounded-full shadow-md text-brand font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2">
              <i className="ri-map-pin-line text-orangeBtn"></i> View All Partners
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Partner 1 */}
            <div className="reveal visible bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/20">
              <div className="bg-gradient-to-r from-brand to-brand/80 p-5 text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full font-medium">⭐ 4.8</div>
                <h3 className="text-xl font-bold">SparkleWash Pro</h3>
                <p className="text-brandLight text-sm">Koramangala, 1.2 km away</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="ri-time-line text-orangeBtn"></i> 24hr delivery</span>
                  <span className="flex items-center gap-1"><i className="ri-star-line text-orangeBtn"></i> 4.8 (320 reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Wash &amp; Fold</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Dry Clean</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Ironing</span>
                </div>
                <button onClick={() => handleBookNow('SparkleWash Pro')} className="w-full bg-orangeBtn hover:bg-orangeHover text-white py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[.98] shadow-sm">Book Now</button>
              </div>
            </div>
            {/* Partner 2 */}
            <div className="reveal visible bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/20" style={{transitionDelay: '.1s'}}>
              <div className="bg-gradient-to-r from-brand to-brand/80 p-5 text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full font-medium">⭐ 4.6</div>
                <h3 className="text-xl font-bold">FreshFold Laundry</h3>
                <p className="text-brandLight text-sm">Indiranagar, 2.5 km away</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="ri-time-line text-orangeBtn"></i> 18hr delivery</span>
                  <span className="flex items-center gap-1"><i className="ri-star-line text-orangeBtn"></i> 4.6 (215 reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Wash &amp; Fold</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Steam Press</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Shoe Cleaning</span>
                </div>
                <button onClick={() => handleBookNow('FreshFold Laundry')} className="w-full bg-orangeBtn hover:bg-orangeHover text-white py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[.98] shadow-sm">Book Now</button>
              </div>
            </div>
            {/* Partner 3 */}
            <div className="reveal visible bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/20" style={{transitionDelay: '.2s'}}>
              <div className="bg-gradient-to-r from-brand to-brand/80 p-5 text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full font-medium">⭐ 4.9</div>
                <h3 className="text-xl font-bold">CleanStar Express</h3>
                <p className="text-brandLight text-sm">HSR Layout, 0.8 km away</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="ri-time-line text-orangeBtn"></i> 12hr delivery</span>
                  <span className="flex items-center gap-1"><i className="ri-star-line text-orangeBtn"></i> 4.9 (480 reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Dry Clean</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Ironing</span>
                  <span className="bg-brandBg text-brand text-xs px-3 py-1 rounded-full font-medium">Express</span>
                </div>
                <button onClick={() => handleBookNow('CleanStar Express')} className="w-full bg-orangeBtn hover:bg-orangeHover text-white py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[.98] shadow-sm">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal visible">
            <p className="text-orangeBtn uppercase tracking-widest font-semibold text-sm mb-2">Services Available on Our Platform</p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand">Services Offered by Our Partners</h2>
            <p className="text-brandLight text-sm mt-3 max-w-xl mx-auto">All our verified laundry partners offer these core services. Compare and choose the one that fits you best.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-brandBg rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="ri-t-shirt-2-line text-3xl text-orangeBtn"></i>
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">Dry Cleaning</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">Expert care for your delicate fabrics. We use eco-friendly solvents to remove tough stains without damaging your clothes.</p>
              <a href="#" className="text-brand font-semibold text-sm flex items-center gap-1 hover:text-orangeBtn transition-colors">Learn more <i className="ri-arrow-right-line"></i></a>
            </div>
            <div className="bg-brandBg rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="ri-drop-line text-3xl text-orangeBtn"></i>
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">Wash &amp; Fold</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">Everyday laundry done right. We sort, wash, dry, and neatly fold your clothes so they are ready for the closet.</p>
              <a href="#" className="text-brand font-semibold text-sm flex items-center gap-1 hover:text-orangeBtn transition-colors">Learn more <i className="ri-arrow-right-line"></i></a>
            </div>
            <div className="bg-brandBg rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-brandLight/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="ri-magic-line text-3xl text-orangeBtn"></i>
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">Ironing Services</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">Crisp, wrinkle-free clothes delivered to your door. Perfect for business wear, formal attire, and everyday shirts.</p>
              <a href="#" className="text-brand font-semibold text-sm flex items-center gap-1 hover:text-orangeBtn transition-colors">Learn more <i className="ri-arrow-right-line"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER TRACKING SECTION */}
      <section id="tracking" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal visible">
            <p className="text-orangeBtn uppercase tracking-widest font-semibold text-sm mb-2">Live Updates</p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand">Track Your Order</h2>
            <p className="text-brandLight text-sm mt-3 max-w-xl mx-auto">Stay updated on every step of your laundry journey in real time.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 reveal visible">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div>
                <p className="text-xs text-brandLight">Order ID</p>
                <p className="font-bold text-brand" id="order-id">#ORD-84920</p>
              </div>
              <button onClick={() => copyToClipboard('order-id')} className="text-xs bg-brandBg text-brand px-3 py-1.5 rounded-lg hover:bg-brand/10 transition flex items-center gap-1">
                <i className="ri-file-copy-line"></i> Copy
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-brandLight">Tracking ID</p>
                <p className="font-bold text-brand" id="tracking-id">TRK-9921-X</p>
              </div>
              <button onClick={() => copyToClipboard('tracking-id')} className="text-xs bg-brandBg text-brand px-3 py-1.5 rounded-lg hover:bg-brand/10 transition flex items-center gap-1">
                <i className="ri-file-copy-line"></i> Copy
              </button>
            </div>
          </div>

          <div className="reveal visible bg-brandBg rounded-3xl p-8 md:p-12 shadow-inner relative">
            <div id="copy-toast" className="absolute -top-12 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity z-50 pointer-events-none">
              <i className="ri-check-line mr-2"></i>Copied to clipboard!
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-3">
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(0)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-brand text-white flex items-center justify-center shadow-md relative z-10">
                  <i className="ri-check-line text-lg"></i>
                </div>
                <p className="text-brand font-semibold text-xs mt-3">Order Placed</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(1)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-brand text-white flex items-center justify-center shadow-md relative z-10">
                  <i className="ri-check-line text-lg"></i>
                </div>
                <p className="text-brand font-semibold text-xs mt-3">Partner Assigned</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(2)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-brand text-white flex items-center justify-center shadow-md relative z-10">
                  <i className="ri-check-line text-lg"></i>
                </div>
                <p className="text-brand font-semibold text-xs mt-3">Pickup Done</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(3)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-orangeBtn text-white flex items-center justify-center shadow-lg relative z-10 pulse-dot">
                  <i className="ri-loader-4-line text-lg animate-spin"></i>
                </div>
                <p className="text-orangeBtn font-bold text-xs mt-3">Washing</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(4)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-200 text-gray-400 flex items-center justify-center relative z-10">
                  <i className="ri-t-shirt-line text-lg"></i>
                </div>
                <p className="text-gray-400 font-medium text-xs mt-3">Ironing</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(5)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-200 text-gray-400 flex items-center justify-center relative z-10">
                  <i className="ri-truck-line text-lg"></i>
                </div>
                <p className="text-gray-400 font-medium text-xs mt-3">Out for Delivery</p>
              </div>
              <div className="text-center tracker-step" onClick={() => handleTrackerClick(6)}>
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-200 text-gray-400 flex items-center justify-center relative z-10">
                  <i className="ri-home-smile-line text-lg"></i>
                </div>
                <p className="text-gray-400 font-medium text-xs mt-3">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;