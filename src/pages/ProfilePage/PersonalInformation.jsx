// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Phone, Mail, Globe, MapPin, Award, Briefcase, GraduationCap, Edit,SquareUser } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const PersonalInformation = () => {
//   const navigate = useNavigate();
//   const handleEditClick = () => {
//     navigate("/Login");
//   };

//   return (
//     <Card className="w-full border-none bg-white-100">
//       <CardContent className="p-6">
        
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center space-x-2 mb-4">
//         <SquareUser className="w-6 h-6 text-gray-500" />
//         <h3 className="text-xl font-semibold">Personal Informatiion</h3>
//           </div>
//           <button 
//           onClick= {handleEditClick}
//             className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-md hover:bg-gray-100"
//           >
//             Edit
//             <Edit size={20} />
//           </button>
//         </div>

//         {/* Basic Information */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold">Dr. Nithyananad Prabhu</h2>
//           <div className="flex flex-wrap gap-3 mt-2">
//             <p className="text-lg text-gray-600">Male</p>
//             <p className="text-lg text-red-600">Research Scientist</p>
//             <p className="text-lg text-gray-600">MSc (Electrical Engineering)</p>
//           </div>
//           <p className="text-gray-600 mt-2">Nanomaterials, Electrochemistry, Energy Storage Applications</p>
//         </div>

//         {/* Academic Identity */}
//         <div className="mb-6">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-green-600 font-semibold">ID</span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Orcid Id</p>
//               <a href="#" className="text-blue-600 hover:underline">0000-0003-2204-5333</a>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Professional Experience Section */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2 mb-4">
//               <Briefcase className="w-6 h-6 text-gray-500" />
//               <h3 className="text-xl font-semibold">Professional Experience</h3>
//             </div>
//             <div className="space-y-4 pl-4 border-l-2 border-gray-200">
//               <div>
//                 <h4 className="font-semibold">Research Scientist</h4>
//                 <p className="text-gray-600">PRL, Thaltej, Ahmedabad</p>
//                 <p className="text-sm text-gray-500">2006-Current</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold">Associate Professor</h4>
//                 <p className="text-gray-600">IIT Bombay-India</p>
//                 <p className="text-sm text-gray-500">1999-2005</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold">Assistant Professor</h4>
//                 <p className="text-gray-600">IIT Bombay-India</p>
//                 <p className="text-sm text-gray-500">1993-1998</p>
//               </div>
//             </div>
//           </div>

//           {/* Qualification Section */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2 mb-4">
//               <GraduationCap className="w-6 h-6 text-gray-500" />
//               <h3 className="text-xl font-semibold">Qualification</h3>
//             </div>
//             <div className="space-y-4 pl-4 border-l-2 border-gray-200">
//               <div>
//                 <h4 className="font-semibold">Ph.D</h4>
//                 <p className="text-gray-600">Carnegie Mellon University, United States</p>
//                 <p className="text-sm text-gray-500">1990</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold">M.Tech. in Electrical Engineering</h4>
//                 <p className="text-gray-600">IIT Bombay-India</p>
//                 <p className="text-sm text-gray-500">1985-1987</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold">B.Tech. in Electrical Engineering</h4>
//                 <p className="text-gray-600">IIT Bombay-India</p>
//                 <p className="text-sm text-gray-500">1981-1984</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Awards Section */}
//         <div className="space-y-4 my-8">
//           <div className="flex items-center space-x-2 mb-4">
//             <Award className="w-6 h-6 text-gray-500" />
//             <h3 className="text-xl font-semibold">Awards and Recognition</h3>
//           </div>
//           <div className="space-y-4 pl-4 border-l-2 border-gray-200">
//             <div className="flex items-start gap-4">
//               <div className="bg-blue-500 text-white px-3 py-1 rounded">2022</div>
//               <div>
//                 <h4 className="font-semibold">SENIOR SCIENTIST AWARD</h4>
//                 <p className="text-sm text-gray-500">Tamil Nadu Academy of Sciences, Chennai</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="bg-blue-500 text-white px-3 py-1 rounded">2021</div>
//               <div>
//                 <h4 className="font-semibold">EDITORIAL BOARD MEMBER</h4>
//                 <p className="text-gray-600">Ultrasonics Sonochemistry (Elsevier)</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="bg-blue-500 text-white px-3 py-1 rounded">2020</div>
//               <div>
//                 <h4 className="font-semibold">ACT PROF P B PUNJABI AWARDEE</h4>
//                 <p className="text-gray-600">Association of Chemistry Teachers, Mumbai</p>
//               </div>
//             </div>
            
