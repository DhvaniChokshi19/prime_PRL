import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection

const LoginBox = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // For redirection
  
  // Check if the email is a valid PRL email
  const isValidPrlEmail = (email) => {
    return email && email.trim() !== '' && email.includes('@prl');
  };
  
  // Function to send OTP to the user's email
  const handleSendOTP = async () => {
    if (!isValidPrlEmail(email)) return;
    
    setIsLoading(true);
    try {
      // In a real application, would make an API call here
      // await api.sendOTP(email);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to verify OTP and login the user
  const handleLogin = async () => {
    if (!otp || otp.trim() === '') return;
    
    setIsLoading(true);
    try {
      // In a real application, we would verify the OTP with your backend
      // Example: const response = await api.verifyOTP(email, otp);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful authentication, redirect to profile page
      navigate('/profile'); // This will redirect the user to the profile page
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-md shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome</h2>
          <p className="text-gray-600">Log in to your account</p>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Enter PRL Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@prl.res.in"
            />
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={!isValidPrlEmail(email) || isLoading}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isValidPrlEmail(email) && !isLoading
                ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading && !otpSent ? 'Sending...' : 'Send OTP'}
          </button>
        </div>

        {otpSent && (
          <>
            <p className="text-center text-green-600 text-sm mb-4">
              OTP sent successfully on your email
            </p>

            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLogin}
                disabled={!otp || otp.trim() === '' || isLoading}
                className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  otp && otp.trim() !== '' && !isLoading
                    ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-gray-700 text-white p-3 flex justify-between">
        <div>PRL, Thaltej</div>
        <div>2025 © All Rights Reserved.</div>
      </div>
    </div>
  );
};

export default LoginBox;