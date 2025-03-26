import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Globe, MapPin, Award, Briefcase, GraduationCap, Edit, SquareUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalInformation = ({ profileData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Extract data from profileData prop
  const profile = profileData?.profile || {};
  const personalInfo = profileData?.personal_information?.[0] || {};
  const professionalExperiences = profileData?.professional_experiences || [];
  const qualifications = profileData?.qualifications || [];
  const honorsAwards = profileData?.honors_and_awards || [];

  const handleEditClick = () => {
    navigate("/Login");
  };

  if (loading) {
    return <div className="flex justify-center items-center">Loading personal information...</div>;
  }

  return (
    <Card className="w-full border-none bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <SquareUser className="w-6 h-6 text-gray-500" />
            <h3 className="text-xl font-semibold">Personal Information</h3>
          </div>
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-md hover:bg-gray-100"
          >
            Edit
            <Edit size={20} />
          </button>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{profile.name || "Dr. Nithyananad Prabhu"}</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <p className="text-lg text-gray-600">{personalInfo.gender || "Male"}</p>
            <p className="text-lg text-red-600">{profile.designation || "Research Scientist"}</p>
            <p className="text-lg text-gray-600">{profile.department || "Electrical Engineering"}</p>
          </div>
          <p className="text-gray-600 mt-2">{profile.expertise || "Nanomaterials, Electrochemistry, Energy Storage Applications"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Professional Experience</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {professionalExperiences.length > 0 ? (
                professionalExperiences.map((exp, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-gray-600">{exp.organization}</p>
                    <p className="text-sm text-gray-500">
                      {exp.start_year}-{exp.end_year || "Current"}
                    </p>
                  </div>
                ))
              ) : (
                // Default data if no experiences are available
                [
                  {
                    start_year: 2006,
                    end_year: null,
                    position: "Research Scientist",
                    organization: "PRL, Thaltej, Ahmedabad"
                  },
                  {
                    start_year: 1999,
                    end_year: 2005,
                    position: "Associate Professor",
                    organization: "IIT Bombay-India"
                  },
                  {
                    start_year: 1993,
                    end_year: 1998,
                    position: "Assistant Professor",
                    organization: "IIT Bombay-India"
                  }
                ].map((exp, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-gray-600">{exp.organization}</p>
                    <p className="text-sm text-gray-500">
                      {exp.start_year}-{exp.end_year || "Current"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Qualification Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Qualification</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {qualifications.length > 0 ? (
                qualifications.map((qual, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{qual.qualification}</h4>
                    <p className="text-gray-600">{qual.authority}</p>
                    <p className="text-sm text-gray-500">{qual.year}</p>
                  </div>
                ))
              ) : (
                // Default data if no qualifications are available
                [
                  {
                    year: 1990,
                    qualification: "Ph.D",
                    authority: "Carnegie Mellon University, United States"
                  },
                  {
                    year: 1987,
                    qualification: "M.Tech. in Electrical Engineering",
                    authority: "IIT Bombay-India"
                  },
                  {
                    year: 1984,
                    qualification: "B.Tech. in Electrical Engineering",
                    authority: "IIT Bombay-India"
                  }
                ].map((qual, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{qual.qualification}</h4>
                    <p className="text-gray-600">{qual.authority}</p>
                    <p className="text-sm text-gray-500">{qual.year}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="space-y-4 my-8">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-6 h-6 text-gray-500" />
            <h3 className="text-xl font-semibold">Awards and Recognition</h3>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {honorsAwards.length > 0 ? (
              honorsAwards.map((award, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded">{award.year}</div>
                  <div>
                    <h4 className="font-semibold">{award.award_name}</h4>
                    <p className="text-sm text-gray-500">{award.awarding_authority}</p>
                  </div>
                </div>
              ))
            ) : (
              // Default data if no awards are available
              [
                {
                  year: 2022,
                  award_name: "SENIOR SCIENTIST AWARD",
                  awarding_authority: "Tamil Nadu Academy of Sciences, Chennai"
                },
                {
                  year: 2021,
                  award_name: "EDITORIAL BOARD MEMBER",
                  awarding_authority: "Ultrasonics Sonochemistry (Elsevier)"
                },
                {
                  year: 2020,
                  award_name: "ACT PROF P B PUNJABI AWARDEE",
                  awarding_authority: "Association of Chemistry Teachers, Mumbai"
                }
              ].map((award, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded">{award.year}</div>
                  <div>
                    <h4 className="font-semibold">{award.award_name}</h4>
                    <p className="text-sm text-gray-500">{award.awarding_authority}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Phone</span>
            </div>
            <p className="text-gray-600">{"+91-9535891223"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Email</span>
            </div>
            <a href={`mailto:nithyananad.prabhu@prl.com`} className="text-red-600 hover:underline">
              {"nithyananad.prabhu@prl.com"}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Website</span>
            </div>
            <a href={personalInfo.website_url || "https://prl.edu/faculty/nithyananad"} className="text-red-600 hover:underline break-all">
              {personalInfo.website_url || "https://prl.edu/faculty/nithyananad"}
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
            <p>{personalInfo.address || "Ahmedabad, Gujarat, India"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;