//             <div className="flex items-start gap-4">
//               <div className="bg-blue-500 text-white px-3 py-1 rounded">2020</div>
//               <div>
//                 <h4 className="font-semibold">Lead Guest Editor/Guest Editor in Leading WoS and Scopus Indexed Journals</h4>
//                 <p className="text-gray-600">Scopus Journals</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Phone className="w-5 h-5 text-gray-500" />
//               <span className="font-medium">Phone</span>
//             </div>
//             <p className="text-gray-600">+91-9535891223</p>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Mail className="w-5 h-5 text-gray-500" />
//               <span className="font-medium">Email</span>
//             </div>
//             <a href="mailto:nithyananad.prabhu@example.com" className="text-red-600 hover:underline">
//               nithyananad.prabhu@prl.com
//             </a>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Globe className="w-5 h-5 text-gray-500" />
//               <span className="font-medium">Website</span>
//             </div>
//             <a href="#" className="text-red-600 hover:underline break-all">
//               https://prl.edu/faculty/nithyananad
//             </a>
//           </div>
//         </div>

//         {/* Address */}
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <MapPin className="w-5 h-5 text-gray-500" />
//             <span className="font-medium">Address</span>
//           </div>
//           <div className="text-gray-600">
//             <p>Ahmedabad, Gujarat</p>
//             <p>India</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PersonalInformation;

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Globe, MapPin, Award, Briefcase, GraduationCap, Edit, SquareUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalInformation = ({ profileData }) => {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [honorsAwards, setHonorsAwards] = useState([]);

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // This is mock data based on your models
    const mockData = {
      personalInfo: {
        profile: {
          name: "Dr. Nithyananad Prabhu",
          email: "nithyananad.prabhu@prl.com",
          phone: "+91-9535891223",
          designation: "Research Scientist",
          department: "MSc (Electrical Engineering)",
          research_interests: "Nanomaterials, Electrochemistry, Energy Storage Applications",
          orcid_id: "0000-0003-2204-5333"
        },
        gender: "Male",
        address: "Ahmedabad, Gujarat, India",
        website_url: "https://prl.edu/faculty/nithyananad",
        about_me: "",
      },
      professionalExperiences: [
        {
          start_year: 2006,
          end_year: null, // Current
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
      ],
      qualifications: [
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
      ],
      honorsAwards: [
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
        },
        {
          year: 2020,
          award_name: "Lead Guest Editor/Guest Editor in Leading WoS and Scopus Indexed Journals",
          awarding_authority: "Scopus Journals"
        }
      ]
    };

    setPersonalInfo(mockData.personalInfo);
    setProfessionalExperiences(mockData.professionalExperiences);
    setQualifications(mockData.qualifications);
    setHonorsAwards(mockData.honorsAwards);
  }, []);

  const handleEditClick = () => {
    navigate("/Login");
  };

  if (!personalInfo) {
    return <div>Loading...</div>;
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
          <h2 className="text-2xl font-semibold">{personalInfo.profile.name}</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <p className="text-lg text-gray-600">{personalInfo.gender}</p>
            <p className="text-lg text-red-600">{personalInfo.profile.designation}</p>
            <p className="text-lg text-gray-600">{personalInfo.profile.department}</p>
          </div>
          <p className="text-gray-600 mt-2">{personalInfo.profile.research_interests}</p>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Professional Experience</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {professionalExperiences.map((exp, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-gray-600">{exp.organization}</p>
                  <p className="text-sm text-gray-500">
                    {exp.start_year}-{exp.end_year || "Current"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Qualification Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Qualification</h3>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {qualifications.map((qual, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{qual.qualification}</h4>
                  <p className="text-gray-600">{qual.authority}</p>
                  <p className="text-sm text-gray-500">{qual.year}</p>
                </div>
              ))}
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
            {honorsAwards.map((award, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-blue-500 text-white px-3 py-1 rounded">{award.year}</div>
                <div>
                  <h4 className="font-semibold">{award.award_name}</h4>
                  <p className="text-sm text-gray-500">{award.awarding_authority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Phone</span>
            </div>
            <p className="text-gray-600">{personalInfo.profile.phone}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Email</span>
            </div>
            <a href={`mailto:${personalInfo.profile.email}`} className="text-red-600 hover:underline">
              {personalInfo.profile.email}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Website</span>
            </div>
            <a href={personalInfo.website_url} className="text-red-600 hover:underline break-all">
              {personalInfo.website_url}
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
            <p>{personalInfo.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;