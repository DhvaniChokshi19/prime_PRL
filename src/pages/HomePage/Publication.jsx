import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import pubimg from '../../assets/pub_bg.jpg'

const Publication = () => {
const [departmentData, setDepartmentData] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to track error status
  const [error, setError] = useState(null);

  // Fetch data from the API when component mounts
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setIsLoading(true);
        // Make the API request to your Django backend
        const response = await fetch('/api/departments');
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Format the data if needed
        const formattedData = Array.isArray(data) ? data : data.results || [];
        
        // Update state with the fetched data
        setDepartmentData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching department data:', err);
        setError('Failed to load department data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading department data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // If no data was returned
  if (departmentData.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice:</strong>
        <span className="block sm:inline"> No department data available.</span>
      </div>
    );
  }


  const sections = [
    {
      title: "Most Viewed",
      publications: [
        {
          title: "Highly sensitive electrochemical sensor for glutathione detection using zinc oxide quantum dots anchored on reduced graphene oxide",
          views: "8,254",
          authors: ["Vinoth V.","Subramaniyam G.","Kaimal R.","Shanmugaraj K.","Gnana Sundara Raj B.","Thirumurugan A.","Thandapani P.","Pugazhenthiran N.","Manidurai P.","Anandan S."],
          type: "Surfaces and Interfaces, Volume 51, Year 2024",
        },
        {
          title: "Design rule of swift control prototyping systems for power electronics and electrical drives",
          views: "6,130",
          authors: ["T. Bramhananda Reddy.", "N. Ravisankara Reddy.", "A. Pradeepkumar Yadav." ,"C. Harinatha Reddy.", "C. Harikrishna.","Y.V. Siva Reddy.", "Vihljajev, Vladimir", "Žilaitienė, Birutė", "Erenpreiss, Juris", "Matulevičius, Valentinas", "Laan, Mart"],
          type: "Journal of Research Administration",
        }, 
      ]
    },
    {
      title: "Most Downloaded",
      publications: [
        {
          title: "Galvijų neužkrečiamosios virškinimo organų ligos : mokomoji knyga",
          downloads: "812",
          authors: ["Antanaitis, Ramūnas"],
          type: "Mokomoji knyga / Educational book (K2b)"
        },
        {
          title: "Neurologijos pagriniai : vadovėlis",
          downloads: "280", 
          authors: ["Endzinienė, Milda", "Jurkevičienė, Giedrė", "Laurikaitė, Kristina", "Mickevičienė, Dalė", "Obelienienė, Diana", "Petrikonis, Kęstutis", "Ščiupokas, Arūnas", "Vaičienė-Magistris, Nerija", "Vaitkus, Antanas"],
          type: "Vadovėlis / Textbook (K2a)"
        },
        {
          title: "Anatomijos vardynas : [elektroninė knyga]",
          downloads: "242",
          authors: ["Stropus, Stasys Rimvydas", "Paulienė, Neringa", "Paula, Danute", "Tamošiūnas, Virgilijus", "Jakimavičienė, Eglė Marija", "Žemlevičiūtė, Palmira"],
          type: "Žodynas / Dictionary (K3a)"
        }
      ]
    },
    {
      title: "Recent Submissions",
      publications: [
        {
          title: "Paukščių aspergilioze",
          authors: ["Ročkevičius, Alius"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Smulkiųjų atrajotojų kazeoinis limfadenitas",
          authors: ["Žagrauskaitė, Rita", "Burinskaitė-Ambroziūnienė, Giedrė", "Ročkevičius, Alius"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Galvijų kraujo biocheminio tyrimo diagnostinė reikšmė",
          authors: ["Antanaitis, Ramūnas"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        },
        {
          title: "Arklių oro maišų mikoze",
          authors: ["Pakalniskytė, Eglė", "Mataitytė, Simona", "Graždytė, Renata"],
          type: "Straipsnis mokslo-populiarinimo leidinyje / Article in popular science editions (S6)"
        }
      ]
    }
  ];

  return (
    <div className='bg-blue-200 mx-auto max-w-6xl p-4'>
      <div className="relative w-full h-48">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"> 
          <div className="container mx-auto px-8 h-52 flex items-center">
            <div className="text-black space-y-6 max-w-2xl">
              <h1 className="text-5xl font-bold">
                Publications
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-100 rounded shadow">
            <div className="flex justify-between items-center bg-gray-200 px-4 py-2">
              <h2 className="text-gray-700 font-medium">{section.title}</h2>
              <div className="flex">
                <button className="text-gray-500 px-1">❮</button>
                <button className="text-gray-500 px-1">❯</button>
              </div>
            </div>
            
            <div className="p-2">
              {section.publications.map((pub, pubIndex) => (
                <div key={pubIndex} className="mb-4 bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between">
                    <h3 className="text-teal-600 font-medium text-sm hover:underline cursor-pointer">
                      {pub.title}
                    </h3>
                    {pub.views && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 rounded ml-2 whitespace-nowrap">
                        {pub.views}
                      </span>
                    )}
                    {pub.downloads && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
                        {pub.downloads}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-600 text-xs mt-1 italic">
                    {pub.authors.map((author, authorIndex) => (
                      <span key={authorIndex}>
                        {author}
                        {authorIndex < pub.authors.length - 1 ? '; ' : ''}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2">Journal</span>
                    <span className="text-xs text-gray-600">{pub.type}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Publications Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Publications by Department</h3>
        <div className="h-64">
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
              <Bar dataKey="total_publications" name="Publications" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Citations Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Citations by Department</h3>
        <div className="h-64">
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
              <Bar dataKey="total_citations" name="Citations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Profiles Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Profiles by Department</h3>
        <div className="h-64">
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
              <Bar dataKey="total_profiles" name="Profiles" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departmentData.map((dept) => (
          <div key={dept.department} className="bg-gray-50 rounded-lg p-4 shadow">
            <h4 className="font-bold text-gray-700 mb-2">{dept.department}</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-100 p-2 rounded">
                <p className="text-xs text-blue-700 font-semibold">Publications</p>
                <p className="text-lg font-bold text-blue-600">{dept.total_publications}</p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <p className="text-xs text-green-700 font-semibold">Profiles</p>
                <p className="text-lg font-bold text-green-600">{dept.total_profiles}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <p className="text-xs text-yellow-700 font-semibold">Citations</p>
                <p className="text-lg font-bold text-yellow-600">{dept.total_citations?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Publication;