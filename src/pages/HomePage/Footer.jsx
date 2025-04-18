import React from 'react';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="bg-blue-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us - Left Side */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">About us</h2>
            <p>
              PRIME stands out as a visionary Research Information 
              Management System (RIMS) explicitly designed to 
              streamline and enhance research data management 
              within Physical Research Laboratories (PRL).
            </p>
          </div>
          
          {/* Empty column for spacing */}
          <div className="hidden md:block"></div>
          
          {/* Contact Us - Right Side */}
          <div className="md:text-right">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-2">
              <p>Physical Research Laboratory</p>
              <p className="flex items-center md:justify-end">
                <span className="mr-2">📍</span> Navrangpura, Ahmedabad - 380 009
              </p>
              <p className="flex items-center md:justify-end">
                <span className="mr-2">📞</span> +91-79-26314 000, 2630 2129
              </p>
              <p className="flex items-center md:justify-end">
                <span className="mr-2">✉️</span> support@prime.org.in
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-blue-800 mt-3 pt-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 PRIME Centre, Ahmedabad. All rights reserved.</p>
          <a
            href="#"
            className="flex items-center text-blue-300 hover:text-white mt-2 md:mt-0"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Back to top <ArrowUp className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;