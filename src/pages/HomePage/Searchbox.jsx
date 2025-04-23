// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import homeimg from '../../assets/bg2.png';
// import prllogo from '../../assets/prl-logo.png'; // Added missing import
// import prlogo from '../../assets/prime.png'; // Added missing import
// import { UserRound, Newspaper, BookMarked, AtSign, Eye } from 'lucide-react';
// import axiosInstance from '../../api/axios';

// axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
// axiosInstance.defaults.withCredentials = true;

// const Searchbox = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     name: true,
//     designation: false,
//     department: false,
//     expertise: false
//   });
//   const [statsData, setStatsData] = useState({
//     total_profiles: '0',
//     total_publications: '0', 
//     total_citations: '0',
//     avg_citations_per_paper: '0',
//     visitors_today: '0'
//   });

//   useEffect(() => {
//     const fetchStatsData = async () => {
//       try {
//         const response = await axiosInstance.get('/');
              
//         const data = response.data;
//         setStatsData({
//           total_profiles: data.total_profiles.toLocaleString(),
//           total_publications: data.total_publications.toLocaleString(),
//           total_citations: data.total_citations.toLocaleString(),
//           avg_citations_per_paper: data.avg_citations_per_paper.toLocaleString(),
//           visitors_today: data.visitors_today.toLocaleString() 
//         });
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       }
//     };

//     fetchStatsData();
//   }, []);

//   const stats = [
//     {
//       icon: <UserRound className="h-8 w-8 text-blue-600" />,
//       number: statsData.total_profiles,
//       label: 'PROFILES',
//       href: `http://${window.location.hostname}:5173/search?name=*&q=*`
//     },
//     {
//       icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
//       number: statsData.total_publications,
//       label: 'JOURNAL ARTICLES',
//     },
//     {
//       icon: <BookMarked className="h-8 w-8 text-blue-600"/>,
//       number: statsData.total_citations,
//       label: 'CITATIONS',
//     },
//     {
//       icon: <AtSign className="h-8 w-8 text-blue-600"/>,
//       number: statsData.avg_citations_per_paper,
//       label: 'AVERAGE CITATIONS PER PAPER'
//     },
//     {
//       icon: <Eye className="h-8 w-8 text-blue-600"/>,
//       number: statsData.visitors_today,
//       label: 'Visitors'
//     },
//   ];

//   const handleLearnMoreClick = () => {
//     const featuresSection = document.getElementById('key-features');
//     featuresSection?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
    
//     // Only proceed if there's a search term
//     if (searchTerm.trim()) {
//       try {
//         const apiQueryParams = new URLSearchParams();
//         const navigationQueryParams = new URLSearchParams();
        
//         const activeFilters = Object.entries(filters).filter(([_, isActive]) => isActive);
        
//         if (activeFilters.length === 0) {
//           apiQueryParams.append('name', searchTerm);
//           navigationQueryParams.append('name', searchTerm);
//         } else {
//           // Add searchTerm for each active filter
//           activeFilters.forEach(([filter, _]) => {
//             apiQueryParams.append(filter, searchTerm);
//             navigationQueryParams.append(filter, searchTerm);
//           });
//         }
        
//         navigationQueryParams.append('q', searchTerm);
        
//         console.log("API Search params:", apiQueryParams.toString());
//         console.log("Navigation params:", navigationQueryParams.toString());
        
//         const response = await axiosInstance.get('/api/search', {
//           params: apiQueryParams
//         });
        
//         console.log("Search results received:", response.data);
   
//         navigate(`/search?${navigationQueryParams.toString()}`, {
//           state: { 
//             results: response.data,
//             searchTerm: searchTerm,
//             filters: Object.keys(filters).filter(key => filters[key])
//           }
//         });
//       } catch (error) {
//         console.error('Search error:', error);
//         // Missing navigationQueryParams declaration in catch block
//         const navigationQueryParams = new URLSearchParams();
//         if (searchTerm) {
//           navigationQueryParams.append('q', searchTerm);
//         }
//         navigate(`/search?${navigationQueryParams.toString()}`, {
//           state: { 
//             searchTerm: searchTerm,
//             filters: Object.keys(filters).filter(key => filters[key]),
//             error: true
//           }
//         });
//       }
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch(e);
//     }
//   };

