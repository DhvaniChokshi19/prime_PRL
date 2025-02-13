import React from 'react'
import { useState } from 'react';
import homeimg from '../../assets/bg 1 (1).png'
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
      label: 'PROFILES'
    },
    {
      icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
      number: '216671',
      label: 'PUBLICATIONS'
    },
    {
      icon: <BookMarked className="h-8 w-8 text-blue-600"/>,
      number: '216671',
      label: 'CITATIONS'
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
return (
    <div className="bg-white">
      <div className="max-w-8xl mx-8 px-1 pt-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold">
              Welcome to the<br />PRIME
            </h1>
            <p className="text-2xl text-gray-700">
              Unlock Knowledge, Connect with Expert
            </p>
            <button className="bg-blue-400 text-black-xl px-6 py-3 rounded-xl shadow-black hover:bg-blue-300 transition-colors"
            onClick={handleLearnMoreClick}>
              Learn More
            </button>
          </div>
          
          <div className="w-3/4 h-96 md:w-[800px]">
            <img 
              src={homeimg} 
              alt="Dashboard" 
              className="w-screen h-full object-fill"
            />
          </div>
        </div>

        <div className="mt-4 ml-7 mr-7 bg-gray-50 p-3 border-black-300 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for.."
              className="w-full p-4 text-lg rounded-2xl border border-black" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        
            <div className="mt-8 bg-white rounded-lg border border-black">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center justify-center p-3 text-center ${
                  index < stats.length - 1 ? '' : ''
                }`}
              >
                {stat.icon}
                <div className="text-2xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-2xl text-black-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
      </div>
    </div>
    </div>
    </div>
  );
};
export default Searchbox