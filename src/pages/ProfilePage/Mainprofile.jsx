import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import profilephoto from "../../assets/image 13.png";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import orcid from "../../assets/image.png";
import scopus from "../../assets/image 16.png";
import research from "../../assets/image 17.png";
import googlei from "../../assets/image 18.png";

const Mainprofile = () => {
  const handleExport = () => {
    // Add export functionality here
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

  const impactFactors = [
    { label: 'Mean Impact Factor (Web of Science)', value: '24' },
    { label: 'Median ERA Ranking', value: '1' },
    { label: 'Average citations per paper', value: '10' },
    { label: 'Total citations', value: '20' },
    { label: 'Highest number of citations', value: '22' },
    { label: 'Publications with 25+ citations', value: '20' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      {/* Header Section */}
      <div className="flex gap-6 mb-8 bg-gray-100">
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
          <Card key={index} className="flex-1">
            <CardContent className="p-2 text-center">
              <h2 className="text-3xl font-bold mb-2">{metric.value}</h2>
              <p className="text-gray-600">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
            </div>
            </div>
            
            {/* Academic Identity Section */}
            <Card className="w-72">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Academic Identity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img
                    src={orcid}
                    className="w-8 h-8 flex items-center justify-center"/>
                    <div>
                      <p className="text-sm font-medium">Orcid Id</p>
                      <p className="text-sm text-blue-600">0000-0003-2204-5333</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                    src={scopus}
                    className="w-8 h-8 flex items-center justify-center"/>
                    <div>
                      <p className="text-sm font-medium">Scopus Id</p>
                      <p className="text-sm text-blue-600">55155930000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                    src={research}
                    className="w-8 h-8 flex items-center justify-center"/>
                    <div>
                      <p className="text-sm font-medium">Researcher Id</p>
                      <p className="text-sm text-blue-600">0000-0003-2204-5333</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                    src={googlei}
                    className="w-8 h-8 flex items-center justify-center"/>
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

      {/* Publications and Impact Factor Section */}
      <div className="flex gap-6 mb-8 bg-gray-100">
        {/* Publications Graph */}
        <Card>
          <CardContent className="p-2">
            <h3 className="font-semibold mb-2">Publications</h3>
            <div className="h-64 w-full ">
              <ResponsiveContainer width="30%" height="30%" >
                <BarChart data={publicationData}>
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h3 className="font-semibold mb-3">Publication Distribution</h3>
            <div className="h-64 " >
              <ResponsiveContainer width="60%" height="60%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <h3 className="font-semibold mb-4">Altmetrics</h3>
          <div className="flex items-center gap-4">
            <img src="/api/placeholder/200/200" alt="Altmetrics donut" className="w-32 h-32" />
            <div>
              <p className="mb-2">Mentioned by:</p>
              <ul className="space-y-1">
                <li>2 news outlets</li>
                <li>11 blogs</li>
                <li>1 Wikipedia page</li>
                <li>109 tweeters</li>
                <li>14 Facebook posts</li>
                <li>13 Google+ users</li>
              </ul>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Publication Distribution */}
        {/* <Card>
          <CardContent className="p-4 mb-1">
            <h3 className="font-semibold mb-3">Publication Distribution</h3>
            <div className="h-64 " >
              <ResponsiveContainer width="60%" height="60%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

      {/* Altmetrics Section */}
      {/* <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Altmetrics</h3>
          <div className="flex items-center gap-4">
            <img src="/api/placeholder/200/200" alt="Altmetrics donut" className="w-32 h-32" />
            <div>
              <p className="mb-2">Mentioned by:</p>
              <ul className="space-y-1">
                <li>2 news outlets</li>
                <li>11 blogs</li>
                <li>1 Wikipedia page</li>
                <li>109 tweeters</li>
                <li>14 Facebook posts</li>
                <li>13 Google+ users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card> */}
</div>
      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b">
        {['Personal Information', 'Professional Experience', 'Qualifications', 
          'Honors & Awards', 'Patents', 'Publications'].map((tab, index) => (
          <button key={index} className="px-4 py-2 hover:text-blue-600">
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Mainprofile;