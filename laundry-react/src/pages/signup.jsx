import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrorMsg('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Store user in localStorage for session (without password)
      localStorage.setItem('currentUser', JSON.stringify(response.data));

      navigate('/home');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brandBg min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <img src="/loundery logo.png" alt="Logo" className="h-10 w-10 rounded bg-white p-1 shadow-sm border border-gray-100" />
            <div className="text-left">
              <h1 className="font-bold text-lg leading-none text-brand">ELITE</h1>
              <p className="font-medium text-xs leading-none text-brand">CLEAN</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-brand">Create an Account</h2>
          <p className="text-brandLight text-sm mt-2">Join us for a hassle-free laundry experience</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
            <div className="relative group">
              <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
              <input type="text" id="name" required value={formData.name} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                placeholder="Enter Your Name" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
            <div className="relative group">
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
              <input type="email" id="email" required value={formData.email} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                placeholder="your@email.com" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative group">
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
              <input type="password" id="password" required value={formData.password} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                placeholder="••••••••" />
            </div>
          </div>
          
          {errorMsg && <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">{errorMsg}</div>}
          
          <button type="submit" disabled={loading}
            className="w-full bg-brand hover:bg-brandLight text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-brand/20 mt-4 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account? <Link to="/login" className="text-orangeBtn font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;