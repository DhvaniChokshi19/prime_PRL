import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

const PersonalInformation = () => {
  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Name and Title Section */}
          <div>
            <h2 className="text-2xl font-semibold">Dr. Nithyananad Prabhu</h2>
            <p className="text-lg text-gray-600">MSc (Electrical Engineering)</p>
            <p className="text-lg text-red-600">Research Scientist, Electrical Engineering</p>
            <p className="text-gray-600">Nanomaterials, Electrochemistry, Energy Storage Applications</p>
          </div>

          {/* Academic Identity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">ID</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Orcid Id</p>
                <a href="#" className="text-blue-600 hover:underline">0000-0003-2204-5333</a>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Phone</span>
              </div>
              <p className="text-gray-600">+91-953589XXXX</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Email</span>
              </div>
              <a href="mailto:nithyananad.prabhu@example.com" className="text-red-600 hover:underline">
                nithyananad.prabhu@example.com
              </a>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Website</span>
              </div>
              <a href="#" className="text-red-600 hover:underline break-all">
                https://example.edu/faculty/nithyananad
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Address</span>
            </div>
            <div className="text-gray-600">
              <p>Ahmedabad, Gujarat</p>
              <p>India</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;