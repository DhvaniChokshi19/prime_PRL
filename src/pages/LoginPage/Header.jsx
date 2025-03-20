import React from 'react';
import prllogo from '../../assets/prl-logo.png';
import prlogo from '../../assets/prime.png';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  const handleFeature= ()=>{
 const featuresSection = document.getElementById('key-features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  }
  const handleHome =()=>{

  }
  const handleContact=()=>{
const footersection = document.getElementById('footer');
    footersection?.scrollIntoView({ behavior: 'smooth' });
}
  return (
    <header className="w-full">
      {/* Logos container */}
      <div className="flex justify-center space-x-4 py-2">
        <div className="Logo">
          <img src={prllogo} alt="PRL Logo" />
        </div>
        <div className="Mainlogo">
          <img src={prlogo} alt="Main Logo" />
        </div>
      </div>
      {/* Navigation bar */}
      <nav className="bg-blue-700 text-white py-2">
        <div className="container mx-auto flex justify-center">
          <ul className="flex space-x-14">
            <li className="hover:text-gray-300 text-xl"
            onClick={handleHome}>
              Home
            </li>
            <li className="hover:text-gray-300 text-xl"
            onClick={handleFeature}>
              Features
            </li>
            <li className="hover:text-gray-300 text-xl"
            onClick={handleContact}>
               Contact Us
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;