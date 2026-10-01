import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const partnerName = searchParams.get('partner') || 'Elite Clean Partner';
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: '',
    date: '',
    time: '',
    payment: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) { newErrors.name = true; isValid = false; }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) { newErrors.phone = true; isValid = false; }
    if (!formData.email.trim() || !validateEmail(formData.email.trim())) { newErrors.email = true; isValid = false; }
    if (!formData.address.trim()) { newErrors.address = true; isValid = false; }
    if (!formData.type) { newErrors.type = true; isValid = false; }
    if (!formData.date) { newErrors.date = true; isValid = false; }
    if (!formData.time) { newErrors.time = true; isValid = false; }
    if (!formData.payment) { newErrors.payment = true; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);
      
      // Simulate API Call / Processing
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Save booking info to local storage
        const bookingInfo = {
          orderId: "#ORD-" + Math.floor(10000 + Math.random() * 90000),
          partner: partnerName,
          paymentId: "SIM_PAY_" + Math.floor(Math.random() * 1000000),
          date: new Date().toISOString()
        };
        localStorage.setItem('lastBooking', JSON.stringify(bookingInfo));
      }, 1500);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    const [h, m] = timeStr.split(':');
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${period}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const inputClass = (isError) => `w-full pl-11 pr-4 py-3.5 rounded-xl border transition-all ${isError ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandBg via-white to-cyan-50 text-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* Page Header */}
        <div className="text-center mb-10 slide-up">
          <button onClick={() => navigate('/home')} className="mb-6 flex items-center gap-2 text-brand font-semibold hover:text-orangeBtn transition text-sm mx-auto">
            <i className="ri-arrow-left-line text-lg"></i> Back to Dashboard
          </button>
          
          <div className="inline-flex items-center justify-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm text-brand font-semibold text-sm mb-4 border border-brand/10">
            <i className="ri-store-2-line text-orangeBtn text-lg"></i>
            <span>Booking with: <strong className="text-brand">{partnerName}</strong></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand mb-3 tracking-tight">Laundry Booking Form</h1>
          <p className="text-brandLight text-lg max-w-xl mx-auto">Fill in your details to schedule your laundry pickup.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Form */}
          <div className="w-full lg:w-2/3 glass-card rounded-3xl p-6 md:p-10 slide-up delay-100 relative bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_10px_40px_-10px_rgba(8,110,150,0.1)]">
            
            {/* Loading Overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center rounded-3xl">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full loader mb-4"></div>
                <p className="text-brand font-bold text-lg">Processing Booking...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Customer Information Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-brand border-b border-gray-100 pb-2 flex items-center gap-2">
                  <i className="ri-user-line text-xl"></i> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <i className={`ri-user-3-line text-lg transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                      </div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClass(errors.name)} />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please enter your name.</p>}
                  </div>

                  <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <i className={`ri-phone-line text-lg transition-colors ${errors.phone ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="9876543210" maxLength="10" className={inputClass(errors.phone)} />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please enter a valid 10-digit number.</p>}
                  </div>
                </div>

                <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <i className={`ri-mail-line text-lg transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputClass(errors.email)} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please enter a valid email address.</p>}
                </div>

                <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Address <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                      <i className={`ri-map-pin-line text-lg transition-colors ${errors.address ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                    </div>
                    <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="House No, Street, Landmark..." rows="3" className={`${inputClass(errors.address)} resize-none`}></textarea>
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please enter your pickup address.</p>}
                </div>
              </div>

              {/* Service Details Section */}
              <div className="space-y-5 pt-4">
                <h3 className="text-lg font-bold text-brand border-b border-gray-100 pb-2 flex items-center gap-2">
                  <i className="ri-t-shirt-line text-xl"></i> Service Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Laundry Type <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <i className={`ri-shopping-bag-3-line text-lg transition-colors ${errors.type ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                      </div>
                      <select name="type" value={formData.type} onChange={handleChange} required className={`${inputClass(errors.type)} appearance-none cursor-pointer pr-10`}>
                        <option value="" disabled>Select service</option>
                        <option value="Wash">Wash</option>
                        <option value="Dry Cleaning">Dry Cleaning</option>
                        <option value="Ironing">Ironing</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <i className="ri-arrow-down-s-line text-gray-500 text-lg"></i>
                      </div>
                    </div>
                    {errors.type && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please select a laundry type.</p>}
                  </div>

                  <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Date <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <i className={`ri-calendar-line text-lg transition-colors ${errors.date ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                      </div>
                      <input type="date" name="date" value={formData.date} onChange={handleChange} min={today} required className={`${inputClass(errors.date)} cursor-pointer`} />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please select a valid future date.</p>}
                  </div>
                  
                  <div className="input-group focus-within:-translate-y-0.5 transition-transform">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Time <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <i className={`ri-time-line text-lg transition-colors ${errors.time ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand'}`}></i>
                      </div>
                      <input type="time" name="time" value={formData.time} onChange={handleChange} required className={`${inputClass(errors.time)} cursor-pointer`} />
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mt-1.5 font-medium"><i className="ri-error-warning-line align-middle"></i> Please select a pickup time.</p>}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method <span className="text-red-500">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="payment" value="Cash on Delivery" checked={formData.payment === 'Cash on Delivery'} onChange={handleChange} className="peer hidden" required />
                      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 peer-checked:border-brand peer-checked:bg-brandBg peer-checked:shadow-sm transition-all hover:bg-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <i className="ri-money-rupee-circle-line text-2xl text-gray-400 peer-checked:text-brand transition-colors"></i>
                        </div>
                        <span className="font-bold text-gray-600 peer-checked:text-brand transition-colors">Cash on Delivery</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="payment" value="Online Payment" checked={formData.payment === 'Online Payment'} onChange={handleChange} className="peer hidden" required />
                      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 peer-checked:border-brand peer-checked:bg-brandBg peer-checked:shadow-sm transition-all hover:bg-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <i className="ri-bank-card-line text-2xl text-gray-400 peer-checked:text-brand transition-colors"></i>
                        </div>
                        <span className="font-bold text-gray-600 peer-checked:text-brand transition-colors">Online Payment</span>
                      </div>
                    </label>
                  </div>
                  {errors.payment && <p className="text-red-500 text-xs mt-2 font-medium"><i className="ri-error-warning-line align-middle"></i> Please select a payment method.</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button type="submit" className="flex-1 bg-brand hover:bg-brandLight text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  Confirm Booking <i className="ri-checkbox-circle-line text-xl"></i>
                </button>
                <button type="button" onClick={() => { setFormData({ name: '', phone: '', email: '', address: '', type: '', date: '', time: '', payment: '' }); setErrors({}); }} className="sm:w-1/3 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                  Reset <i className="ri-refresh-line text-xl"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Live Booking Summary */}
          <div className="w-full lg:w-1/3 glass-card rounded-3xl p-6 md:p-8 sticky top-24 slide-up delay-200 bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_10px_40px_-10px_rgba(8,110,150,0.1)]">
            <h3 className="text-xl font-black text-brand mb-5 flex items-center gap-2">
              <i className="ri-file-list-3-line text-orangeBtn text-2xl"></i> Booking Summary
            </h3>
            
            <div className="space-y-4 text-sm bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><i className="ri-store-2-line"></i> Partner</span>
                <span className="font-bold text-brand text-right max-w-[50%]">{partnerName}</span>
              </div>
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><i className="ri-shirt-line"></i> Service</span>
                <span className="font-bold text-gray-800 text-right">{formData.type || '-'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><i className="ri-calendar-line"></i> Date</span>
                <span className="font-bold text-gray-800 text-right">{formatDate(formData.date)}</span>
              </div>
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><i className="ri-time-line"></i> Time</span>
                <span className="font-bold text-gray-800 text-right">{formatTime(formData.time)}</span>
              </div>
              <div className="flex justify-between items-start pb-1">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><i className="ri-wallet-3-line"></i> Payment</span>
                <span className="font-bold text-gray-800 text-right">{formData.payment || '-'}</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
              <div className="mt-0.5 text-brand bg-white rounded-full p-1 shadow-sm"><i className="ri-shield-check-fill"></i></div>
              <p className="text-xs text-brand leading-relaxed font-medium">Your details are secure. A confirmation will be sent to your email and phone after booking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-[90%] text-center shadow-2xl transform scale-100 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-brandBg rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-8 border-white shadow-sm">
              <i className="ri-check-line text-5xl text-green-500"></i>
            </div>
            
            <h3 className="text-2xl font-black text-gray-800 mb-2 relative z-10">Booking Successful!</h3>
            <p className="text-gray-500 text-sm mb-8 relative z-10 font-medium leading-relaxed">Your laundry pickup is scheduled. Our partner will contact you shortly to confirm.</p>
            
            <button onClick={() => navigate('/home')} className="w-full bg-brand hover:bg-brandLight text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 shadow-lg shadow-brand/20">
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
