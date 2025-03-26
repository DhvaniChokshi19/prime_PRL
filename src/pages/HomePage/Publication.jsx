import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import pubimg from '../../assets/pub_bg.jpg';

const Publication = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [yearlyData, setYearlyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('total_publications');
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);

  // Fetch data from the API when component mounts
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setIsLoading(true);
        
        // Determine the correct API URL (adjust this to your actual backend URL)
        // For local development, your Django backend is likely on a different port
        const API_BASE_URL =  'http://localhost:8000';
        const apiUrl = `${API_BASE_URL}/api/departments`;
        
        console.log('Fetching data from:', apiUrl);
        
        // Make the API request to your Django backend with the correct URL
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        // Log the response for debugging
        console.log('Response status:', response.status);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Process the data - separate department metrics and yearly stats
        const deptMetrics = [];
        const yearlyDataObj = {};
        const uniqueYears = new Set();
        
        data.forEach(item => {
          if (item.hasOwnProperty('total_profiles')) {
            // This is department metrics data
            deptMetrics.push(item);
          } else if (item.hasOwnProperty('publication_stats')) {
            // This is yearly publication stats data
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
        
        // Convert years to array and sort
        const sortedYears = Array.from(uniqueYears).sort();
        
        // Set the most recent year as the default selected year
        if (sortedYears.length > 0 && !selectedYear) {
          setSelectedYear(sortedYears[sortedYears.length - 1]);
        }
        
        // Update state with the processed data
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
      setSelectedYear(mockYears[mockYears.length - 1]);
    };

    fetchDepartmentData();
  }, []); // Empty dependency array means this effect runs once on mount

  // The rest of the component remains the same...
  
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

  // Prepare data for the yearly trends chart
  const prepareYearlyTrendsData = () => {
    // Get all department names
    const departments = departmentData.map(dept => dept.department);
    
    // Create data for the line chart
    return years.map(year => {
      const yearData = { year };
      
      // Find data for this year
      const yearStats = yearlyData[year] || [];
      
      // Add data for each department
      departments.forEach(dept => {
        const deptData = yearStats.find(stat => stat.department === dept);
        
        if (deptData) {
          yearData[`${dept}_publications`] = deptData.total_publications;
          yearData[`${dept}_citations`] = deptData.total_citations;
        } else {
          yearData[`${dept}_publications`] = 0;
          yearData[`${dept}_citations`] = 0;
        }
      });
      
      return yearData;
    });
  };

  // Generate colors for departments
  const generateColors = (count) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#F97316', // orange
    ];
    
    return Array(count).fill().map((_, idx) => colors[idx % colors.length]);
  };

  // Get yearly trends data
  const yearlyTrendsData = prepareYearlyTrendsData();
  
  // Get all department names and colors
  const departments = departmentData.map(dept => dept.department);
  const departmentColors = generateColors(departments.length);

  return (
    <div className='bg-blue-200 mx-auto max-w-6xl p-4'>
      <div className="relative w-full h-48">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"> 
          <div className="container mx-auto px-8 h-52 flex items-center">
            <div className="text-black space-y-6 max-w-2xl">
              <h1 className="text-5xl font-bold">
                Publications
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Publications, Profiles and Citations Chart */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md mt-6">
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

      {/* Year-wise Department Trends Chart */}
      {years.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">Department Trends by Year</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="metricSelect" className="text-sm text-gray-600">Metric:</label>
                <select
                  id="metricSelect"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="text-sm border rounded py-1 px-2"
                >
                  <option value="total_publications">Publications</option>
                  <option value="total_citations">Citations</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyTrendsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    // Extract department name from the dataKey
                    const dept = name.split('_')[0];
                    return [value, dept];
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    // Extract department name from the dataKey
                    return value.split('_')[0];
                  }}
                />
                {departments.map((dept, index) => (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={`${dept}_${selectedMetric === 'total_publications' ? 'publications' : 'citations'}`}
                    name={`${dept}_${selectedMetric === 'total_publications' ? 'publications' : 'citations'}`}
                    stroke={departmentColors[index]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departmentData.map((dept, index) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-4 shadow border-l-4" 
            style={{ borderLeftColor: departmentColors[index % departmentColors.length] }}
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