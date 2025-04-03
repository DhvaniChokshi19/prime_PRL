import React,{useState,useEffect} from 'react';
import prllogo from '../../assets/prl-logo.png';
import prlogo from '../../assets/prime.png';
import { LogIn, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Headers = () => {

const navigate = useNavigate();
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

const handleHomeClick=()=>{
  navigate('/');
};
const handleLoginClick=()=>{
  navigate("/login");
};

  return (
    <div className="flex justify-between items-center px-4 py-2">
     
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
        <button 
        onClick={handleHomeClick}
        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-md hover:bg-gray-100">
          Home
        </button>
        <button 
        onClick={handleLoginClick}
        icon={<LogIn />}
        className="px-7 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 flex items-center gap-2">
          <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
          {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Headers;