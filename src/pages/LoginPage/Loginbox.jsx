import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { useNavigate,useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
axiosInstance.defaults.withCredentials = true;
// Login component that handles both OTP request and verification
const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
     const checkLoginStatus = () => {
      const authToken = Cookies.get('authToken');
      setIsLoggedIn(!!authToken);
    };
    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
 useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
    return () => {
      delete axiosInstance.defaults.headers.common['Authorization'];
    };
  }, [isLoggedIn]);
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post('/api/login/request-otp', { email },);
      setOtpSent(true);
      setCountdown(300); // 5 minutes in seconds
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post('/api/login/verify-otp', { email, otp });
      
      const {access, refresh, id} = response.data;
       if (access, refresh) {
 Cookies.set('authToken', access, { expires: 7, sameSite: 'Strict' });
        Cookies.set('refresh_token', refresh, { expires: 30, sameSite: 'Strict' });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`; 
      setIsLoggedIn(true);
      }
      console.log('Response data:', response.data);
      if (id) {
        navigate(`/profile/${id}`);
      } else {
        setError('Profile ID not found in response. Please contact support.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
const handleLogout = async () => {
    setLoading(true);
    setError(null);
    const authToken = Cookies.get('authToken');
    const userId = location.pathname.split('/').pop();
  Cookies.remove('authToken');
  Cookies.remove('refresh_token');
  delete axiosInstance.defaults.headers.common['Authorization'];
  
  setIsLoggedIn(false)
    try {   
      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      };
      
      const response = await axiosInstance.get('api/logout',config);
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate('/');
    }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-2xl font-bold">PRIME Account</h1>
            <p className="mt-2 text-gray-600">You are currently logged in</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">PRIME Login</h1>
          <p className="mt-2 text-gray-600">
            {!otpSent ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleRequestOTP} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading || !email ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                One-Time Password (OTP)
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength="6"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {countdown > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  OTP expires in: {formatTime(countdown)}
                </p>
              )}
              {countdown === 0 && otpSent && (
                <p className="mt-2 text-sm text-red-600">
                  OTP has expired. Please request a new one.
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || countdown === 0}
                className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading || otp.length !== 6 || countdown === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError(null);
                  setCountdown(0);
                }}
                className="w-full px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Email
              </button>
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading}
                className="text-sm text-blue-600 hover:underline focus:outline-none"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;