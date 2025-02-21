import React from 'react';
import prllogo from '../../assets/prl-logo.png';
import prlogo from '../../assets/prl_logo.png';
import { LogIn } from 'lucide-react'
const Headers = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      {/* Left side - Logos */}
      <div className="flex space-x-4">
        <div className="Logo">
          <img src={prllogo} alt="PRL Logo" />
        </div>
        <div className="Mainlogo">
          <img src={prlogo} alt="Main Logo" />
        </div>
      </div>

      {/* Right side - Navigation Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-md hover:bg-gray-100">
          Home
        </button>
        <button 
        icon={<LogIn />}
        className="px-7 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 flex items-center gap-2">
          <span>Login</span>
          <LogIn size={20} />
        </button>
      </div>
    </div>
  );
};

export default Headers;