//   const handleNavigate = (route) => {
//     navigate(route);
//   };

//   return (
//     <div className="bg-white flex flex-col h-screen">
     
//       <header className="w-full">
       
//         <div className="flex justify-center space-x-4 py-1">
//           <div className="Logo h-16">
//             <img src={prllogo} alt="PRL Logo" className="h-full" />
//           </div>
//           <div className="Mainlogo h-16">
//             <img src={prlogo} alt="Main Logo" className="h-full" />
//           </div>
//         </div>
        
//         {/* Navigation bar - reduced padding */}
//         <nav className="bg-blue-700 text-white py-1">
//           <div className="container mx-auto flex justify-center">
//             <ul className="flex space-x-14">
//               <li className="hover:text-gray-300 text-xl cursor-pointer" 
//                   onClick={() => handleNavigate('/')}>
//                 Home
//               </li>
//               <li className="hover:text-gray-300 text-xl cursor-pointer" 
//                   onClick={handleLearnMoreClick}>
//                 Features
//               </li>
//               <li className="hover:text-gray-300 text-xl cursor-pointer"
//                   onClick={() => handleNavigate('/Publication')}>
//                 Department Statistics
//               </li>
//               <li className="hover:text-gray-300 text-xl cursor-pointer"
//                   onClick={() => {
//                     const footersection = document.getElementById('footer');
//                     footersection?.scrollIntoView({ behavior: 'smooth' });
//                   }}>
//                 Contact Us
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </header>
//       <div className="flex-grow relative">
//         <img 
//           src={homeimg} 
//           alt="Dashboard" 
//           className="w-full h-full object-cover" 
//         />
//         <div className="absolute inset-0 bg-white bg-opacity-10">
//           <div className="container mx-auto px-8 py-6 flex items-start mt-4">
//             <div className="text-white space-y-4 max-w-2xl">
//               <h1 className="text-5xl font-bold">
//                 Welcome to the<br />PRIME
//               </h1>
//               <p className="text-xl">
//                 Unlock Knowledge, Connect with Expert
//               </p>
//               <button 
//                 className="bg-blue-400 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-500 transition-colors"
//                 onClick={handleLearnMoreClick}
//               >
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Stats section - positioned lower but still visible */}
//         <div className="absolute bottom-4 left-0 right-0 px-5">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//             {stats.map((stat, index) => (
//               <div 
//                 key={index}
//                 className="bg-white rounded-lg shadow-md p-2 text-center cursor-pointer"
//               >
//                 <div className="flex justify-center">
//                   {stat.icon}
//                 </div>
//                 <button 
//                   className="text-black mt-1"
//                   onClick={() => {
//                     if (stat.href) {
//                       window.open(stat.href, '_blank');
//                     } else {
//                       handleNavigate('/');
//                     }
//                   }}
//                 >
//                   <h3 className="text-xl font-bold mb-0">{stat.number}</h3>
//                 </button>
//                 <p className="text-gray-600 text-sm">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Search box section */}
//       <div className="max-w-9xl mx-8 px-1 pt-1">
//         <div className="mt-7 ml-7 mr-7 bg-gray-50 p-3 border-black-300 shadow-sm">
//           <form onSubmit={handleSearch}>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search for.."
//                 className="w-full p-4 text-lg rounded-2xl border border-black" 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyDown}
//               />
//               <button 
//                 type="submit"
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
//               >
//                 🔍
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-6 mt-4">
//               {Object.keys(filters).map((filter) => (
//                 <label key={filter} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={filters[filter]}
//                     onChange={() => setFilters(prev => ({
//                       ...prev,
//                       [filter]: !prev[filter]
//                     }))}
//                     className="w-4 h-4 rounded"
//                   />
//                   <span className="capitalize">{filter}</span>
//                 </label>
//               ))}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Searchbox;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimg from '../../assets/bg2.png';
import prllogo from '../../assets/prl-logo.png';
import prlogo from '../../assets/prime.png';
import { UserRound, Newspaper, BookMarked, AtSign, Eye } from 'lucide-react';
import axiosInstance from '../../api/axios';

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.withCredentials = true;

