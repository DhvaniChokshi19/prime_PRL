import React from 'react'
import { useState } from 'react';
import homeimg from '../../assets/bg1.jpg'
import { useNavigate } from 'react-router-dom';

import { UserRound,Newspaper,BookMarked,AtSign } from 'lucide-react';
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

  const stats = [
    {
      icon: <UserRound className="h-8 w-8 text-blue-600" ></UserRound>,
      number: '21671',
      label: 'PROFILES',
      route: '/search'
    },
    {
      icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
      number: '216671',
      label: 'PUBLICATIONS',
      route: '/publication'
    },
    {
      icon: <BookMarked className="h-8 w-8 text-blue-600"/>,
      number: '216671',
      label: 'CITATIONS',
      route: '/publication'
    },
    {
      icon: <AtSign className="h-8 w-8 text-blue-600"/>,
      number: '216671',
      label: 'ALTMETRICS MENTIONS'
    }
  ];
const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('key-features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };
const handleSearch = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Only proceed if there's a search term
    if (searchTerm.trim()) {
      // Create a query parameter string from the filters
      const activeFilters = Object.entries(filters)
        .filter(([_, isActive]) => isActive)
        .map(([filter]) => filter);
      
      // Build the query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchTerm);
      
      // Only add filters param if there are active filters
      if (activeFilters.length > 0) {
        queryParams.append('filters', activeFilters.join(','));
      }
      
      // Navigate to search results page with query parameters
      navigate(`/search?${queryParams.toString()}`);
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
                className="bg-white rounded-lg shadow-md p-6 text-center"
                onClick={() => handleNavigate(stat.route)}
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search for.."
              className="w-full p-4 text-lg rounded-2xl border border-black" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </span>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            {Object.keys(filters).map((filter) => (
              <label key={filter} className="flex items-center gap-2">
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
        </div>
        
</div>
    </div>
    </div>
  );
};
export default Searchbox;