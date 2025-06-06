// import React, { useState, useEffect } from 'react';
// import person from '../../assets/person.jpg';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from '@/components/ui/checkbox';
// import { Search } from 'lucide-react';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import axiosInstance, { API_BASE_URL } from '../../api/axios';
// import ProfileSearchbox from './ProfileSearchbox';
// const Profiles = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [allFacultyData, setAllFacultyData] = useState([]);
//   const [displayFacultyData, setDisplayFacultyData] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const itemsPerPage = 9;
//   const [totalPages, setTotalPages] = useState(1);
//   const [activeFilters, setActiveFilters] = useState({
//     designations: [],
//     departments: [],
//     states: [],
//     institutions: []
//   });
//   const [sortBy, setSortBy] = useState('name');
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract search parameters from URL
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//   const name = searchParams.get('name');
  
//   if (name) {
//     setSearchTerm(name);
//   }
  
//   // Check if we have results passed via state
//   if (location.state && location.state.results) {
//     console.log("Results from state:", location.state.results);
//     setAllFacultyData(location.state.results);
//     setCurrentPage(1); // Reset to first page with new results
//   } else {
//     // If no results in state, fetch them based on URL parameters
//     fetchAllFacultyData();
//   }
// }, [location.search]);

//   // Apply filters, sorting, and pagination whenever data, filters, sort, or page changes
//   useEffect(() => {
//     applyFiltersAndPagination();
//   }, [allFacultyData, activeFilters, sortBy, currentPage, searchTerm]);

//   const fetchAllFacultyData = async () => {
//   setLoading(true);
//   try {
//     const params = searchTerm ? { name: searchTerm } : {};
    
//     console.log("Fetching data with params:", params);
    
//     const response = await axiosInstance.get('/api/search', {
//       params: params,
//       withCredentials: true,
//     });
    
//     console.log("Fetched data:", response.data);
    
//     setAllFacultyData(response.data);
    
//     setCurrentPage(1);
//   } catch (error) {
//     console.error("Error fetching faculty data:", error);
//     setAllFacultyData([]);
//   } finally {
//     setLoading(false);
//   }
// };

//   const applyFiltersAndPagination = () => {
//     // Start with all faculty data
//     let filteredData = [...allFacultyData];
    
//     // Apply search term filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filteredData = filteredData.filter(faculty => 
//         faculty.name?.toLowerCase().includes(searchLower) ||
//         faculty.department?.toLowerCase().includes(searchLower) ||
//         faculty.expertise?.toLowerCase().includes(searchLower) ||
//         faculty.designation?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     // Apply designation filters
//     if (activeFilters.designations.length > 0) {
//       filteredData = filteredData.filter(faculty => 
//         activeFilters.designations.includes(faculty.designation)
//       );
//     }
    
//     // Apply department filters
//     if (activeFilters.departments.length > 0) {
//       filteredData = filteredData.filter(faculty => 
//         activeFilters.departments.includes(faculty.department)
//       );
//     }
    
//     // Apply state filters
//     if (activeFilters.states.length > 0) {
//       filteredData = filteredData.filter(faculty => 
//         activeFilters.states.includes(faculty.state)
//       );
//     }
    
//     // Apply institution filters
//     if (activeFilters.institutions.length > 0) {
//       filteredData = filteredData.filter(faculty => 
//         activeFilters.institutions.includes(faculty.institution)
//       );
//     }
    
//     // Apply sorting
//     filteredData.sort((a, b) => {
//       if (sortBy === 'name') {
//         return a.name?.localeCompare(b.name);
//       } else if (sortBy === 'designation') {
//         return a.designation?.localeCompare(b.designation);
//       } else if (sortBy === 'department') {
//         return a.department?.localeCompare(b.department);
//       }
//       return 0;
//     });
    
//     // Update total items and pages
//     setTotalItems(filteredData.length);
//     setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    
//     // Get current page items
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     setDisplayFacultyData(filteredData.slice(startIndex, endIndex));
//   };

