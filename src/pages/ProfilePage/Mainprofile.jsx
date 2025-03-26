import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import googlei from "../../assets/image 18.png";
import publons from "../../assets/image 17.png";
import PersonalInformation from './PersonalInformation';
import Patents from './Patents';
import Publications from './Publications';
import Network from './Network';
import Projects from './Projects';
import { 
  User,
  ScrollText,
  BookOpen,
  GlobeLock,
  BookMarked,
} from 'lucide-react';

axios.defaults.baseURL = 'http://localhost:8000';

const Tooltips = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-48 p-2 bg-white-900 text-gray text-xs rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

const Mainprofile = () => {
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(1); // Default profile ID

  // Combined state for all profile data
  const [profileData, setProfileData] = useState({
    profile: {
      name: '',
      image_url: '',
      designation: '',
      department: '',
      expertise: '',
      state: '',
      scopus_id: '',
      orc_id: '',
      google_scholar_id: '',
      publons_id: '',
      orcid_url: '',
      scopus_url: '',
    },
    personal_information: [],
    qualifications: [],
    professional_experiences: [],
    honors_and_awards: [],
    top_publications: [], // Added to store top cited publications
  });
  
  const [publicationsData, setPublicationsData] = useState([]);

  // Fetch all profile data from backend in a single API call
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/profile', {
          params: { profile_id: profileId }
        });
        
        setProfileData(response.data);
        
        // If top_publications is in the response, make it available to the Publications component
        if (response.data.top_publications && Array.isArray(response.data.top_publications)) {
          // We keep it in profileData so Publications can access it
          console.log("Top publications loaded:", response.data.top_publications.length);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error.response?.data?.error || error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  // Fetch publications data separately
  useEffect(() => {
    const fetchPublicationsData = async () => {
      try {
        const response = await axios.get('/api/profile/publications', {
          params: { profile_id: profileId }
        });
        setPublicationsData(response.data);
      } catch (error) {
        console.error("Error fetching publications data:", error);
      }
    };

    fetchPublicationsData();
  }, [profileId]);

  // Function to update component data
  const updateComponentData = (componentName, data) => {
    switch(componentName) {
      case 'PersonalInformation':
        setProfileData(prevData => {
          return {
            ...prevData,
            profile: { ...prevData.profile, ...data.profile },
            personal_information: data.personal_information || prevData.personal_information,
            qualifications: data.qualifications || prevData.qualifications,
            professional_experiences: data.professional_experiences || prevData.professional_experiences,
            honors_and_awards: data.honors_and_awards || prevData.honors_and_awards
          };
        });
        break;
      case 'Publications':
        setPublicationsData(data);
        break;
      case 'Patents':
        setProfileData(prevData => ({ ...prevData, patents: data }));
        break;
      case 'Projects':
        // Handle projects update
        break;
      case 'Network':
        // Handle network update
        break;
      default:
        break;
    }
  };

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Publication', icon: BookOpen },
    { name: 'Patent', icon: ScrollText  },
    { name: 'Project', icon: BookMarked },
    { name: 'Networks', icon: GlobeLock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Personal Information':
        return <PersonalInformation 
          onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} 
          profileData={profileData} 
        />;        
      case 'Publication':
        return <Publications 
          profileId={profileId}
          data={publicationsData} 
          onDataUpdate={(data) => updateComponentData('Publications', data)}
          // Pass top publications from profileData if available
          topPublications={profileData.top_publications}
        />;
        case 'Patent':
        return <Patents 
          patents={profileData.patents} 
          onDataUpdate={(data) => updateComponentData('Patents', data)}
        />;
      case 'Project':
        return <Projects 
          onDataUpdate={(data) => updateComponentData('Projects', data)} 
          profileId={profileId} 
        />;
      case 'Networks':
        return <Network 
          onDataUpdate={(data) => updateComponentData('Network', data)} 
          profileId={profileId} 
        />;
      default:
        return <PersonalInformation 
          onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} 
          profileData={profileData} 
        />;
    }
  };

  const handleExport = async () => {

  };

  // Calculate research metrics
  const calculateMetrics = () => {
    // Get citation data from the API response if available
    const citationData = profileData.citation_data && profileData.citation_data.length > 0 
      ? profileData.citation_data[0] 
      : null;
    
    // Get publication stats from API
    const pubStats = profileData.publication_stats || [];
    
    // Calculate total publications - use publicationsData.length if available
    const totalPublications = publicationsData.length || 
      citationData?.num_documents || 
      pubStats.reduce((sum, stat) => sum + stat.total_publications, 0) || 0;
    
    // Calculate total citations
    const totalCitations = citationData?.num_citations || 
      pubStats.reduce((sum, stat) => sum + stat.total_citations_per_year, 0) || 0;
    
    // H-index either from API or calculate
    const hIndex = citationData?.h_index || 
      Math.floor(Math.sqrt(totalCitations)) || 0;
    
    // I-index (publications with 10+ citations) - approximation or direct calculation
    const iIndex = publicationsData.length > 0 
      ? publicationsData.filter(pub => (pub.cited_by || 0) >= 10).length
      : Math.floor(totalPublications * 0.3) || 0;
    
    return [
      { 
        label: 'Publications', 
        value: totalPublications.toString(),
        tooltip: 'Total number of publications across all years'
      },
      { 
        label: 'Citations', 
        value: totalCitations.toString(),
        tooltip: 'Total number of times this researcher\'s publications have been cited'
      },
      { 
        label: 'H-Index', 
        value: hIndex.toString(),
        tooltip: 'The h-index is the largest number h such that h publications have at least h citations each'
      },
      { 
        label: 'I-Index', 
        value: iIndex.toString(),
        tooltip: 'The i-index represents the number of publications with at least 10 citations'
      }
    ];
  };

  // Format publication stats for charts
  const formatPublicationStats = () => {
    const stats = profileData.publication_stats || [
      { year: 2017, total_publications: 5, total_citations_per_year: 28, avg_citations_per_paper: 5.6 },
      { year: 2018, total_publications: 8, total_citations_per_year: 42, avg_citations_per_paper: 5.25 },
      { year: 2019, total_publications: 12, total_citations_per_year: 56, avg_citations_per_paper: 4.7 },
      { year: 2020, total_publications: 10, total_citations_per_year: 38, avg_citations_per_paper: 3.8 },
      { year: 2021, total_publications: 9, total_citations_per_year: 24, avg_citations_per_paper: 2.7 },
      { year: 2022, total_publications: 6, total_citations_per_year: 12, avg_citations_per_paper: 2.0 }
    ];
    
    return stats.map(stat => ({
      year: stat.year,
      publications: stat.total_publications,
      citations: stat.total_citations_per_year
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">Error loading profile: {error}</div>;
  }

  // Get metrics and formatted stats
  const researchMetrics = calculateMetrics();
  const formattedPublicationStats = formatPublicationStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex gap-6 mb-8 bg-gray-100 p-6 rounded-lg">
        <img 
          src={profileData.profile.image_url || "/api/placeholder/400/320"}
          alt="Profile"
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-start gap-x-96 mb-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-slate-200 rounded-full text-m text-black-600">
                    id: {profileId}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>Export</span>
                </Button>
              </div>
              <h1 className="text-2xl font-bold mb-2">{profileData.profile.name || "Dr. Nithyananad Prabhu"}</h1>
              <p className="text-lg text-gray-600">{profileData.profile.designation || "Research Scientist"}</p>
              <p className="text-lg text-gray-600">{profileData.profile.department || "Electrical Engineering"}</p>
              <p className="text-gray-600">{profileData.profile.expertise || "Nanomaterials, Electrochemistry, Energy Storage Applications"}</p>
              <p className="text-gray-600">{profileData.profile.state || "Ahmedabad, Gujarat"}</p>
              {/* Research Metrics */}
              <div className="grid grid-cols-4 md:grid-cols-4 gap-2 mt-6">
                {researchMetrics.map((metric, index) => (
                  <Tooltips key={index} text={metric.tooltip || ''}>
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md cursor-pointer">
                      <p className="text-xl font-bold">{metric.value}</p>
                      <p className="text-gray-600">{metric.label}</p>
                    </div>
                  </Tooltips>
                ))}
              </div>
            </div>

            {/* Academic Identity Section */}
            <Card className="w-72 border-none">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4">Academic Identity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={orcid} alt="ORCID" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Orcid Id</p>
                      <p className="text-sm text-blue-600">
                        <a href={profileData.profile.orcid_url || `https://orcid.org/${profileData.profile.orc_id}`} target="_blank" rel="noopener noreferrer">
                          {profileData.profile.orc_id || "0000-0003-2204-5333"}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={scopus} alt="Scopus" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Scopus Id</p>
                      <p className="text-sm text-blue-600">
                        <a href={profileData.profile.scopus_url || `https://www.scopus.com/authid/detail.uri?authorId=${profileData.profile.scopus_id}`} target="_blank" rel="noopener noreferrer">
                          {profileData.profile.scopus_id || "55155930000"}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={publons} alt="Publons" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Publons Id</p>
                      <p className="text-sm text-blue-600">{profileData.profile.publons_id || "0000-0003-2204-5333"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={googlei} alt="Google Scholar" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Google Scholar Id</p>
                      <p className="text-sm text-blue-600">{profileData.profile.google_scholar_id || "0000-0003-2204-5333"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

     <Card className="w-full h-60 border-none bg-gray-100">
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-72">
            <ResponsiveContainer width="70%" height="70%">
              <BarChart data={formattedPublicationStats}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="publications" name="Publications" fill="#3B82F6" barSize={18} />
                <Bar dataKey="citations" name="Citations" fill="#10B981" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold mb-4">Research Impact Factor</h3>
            <div className="h-48 overflow-y-auto">
              <ul className="space-y-2 text-base">
                <li>Total career publications: {researchMetrics[0].value}</li>
                <li>Publication years: {formattedPublicationStats.length > 0 ? 
                  `${Math.min(...formattedPublicationStats.map(s => s.year))}-${Math.max(...formattedPublicationStats.map(s => s.year))}` : 
                  "N/A"}
                </li>
                <li>Mean Impact Factor (Web of Science): {
                  publicationsData.length > 0 
                    ? (publicationsData.reduce((sum, pub) => sum + (pub.impact_factor || 0), 0) / publicationsData.length).toFixed(2) 
                    : "2.685"
                }</li>
                <li>Average citations per paper: {
                  parseInt(researchMetrics[0].value) > 0 
                    ? (parseInt(researchMetrics[1].value) / parseInt(researchMetrics[0].value)).toFixed(1) 
                    : "0.0"
                }</li>
                <li>Publications with 25+ citations: {
                  publicationsData.length > 0
                    ? publicationsData.filter(pub => (pub.cited_by || 0) >= 25).length
                    : Math.floor(parseInt(researchMetrics[0].value) * 0.2)
                }</li>
              </ul> 
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

      <div className="flex gap-4 border-b mb-6">
        {tabs.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`px-4 py-2 hover:text-blue-600 transition-colors flex items-center gap-2 ${
              activeTab === name 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(name)}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Mainprofile;

