import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import googlei from "../../assets/image 18.png";
import publons from "../../assets/image 17.png";
import altmetric from "../../assets/image (1).png";
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

  const [personalInfo, setPersonalInfo] = useState({
    user: null,
    name: '',
    image: null,
    image_url: '',
    designation: '',
    department: '',
    expertise: '',
    state: '',
    scopus_id: '',
    orc_id: '',
    google_scholar_id: '',
    publons_id: '',
    created_at: '',
    updated_at: ''
  });
  
  const [publicationsData, setPublicationsData] = useState([]);
  const [publicationStats, setPublicationStats] = useState([]);
  const [patentsData, setPatentsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [networkData, setNetworkData] = useState([]);

  // Function to receive data from child components
  const updateComponentData = (componentName, data) => {
    switch(componentName) {
      case 'PersonalInformation':
        setPersonalInfo(data);
        break;
      case 'Publications':
        setPublicationsData(data);
        break;
      case 'PublicationStats':
        setPublicationStats(data);
        break;
      case 'Patents':
        setPatentsData(data);
        break;
      case 'Projects':
        setProjectsData(data);
        break;
      case 'Network':
        setNetworkData(data);
        break;
      default:
        break;
    }
  };

  // Mock data for publication stats based on the model
  useEffect(() => {
    // This would typically come from an API call
    const mockPublicationStats = [
      { year: 2017, total_publications: 5, total_citations: 28, avg_citations_per_paper: 5.6 },
      { year: 2018, total_publications: 8, total_citations: 42, avg_citations_per_paper: 5.25 },
      { year: 2019, total_publications: 12, total_citations: 56, avg_citations_per_paper: 4.7 },
      { year: 2020, total_publications: 10, total_citations: 38, avg_citations_per_paper: 3.8 },
      { year: 2021, total_publications: 9, total_citations: 24, avg_citations_per_paper: 2.7 },
      { year: 2022, total_publications: 6, total_citations: 12, avg_citations_per_paper: 2.0 }
    ];
    setPublicationStats(mockPublicationStats);
  }, []);

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Patent', icon: ScrollText  },
    { name: 'Publication', icon: BookOpen },
    { name: 'Project', icon: BookMarked },
    { name: 'Networks', icon: GlobeLock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Personal Information':
        return <PersonalInformation onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} />;
      case 'Patent':
        return <Patents onDataUpdate={(data) => updateComponentData('Patents', data)} />;
      case 'Publication':
        return <Publications onDataUpdate={(data) => updateComponentData('Publications', data)} />;
      case 'Project':
        return <Projects onDataUpdate={(data) => updateComponentData('Projects', data)} />;
      case 'Networks':
        return <Network onDataUpdate={(data) => updateComponentData('Network', data)} />;
      default:
        return <PersonalInformation onDataUpdate={(data) => updateComponentData('PersonalInformation', data)} />;
    }
  };

  const handleExport = () => {
    console.log('exporting');
  };

  // Calculate total publications and citations
  const totalPublications = publicationStats.reduce((sum, stat) => sum + stat.total_publications, 0);
  const totalCitations = publicationStats.reduce((sum, stat) => sum + stat.total_citations, 0);
  
  // Calculate h-index (simplified example)
  // In a real application, you'd need actual publication data with citation counts
  const hIndex = Math.floor(Math.sqrt(totalCitations));
  
  // Calculate i-index (simplified example)
  // In reality, you'd count publications with at least 10 citations
  const iIndex = Math.floor(totalPublications * 0.3);

  // Format publication stats for the bar chart
  const formattedPublicationStats = publicationStats.map(stat => ({
    year: stat.year.toString(),
    publications: stat.total_publications,
    citations: stat.total_citations
  }));

  const pieData = [
    { name: 'Journal Articles', value: Math.floor(totalPublications * 0.6) },
    { name: 'Conference Papers', value: Math.floor(totalPublications * 0.3) },
    { name: 'Book Chapters', value: Math.floor(totalPublications * 0.1) }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const researchMetrics = [
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex gap-6 mb-8 bg-gray-100 p-6 rounded-lg">
        {/* Use image_url if available, otherwise fallback to the imported image */}
        <img 
          src={personalInfo.image_url || personalInfo.image || "/api/placeholder/400/320"}
          alt="Profile"
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-start gap-x-96 mb-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-slate-200 rounded-full text-s text-black-600">
                    id: {personalInfo.user?.id || "23456"}
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
              <h1 className="text-2xl font-bold mb-2">{personalInfo.name || "Dr. Nithyananad Prabhu"}</h1>
              <p className="text-lg text-gray-600">{personalInfo.designation || "Research Scientist"}</p>
              <p className="text-lg text-gray-600">{personalInfo.department || "Electrical Engineering"}</p>
              <p className="text-gray-600">{personalInfo.expertise || "Nanomaterials, Electrochemistry, Energy Storage Applications"}</p>
              <p className="text-gray-600">{personalInfo.state || "Ahmedabad, Gujarat"}</p>
              {/* Research Metrics */}
              <div className="grid grid-cols-4 md:grid-cols-4 gap-3 mt-6">
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
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Academic Identity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={orcid} alt="ORCID" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Orcid Id</p>
                      <p className="text-sm text-blue-600">{personalInfo.orc_id || "0000-0003-2204-5333"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={scopus} alt="Scopus" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Scopus Id</p>
                      <p className="text-sm text-blue-600">{personalInfo.scopus_id || "55155930000"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={publons} alt="Publons" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Publons Id</p>
                      <p className="text-sm text-blue-600">{personalInfo.publons_id || "0000-0003-2204-5333"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={googlei} alt="Google Scholar" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Google Scholar Id</p>
                      <p className="text-sm text-blue-600">{personalInfo.google_scholar_id || "0000-0003-2204-5333"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="w-full border-none bg-gray-100">
        <CardContent className="p-5">
          <div className="grid grid-cols-4 gap-5">
            {/* Publications Graph */}
            <div className="flex flex-col">
              <h3 className="font-semibold mb-4">Publications</h3>
              <div className="h-48">
                <ResponsiveContainer width="90%" height="90%">
                  <BarChart data={formattedPublicationStats}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="publications" name="Publications" fill="#3B82F6" barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Publication Distribution */}
            <div className="flex flex-col">
              <h3 className="font-semibold mb-4">Publication Distribution</h3>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={20}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right" 
                      wrapperStyle={{paddingLeft:"10px"}}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Citations Over Time */}
            <div className="flex flex-col">
              <h3 className="font-semibold mb-4">Citations Over Time</h3>
              <div className="h-48">
                <ResponsiveContainer width="90%" height="90%">
                  <BarChart data={formattedPublicationStats}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="citations" name="Citations" fill="#10B981" barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Research Impact Factor */}
            <div className="flex flex-col">
              <h3 className="font-semibold mb-4">Research Impact Factor</h3>
              <div className="h-48 overflow-y-auto">
                <ul className="space-y-2 text-sm">
                  <li>Total career publications: {totalPublications}</li>
                  <li>Publication years: {publicationStats.length > 0 ? 
                    `${Math.min(...publicationStats.map(s => s.year))}-${Math.max(...publicationStats.map(s => s.year))}` : 
                    "N/A"}
                  </li>
                  <li>Mean Impact Factor (Web of Science): 2.685</li>
                  <li>Median ERA Ranking: B</li>
                  <li>Average citations per paper: {(totalCitations / totalPublications).toFixed(1)}</li>
                  <li>Highest number of citations: {publicationStats.length > 0 ? 
                    Math.max(...publicationStats.map(s => s.total_citations)) : 
                    "N/A"}
                  </li>
                  <li>Publications with 25+ citations: {Math.floor(totalPublications * 0.2)}</li>
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