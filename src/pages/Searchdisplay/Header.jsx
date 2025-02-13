import React from 'react';
import prllogo from '../../assets/prl-logo.png'; 
import prlogo from '../../assets/prl_logo.png';

const Header = () => {
  return (
    <div className="flex justify-center space-x-4"> {/* Flexbox for side-by-side images */}
      <div className="Logo">
        <img src={prllogo} alt="PRL Logo"  />
      </div>
      <div className="Mainlogo">
        <img src={prlogo} alt="Main Logo" />
      </div>
    </div>
    
  );
};

export default Header;
