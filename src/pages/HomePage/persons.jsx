import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(0);
  const resultsPerPage = 10;

axios.defaults.baseURL = 'http://localhost:8000';
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('/api/profile', {params: { page: currentPage, limit: resultsPerPage }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = response.data; 

        setPersons(data.profiles);
        setResultsCount(data.total);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPersons();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className="text-center p-4">Loading profiles...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, resultsCount);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="text-blue-500 hover:underline flex items-center mr-4"
          >
            &lt; Search in all content
          </button>
          <span className="text-gray-600">
            {startResult} - {endResult} out of {resultsCount} results
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4">
            <button className="text-blue-500 hover:underline flex items-center">
               Name (ascending) &gt;
            </button>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {persons.map((person) => (
          <div key={person.id} className="border-b pb-4 flex">
            <div className="w-16 h-16 mr-4">
              {person.profileImage ? (
                <img    
                  src={person.profileImage} 
                  alt={`${person.name} `} 
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium text-blue-600">
                <a href={`/profile/${person.id}`} className="hover:underline">
                  {person.name}
                </a>
              </h3>
              <div className="text-gray-700">
                {person.department && (
                  <div>{person.department}</div>
                )}
                {person.designation && (
                  <div>{person.designation}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {resultsCount > resultsPerPage && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex">
              {currentPage > 1 && (
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded-md mr-1 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                </li>
              )}
              {Array.from({ length: Math.ceil(resultsCount / resultsPerPage) }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 border rounded-md mx-1 ${
                      currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              {currentPage < Math.ceil(resultsCount / resultsPerPage) && (
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded-md ml-1 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Persons;