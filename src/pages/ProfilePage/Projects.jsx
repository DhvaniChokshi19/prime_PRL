import React from 'react';
import { BookMarked , Wallet,CircleCheckBig,Users,IndianRupee, CalendarDays} from 'lucide-react';

const Projects = () => {
  const projectsData = [
    {
      title: "Studies on effect of coated materials for the reduction of Nitrogen Leaching from applied fertilizers",
      fundingAgency: "UPL Ltd.",
      completed: true,
      role: "Principal investigator",
      amount: "₹ 2815000",
      period: "2019 - 2022"
    },
    {
      title: "Bio-fortification of maize (Zea mays L.) with micronutrients under different methods of NPK management",
      fundingAgency: "ATMA, GOK",
      completed: true,
      role: "Principal investigator",
      amount: "₹ 150000",
      period: "2020 - 2022"
    },
    {
      title: "Bio-efficacy testing of seed treatment, soil and foliar application bio-fertilizers on corn and paddy",
      fundingAgency: "Novozymes India Pvt. Ltd.",
      completed: true,
      role: "Co-Principal investigator",
      amount: "₹ 1643000",
      period: "2017 - 2020"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookMarked className="w-6 h-6 text-gray-500" />
          <h3 className="text-xl font-semibold">Projects</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-1 border rounded-md text-sm">
            <option>Sort by Date (newest)</option>
          </select>
        </div>
      </div>

      {projectsData.map((project, index) => (
        <div key={index} className="p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{project.title}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="inline-block">
                <Wallet className="w-4 h-4" />
              </span>
              <span>Funding Agency : {project.fundingAgency}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-gray-600">
                <span className="inline-block text-yellow-500">
                    <CircleCheckBig className="w-4 h-4" />
                    </span>
              <span>Completed</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <span className="inline-block text-yellow-500">
                <Users className="w-4 h-4" />
              </span>
              <span>{project.role}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <span className="inline-block text-yellow-500">
                <IndianRupee className="w-4 h-4" />
              </span>
              <span>{project.amount}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <span className="inline-block text-yellow-500">
                <CalendarDays className="w-4 h-4" />
              </span>
              <span>{project.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;