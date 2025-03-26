import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import pubimg from '../../assets/pub_bg.jpg';

const Publication = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [yearlyData, setYearlyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);

  // Fetch data from the API when component mounts
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setIsLoading(true);
        
        const API_BASE_URL =  'http://localhost:8000';
        const apiUrl = `${API_BASE_URL}/api/departments`;
        
        console.log('Fetching data from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
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
        
        setDepartmentData(deptMetrics);
        setYearlyData(yearlyDataObj);
        setYears(sortedYears);
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
        { department: "Computer Science", total_publications: 356, total_citations: 4250, total_profiles: 42 },
        { department: "Physics", total_publications: 285, total_citations: 3800, total_profiles: 36 },
        { department: "Mathematics", total_publications: 198, total_citations: 2100, total_profiles: 28 },
        { department: "Chemistry", total_publications: 245, total_citations: 3200, total_profiles: 32 },
        { department: "Biology", total_publications: 320, total_citations: 4100, total_profiles: 38 }
      ];
      
      const mockYears = ["2021", "2022", "2023", "2024"];
      
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
    };

    fetchDepartmentData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading department data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // If no data was returned
  if (departmentData.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice:</strong>
        <span className="block sm:inline"> No department data available.</span>
      </div>
    );
  }

  // Prepare data for the yearly trends bar chart
  const prepareYearlyTrendsData = () => {
    // Calculate total publications and citations for each year
    return years.map(year => {
      const yearData = { year };
      
      const yearStats = yearlyData[year] || [];
      
      // Sum publications and citations across all departments for this year
      yearData.total_publications = yearStats.reduce((sum, dept) => sum + (dept.total_publications || 0), 0);
      yearData.total_citations = yearStats.reduce((sum, dept) => sum + (dept.total_citations || 0), 0);
      
      return yearData;
    });
  };

  // Generate colors for the bar chart
  const generateColors = () => ({
    publications: '#3B82F6', // blue
    citations: '#10B981'     // green
  });

  // Get yearly trends data
  const yearlyTrendsData = prepareYearlyTrendsData();
  const colors = generateColors();

  return (
    <div className='bg-blue-200 mx-auto max-w-9xl p-4'>
      {/* Existing code for header image */}
      <div className="relative w-screen h-48">
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

      {/* Existing code for Department Metrics Overview */}
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
              <Legend />
              <Bar yAxisId="left" dataKey="total_publications" name="Publications" fill="#3B82F6" />
              <Bar yAxisId="left" dataKey="total_profiles" name="Profiles" fill="#10B981" />
              <Bar yAxisId="right" dataKey="total_citations" name="Citations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Yearly Trends Bar Chart */}
      {years.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Yearly Publications and Citations</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="total_publications" 
                  name="Total Publications" 
                  fill={colors.publications} 
                />
                <Bar 
                  dataKey="total_citations" 
                  name="Total Citations" 
                  fill={colors.citations} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Existing code for Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departmentData.map((dept, index) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-4 shadow border-l-4" 
            style={{ borderLeftColor: '#3B82F6' }}
          >
            <h4 className="font-bold text-gray-700 mb-2 truncate" title={dept.department}>{dept.department}</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-100 p-2 rounded">
                <p className="text-xs text-blue-700 font-semibold">Publications</p>
                <p className="text-lg font-bold text-blue-600">{dept.total_publications}</p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <p className="text-xs text-green-700 font-semibold">Profiles</p>
                <p className="text-lg font-bold text-green-600">{dept.total_profiles}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <p className="text-xs text-yellow-700 font-semibold">Citations</p>
                <p className="text-lg font-bold text-yellow-600">{dept.total_citations?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publication;