//   // Handle filter changes
//   const handleFilterChange = (category, value) => {
//     setActiveFilters(prev => {
//       const updated = { ...prev };
//       if (updated[category].includes(value)) {
//         updated[category] = updated[category].filter(item => item !== value);
//       } else {
//         updated[category] = [...updated[category], value];
//       }
//       return updated;
//     });
//     // Reset to first page when filters change
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleViewProfile = (profile_id) => {
//     navigate(`/profile/${profile_id}`);
//   };

//  const handleSortChange = (value) => {
//     setSortBy(value);
//   };
//   const departments = [
//     'Astronomy and Astrophysics',
//     'Atomic, Molecular and Optical Physics', 
//     'Geosciences', 
//     'Planetary Sciences', 
//     'Space and Atmospheric Sciences', 
//     'Theoretical Physics', 
//     'Udaipur Solar Observatory',
//     'Workshop', 
//     'CNIT Services', 
//     'Medical Services',
//     'Administration', 
//     'CMG Services', 
//     'Library Services', 
//     'Unknown', 
//     'Others', 
//   ];

//   const states = [ 
//     "Andhra Pradesh",
//     "Arunachal Pradesh",
//     "Assam",
//     "Bihar",
//     "Chhattisgarh",
//     "Goa",
//     "Gujarat",
//     "Haryana",
//     "Himachal Pradesh",
//     "Jharkhand",
//     "Karnataka",
//     "Kerala",
//     "Maharashtra",
//     "Madhya Pradesh",
//     "Manipur",
//     "Meghalaya",
//     "Mizoram",
//     "Nagaland",
//     "Odisha",
//     "Punjab",
//     "Rajasthan",
//     "Sikkim",
//     "Tamil Nadu",
//     "Tripura",
//     "Telangana",
//     "Uttar Pradesh",
//     "Uttarakhand",
//     "West Bengal",
//     "Andaman & Nicobar (UT)",
//     "Chandigarh (UT)",
//     "Dadra & Nagar Haveli and Daman & Diu (UT)",
//     "Delhi [National Capital Territory (NCT)]",
//     "Jammu & Kashmir (UT)",
//     "Ladakh (UT)",
//     "Lakshadweep (UT)",
//     "Puducherry (UT)"
//   ];

//   const designations = [
//     "Associate Professor",
//     "Assistant Professor",
//     "Scientist",
//     "Senior Scientist",
//     "Faculty",
//     "Senior Research Fellow",
//     "Dean",
//     "Doctor",
//     "Head of the Department",
//     "Lecturer",
//     "Associate Dean",
//     "Head",
//     "Project Engineer",
//     "Research Fellow",
//     "Research Scientist",
//     "Research Scholar",
//     "Library Officer-C",
//     "Pending"
//   ];


//   // Show error message if no data is available
//   const displayData = displayFacultyData.length > 0 ? displayFacultyData : { error: "No faculty data available" };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Bar */}
//       <div className="w-full bg-white shadow-sm py-6 px-7 mb-6">
//        <ProfileSearchbox/>
//       </div>

//       <div className="flex p-6 gap-6">
//         {/* Filters Section */}
//         <div className="w-64 flex-shrink-0">
//           <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
//             <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
//             <Accordion type="single" collapsible className="w-full">
//               <AccordionItem value="designation">
//                 <AccordionTrigger>Designation</AccordionTrigger>
//                 <AccordionContent>
//                   <div className="space-y-2">
//                     {designations.map((designation) => (
//                       <div key={designation} className="flex items-center space-x-2">
//                         <Checkbox id={designation} 
//                         checked={activeFilters.designations.includes(designation)}
//                           onCheckedChange={() => handleFilterChange('designations', designation)}
//                         />
//                         <label htmlFor={designation} className="text-sm">
//                           {designation}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>

//               <AccordionItem value="department">
//                 <AccordionTrigger>Department</AccordionTrigger>
//                 <AccordionContent>
//                   <div className="space-y-2">
//                     {departments.map((department) => (
//                       <div key={department} className="flex items-center space-x-2">
//                         <Checkbox id={department} 
                        
//                         checked={activeFilters.departments.includes(department)}
//                           onCheckedChange={() => handleFilterChange('departments', department)}
//                         />
//                         <label htmlFor={department} className="text-sm">
//                           {department}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//               <AccordionItem value="state">
//                 <AccordionTrigger>State</AccordionTrigger>
//                 <AccordionContent>
//                 <div className="space-y-2">
//                     {states.map((state) => (
//                       <div key={state} className="flex items-center space-x-2">
//                         <Checkbox id={state}
//                         checked={activeFilters.states.includes(state)}
//                           onCheckedChange={() => handleFilterChange('states', state)}
//                          />
//                         <label htmlFor={state} className="text-sm">
//                           {state}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>
//         </div>

//         {/* Results Section */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-medium">Sort By</span>
//               <Select value={sortBy} onValueChange={handleSortChange}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="name">Name</SelectItem>
//                   <SelectItem value="designation">Designation</SelectItem>
//                   <SelectItem value="department">Department</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="text-sm text-gray-600">
//               Showing {totalItems > 0 ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)}` : 0} of {totalItems} results
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-8">Loading...</div>
//           ) : Array.isArray(displayData) && displayData.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-none">
//               {displayData.map((faculty) => (
//                 <Card key={faculty.id} className="hover:shadow-lg transition-shadow duration-300 group">
//                   <CardContent className="p-5">
//                     <div className="flex flex-col items-center">
//                       <div className="w-32 h-32 rounded-full border-black bg-gray-200 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
//                         <img
//                           src={`${API_BASE_URL}`+faculty.image|| person}
//                           alt={faculty.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
                      
//                       <h3 className="text-xl font-semibold mb-1 text-center group-hover:text-blue-600 transition-colors duration-300">
//                         {faculty.name}
//                       </h3>
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="px-2 py-1 bg-gray-200 rounded-full text-sm text-black">
//                           ID: {faculty.id}
//                         </span>
//                       </div>
//                       <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-1">
//                         {faculty.designation}
//                       </div>
//                       <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-1">
//                         {faculty.department}
//                       </div>
//                       {faculty.expertise && (
//                         <div className="text-sm text-center text-gray-600 mb-3 line-clamp-2">
//                           {faculty.expertise}
//                         </div>
//                       )}
//                       {faculty.scopus_url && (
//                         <div className="text-sm text-center text-blue-500 mb-3 hover:underline">
//                           <a href={faculty.scopus_url} target="_blank" rel="noopener noreferrer">
//                             Scopus Profile
//                           </a>
//                         </div>
//                       )}
//                       {faculty.state && (
//                         <div className="flex items-center text-sm text-gray-600 mb-4">
//                           {faculty.state}
//                         </div>
//                       )}
//                       <Button 
//                         onClick={() => handleViewProfile(faculty.id)}
//                         variant="outline" 
//                         size="sm"
//                         className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
//                       >
//                         View Profile
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p>No profiles found matching your search criteria.</p>
//             </div>
//           )}

//           {/* Improved Pagination Controls */}
//           {totalItems > 0 && totalPages > 1 && (
//             <div className="mt-8 flex justify-center">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious 
//                       href="#" 
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handlePageChange(Math.max(1, currentPage - 1));
//                       }}
//                       className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//                     />
//                   </PaginationItem>
                  
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
//                     // Show current page and adjacent pages
//                     const shouldShow = page === 1 || 
//                                      page === totalPages || 
//                                      Math.abs(page - currentPage) <= 1;
                    
//                     // Show ellipsis for gaps
//                     const shouldShowEllipsis = (page === 2 && currentPage > 3) || 
//                                              (page === totalPages - 1 && currentPage < totalPages - 2);
                                       
//                     if (shouldShow) {
//                       return (
//                         <PaginationItem key={page}>
//                           <PaginationLink 
//                             href="#"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               handlePageChange(page);
//                             }}
//                             isActive={currentPage === page}
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     } else if (shouldShowEllipsis) {
//                       return (
//                         <PaginationItem key={`ellipsis-${page}`}>
//                           <PaginationEllipsis />
//                         </PaginationItem>
//                       );
//                     }
                    
//                     return null;
//                   })}
                  
//                   <PaginationItem>
//                     <PaginationNext 
//                       href="#" 
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handlePageChange(Math.min(totalPages, currentPage + 1));
//                       }}
//                       className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profiles;


import React, { useState, useEffect } from 'react';
import person from '../../assets/person.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import ProfileSearchbox from './ProfileSearchbox';

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allFacultyData, setAllFacultyData] = useState([]);
  const [displayFacultyData, setDisplayFacultyData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    designations: [],
    departments: [],
    states: [],
    institutions: []
  });
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Extract search parameters from URL and handle state data
  useEffect(() => {
    // Check if we have results passed via state
    if (location.state?.results) {
      console.log("Using results from state:", location.state.results);
      setAllFacultyData(location.state.results);
      setCurrentPage(1); // Reset to first page with new results
      setLoading(false);
      return;
    }
    
    // Otherwise check URL params and fetch accordingly
    const apiQueryParams = new URLSearchParams();
    const filters = ['name', 'designation', 'department', 'expertise'];
    let hasFilter = false;
    
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        apiQueryParams.append(filter, value);
        hasFilter = true;
        
        // Update search term for display
        if (filter === 'name') {
          setSearchTerm(value);
        }
      }
    });
    
    if (hasFilter) {
      fetchFacultyData(apiQueryParams);
    } else {
      fetchAllFacultyData();
    }
  }, [location.search, location.state]);

  // Apply filters, sorting, and pagination whenever data, filters, sort, or page changes
  useEffect(() => {
    applyFiltersAndPagination();
  }, [allFacultyData, activeFilters, sortBy, currentPage, searchTerm]);

  const fetchFacultyData = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching data with params:", params.toString());
      
      const response = await axiosInstance.get('/api/search', {
        params: params,
        withCredentials: true,
      });
      
      console.log("Fetched data:", response.data);
      
      setAllFacultyData(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching faculty data:", err);
      setError("Failed to load search results. Please try again.");
      setAllFacultyData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFacultyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = searchTerm ? { name: searchTerm } : {};
      
      console.log("Fetching all data with params:", params);
      
      const response = await axiosInstance.get('/api/search', {
        params: params,
        withCredentials: true,
      });
      
      console.log("Fetched all data:", response.data);
      
      setAllFacultyData(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching faculty data:", err);
      setError("Failed to load faculty data. Please try again.");
      setAllFacultyData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    // Start with all faculty data
    let filteredData = [...allFacultyData];
    
    // Apply search term filter if not already filtered by API
    if (searchTerm && !searchParams.has('name')) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(faculty => 
        faculty.name?.toLowerCase().includes(searchLower) ||
        faculty.department?.toLowerCase().includes(searchLower) ||
        faculty.expertise?.toLowerCase().includes(searchLower) ||
        faculty.designation?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply designation filters
    if (activeFilters.designations.length > 0) {
      filteredData = filteredData.filter(faculty => 
        activeFilters.designations.includes(faculty.designation)
      );
    }
    
    // Apply department filters
    if (activeFilters.departments.length > 0) {
      filteredData = filteredData.filter(faculty => 
        activeFilters.departments.includes(faculty.department)
      );
    }
    
    // Apply state filters
    if (activeFilters.states.length > 0) {
      filteredData = filteredData.filter(faculty => 
        activeFilters.states.includes(faculty.state)
      );
    }
    
    // Apply institution filters
    if (activeFilters.institutions.length > 0) {
      filteredData = filteredData.filter(faculty => 
        activeFilters.institutions.includes(faculty.institution)
      );
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name?.localeCompare(b.name);
      } else if (sortBy === 'designation') {
        return a.designation?.localeCompare(b.designation);
      } else if (sortBy === 'department') {
        return a.department?.localeCompare(b.department);
      }
      return 0;
    });
    
    // Update total items and pages
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    
    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayFacultyData(filteredData.slice(startIndex, endIndex));
  };

  // Get the active filters for display
  const getActiveFilters = () => {
    // First try to get from state
    if (location.state?.filters) {
      return location.state.filters;
    }
    
    // Otherwise, check URL parameters
    const activeFilterList = [];
    const filters = ['name', 'designation', 'department', 'expertise'];
    
    filters.forEach(filter => {
      if (searchParams.has(filter)) {
        activeFilterList.push(filter);
      }
    });
    
    return activeFilterList;
  };

  // Get search term for display
  const getSearchTerm = () => {
    // First try to get it from state
    if (location.state?.searchTerm) {
      return location.state.searchTerm;
    }
    
    // If not in state, check URL parameters
    const filters = ['name', 'designation', 'department', 'expertise'];
    for (const filter of filters) {
      const value = searchParams.get(filter);
      if (value) return value;
    }
    
    return searchTerm || '';
  };

  // Handle filter changes
  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter(item => item !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProfile = (profile_id) => {
    navigate(`/profile/${profile_id}`);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const departments = [
    'Astronomy and Astrophysics',
    'Atomic, Molecular and Optical Physics', 
    'Geosciences', 
    'Planetary Sciences', 
    'Space and Atmospheric Sciences', 
    'Theoretical Physics', 
    'Udaipur Solar Observatory',
    'Workshop', 
    'CNIT Services', 
    'Medical Services',
    'Administration', 
    'CMG Services', 
    'Library Services', 
    'Unknown', 
    'Others', 
  ];

  const states = [ 
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Maharashtra",
    "Madhya Pradesh",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Tripura",
    "Telangana",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman & Nicobar (UT)",
    "Chandigarh (UT)",
    "Dadra & Nagar Haveli and Daman & Diu (UT)",
    "Delhi [National Capital Territory (NCT)]",
    "Jammu & Kashmir (UT)",
    "Ladakh (UT)",
    "Lakshadweep (UT)",
    "Puducherry (UT)"
  ];

  const designations = [
    "Associate Professor",
    "Assistant Professor",
    "Scientist",
    "Senior Scientist",
    "Faculty",
    "Senior Research Fellow",
    "Dean",
    "Doctor",
    "Head of the Department",
    "Lecturer",
    "Associate Dean",
    "Head",
    "Project Engineer",
    "Research Fellow",
    "Research Scientist",
    "Research Scholar",
    "Library Officer-C",
    "Pending"
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="w-full bg-white shadow-sm py-6 px-7 mb-6">
        <ProfileSearchbox />
      </div>
     
      
      {/* Error display */}
      {error && (
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="flex p-6 gap-6">
        {/* Filters Section */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="designation">
                <AccordionTrigger>Designation</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {designations.map((designation) => (
                      <div key={designation} className="flex items-center space-x-2">
                        <Checkbox id={designation} 
                        checked={activeFilters.designations.includes(designation)}
                          onCheckedChange={() => handleFilterChange('designations', designation)}
                        />
                        <label htmlFor={designation} className="text-sm">
                          {designation}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="department">
                <AccordionTrigger>Department</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {departments.map((department) => (
                      <div key={department} className="flex items-center space-x-2">
                        <Checkbox id={department} 
                        checked={activeFilters.departments.includes(department)}
                          onCheckedChange={() => handleFilterChange('departments', department)}
                        />
                        <label htmlFor={department} className="text-sm">
                          {department}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="state">
                <AccordionTrigger>State</AccordionTrigger>
                <AccordionContent>
                <div className="space-y-2">
                    {states.map((state) => (
                      <div key={state} className="flex items-center space-x-2">
                        <Checkbox id={state}
                        checked={activeFilters.states.includes(state)}
                          onCheckedChange={() => handleFilterChange('states', state)}
                         />
                        <label htmlFor={state} className="text-sm">
                          {state}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort By</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="designation">Designation</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {totalItems > 0 ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)}` : 0} of {totalItems} results
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading results...</div>
          ) : displayFacultyData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-none">
              {displayFacultyData.map((faculty) => (
                <Card key={faculty.id} className="hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-black bg-gray-200 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={faculty.image ? `${API_BASE_URL}${faculty.image}` : person}
                          alt={faculty.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-1 text-center group-hover:text-blue-600 transition-colors duration-300">
                        {faculty.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-gray-200 rounded-full text-sm text-black">
                          ID: {faculty.id}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-1">
                        {faculty.designation}
                      </div>
                      <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-1">
                        {faculty.department}
                      </div>
                      {faculty.expertise && (
                        <div className="text-sm text-center text-gray-600 mb-3 line-clamp-2">
                          {faculty.expertise}
                        </div>
                      )}
                      {faculty.scopus_url && (
                        <div className="text-sm text-center text-blue-500 mb-3 hover:underline">
                          <a href={faculty.scopus_url} target="_blank" rel="noopener noreferrer">
                            Scopus Profile
                          </a>
                        </div>
                      )}
                      {faculty.state && (
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          {faculty.state}
                        </div>
                      )}
                      <Button 
                        onClick={() => handleViewProfile(faculty.id)}
                        variant="outline" 
                        size="sm"
                        className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No results found for your search.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalItems > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1));
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show current page and adjacent pages
                    const shouldShow = page === 1 || 
                                     page === totalPages || 
                                     Math.abs(page - currentPage) <= 1;
                    
                    // Show ellipsis for gaps
                    const shouldShowEllipsis = (page === 2 && currentPage > 3) || 
                                             (page === totalPages - 1 && currentPage < totalPages - 2);
                                       
                    if (shouldShow) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (shouldShowEllipsis) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(totalPages, currentPage + 1));
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;