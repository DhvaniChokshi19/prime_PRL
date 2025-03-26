import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimg from '../../assets/bg1.jpg';
import { UserRound, Newspaper, BookMarked, AtSign } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000';

const Searchbox = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    all: false,
    name: false,
    designation: false,
    department: false,
    expertise: false
  });

  // Add state for stats data
  const [statsData, setStatsData] = useState({
    profiles: '0',
    publications: '0',
    citations: '0',
    altmetrics: '0'
  });

  // Fetch stats data on component mount
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setStatsData({
          profiles: data.profiles_count.toLocaleString(),
          publications: data.publications_count.toLocaleString(),
          citations: data.citations_count.toLocaleString(),
          altmetrics: data.altmetrics_count.toLocaleString()
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
      number: statsData.profiles,
      label: 'PROFILES',
      route: '/persons'
    },
    {
      icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
      number: statsData.publications,
      label: 'PUBLICATIONS',
      route: '/Publication'
    },
    {
      icon: <BookMarked className="h-8 w-8 text-blue-600"/>,
      number: statsData.citations,
      label: 'CITATIONS',
      route: '/Publication'
    },
    {
      icon: <AtSign className="h-8 w-8 text-blue-600"/>,
      number: statsData.altmetrics,
      label: 'ALTMETRICS MENTIONS'
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
          queryParams.append('query', searchTerm);
          queryParams.append('filter_all', 'true');
        } else {
          // Add searchTerm for each active filter
          activeFilters.forEach(([filter, _]) => {
            if (filter !== 'all') {
              queryParams.append(filter, searchTerm);
              queryParams.append(`filter_${filter}`, 'true');
            }
          });
        }
        // Make API call to Django backend
        const response = await fetch(`${API_BASE_URL}/api/search?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const searchResults = await response.json();
        // console.log("Search results received:", searchResults);
        // Navigate to search results page with the results as state
        navigate('/search', { 
          state: { results: searchResults },
          search: queryParams.toString()
        });
      } catch (error) {
        console.error('Search error:', error);
        // Still navigate to search page, but let that page handle the error
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
                onClick={() => stat.route && handleNavigate(stat.route)}
              >
                <div className="flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold mt-2 mb-1">{stat.number}</h3>
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


