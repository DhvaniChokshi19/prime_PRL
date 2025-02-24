import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import profilephoto from "../../assets/image 13.png";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import research from "../../assets/image 17.png";
import googlei from "../../assets/image 18.png";
import altmetric from "../../assets/image (1).png";
import { useState } from 'react';
import PersonalInformation from './PersonalInformation';
import Patents from './Patents';
import Publications from './Publications';
import { 
  User,
  Lightbulb,
  BookOpen,
  GlobeLock
} from 'lucide-react';


const Mainprofile = () => {
  const [activeTab, setActiveTab] = useState('Personal Information');

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Patent', icon: Lightbulb },
    { name: 'Publication', icon: BookOpen },
    {name: 'Networks',icon: GlobeLock},
  ];

const renderContent = () => {
    switch (activeTab) {
      case 'Personal Information':
        return <PersonalInformation />;
      case 'Patent':
        return <Patents />;
      case 'Publication':
        return <Publications />;

      default:
        return <PersonalInformation />;
    }
  };
  const handleExport = () => {
    console.log('Exporting profile data...');
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
    { label: 'Publications', value: '50' },
    { label: 'Citation', value: '100' },
    { label: 'H-Index', value: '64' },
    { label: 'I-Index', value: '64' }
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
              <div className="flex gap-4 mt-4">
                {researchMetrics.map((metric, index) => (
                  <Card key={index} className=" border-none flex-1">
                    <CardContent className="p-2 text-center">
                      <h2 className="text-3xl font-bold mb-2">{metric.value}</h2>
                      <p className="text-gray-600">{metric.label}</p>
                    </CardContent>
                  </Card>
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
        <div className="grid grid-cols-4 gap-6">
          {/* Publications Graph */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4">Publications</h3>
            <div className="h-48">
              <ResponsiveContainer width="90%" height="90%">
                <BarChart data={publicationData}>
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Publication Distribution */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4">Publication Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="70%" height="70%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
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
                <li>Total career publications       42</li>
                <li>Publication years        1994-2008</li>
                <li>Mean Impact Factor (Web of Science)        2.685</li>
                <li>Median ERA Ranking         B</li>
                <li>Average citations per paper          6.2</li>
                <li>Highest number of citations        61</li>
                <li>Publications with 25+ citations     10</li>
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