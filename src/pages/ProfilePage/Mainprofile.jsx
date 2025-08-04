import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import googlei from "../../assets/image 18.png";
import publons from "../../assets/image 17.png";
import PersonalInformation from './PersonalInformation';
import Patents from './Patents';
import Publications from './Publications';
import Projects from './Projects';
import handleExportPDF from './handleExport';
import { useParams } from 'react-router-dom';
import Thesis from './Thesis';
import fb from "../../assets/fb.jpg";
import X from "../../assets/x.jpg";
import Mend from '../../assets/mendley.png';
import plum from '../../assets/plumx.png'
import { 
  User,
  ScrollText,
  BookOpen,
  BookMarked,
  Newspaper,
  Download,
  FileText,
  Quote,
  Bookmark,
  BookText,
  NotebookText,
  SquareChartGantt,
  Users,
} from 'lucide-react';
import ProfileImageUpload from './ProfileImageUpload';
import PostDoctoralFellow from './PostDoctoralFellow.jsx';

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

const ResearchImpactFactor = ({ 
  publicationsMetrics, 
  yearRangeOptions, 
  publicationsData, 
  setActiveTab, 
  setPublicationsFilter 
}) => {
  const handlePublicationFilter = (minValue) => {
    setActiveTab('Publication');
    setPublicationsFilter({
      key: 'Cited by:',
      minValue: minValue,
    });
  };

  const handleClearFilter = () => {
    setPublicationsFilter(null);
  };

  // Safely get total publications - use publicationsMetrics array
  const totalPublications = publicationsMetrics && publicationsMetrics.length > 0 
    ? publicationsMetrics[0].value 
    : publicationsData.length.toString();
  
  // Safely get total citations
  const totalCitations = publicationsMetrics && publicationsMetrics.length > 1 
    ? publicationsMetrics[1].value 
    : publicationsData.reduce((sum, pub) => sum + (pub.cited_by || 0), 0).toString();

  const publications20Plus = publicationsData.filter(pub => (pub.cited_by || 0) >= 20).length;
  const publications50Plus = publicationsData.filter(pub => (pub.cited_by || 0) >= 50).length;

  return (
    <div className="rounded-lg shadow-sm p-3 h-72">
      <h3 className="font-semibold text-lg mb-2">Bibliometric and Citation Indicators</h3>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="font-medium">Total Publications <span className='text-red-600'>( with PRL Affiliation)</span>:</td>
            <td className="text-left">{totalPublications}</td>
          </tr>
          <tr>
            <td className="py-1 font-medium">Publication years:</td>
            <td className="py-1 text-left">{yearRangeOptions}</td>
          </tr>
          <tr>
            <td className="py-1 font-medium">Average citations per paper:</td>
            <td className="py-1 text-left">
              {parseInt(totalPublications) > 0 
                ? (parseInt(totalCitations) / parseInt(totalPublications)).toFixed(1) 
                : "0.0"}
            </td>
          </tr>
          <tr>
            <td className="py-1 font-medium">Highest number of citations:</td>
            <td className="py-1 text-left">
              {publicationsData.length > 0 
                ? Math.max(...publicationsData.map(pub => pub.cited_by || 0)) 
                : 0}
            </td>
          </tr>
          <tr>
            <td className="py-1 font-medium">
              <button 
                className="text-black hover:underline focus:outline-none text-left w-full"
                onClick={() => handlePublicationFilter(20)}
              >
               Journal Articles with 20+ citations:
              </button>
            </td>
            <td className="py-1 text-left">
             {publications20Plus}
            </td>
          </tr>
          <tr>
            <td className="py-1 font-medium">
              <button 
                className="text-black hover:underline focus:outline-none text-left w-full"
                onClick={() => handlePublicationFilter(50)}
              >
               Journal Articles with 50+ citations:
              </button>
            </td>
            <td className="py-1 text-left">
              {publications50Plus}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Mainprofile = () => {
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profileId: urlProfileId } = useParams();
  const [publicationsFilter, setPublicationsFilter] = useState(null);
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [filterMessage, setFilterMessage] = useState('');
  
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
      publons_id:'',
      google_scholar_id:'',
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
        setDisplayedPublications(response.data); // Initialize displayed publications
      } catch (error) {
        console.error("Error fetching publications data:", error);
      }
    };

    fetchPublicationsData();
  }, [profileId]);

  useEffect(() => {
    if (activeTab === 'Publication' && publicationsFilter) {
      const filteredData = publicationsData.filter(publication => {
        if (publicationsFilter.key === 'Cited by:' && publicationsFilter.minValue) {
          return (publication.cited_by || 0) >= publicationsFilter.minValue;
        }
        return true;
      });
      
      setDisplayedPublications(filteredData);
      setFilterMessage(`Showing publications with ${publicationsFilter.minValue}+ citations`);
    } else if (activeTab === 'Publication') {
      setDisplayedPublications(publicationsData);
      setFilterMessage('');
    }
  }, [activeTab, publicationsFilter, publicationsData]);
  
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
        if (!publicationsFilter && JSON.stringify(publicationsData) !== JSON.stringify(data)) {
          setPublicationsData(data);
        }
        break;
      default:
        break;
    }
  };

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Publication', icon: BookOpen },
    { name: 'Patent', icon: ScrollText },
    { name: 'Project', icon: BookMarked },
    { name: 'Thesis (PhD)', icon: Newspaper },
    {name : 'Post Doctoral Fellow',icon: NotebookText},
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
          data={displayedPublications}
          filterMessage={filterMessage}
          onDataUpdate={(data) => {
            if (!publicationsFilter) {
              updateComponentData('Publications', data);
            }
          }}
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
      case 'Thesis (PhD)':
        return <Thesis
          onDataUpdate={(data) => updateComponentData('Thesis', data)}
          profileId={profileId}
        />;
      case 'Post Doctoral Fellow':
          return <PostDoctoralFellow
          onDataUpdate={(data) => updateComponentData('Post Doctoral Fellow', data)}
          profileId={profileId}
        />;
      default:
        return <PersonalInformation 
          onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} 
          profileData={profileData} 
        />;
    }
  };

  const calculateMetrics = () => {
    const totalPublications = publicationsData.length;
    const totalCitations = publicationsData.reduce((sum, pub) => sum + (pub.cited_by || 0), 0);
    
    const citationData = profileData.citation_data?.[0] || {};
    const totalFbCites = publicationsData.reduce((sum, pub) => sum + (pub.fb_cite || 0), 0);
    const totalXCites = publicationsData.reduce((sum, pub) => sum + (pub.x_cite || 0), 0);
    const totalNewsCites = publicationsData.reduce((sum, pub) => sum + (pub.news_cite || 0), 0);
    const totalMendelyCites = publicationsData.reduce((sum, pub) => sum + (pub.mendeley_cite || 0), 0);
    const totalPlumxCitations = publicationsData.reduce((sum, pub) => sum + (pub.plumx_citations || 0), 0);

    const publicationsMetrics = [
      { 
        label: 'Journal Articles (PRL)', 
        value: totalPublications.toString(),
        tooltip: 'Total number of Journal Articles affiliated by PRL',
        icon: <FileText size={24} className="text-blue-600" />,
        
      },
      { 
        label: 'Citations', 
        value: totalCitations.toString(),
        tooltip: 'Total number of citations',
        icon: <Quote size={28} className="text-blue-600"/>,
      },
    ];

    // Altmetrics (3rd row)
    const altmetrics = [
      { 
        label: ' Facebook Mentions',
        value: totalFbCites.toString(),
        tooltip: 'Total mentions on Facebook',
        icon: <img src={fb} alt="Facebook" className="w-8 h-9" />,
      },
      { 
        label: ' Mentions on X',
        value: totalXCites.toString(),
        tooltip: 'Total mentions on X (Twitter)',
        icon: <img src={X} alt="X" className="w-7 h-7" />,
      },
      { 
        label: ' Mentions in News',
        value: totalNewsCites.toString(),
        tooltip: 'Total mentions in news outlets',
        icon: <Newspaper size={30} className="text-black" />,
      },
      { 
        label: ' Mendeley Citations',
        value: totalMendelyCites.toString(),
        tooltip: 'Total Mendeley Citations',
        icon: <img src={Mend} alt="mendeley" className='w-10 h-10' />,
      },
      { 
        label: ' PlumX Citations', 
        value: totalPlumxCitations.toString(),
        tooltip: 'Total PlumX citations',
        icon: <img className='w-10 h-10' src={plum} alt="plumc" />
      }
    ];

    return {
      publicationsMetrics,
      altmetrics
    };
  };

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
      const result = await handleExportPDF(dataForExport, publicationsData, chartData);
      
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

  const { publicationsMetrics, altmetrics } = calculateMetrics();
  const { stats: formattedPublicationStats, yearRangeOptions } = formatPublicationStats();

  const PublicationBarChart = () => {
    const allYears = formattedPublicationStats.map(stat => stat.year);
    
    const [selectedYears, setSelectedYears] = useState(allYears);

    const filteredStats = formattedPublicationStats.filter(stat => 
      selectedYears.includes(stat.year)
    );

    const handleYearToggle = (year) => {
      setSelectedYears(prev => 
        prev.includes(year) 
          ? prev.filter(y => y !== year)
          : [...prev, year]
      );
    };
    
    const maxPublications = Math.max(...(filteredStats.length ? filteredStats.map(item => item.Publications) : [0]));
    const maxCitations = Math.max(...(filteredStats.length ? filteredStats.map(item => item.Citations) : [0]));
    
    return (
      <div className="flex">
        <div className="w-auto pr-4 max-h-52 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Select Years</h3>
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
          <ResponsiveContainer width="110%" height={250}>
            <BarChart 
              data={filteredStats}
              margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis dataKey="year" />
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke="#3B82F6"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#10B981"
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="Publications" 
                name="Publications" 
                fill="#3B82F6" 
                barSize={18} 
                yAxisId="left"
              />
              <Bar 
                dataKey="Citations" 
                name="Citations" 
                fill="#10B981" 
                barSize={18} 
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMetricCards = (metrics) => {
    return metrics.map((metric, index) => (
      <div key={index} className="bg-white hover:bg-blue-200 transition-colors rounded p-1 cursor-pointer text-center px-2 py-1">
        <div className="flex justify-center mb-2">
          {metric.icon}
        </div>
        <Tooltips text={metric.tooltip || ''}>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-black text-center mb-1">{metric.value}</p>
            <p className="text-base text-gray-600 text-center">{metric.label}</p>
          </div>
        </Tooltips>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="flex gap-4 mb-1 bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-md"> 
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
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{profileData.profile.name || "Dr. Name"}</h1>
              <p className="text-lg text-gray-600">{profileData.profile.designation || "Designation"}</p>
              <p className="text-lg text-gray-600">{profileData.profile.department || "Department"}</p>
              <p className="text-gray-600">{profileData.profile.expertise || "Research Areas"}</p>
              <p className="text-gray-600">{profileData.profile.state || "Location"}</p>
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
        </div>
        <Card className="w-72 border-none shadow-none">
          <CardContent className="pt-2">
            <h3 className="font-semibold mb-2">Academic Identity</h3>
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
                  <p className="text-sm text-blue-600">
                    <a 
                      href={profileData.profile.publons_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {profileData.profile.publons_url
                        ? profileData.profile.publons_url.split('/').pop()  
                        : ""}
                    </a> 
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={googlei} alt="Google Scholar" className="w-8 h-8" />
                <div>
                  <p className="text-sm font-medium">Google Scholar Id</p>
                  <p className="text-sm text-blue-600">
                    <a 
                      href={profileData.profile.google_scholar_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {profileData.profile.google_scholar_url
                        ? profileData.profile.google_scholar_url.split('=').pop() 
                        : ""}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
     <Card className="w-full mt-2 border-none shadow-none">
  <CardContent className="p-2">
    <div className="max-w-full">
      <div className="bg-white rounded-l shadow-lg overflow-hidden border border-gray-200 grid grid-cols-2 gap-0">
        <div className="p-3 border-r border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Publications and Citations</h3>
          <div className="grid grid-cols-4 gap-1">
            {renderMetricCards(publicationsMetrics)}
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Altmetrics</h3>
          <div className="grid grid-cols-5">
            {renderMetricCards(altmetrics)}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
      <Card className="w-full mb-1 bg-gray-50 border border-gray-300">
        <CardContent className="p-3">
          <div className="grid grid-cols-1">
            <div className="h-64wh">
              <PublicationBarChart />
            </div>
            <div>
              <ResearchImpactFactor 
                publicationsMetrics={publicationsMetrics}
                yearRangeOptions={yearRangeOptions}
                publicationsData={publicationsData}
                setActiveTab={setActiveTab}
                setPublicationsFilter={setPublicationsFilter}
              />
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