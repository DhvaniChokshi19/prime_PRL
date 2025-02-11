import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
            <h2 className="text-xl font-bold mb-4">About Us</h2>
            <p className="text-gray-300 leading-relaxed">
              PRIME (PRL Research Information and Metrics Engine)
              stands out as a visionary Research Information
              Management System (RIMS) explicitly designed to
              streamline and enhance research data management
              within Physical Research Laboratories (PRL).
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-2">
              <h3 className="font-semibold">PHYSICAL RESEARCH LABORATORY</h3>
              <p className="text-gray-300">
                Navrangpura, Ahmedabad - 380 009, India
              </p>
              <p className="text-gray-300">
                Phone: +91-79-26314 000, 2630 2129.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;