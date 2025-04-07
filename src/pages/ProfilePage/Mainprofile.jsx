import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Newspaper } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import googlei from "../../assets/image 18.png";
import publons from "../../assets/image 17.png";
import PersonalInformation from './PersonalInformation';
import Patents from './Patents';
import Publications from './Publications';
import Network from './Network';
import Projects from './Projects';
import handleExportPDF from './handleExport';
import { useParams } from 'react-router-dom';
import Thesis from './Thesis';
import { 
  User,
  ScrollText,
  BookOpen,
  GlobeLock,
  BookMarked,
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import ProfileImageUpload from './ProfileImageUpload';



// Tooltips component
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
        <div className="absolute bottom-full mb-2 w-48 p-2 bg-white-900 text-black text-xs rounded shadow-lg">
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
  const { profileId: urlProfileId } = useParams();
  const [publicationsFilter, setPublicationsFilter] = useState(null);
  
   const profileId = urlProfileId ? parseInt(urlProfileId, 10) : null;

  
  const [profileData, setProfileData] = useState({
    profile: {
      name: '',
      image_url: '',
      designation: '',
      department: '',
      expertise: '',
      state: '',
      orcid_url: '',
      scopus_url: '',
      google_scholar_url: '',
      publons_url: '',
      orc_id:'',
      scopus_id:'',
    },
    personal_information: [],
    qualifications: [],
    professional_experiences: [],
    honors_and_awards: [],
    patents: [],
    citation_data: [],
    publication_stats: []
  });
  
  const [publicationsData, setPublicationsData] = useState([]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile', {
          params: { profile_id: profileId }
        });
        
        console.log("Received profile data:", response.data);
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error.response?.data?.error || error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  // Fetch publications data
  useEffect(() => {
    const fetchPublicationsData = async () => {
      try {
        const response = await axiosInstance.get('/api/profile/publications', {
          params: { profile_id: profileId }
        });
        setPublicationsData(response.data);
      } catch (error) {
        console.error("Error fetching publications data:", error);
      }
    };

    fetchPublicationsData();
  }, [profileId]);


  const updateComponentData = (componentName, data) => {
    switch(componentName) {
      case 'PersonalInformation':
        setProfileData(prevData => ({
          ...prevData,
          profile: { ...prevData.profile, ...data.profile },
          personal_information: data.personal_information || prevData.personal_information,
          qualifications: data.qualifications || prevData.qualifications,
          professional_experiences: data.professional_experiences || prevData.professional_experiences,
          honors_and_awards: data.honors_and_awards || prevData.honors_and_awards
        }));
        break;
      case 'Publications':
        setPublicationsData(data);
        break;
      // case 'Patents':
      //   setProfileData(prevData => ({ ...prevData, patents: data }));
      //   break;       
      default:
        break;
    }
  };

  // Tabs configuration
  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Publication', icon: BookOpen },
    { name: 'Patent', icon: ScrollText },
    { name: 'Project', icon: BookMarked },
    {name: 'Thesis', icon: Newspaper},
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
           filter={publicationsFilter} 
          onDataUpdate={(data) => updateComponentData('Publications', data)}
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
      case 'Thesis':
        return <Thesis
        onDataUpdate={(data) => updateComponentData('Thesis', data)}
        profileId={profileId}
        />
      default:
        return <PersonalInformation 
          onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} 
          profileData={profileData} 
        />;
    }
  };

  // Calculate research metrics
  const calculateMetrics = () => {
    const totalPublications = publicationsData.length;
    const totalCitations = publicationsData.reduce((sum, pub) => sum + (pub.cited_by || 0), 0);
    
    const citationData = profileData.citation_data?.[0] || {};
    const hIndex = citationData.h_index || Math.floor(Math.sqrt(totalCitations));
   
const highImpactPublicationsCount = publicationsData.filter(pub => (pub.cited_by || 0) >= 20).length;
    return [
      { 
        label: 'Journal Articles', 
        value: totalPublications.toString(),
        tooltip: 'Total number of publications'
      },
      { 
        label: 'Citations', 
        value: totalCitations.toString(),
        tooltip: 'Total number of citations'
      },
      { 
        label: 'H-Index', 
        value: hIndex.toString(),
        tooltip: 'Measure of research productivity and impact'
      },
    ];
  };

  // Format publication stats for charts
  const formatPublicationStats = () => {
    const stats = profileData.publication_stats || [];
    return {
      stats: stats.map(stat => ({
        year: stat.year,
        Publications: stat.total_publications,
        Citations: stat.total_citations_per_year
      })),
      yearRangeOptions: stats.length > 0 
        ? `${Math.min(...stats.map(s => s.year))}-${Math.max(...stats.map(s => s.year))}`
        : 'N/A'
    };
  };

  const handleExport = async () => {
    try {
   
    const dataForExport = {
      profile: profileData.profile,
      professional_experiences: profileData.professional_experiences || [],
      qualifications: profileData.qualifications || [],
      honors_and_awards: profileData.honors_and_awards || [],
      citation_data: profileData.citation_data || [], 
      publication_stats: profileData.publication_stats || [],
    };
     const { stats: chartData } = formatPublicationStats();
    const result = await handleExportPDF(dataForExport, publicationsData,chartData);
    
    if (result) {
      console.log('PDF successfully downloaded');
    } else {
      console.error('Error downloading PDF');
    }
  } catch (error) {
    console.error('Export error:', error);
  }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">Error loading profile: {error}</div>;
  }

  // Get metrics and formatted stats
  const researchMetrics = calculateMetrics();
  const { stats: formattedPublicationStats, yearRangeOptions } = formatPublicationStats();

  const PublicationBarChart = () => {
    
    const allYears = formattedPublicationStats.map(stat => stat.year);
    
    // State for selected years
    const [selectedYears, setSelectedYears] = useState(allYears);

    // Filter publication stats based on selected years
    const filteredStats = formattedPublicationStats.filter(stat => 
      selectedYears.includes(stat.year)
    );

    // Handle year selection toggle
    const handleYearToggle = (year) => {
       setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
    };
   return (
    <div className="flex">
      <div className="w-1/4 pr-4 max-h-60 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Select Years</h3>
        <div className="space-y-2">
          {allYears.map(year => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={selectedYears.includes(year)}
                onCheckedChange={() => handleYearToggle(year)}
              />
              <label 
                htmlFor={`year-${year}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {year}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="w-3/4 publication-chart-container">
        <ResponsiveContainer width="90%" height={200}>
          <BarChart data={filteredStats}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Publications" name="Publications" fill="#3B82F6" barSize={18} />
            <Bar dataKey="Citations" name="Citations" fill="#10B981" barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    );
  };
const handlePublication=()=>{
setActiveTab('Publication');
  
    setPublicationsFilter({
      key: 'Cited by:',
      minValue: 20,
    });
}
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex gap-6 mb-8 bg-gray-100 p-6 rounded-lg">
     <ProfileImageUpload 
    profileImage={`${API_BASE_URL}${profileData.profile.image_url}` || null}
    onImageUpdate={(newImageUrl) => {
      setProfileData(prevData => ({
        ...prevData,
        profile: { 
          ...prevData.profile, 
          image_url: newImageUrl.replace(API_BASE_URL, '') 
        }
      }));
    }}
  />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-start gap-x-96 mb-1">
                <div className="flex items-center space-x-2 mb-2">
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
              <h1 className="text-2xl font-bold mb-2">{profileData.profile.name || "Dr. Name"}</h1>
              <p className="text-lg text-gray-600">{profileData.profile.designation || "Designation"}</p>
              <p className="text-lg text-gray-600">{profileData.profile.department || "Department"}</p>
              <p className="text-gray-600">{profileData.profile.expertise || "Research Areas"}</p>
              <p className="text-gray-600">{profileData.profile.state || "Location"}</p>
              
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
                        <a 
                          href={profileData.profile.orcid_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {profileData.profile.orcid_url 
                ? profileData.profile.orcid_url.split('/').pop() 
                : ""}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={scopus} alt="Scopus" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Scopus Id</p>
                      <p className="text-sm text-blue-600">
                        <a 
                          href={profileData.profile.scopus_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {profileData.profile.scopus_url
                ? profileData.profile.scopus_url.split('=').pop()
                : ""}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={publons} alt="Publons" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Publons Id</p>
                      <p className="text-sm text-blue-600">{profileData.profile.publons_id || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={googlei} alt="Google Scholar" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Google Scholar Id</p>
                      <p className="text-sm text-blue-600">{profileData.profile.google_scholar_id || ""}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Publications Chart */}
      <Card className="w-full h-60 border-none bg-gray-100">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-72">
                 <PublicationBarChart />
            </div>
            <div className="mt-3">
              <h3 className="font-semibold mb-4">Research Impact Factor</h3>
              <div className="h-48 overflow-y-auto">
                <ul className="space-y-2 text-base">
                  <li>Total career publications(PRL): {researchMetrics[0].value}</li>
                  <li>Publication years: {yearRangeOptions}</li>
                  <li>Average citations per paper: {
                    parseInt(researchMetrics[0].value) > 0 
                      ? (parseInt(researchMetrics[1].value) / parseInt(researchMetrics[0].value)).toFixed(1) 
                      : "0.0"
                  }</li>
                  <li className="cursor-pointer hover:text-blue-600 transition-colors" onClick={handlePublication}>Publications with 20+ citations: {
                    publicationsData.filter(pub => (pub.cited_by || 0) >= 20).length
                  }</li>
                </ul> 
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
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
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Mainprofile;