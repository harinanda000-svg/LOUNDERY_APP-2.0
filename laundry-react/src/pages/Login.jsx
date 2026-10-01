import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Hardcoded admin login
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin123') {
      setSuccessMsg('Admin login successful! Redirecting...');
      localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', email: 'admin@gmail.com', name: 'Admin' }));
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const user = response.data;

      setSuccessMsg('Login successful! Redirecting...');
      localStorage.setItem('currentUser', JSON.stringify(user));

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brandBg min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <img src="/loundery logo.png" alt="Elite Clean Logo" className="h-10 w-10 rounded bg-white p-1 shadow-sm border border-gray-100" />
            <div className="text-left">
              <h1 className="font-bold text-lg leading-none text-brand">ELITE</h1>
              <p className="font-medium text-xs leading-none text-brand">CLEAN</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-brand">Welcome Back</h2>
          <p className="text-brandLight text-sm mt-2">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
            <div className="relative group">
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
              <input type="email" id="email" required value={formData.email} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                placeholder="Email" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative group">
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
              <input type="password" id="password" required value={formData.password} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-sm transition-all"
                placeholder="••••••••" />
            </div>
          </div>

          {errorMsg && <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 text-sm text-center bg-green-50 py-2 rounded-lg border border-green-100">{successMsg}</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-orangeBtn hover:bg-orangeHover text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-orangeBtn/20 mt-2 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <Link to="/signup" className="text-brand font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;