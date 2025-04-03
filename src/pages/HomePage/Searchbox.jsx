import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimg from '../../assets/bg1.jpg';
import { UserRound, Newspaper, BookMarked, AtSign, Eye } from 'lucide-react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.withCredentials = true;
const Searchbox = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    all: false,
    name: true,
    designation: false,
    department: false,
    expertise: false
  });

  // Add state for stats data
  const [statsData, setStatsData] = useState({
   total_profiles: '0',
    total_publications: '0', 
    total_citations: '0',
    avg_citations_per_paper: '0',
    visitors_today: '0'
  });

  // Fetch stats data on component mount
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axiosInstance.get('/');
              
        const data = response.data
        setStatsData({
         total_profiles: data.total_profiles.toLocaleString(),
          total_publications: data.total_publications.toLocaleString(),
          total_citations: data.total_citations.toLocaleString(),
          avg_citations_per_paper: data.avg_citations_per_paper.toLocaleString(),
          visitors_today: data.visitors_today.toLocaleString() 
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStatsData();
  }, []);

  
  const stats = [
    {
      icon: <UserRound className="h-8 w-8 text-blue-600" />,
      number: statsData.total_profiles,
      label: 'PROFILES',
      
    },
    {
      icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
      number: statsData.total_publications,
      label: 'PUBLICATIONS',
      
    },
    {
      icon: <BookMarked className="h-8 w-8 text-blue-600"/>,
      number: statsData.total_citations,
      label: 'CITATIONS',
     
    },
    {
      icon: <AtSign className="h-8 w-8 text-blue-600"/>,
      number: statsData.avg_citations_per_paper,
      label: 'AVERAGE CITATIONS PER PAPER'
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-600"/>,
      number: statsData.visitors_today,
      label: 'VISITORS TODAY'
    }
  ];

  const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('key-features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Only proceed if there's a search term
    if (searchTerm.trim()) {
      try {
        // Build the query parameters
        const queryParams = new URLSearchParams();
        
        // Check which filters are active
        const activeFilters = Object.entries(filters).filter(([_, isActive]) => isActive);
        
        // If no specific filters are checked or "all" is checked, search in all fields
        if (activeFilters.length === 0 || filters.all) {
           Object.entries({
            name: searchTerm,
            designation: searchTerm,
            department: searchTerm,
            expertise: searchTerm
          }).forEach(([key, value]) => {
            queryParams.append(key, value);
          });
        } else {
          // Add searchTerm for each active filter
          activeFilters.forEach(([filter, _]) => {
            if (filter !== 'all') {
              queryParams.append(filter, searchTerm);
            }
          });
        }
       const response = await axiosInstance.get('/api/search', {
        params: queryParams
        
      });
      
      console.log("Search results received:", response.data);
      
      // Create URLSearchParams for navigation
      const urlParams = new URLSearchParams();
      urlParams.append('query', searchTerm);
      
      // Navigate to search results page with the results as state
      navigate('/search', { 
        state: { results: response.data },
        search: urlParams.toString()
      });
    } catch (error) {
      console.error('Search error:', error);
      
      navigate(`/search?${new URLSearchParams({ query: searchTerm }).toString()}`);
    }
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="bg-white">
      {/* Hero section with full-width image and overlay text */}
      <div className="relative w-full h-screen">
        <img 
          src={homeimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"> {/* Dark overlay for better text readability */}
          <div className="container mx-auto px-8 h-full flex items-center">
            <div className="text-white space-y-6 max-w-2xl">
              <h1 className="text-6xl font-bold">
                Welcome to the<br />PRIME
              </h1>
              <p className="text-2xl">
                Unlock Knowledge, Connect with Expert
              </p>
              <button 
                className="bg-blue-400 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-500 transition-colors"
                onClick={handleLearnMoreClick}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold mt-2 mb-1">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      
        <div className="max-w-9xl mx-8 px-1 pt-16">
          <div className="mt-7 ml-7 mr-7 bg-gray-50 p-3 border-black-300 shadow-sm">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for.."
                  className="w-full p-4 text-lg rounded-2xl border border-black" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
                >
                  🔍
                </button>
              </div>

              <div className="flex flex-wrap gap-6 mt-4">
                {Object.keys(filters).map((filter) => (
                  <label key={filter} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters[filter]}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        [filter]: !prev[filter]
                      }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="capitalize">{filter}</span>
                  </label>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;


