import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Globe, MapPin, Award, Briefcase, GraduationCap } from 'lucide-react';

const PersonalInformation = () => {
  return (
    <Card className="w-full border-none bg-white-100">
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-semibold">Dr. Nithyananad Prabhu</h2>
            <p className="text-lg text-gray-600">Male</p>
            <p className="text-lg text-red-600">Research Scientist</p>
            <p className="text-lg text-gray-600">MSc (Electrical Engineering)</p>
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
<div className="grid grid-cols-2 md:grid-cols-2 gap-8 p-6">
          {/* Professional Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Professional Experience</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <h4 className="font-semibold">Research Scientist</h4>
                <p className="text-gray-600">PRL, Thaltej, Ahmedabad</p>
                <p className="text-sm text-gray-500">2006-Current</p>
              </div>
              <div>
                <h4 className="font-semibold">Associate Professor</h4>
                <p className="text-gray-600">IIT Bombay-India</p>
                <p className="text-sm text-gray-500">1999-2005</p>
              </div>
              <div>
                <h4 className="font-semibold">Assistant Professor</h4>
                <p className="text-gray-600">IIT Bombay-India</p>
                <p className="text-sm text-gray-500">1993-1998</p>
              </div>
            </div>
          </div>

          {/* Qualification Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Qualification</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <h4 className="font-semibold">Ph.D</h4>
                <p className="text-gray-600">Carnegie Mellon University, United States</p>
                <p className="text-sm text-gray-500">1990</p>
              </div>
              <div>
                <h4 className="font-semibold">M.Tech. in Electrical Engineering</h4>
                <p className="text-gray-600">IIT Bombay-India</p>
                <p className="text-sm text-gray-500">1985-1987</p>
              </div>
              <div>
                <h4 className="font-semibold">B.Tech. in Electrical Engineering</h4>
                <p className="text-gray-600">IIT Bombay-India</p>
                <p className="text-sm text-gray-500">1981-1984</p>
              </div>
            </div>
          </div>
</div>
          <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Award className="w-6 h-6 text-gray-500" />
        <h3 className="text-xl font-semibold">Awards and Recognition</h3>
      </div>
      <div className="space-y-4 pl-4 border-l-2 border-gray-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded">2022</div>
          <div>
            <h4 className="font-semibold">SENIOR SCIENTIST AWARD</h4>
    
            <p className="text-sm text-gray-500">Tamil Nadu Academy of Sciences, Chennai</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded">2021</div>
          <div>
            <h4 className="font-semibold">EDITORIAL BOARD MEMBER</h4>
            <p className="text-gray-600">Ultrasonics Sonochemistry (Elsevier)</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded">2020</div>
          <div>
            <h4 className="font-semibold">ACT PROF P B PUNJABI AWARDEE</h4>
            <p className="text-gray-600">Association of Chemistry Teachers, Mumbai</p>
          </div>
        </div>
<div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded">2020</div>
          <div>
            <h4 className="font-semibold">Lead Guest Editor/Guest Editor in Leading WoS and Scopus Indexed Journals</h4>
            <p className="text-gray-600">Scopus Journals</p>
          </div>
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
              <p className="text-gray-600">+91-9535891223</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Email</span>
              </div>
              <a href="mailto:nithyananad.prabhu@example.com" className="text-red-600 hover:underline">
                nithyananad.prabhu@prl.com
              </a>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Website</span>
              </div>
              <a href="#" className="text-red-600 hover:underline break-all">
                https://prl.edu/faculty/nithyananad
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