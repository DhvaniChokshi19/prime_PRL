import React, { useState } from 'react';
import person from '../../assets/person.jpg';
import { useNavigate } from 'react-router-dom';
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
import { Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalItems = 20; // Total number of faculty members
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Here you would typically fetch data for the new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleViewProfile = () => {
    navigate('/profile');
  };
  const navigate = useNavigate();
const departments = [
  "Astronomy and Astrophysics",
  "Atomic, Molecular and Optical Physics",
  "Geosciences",
  "Planetary Science",
  "Space and Atmospheric Sciences",
  "Theoretical Physics"
];
const locations=[ 
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
]
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
    "Research Scholar"
  ];
  const facultyData = [
    {
      id: 1,
      name: "Dr. Nithyananad Prabhu",
      uid: "23451",
      designation: "Associate Professor",
      expertise: "Theoretical Physics, General relativity, Gravitation and Astrophysics",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      uid: "23452",
      designation: "Assistant Professor",
      expertise: "Quantum Computing, Machine Learning",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      uid: "23453",
      designation: "Senior Scientist",
      expertise: "Molecular Biology, Genetics",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 4,
      name: "Dr. Sarah Khan",
      uid: "23454",
      designation: "Research Scientist",
      expertise: "Environmental Science, Climate Studies",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 5,
      name: "Dr. Amit Patel",
      uid: "23455",
      designation: "Associate Professor",
      expertise: "Data Science, Artificial Intelligence",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 6,
      name: "Dr. Maya Singh",
      uid: "23456",
      designation: "Assistant Professor",
      expertise: "Robotics, Control Systems",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 7,
      name: "Dr. Arjun Reddy",
      uid: "23457",
      designation: "Senior Research Fellow",
      expertise: "Nanotechnology, Material Science",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 8,
      name: "Dr. Lisa Chen",
      uid: "23458",
      designation: "Research Fellow",
      expertise: "Biochemistry, Drug Discovery",
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 9,
      name: "Dr. Arun Verma",
      uid: "23459",
      designation: "Associate Professor",
      expertise: "Computer Vision, Deep Learning",
      location: "Ahmedabad, Gujarat"
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="w-full bg-white shadow-sm py-6 px-7 mb-6">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for faculty, department, expertise..."
            className="w-full p-3 pr-12 text-lg rounded-lg border border-black-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

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
                      <Checkbox id={designation} />
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
                      <Checkbox id={department} />
                      <label htmlFor={department} className="text-sm">
                        {department}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expertise">
              <AccordionTrigger>Expertise</AccordionTrigger>
              <AccordionContent>
                {/* Add expertise filters here */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location">
              <AccordionTrigger>Location</AccordionTrigger>
              <AccordionContent>
               <div className="space-y-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox id={location} />
                      <label htmlFor={location} className="text-sm">
                        {location}
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
              <Select defaultValue="name">
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
             <div className="mt-4 text-center text-sm text-gray-600">
            Showing {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 borner-none">
            {facultyData.map((faculty) => (
              <Card key={faculty.id} className="hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-black  bg-grey-400 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={person}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-center group-hover:text-blue-600 transition-colors duration-300">
                      {faculty.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-gray-200 rounded-full text-s text-black-600">
                        Uid: {faculty.uid}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
                      {faculty.designation}
                    </div>
                    <div className="text-sm text-center text-gray-600 mb-3 line-clamp-2">
                      {faculty.expertise}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {faculty.location}
                    </div>
                    <Button 
                    onClick={handleViewProfile}
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
          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  
                  // Show first page, current page, last page, and one page before and after current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          href="#"
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis for gaps
                  if (
                    pageNumber === 2 ||
                    pageNumber === totalPages - 1
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default profiles;