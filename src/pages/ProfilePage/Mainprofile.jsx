import React,{useState} from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,Tooltip, XAxis,YAxis,Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import profilephoto from "../../assets/image 13.png";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import research from "../../assets/image 17.png";
import googlei from "../../assets/image 18.png";
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
}; //TEMPORARY CUSTOM TOOLTIP COMPONENT, WILL BE REPLACED WITH A LIBRARY
const Mainprofile = () => {
  const [activeTab, setActiveTab] = useState('Personal Information');

  const [personalInfo, setPersonalInfo] = useState({});
  const [publicationsData, setPublicationsData] = useState([]);
  const [patentsData, setPatentsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [networkData, setNetworkData] = useState([]);

  //function to receive data from child components
  const updateComponentData = (componentName, data) => {
    switch(componentName) {
      case 'PersonalInformation':
        setPersonalInfo(data);
        break;
      case 'Publications':
        setPublicationsData(data);
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

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Patent', icon: ScrollText  },
    { name: 'Publication', icon: BookOpen },
    {name: 'Project',icon: BookMarked},
    {name: 'Networks',icon: GlobeLock},
    
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
   const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;
    
    // Set font styles
    const titleFont = 'helvetica';
    const regularFont = 'helvetica';
    
    // Add header with researcher name - using real data from state
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(18);
    doc.text(personalInfo.name || 'Dr. Nithyananad Prabhu', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Add position and field
    doc.setFontSize(12);
    doc.text(`${personalInfo.position || 'Research Scientist'} - ${personalInfo.field || 'Electrical Engineering'}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Add specialization
    doc.setFont(regularFont, 'normal');
    doc.setFontSize(10);
    doc.text(personalInfo.specialization || 'Nanomaterials, Electrochemistry, Energy Storage Applications', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Add location
    doc.text(personalInfo.location || 'Ahmedabad, Gujarat', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Add academic identifiers
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(12);
    doc.text('Academic Identity', 20, yPosition);
    yPosition += 6;
    
    doc.setFont(regularFont, 'normal');
    doc.setFontSize(10);
    doc.text(`ORCID ID: ${personalInfo.orcidId || '0000-0003-2204-5333'}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Scopus ID: ${personalInfo.scopusId || '55155930000'}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Researcher ID: ${personalInfo.researcherId || '0000-0003-2204-5333'}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Google Scholar ID: ${personalInfo.googleId || '0000-0003-2204-5333'}`, 20, yPosition);
    yPosition += 15;
    
    // Add research metrics
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(12);
    doc.text('Research Metrics', 20, yPosition);
    yPosition += 8;
    
    // Create metrics table using real data when available
    const metricsData = [
      ['Publications', personalInfo.publications || '50'],
      ['Citations', personalInfo.citations || '100'],
      ['H-Index', personalInfo.hIndex || '64'],
      ['I-Index', personalInfo.iIndex || '64'],
      ['Mean Impact Factor (Web of Science)', personalInfo.impactFactor || '2.685'],
      ['Median ERA Ranking', personalInfo.eraRanking || 'B'],
      ['Average citations per paper', personalInfo.avgCitations || '6.2'],
      ['Highest number of citations', personalInfo.maxCitations || '61'],
      ['Publications with 25+ citations', personalInfo.pubsWith25Citations || '10']
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Publications section using real data
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(14);
    doc.text('Publications', 20, yPosition);
    yPosition += 8;
    
    // Use real publications data if available, otherwise use sample data
    const publicationsForTable = publicationsData.length > 0 ? 
      publicationsData.map(pub => [pub.title, pub.journal, pub.year.toString(), pub.doi]) :
      [
        ['Advances in Nanomaterials for Energy Storage', 'Journal of Energy Materials', '2022', '10.1000/xyz123'],
        ['Electrochemical Properties of Novel Composite Materials', 'Electrochemistry Communications', '2021', '10.1000/abc456'],
        ['Sustainable Energy Storage Solutions', 'Applied Energy', '2020', '10.1000/def789']
      ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Title', 'Journal', 'Year', 'DOI']],
      body: publicationsForTable,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Patents section using real data
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(14);
    doc.text('Patents', 20, yPosition);
    yPosition += 8;
    
    // Use real patents data if available, otherwise use sample data
    const patentsForTable = patentsData.length > 0 ?
      patentsData.map(patent => [patent.title, patent.patentNumber, patent.year.toString(), patent.status]) :
      [
        ['Method for Enhancing Battery Life in Electric Vehicles', 'US12345678', '2021', 'Granted'],
        ['Energy Efficient Storage Device', 'US87654321', '2019', 'Granted']
      ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Title', 'Patent Number', 'Year', 'Status']],
      body: patentsForTable,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Projects section using real data
    if (yPosition > 240) { // Check if need a new page
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(14);
    doc.text('Projects', 20, yPosition);
    yPosition += 8;
    
    
    const projectsForTable = projectsData.length > 0 ?
      projectsData.map(project => [project.title, project.agency, project.duration, project.status]) :
      [
        ['Development of High-Capacity Energy Storage Systems', 'Department of Science & Technology', '2020-2023', 'Ongoing'],
        ['Green Energy Solutions for Smart Cities', 'Ministry of Electronics & IT', '2018-2021', 'Completed']
      ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Title', 'Funding Agency', 'Duration', 'Status']],
      body: projectsForTable,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
    
    // Add footer with date
    const today = new Date();
    doc.setFont(regularFont, 'italic');
    doc.setFontSize(8);
    doc.text(`Generated on ${today.toLocaleDateString()}`, pageWidth - 20, 280, { align: 'right' });
    
    // Save the PDF with a filename
    const researcherName = personalInfo.name ? personalInfo.name.replace(/\s+/g, '_') : 'name';
    doc.save(`CV_${researcherName}_${today.toLocaleDateString().replace(/\//g, '-')}.pdf`);
  };

  const publicationData = [
    { year: '2017', count: 5 },
    { year: '2018', count: 8 },
    { year: '2019', count: 12 },
    { year: '2020', count: 10 },
    { year: '2021', count: 9 },
    { year: '2022', count: 6 }
  ];

  const pieData = [
    { name: 'Journal Articles', value: 30 },
    { name: 'Conference Papers', value: 15 },
    { name: 'Book Chapters', value: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

 const researchMetrics = [
    { 
      label: 'Publications', 
      value: '50',
      tooltip: null
    },
    { 
      label: 'Citation', 
      value: '100',
      tooltip: 'The number of times the researcher\'s publications have been referenced by other works.'
    },
    { 
      label: 'H-Index', 
      value: '64',
      tooltip: 'A metric that measures a researcher productivity and impact.'
    },
    { 
      label: 'I-Index', 
      value: '64',
      tooltip: 'It represents the number of publications with at least 10 citations'
    }
  ];

  // const impactFactors = [
  //   { label: 'Mean Impact Factor (Web of Science)', value: '24' },
  //   { label: 'Median ERA Ranking', value: '1' },
  //   { label: 'Average citations per paper', value: '10' },
  //   { label: 'Total citations', value: '20' },
  //   { label: 'Highest number of citations', value: '22' },
  //   { label: 'Publications with 25+ citations', value: '20' }
  // ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex gap-6 mb-8 bg-gray-100 p-6 rounded-lg">
        <img 
          src={profilephoto}
          alt="Profile"
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-start gap-x-96 mb-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-slate-200 rounded-full text-s text-black-600">
                    Uid: 23456
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
              <h1 className="text-2xl font-bold mb-2">Dr. Nithyananad Prabhu</h1>
              <p className="text-lg text-gray-600">Research Scientist</p>
              <p className="text-lg text-gray-600">Electrical Engineering</p>
              <p className="text-gray-600">Nanomaterials, Electrochemistry, Energy Storage Applications</p>
              <p className="text-gray-600">Ahmedabad, Gujarat</p>
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
                      <p className="text-sm text-blue-600">0000-0003-2204-5333</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={scopus} alt="Scopus" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Scopus Id</p>
                      <p className="text-sm text-blue-600">55155930000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={research} alt="Research" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Researcher Id</p>
                      <p className="text-sm text-blue-600">0000-0003-2204-5333</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={googlei} alt="Google Scholar" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium">Google Id</p>
                      <p className="text-sm text-blue-600">0000-0003-2204-5333</p>
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
                <BarChart data={publicationData}>
                   <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" barSize={18} />
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
></Legend>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Altmetrics */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4">Altmetrics</h3>
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-start space-y-2">
                <div className="text-sm">
                  <img src={altmetric} alt="altmetrics" />
                </div>
              </div>
            </div>
          </div>

          {/* Research Impact Factor */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4">Research Impact Factor</h3>
            <div className="h-48 overflow-y-auto">
              <ul className="space-y-2 text-sm">
                <li>Total career publications                     42</li>
                <li>Publication years                       1994-2008</li>
                <li>Mean Impact Factor (Web of Science)                           2.685</li>
                <li>Median ERA Ranking                             B</li>
                <li>Average citations per paper                        6.2</li>
                <li>Highest number of citations                   61</li>
                <li>Publications with 25+ citations                  10</li>
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