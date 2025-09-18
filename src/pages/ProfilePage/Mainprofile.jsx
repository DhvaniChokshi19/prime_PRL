import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from '../../api/axios';

// UI Components
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

// Icons & Images
import { 
  User, ScrollText, BookOpen, BookMarked, Newspaper, Download, 
  FileText, Quote, NotebookText 
} from 'lucide-react';
import orcidImg from "../../assets/image.png";
import scopusImg from "../../assets/image 16.png";
import googleImg from "../../assets/image 18.png";
import publonsImg from "../../assets/image 17.png";
import fbImg from "../../assets/fb.jpg";
import xImg from "../../assets/x.jpg";
import mendleyImg from '../../assets/mendley.png';
import plumxImg from '../../assets/plumx.png';

// Child Components
import PersonalInformation from './PersonalInformation';
import Patents from './Patents';
import Publications from './Publications';
import Projects from './Projects';
import Thesis from './Thesis';
import PostDoctoralFellow from './PostDoctoralFellow.jsx';
import ProfileImageUpload from './ProfileImageUpload';
import handleExportPDF from './handleExport';

// --- Reusable & Sub-Components ---

const TooltipWrapper = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

const ProfileHeader = ({ profile, onImageUpdate, onExport }) => (
  <div className="flex gap-4 w-full bg-gray-50 border border-gray-300 p-4 rounded-lg shadow-md">
    <ProfileImageUpload
      profileImage={`${API_BASE_URL}${profile.image_url}`}
      onImageUpdate={onImageUpdate}
    />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{profile.name || "Dr. Name"}</h1>
          <p className="text-lg text-gray-600">{profile.designation || "Designation"}</p>
          <p className="text-lg text-gray-600">{profile.department || "Department"}</p>
          <p className="text-gray-600">{profile.expertise || "Research Areas"}</p>
          <p className="text-gray-600">{profile.state || "Location"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
          <Download size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
    <AcademicIdentity profile={profile} />
  </div>
);

const AcademicIdentity = ({ profile }) => {
  const identities = [
    { name: 'Orcid Id', img: orcidImg, url: profile.orcid_url, value: profile.orcid_url?.split('/').pop() },
    { name: 'Scopus Id', img: scopusImg, url: profile.scopus_url, value: profile.scopus_url?.split('=').pop() },
    { name: 'Publons Id', img: publonsImg, url: profile.publons_url, value: profile.publons_url?.split('/').pop() },
    { name: 'Google Scholar Id', img: googleImg, url: profile.google_scholar_url, value: profile.google_scholar_url?.split('=').pop() },
  ];

  return (
    <Card className="w-72 border-none shadow-none bg-transparent">
      <CardContent className="pt-2">
        <h3 className="font-semibold mb-2">Academic Identity</h3>
        <div className="space-y-3">
          {identities.map((id) => id.url && (
            <div key={id.name} className="flex items-center gap-2">
              <img src={id.img} alt={id.name} className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">{id.name}</p>
                <a href={id.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {id.value || "N/A"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ metric }) => (
  <div className="bg-white hover:bg-blue-100 transition-colors rounded p-2 cursor-pointer text-center w-full">
    <div className="flex mb-2 items-center h-10">{metric.icon}</div>
    <TooltipWrapper text={metric.tooltip || ''}>
      <div className="flex flex-col items-center">
        <p className="text-xl font-bold text-black mb-1">{metric.value}</p>
        <p className="text-sm text-gray-600 text-center">{metric.label}</p>
      </div>
    </TooltipWrapper>
  </div>
);

const PublicationBarChart = ({ data }) => {
  const allYears = useMemo(() => data.map(stat => stat.year).sort((a, b) => b - a), [data]);
  const [selectedYears, setSelectedYears] = useState(allYears);

  const handleYearToggle = (year) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => b - a)
    );
  };

  const filteredData = useMemo(() => data.filter(stat => selectedYears.includes(stat.year)), [data, selectedYears]);

  return (
    <div className="flex w-full">
      <div className="w-auto pr-4 max-h-60 overflow-y-auto border-r mr-4">
        <h3 className="text-lg font-semibold mb-3">Filter Years</h3>
        <div className="space-y-2">
          {allYears.map(year => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={selectedYears.includes(year)}
                onCheckedChange={() => handleYearToggle(year)}
              />
              <label htmlFor={`year-${year}`} className="text-sm font-medium cursor-pointer">
                {year}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" label={{ value: 'Publications', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" label={{ value: 'Citations', angle: -90, position: 'insideRight' }}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="Publications" fill="#3B82F6" barSize={18} yAxisId="left" />
            <Bar dataKey="Citations" fill="#10B981" barSize={18} yAxisId="right" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ResearchImpactFactor = ({ metrics, onFilter }) => (
  <div className="rounded-lg shadow-sm p-4 h-full">
    <h3 className="font-semibold text-lg mb-2">Bibliometric & Citation Indicators</h3>
    <table className="w-full text-sm">
      <tbody>
        {metrics.map(metric => (
          <tr key={metric.label}>
            <td className="py-1 font-medium">
              {metric.isFilterable ? (
                <button
                  className="text-black hover:underline focus:outline-none text-left w-full"
                  onClick={() => onFilter(metric.filterValue)}
                >
                  {metric.label}:
                </button>
              ) : (
                `${metric.label}:`
              )}
            </td>
            <td className="py-1 text-left">{metric.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Main Profile Component ---

const Mainprofile = () => {
  const { profileId: urlProfileId } = useParams();
  const profileId = urlProfileId ? parseInt(urlProfileId, 10) : null;

  // State Management
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicationsFilter, setPublicationsFilter] = useState(null);
  
  const [profileData, setProfileData] = useState({
    profile: {},
    personal_information: [],
    qualifications: [],
    professional_experiences: [],
    honors_and_awards: [],
    patents: [],
    citation_data: [],
    publication_stats: []
  });
  const [publicationsData, setPublicationsData] = useState([]);

  // Data Fetching
  useEffect(() => {
    const fetchData = async (url, setData) => {
      try {
        const response = await axiosInstance.get(url, { params: { profile_id: profileId } });
        setData(response.data);
      } catch (err) {
        console.error(`Error fetching data from ${url}:`, err);
        setError(err.response?.data?.error || err.message);
      }
    };

    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchData('/api/profile', setProfileData),
        fetchData('/api/profile/publications', setPublicationsData)
      ]);
      setLoading(false);
    };

    if (profileId) {
      loadAllData();
    }
  }, [profileId]);

  // Derived State & Memoized Calculations
  const displayedPublications = useMemo(() => {
    if (activeTab === 'Publication' && publicationsFilter) {
      return publicationsData.filter(pub => (pub.cited_by || 0) >= publicationsFilter.minValue);
    }
    return publicationsData;
  }, [activeTab, publicationsFilter, publicationsData]);

  const filterMessage = useMemo(() => {
    return publicationsFilter ? `Showing publications with ${publicationsFilter.minValue}+ citations` : '';
  }, [publicationsFilter]);

  const { publicationsMetrics, altmetrics, impactMetrics } = useMemo(() => {
    const totalPublications = publicationsData.length;
    const totalCitations = publicationsData.reduce((sum, pub) => sum + (pub.cited_by || 0), 0);
    const years = profileData.publication_stats?.map(s => s.year) || [];
    const yearRange = years.length > 0 ? `${Math.min(...years)}-${Math.max(...years)}` : 'N/A';

    const pubs = [
      { label: 'Total Publications (with PRL Affiliation)', value: totalPublications },
      { label: 'Publication years', value: yearRange },
      { label: 'Average citations per paper', value: totalPublications > 0 ? (totalCitations / totalPublications).toFixed(1) : "0.0" },
      { label: 'Highest number of citations', value: publicationsData.length > 0 ? Math.max(...publicationsData.map(p => p.cited_by || 0)) : 0 },
      { label: 'Journal Articles with 20+ citations', value: publicationsData.filter(p => (p.cited_by || 0) >= 20).length, isFilterable: true, filterValue: 20 },
      { label: 'Journal Articles with 50+ citations', value: publicationsData.filter(p => (p.cited_by || 0) >= 50).length, isFilterable: true, filterValue: 50 },
    ];
    
    const pMetrics = [
      { label: 'Journal Articles (PRL)', value: totalPublications.toString(), tooltip: 'Total number of Journal Articles affiliated by PRL', icon: <FileText size={28} className="text-blue-600" /> },
      { label: 'Citations', value: totalCitations.toString(), tooltip: 'Total number of citations', icon: <Quote size={28} className="text-blue-600"/> },
    ];
    
    const aMetrics = [
        // { label: 'Facebook Mentions', 
          {value: publicationsData.reduce((s, p) => s + (p.fb_cite || 0), 0).toString(), tooltip:'Facebook Mentions', icon: <img src={fbImg} alt="Facebook" className="w-8 h-8" /> },
        {  value: publicationsData.reduce((s, p) => s + (p.x_cite || 0), 0).toString(),tooltip:'Mentions on X', icon: <img src={xImg} alt="X" className="w-7 h-7" /> },
        { value: publicationsData.reduce((s, p) => s + (p.news_cite || 0), 0).toString(),tooltip:'News Mentions', icon: <Newspaper size={30} className="text-black" /> },
        { value: publicationsData.reduce((s, p) => s + (p.mendeley_cite || 0), 0).toString(), tooltip:'Mendeley Citation',icon: <img src={mendleyImg} alt="Mendeley" className='w-10 h-10' /> },
        { value: publicationsData.reduce((s, p) => s + (p.plumx_citations || 0), 0).toString(),tooltip:'PlumX Citations', icon: <img src={plumxImg} alt="PlumX" className='w-10 h-10' /> }
    ];

    return { publicationsMetrics: pMetrics, altmetrics: aMetrics, impactMetrics: pubs };
  }, [publicationsData, profileData.publication_stats]);

  const chartData = useMemo(() => {
    return (profileData.publication_stats || []).map(stat => ({
      year: stat.year,
      Publications: stat.total_publications,
      Citations: stat.total_citations_per_year
    }));
  }, [profileData.publication_stats]);


  // Event Handlers
  const handlePublicationFilter = useCallback((minValue) => {
    setActiveTab('Publication');
    setPublicationsFilter({ key: 'Cited by:', minValue });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, []);

  const handleImageUpdate = useCallback((newImageUrl) => {
    setProfileData(prev => ({
      ...prev,
      profile: { ...prev.profile, image_url: newImageUrl.replace(API_BASE_URL, '') }
    }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const dataForExport = {
        profile: profileData.profile,
        professional_experiences: profileData.professional_experiences || [],
        qualifications: profileData.qualifications || [],
        honors_and_awards: profileData.honors_and_awards || [],
        citation_data: profileData.citation_data || [], 
        publication_stats: profileData.publication_stats || [],
      };
      await handleExportPDF(dataForExport, publicationsData, chartData);
    } catch (err) {
      console.error('Export error:', err);
    }
  }, [profileData, publicationsData, chartData]);

  const tabs = useMemo(() => [
    { name: 'Personal Information', icon: User, component: <PersonalInformation profileData={profileData} /> },
    { name: 'Publication', icon: BookOpen, component: <Publications data={displayedPublications} filterMessage={filterMessage} /> },
    { name: 'Patent', icon: ScrollText, component: <Patents patents={profileData.patents} /> },
    { name: 'Project', icon: BookMarked, component: <Projects profileId={profileId} /> },
    { name: 'Thesis (PhD)', icon: Newspaper, component: <Thesis profileId={profileId} /> },
    { name: 'Post Doctoral Fellow', icon: NotebookText, component: <PostDoctoralFellow profileId={profileId} /> },
  ], [profileData, displayedPublications, filterMessage, profileId]);

  // Render Logic
  if (loading) return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
  if (error) return <div className="text-red-500 text-center p-6">Error loading profile: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <ProfileHeader 
        profile={profileData.profile}
        onImageUpdate={handleImageUpdate}
        onExport={handleExport}
      />
      
      <Card>
        <CardContent className=" border-none shadow-none p-3 grid grid-cols-3 md:grid-cols-3 gap-3 ">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Publications and Citations</h3>
            <div className="grid grid-cols-2 gap-3">
              {publicationsMetrics.map(metric => <MetricCard key={metric.label} metric={metric} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Altmetrics</h3>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
              {altmetrics.map(metric => <MetricCard key={metric.label} metric={metric} />)}
            </div>
          </div>
          <div>
            <ResearchImpactFactor metrics={impactMetrics} onFilter={handlePublicationFilter} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className=" border-none shadow-none p-4 grid grid-cols-1 lg:grid-cols-1 gap-6">
           <PublicationBarChart data={chartData} />
        </CardContent>
      </Card>
      
      <div>
        <div className="border-b mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`px-4 py-2 flex-shrink-0 flex items-center gap-2 transition-colors ${activeTab === name ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab(name)}
              >
                <Icon size={18} />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          {tabs.find(tab => tab.name === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;