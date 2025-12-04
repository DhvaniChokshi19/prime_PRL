import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import pubimg from '../../assets/pub_bg.jpg';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Publication = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [yearlyData, setYearlyData] = useState({});
  const [prlData, setPrlData] = useState(null);
  const [prlYearlyData, setPrlYearlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeChart, setActiveChart] = useState('overview'); // New state for chart switching
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
        let prlMetrics = null;
        let prlYearlyMetrics = [];
        
        data.forEach(item => {
          if (item.hasOwnProperty('total_profiles')) {
            // Check if this is PRL data or department data
            if (item.department === 'PRL') {
              prlMetrics = item;
            } else {
              deptMetrics.push(item);
            }
          } else if (item.hasOwnProperty('publication_stats')) {
            // Yearly publication stats data
            const departmentName = item.department;
            
            if (departmentName === 'PRL') {
              prlYearlyMetrics = item.publication_stats;
            } else {
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
          }
        });
        
        const sortedYears = Array.from(uniqueYears).sort();
        const departments = deptMetrics.map(dept => dept.department);
        
        setDepartmentData(deptMetrics);
        setYearlyData(yearlyDataObj);
        setPrlData(prlMetrics);
        setPrlYearlyData(prlYearlyMetrics);
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
      
      const mockPrlData = { 
        department: "PRL", 
        total_publications: 1500, 
        total_citations: 25000, 
        total_profiles: 150, 
        "h-index": 45 
      };
      
      const mockYears = ["2021", "2022"];
      
      const mockYearlyData = {};
      mockYears.forEach(year => {
        mockYearlyData[year] = mockDepartmentData.map(dept => ({
          department: dept.department,
          total_publications: Math.floor(dept.total_publications * (0.85 + Math.random() * 0.3)),
          total_citations: Math.floor(dept.total_citations * (0.85 + Math.random() * 0.3))
        }));
      });

      const mockPrlYearlyData = mockYears.map(year => ({
        year: parseInt(year),
        total_publications: Math.floor(mockPrlData.total_publications * (0.4 + Math.random() * 0.2)),
        total_citations: Math.floor(mockPrlData.total_citations * (0.4 + Math.random() * 0.2))
      }));
      
      setDepartmentData(mockDepartmentData);
      setYearlyData(mockYearlyData);
      setPrlData(mockPrlData);
      setPrlYearlyData(mockPrlYearlyData);
      setYears(mockYears);
      setSelectedDepartment(mockDepartmentData[0].department);
    };

    fetchDepartmentData();
  }, []); 

  const handlePublicationClick = (department) => {
    const departmentId = departmentIdMap[department] || 11;
    navigate(`/DepartmentArticles/${departmentId}`);
  };

  // Prepare data for department-wise line charts
  const prepareDepartmentLineData = () => {
    const lineData = {};
    
    years.forEach(year => {
      const yearEntry = { year };
      
      departmentData.forEach(dept => {
        const deptYearData = (yearlyData[year] || [])
          .find(item => item.department === dept.department);
        
        yearEntry[`${dept.department}_publications`] = deptYearData?.total_publications || 0;
        yearEntry[`${dept.department}_citations`] = deptYearData?.total_citations || 0;
      });
      
      lineData[year] = yearEntry;
    });
    
    return Object.values(lineData);
  };

  // Generate colors for departments
  const generateDepartmentColors = () => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    const colorMap = {};
    departmentData.forEach((dept, index) => {
      colorMap[dept.department] = colors[index % colors.length];
    });
    return colorMap;
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

  const departmentLineData = prepareDepartmentLineData();
  const departmentColors = generateDepartmentColors();

  // Chart navigation buttons
  const chartButtons = [
    { key: 'overview', label: 'Department Overview' },
    { key: 'profiles', label: 'Total Profiles' },
    { key: 'publications', label: 'Total Publications' },
    { key: 'citations', label: 'Total Citations' },
    { key: 'hindex', label: 'H-Index' },
    { key: 'prl-overview', label: 'PRL Overview' },
    { key: 'dept-trends', label: 'Department Publication Trends' },
    { key: 'prl-trends', label: 'PRL Publication Trends' }
  ];

  return (
    <div className='bg-blue-200 mx-auto max-w-9xl p-3'>
      <div className="relative w-full h-48">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"> 
          <div className="container mx-auto px-8 h-52 flex items-center">
            <div className="text-black space-y-6 max-w-3xl">
              <h1 className="text-4xl font-bold">
                Publications & Citations Department wise
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="mb-6 mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2 justify-center">
          {chartButtons.map(button => (
            <button
              key={button.key}
              onClick={() => setActiveChart(button.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeChart === button.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart 1: Department Overview (Original) */}
      {activeChart === 'overview' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
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
      )}

      {/* Chart 2: Total Profiles per Department */}
      {activeChart === 'profiles' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Profiles per Department</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_profiles" name="Total Profiles" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Total Publications per Department */}
      {activeChart === 'publications' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Publications per Department</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_publications" name="Total Publications" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 4: Total Citations per Department */}
      {activeChart === 'citations' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Citations per Department</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_citations" name="Total Citations" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 5: H-Index Comparison */}
      {activeChart === 'hindex' && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">H-Index Comparison Across Departments</h3>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="h-index" name="H-Index" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 6: PRL Overview */}
      {activeChart === 'prl-overview' && prlData && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">PRL Overall Statistics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[prlData]}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="total_profiles" name="Total Profiles" fill="#10B981" />
                <Bar yAxisId="left" dataKey="total_publications" name="Total Publications" fill="#3B82F6" />
                <Bar yAxisId="left" dataKey="h-index" name="H-Index" fill="#8B5CF6" />
                <Bar yAxisId="right" dataKey="total_citations" name="Total Citations" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 7: Department Trends (Line Chart for Publications/Citations over years) */}
      {activeChart === 'dept-trends' && departmentLineData.length > 0 && (
<div className="mb-8 bg-white p-6 rounded-lg shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-700">Individual Department Analysis</h3>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="dept-select" className="text-gray-600">Department:</label>
        <select 
          id="dept-select"
          value={selectedDepartment || ''}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="form-select block w-48 mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {departmentData.map(dept => (
            <option key={dept.department} value={dept.department}>
              {dept.department}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={years.map(year => {
          const yearData = (yearlyData[year] || [])
            .find(item => item.department === selectedDepartment);
                         
          return {
            year,
            total_publications: yearData?.total_publications || 0,
            total_citations: yearData?.total_citations || 0
          };
        })}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="total_publications"
          fill="#3B82F6"
          name="Publications"
        />
        <Bar
          yAxisId="right"
          dataKey="total_citations"
          fill="#F59E0B"
          name="Citations"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
      )}
{activeChart === 'prl-trends' && prlYearlyData.length > 0 && (
  <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">PRL Publications & Citations Over Time</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={prlYearlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="total_publications"
            fill="#3B82F6"
            name="Total Publications"
          />
          <Bar
            yAxisId="right"
            dataKey="total_citations"
            fill="#F59E0B"
            name="Total Citations"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      {/* Department Cards */}
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
                  href={`https://${window.location.hostname}/search?department=${dept.department}&q=${dept.department}`} 
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
