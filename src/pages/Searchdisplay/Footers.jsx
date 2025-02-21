import React from 'react';

const Footers = () => {
  return (
    <footer className="bg-gray-800 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-96">
          
          <div>

            <p className="text-gray-300 leading-relaxed">
              PRIME (PRL Research Information and Metrics Engine)
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <div className="space-y-1">
              <h3 className="font-semibold">PHYSICAL RESEARCH LABORATORY, Ahmedabad,India</h3>
            
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;