const Searchbox = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: true,
    designation: false,
    department: false,
    expertise: false
  });
  const [statsData, setStatsData] = useState({
    total_profiles: '0',
    total_publications: '0', 
    total_citations: '0',
    avg_citations_per_paper: '0',
    visitors_today: '0'
  });

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axiosInstance.get('/');
              
        const data = response.data;
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
      href: `http://${window.location.hostname}:5000/search?name=*&q=*`
    },
    {
      icon: <Newspaper className="h-8 w-8 text-blue-600"/>,
      number: statsData.total_publications,
      label: 'JOURNAL ARTICLES',
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
      label: 'VISITORS'
    },
  ];

  const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('key-features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      try {
        const apiQueryParams = new URLSearchParams();
        const navigationQueryParams = new URLSearchParams();
        
        const activeFilters = Object.entries(filters).filter(([_, isActive]) => isActive);
        
        if (activeFilters.length === 0) {
          apiQueryParams.append('name', searchTerm);
          navigationQueryParams.append('name', searchTerm);
        } else {
         
          activeFilters.forEach(([filter, _]) => {
            apiQueryParams.append(filter, searchTerm);
            navigationQueryParams.append(filter, searchTerm);
          });
        }
        
        navigationQueryParams.append('q', searchTerm);
        
        console.log("API Search params:", apiQueryParams.toString());
        console.log("Navigation params:", navigationQueryParams.toString());
        
        const response = await axiosInstance.get('/api/search', {
          params: apiQueryParams
        });
        
        console.log("Search results received:", response.data);
   
        navigate(`/search?${navigationQueryParams.toString()}`, {
          state: { 
            results: response.data,
            searchTerm: searchTerm,
            filters: Object.keys(filters).filter(key => filters[key])
          }
        });
      } catch (error) {
        console.error('Search error:', error);
        const navigationQueryParams = new URLSearchParams();
        if (searchTerm) {
          navigationQueryParams.append('q', searchTerm);
        }
        navigate(`/search?${navigationQueryParams.toString()}`, {
          state: { 
            searchTerm: searchTerm,
            filters: Object.keys(filters).filter(key => filters[key]),
            error: true
          }
        });
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
    <div className="bg-white flex flex-col h-screen">
    
      <header className="w-full">
        <div className="flex justify-center space-x-4 py-1">
          <div className="Logo h-16">
            <img src={prllogo} alt="PRL Logo" className="h-full" />
          </div>
          <div className="Mainlogo h-16">
            <img src={prlogo} alt="Main Logo" className="h-full" />
          </div>
        </div>
        
        <nav className="bg-blue-900 text-white py-2">
          <div className="container mx-auto flex justify-center">
            <ul className="flex space-x-14">
              <li className="hover:text-gray-300 text-xl cursor-pointer" 
                  onClick={() => handleNavigate('/')}>
                Home
              </li>
              <li className="hover:text-gray-300 text-xl cursor-pointer" 
                  onClick={handleLearnMoreClick}>
                Features
              </li>
              <li className="hover:text-gray-300 text-xl cursor-pointer"
                  onClick={() => handleNavigate('/Publication')}>
                Division
              </li>
              <li className="hover:text-gray-300 text-xl cursor-pointer"
                  onClick={() => {
                    const footersection = document.getElementById('footer');
                    footersection?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                Contact Us
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <div className="flex-grow relative">
        <img 
          src={homeimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-white bg-opacity-10">
          <div className="container mx-auto px-8 py-6 flex items-start mt-4">
            <div className="text-white space-y-4 max-w-2xl">
              <h1 className="text-5xl font-bold">
                Welcome to the<br />PRIME
              </h1>
              <p className="text-xl">
                Unlock Knowledge, Connect with Expert
              </p>
              <button 
                className="bg-blue-400 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-500 transition-colors"
                onClick={handleLearnMoreClick}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-9xl mx-8 px-1 pt-6">
        <div className="mb-6">
          <div className="border border-gray-300 p-6 rounded-sm bg-gray-50">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Search for...  "
                  className="w-full p-3 text-lg border border-gray-300 rounded-l"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  type="submit"
                  className="bg-blue-900 text-white px-8 rounded-r font-medium"
                >
                  Search
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

        <div className="mb-10">      
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-blue-100 hover:bg-blue-200 transition-colors rounded p-4 cursor-pointer"
                onClick={() => {
                  if (stat.href) {
                    window.open(stat.href, '_blank');
                  }
                }}
              >
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-center mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-center text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;