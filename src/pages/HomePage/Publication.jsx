import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import pubimg from '../../assets/pub_bg.jpg';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Publication = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [yearlyData, setYearlyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  const departmentIdMap = {
    'Astronomy and Astrophysics': 1,
    'Atomic, Molecular and Optical Physics': 2,
    'Geosciences': 3,
    'Planetary Sciences': 4,
    'Space and Atmospheric Sciences': 5,
    'Theoretical Physics': 6,
    'Udaipur Solar Observatory': 7,
    'Workshop': 8,
    'CNIT Services': 9,
    'Medical Services': 10,
    'Administration': 11,
    'CMG Services': 12,
    'Library Services': 13,
    'Unknown': 14,
    'Others': 15
  };
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setIsLoading(true);        
        const response = await axiosInstance.get('/api/departments', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        const data = response.data;
        
        const deptMetrics = [];
        const yearlyDataObj = {};
        const uniqueYears = new Set();
        
        data.forEach(item => {
          if (item.hasOwnProperty('total_profiles')) {
            // Department metrics data
            deptMetrics.push(item);
          } else if (item.hasOwnProperty('publication_stats')) {
            // Yearly publication stats data
            const departmentName = item.department;
            
            item.publication_stats.forEach(stat => {
              const year = stat.year.toString();
              uniqueYears.add(year);
              
              if (!yearlyDataObj[year]) {
                yearlyDataObj[year] = [];
              }
              
              yearlyDataObj[year].push({
                department: departmentName,
                total_publications: stat.total_publications,
                total_citations: stat.total_citations
              });
            });
          }
        });
        
        const sortedYears = Array.from(uniqueYears).sort();
        const departments = deptMetrics.map(dept => dept.department);
        
        setDepartmentData(deptMetrics);
        setYearlyData(yearlyDataObj);
        setYears(sortedYears);
        setSelectedDepartment(departments[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching department data:', err);
        setError('Failed to load department data. Please try again later.');
        
        // Use mock data if API fails
        console.log('Using mock data due to API error');
        useMockData();
      } finally {
        setIsLoading(false);
      }
    };

    // Mock data function for development/testing
    const useMockData = () => {
      console.log('Loading mock data');
      
      const mockDepartmentData = [
        { department: "Computer Science", total_publications: 356, total_citations: 4250, total_profiles: 42, "h-index": 25 },
        { department: "Physics", total_publications: 285, total_citations: 3800, total_profiles: 36, "h-index": 22 },
      ];
      
      const mockYears = ["2021", "2022"];
      
      const mockYearlyData = {};
      mockYears.forEach(year => {
        mockYearlyData[year] = mockDepartmentData.map(dept => ({
          department: dept.department,
          total_publications: Math.floor(dept.total_publications * (0.85 + Math.random() * 0.3)),
          total_citations: Math.floor(dept.total_citations * (0.85 + Math.random() * 0.3))
        }));
      });
      
      setDepartmentData(mockDepartmentData);
      setYearlyData(mockYearlyData);
      setYears(mockYears);
      setSelectedDepartment(mockDepartmentData[0].department);
    };

    fetchDepartmentData();
  }, []); 

  const handlePublicationClick = (department) => {
    const departmentId = departmentIdMap[department] || 11;
    navigate(`/DepartmentArticles/${departmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading department data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  if (departmentData.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice:</strong>
        <span className="block sm:inline"> No department data available.</span>
      </div>
    );
  }
  
  const prepareDepartmentYearlyData = () => {
    return years.map(year => {
      const yearData = { year };
      
      const departmentYearData = (yearlyData[year] || [])
        .find(item => item.department === selectedDepartment);
      
      if (departmentYearData) {
        yearData.total_publications = departmentYearData.total_publications || 0;
        yearData.total_citations = departmentYearData.total_citations || 0;
      } else {
        yearData.total_publications = 0;
        yearData.total_citations = 0;
      }
      
      return yearData;
    });
  };

  const generateColors = () => ({
    publications: '#3B82F6', 
    citations: '#10B981',
    hIndex: '#8B5CF6'
  });

  const yearlyTrendsData = prepareDepartmentYearlyData();
  const colors = generateColors();
  const departments = departmentData.map(dept => dept.department);
  
  return (
    <div className='bg-blue-200 mx-auto max-w-9xl p-3'>
      <div className="relative w-full h-48">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 "> 
          <div className="container mx-auto px-8 h-52 flex items-center">
            <div className="text-black space-y-6 max-w-3xl">
              <h1 className="text-4xl font-bold">
                Publications & Citations Department wise
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md mt-6 max-w-8xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Metrics Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45} 
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center"/>
              <Bar yAxisId="left" dataKey="total_publications" name="Publications" fill="#3B82F6" />
              <Bar yAxisId="left" dataKey="total_profiles" name="Profiles" fill="#10B981" />
              <Bar yAxisId="left" dataKey="h-index" name="H-Index" fill="#8B5CF6" />
              <Bar yAxisId="right" dataKey="total_citations" name="Citations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {years.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Yearly Publications and Citations</h3>
          <div className="flex items-center space-x-2">
              <label htmlFor="department-select" className="text-gray-600 mr-2">Department:</label>
              <select 
                id="department-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyTrendsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="total_publications" 
                  name="Publications" 
                  fill={colors.publications} 
                />
                <Bar 
                  yAxisId="right"
                  dataKey="total_citations" 
                  name="Citations" 
                  fill={colors.citations} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departmentData.map((dept, index) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-4 shadow border-l-4" 
            style={{ borderLeftColor: '#3B82F6' }}
          >
            <h4 className="font-bold text-gray-700 mb-2 truncate" title={dept.department}>{dept.department}</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-100 p-2 rounded">
                <p className="text-xs text-blue-700 font-semibold">Publications</p>
                <p 
                  onClick={() => handlePublicationClick(dept.department)} 
                  className="text-lg font-bold text-blue-600 cursor-pointer hover:underline"
                >
                  {dept.total_publications}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <p className="text-xs text-green-700 font-semibold">Profiles</p>
                <a 
                  href={`http://${window.location.hostname}:5000/search?department=${dept.department}&q=${dept.department}`} 
                  className="text-lg font-bold text-green-600 hover:underline"
                >
                  {dept.total_profiles}
                </a>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <p className="text-xs text-yellow-700 font-semibold">Citations</p>
                <p className="text-lg font-bold text-yellow-600">{dept.total_citations?.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded">
                <p className="text-xs text-purple-700 font-semibold">H-Index</p>
                <p className="text-lg font-bold text-purple-600">{dept["h-index"]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publication;