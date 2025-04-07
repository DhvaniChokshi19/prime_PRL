import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const ProfileSearchBox = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: true,
    designation: false,
    department: false,
    expertise: false
  });

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
        
        // If no specific filters are checked
        if (activeFilters.length === 0) {
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
        
        const urlParams = new URLSearchParams();
        urlParams.append('query', searchTerm);
        
 navigate({
          pathname: '/search',
          search: urlParams.toString(),
        }, {
          state: { results: response.data, timestamp: Date.now() },
          replace: true 
        });
      } catch (error) {
        console.error('Search error:', error);
        
        navigate({
          pathname: '/search',
          search: `query=${encodeURIComponent(searchTerm)}`,
        }, {
          state: { results: [], error: true, timestamp: Date.now() },
          replace: true
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for profiles..."
              className="w-full p-3 text-lg rounded-xl border border-gray-300"
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

          <div className="flex flex-wrap gap-4 mt-3">
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
  );
};

export default ProfileSearchBox;