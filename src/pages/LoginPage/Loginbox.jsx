import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { useNavigate,useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
axiosInstance.defaults.withCredentials = true;
import '../../App.css';
import { toast,  Toaster } from 'react-hot-toast';

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
  const otpRefs = React.useRef([]);


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
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error('Failed to send OTP. Please try again.');
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
        toast.success(`Welcome to PRIME!`);
        navigate(`/profile/${id}`);
      } else {
        toast.error('Profile ID not found in response. Please contact support.');
        setError('Profile ID not found in response. Please contact support.');
      }
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
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
      if (response.status === 200) {
        alert('Logged out successfully');
        var path = response.data.id ? `/profile/${response.data.id}` : '/login';
        window.location.href = path;

      }

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
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold">PRIME Login</h1>
  //         <p className="mt-2 text-gray-600">
  //           {!otpSent ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email'}
  //         </p>
  //       </div>

  //       {error && (
  //         <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
  //           {error}
  //         </div>
  //       )}

  //       {!otpSent ? (
  //         <form onSubmit={handleRequestOTP} className="mt-8 space-y-6">
  //           <div>
  //             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
  //               Email Address
  //             </label>
  //             <input
  //               id="email"
  //               name="email"
  //               type="email"
  //               required
  //               className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //             />
  //           </div>
  //           <div>
  //             <button
  //               type="submit"
  //               disabled={loading || !email}
  //               className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
  //                 loading || !email ? 'opacity-50 cursor-not-allowed' : ''
  //               }`}
  //             >
  //               {loading ? 'Sending...' : 'Send OTP'}
  //             </button>
  //           </div>
  //         </form>
  //       ) : (
  //         <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
  //           <div>
  //             <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
  //               One-Time Password (OTP)
  //             </label>
  //             <input
  //               id="otp"
  //               name="otp"
  //               type="text"
  //               inputMode="numeric"
  //               pattern="[0-9]{6}"
  //               maxLength="6"
  //               required
  //               className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               value={otp}
  //               onChange={(e) => setOtp(e.target.value)}
  //             />
  //             {countdown > 0 && (
  //               <p className="mt-2 text-sm text-gray-600">
  //                 OTP expires in: {formatTime(countdown)}
  //               </p>
  //             )}
  //             {countdown === 0 && otpSent && (
  //               <p className="mt-2 text-sm text-red-600">
  //                 OTP has expired. Please request a new one.
  //               </p>
  //             )}
  //           </div>
  //           <div className="flex flex-col space-y-3">
  //             <button
  //               type="submit"
  //               disabled={loading || otp.length !== 6 || countdown === 0}
  //               className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
  //                 loading || otp.length !== 6 || countdown === 0 ? 'opacity-50 cursor-not-allowed' : ''
  //               }`}
  //             >
  //               {loading ? 'Verifying...' : 'Verify OTP'}
  //             </button>
  //             <button
  //               type="button"
  //               onClick={() => {
  //                 setOtpSent(false);
  //                 setOtp('');
  //                 setError(null);
  //                 setCountdown(0);
  //               }}
  //               className="w-full px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //             >
  //               Back to Email
  //             </button>
  //             <button
  //               type="button"
  //               onClick={handleRequestOTP}
  //               disabled={loading}
  //               className="text-sm text-blue-600 hover:underline focus:outline-none"
  //             >
  //               Resend OTP
  //             </button>
  //           </div>
  //         </form>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 transition-all">

      {/* HEADER */}
      <div className="text-center space-y-1 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PRIME Login</h1>
        <p className="text-gray-600 text-sm">
          {!otpSent ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email'}
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-md animate-fadeIn">
          {error}
        </div>
      )}

      {/* LOGIN FORMS */}
      {!otpSent ? (
        <form onSubmit={handleRequestOTP} className="space-y-5">

          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="name@prl.res.in"
            />
          </div>
          <small>Kindly use your PRL email address.</small>

          {/* SEND OTP */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="loader-small"></span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5">

          {/* OTP INPUT (Modern segmented style) */}
          <div>
  <label className="block text-sm font-medium text-gray-700">One-Time Password</label>

  <div className="flex justify-between gap-2 mt-2">

    {Array.from({ length: 6 }).map((_, index) => (
      <input
        key={index}
        ref={(el) => (otpRefs.current[index] = el)}
        maxLength={1}
        inputMode="numeric"
        className="w-12 h-12 border rounded-lg text-center text-xl focus:ring-2 focus:ring-blue-500"
        value={otp[index] || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/, "");
          if (!value) return;

          // Update OTP
          const newOtp = otp.split("");
          newOtp[index] = value;
          setOtp(newOtp.join(""));

          // Move forward
          if (index < 5) otpRefs.current[index + 1].focus();
        }}
        onKeyDown={(e) => {
          const newOtp = otp.split("");

          // 🡐 Backspace (move backward)
          if (e.key === "Backspace") {
            if (!newOtp[index]) {
              if (index > 0) otpRefs.current[index - 1].focus();
            } else {
              newOtp[index] = "";
              setOtp(newOtp.join(""));
            }
          }

          // 🡐 Arrow Left
          if (e.key === "ArrowLeft" && index > 0) {
            otpRefs.current[index - 1].focus();
          }

          // 🡒 Arrow Right
          if (e.key === "ArrowRight" && index < 5) {
            otpRefs.current[index + 1].focus();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
          if (!pasted) return;

          // Fill OTP fully
          const newOtp = otp.split("");
          pasted.split("").forEach((char, i) => {
            if (index + i < 6) newOtp[index + i] = char;
          });
          setOtp(newOtp.join(""));

          // Move cursor to last filled box
          const last = Math.min(index + pasted.length - 1, 5);
          otpRefs.current[last].focus();
        }}
      />
    ))}

  </div>

  {countdown > 0 && (
    <p className="mt-2 text-sm text-gray-600">OTP expires in: {formatTime(countdown)}</p>
  )}
  {countdown === 0 && (
    <p className="mt-2 text-sm text-red-600">OTP expired — request again</p>
  )}
</div>


          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || countdown === 0}
            className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <span className="loader-small"></span> : "Verify OTP"}
          </button>

          {/* SECONDARY ACTIONS */}
          <div className="flex justify-between text-sm mt-4">
            <button
              type="button"
              onClick={() => {
                setOtp("");
                setOtpSent(false);
                setError(null);
              }}
              className="text-blue-600 hover:underline"
            >
              Back to Email
            </button>

            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loading}
              className="text-blue-600 hover:underline"
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