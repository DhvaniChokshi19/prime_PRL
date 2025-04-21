import React, { useEffect, useRef } from 'react';
import { Cpu, Database, Eye, LineChart, Shield, Users } from "lucide-react";
const KeyFeatures = () => {
  const features = [
    {
      icon: <Database className="h-8 w-8 text-blue-600" />,
      title: "Centralized Data Aggregation",
      description: "PRIME integrates data from multiple sources into a single, intelligent, secure platform. This unified approach allows for seamless management and analysis of research activities, publications, faculty contributions, and scholarly output."
    },
    {
      icon: <LineChart className="h-8 w-8 text-blue-600" />,
      title: "Actionable Insights",
      description: "By offering robust reporting, analysis, and benchmarking tools, PRIME equips decision-makers with the insights needed to evaluate research impact, optimize resources, and identify growth opportunities."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Global Standards Compliance",
      description: "PRIME is aligned with internationally recognized standards for research information management. This ensures interoperability, scalability, and adaptability to evolving research trends and technologies."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Enhanced Collaboration",
      description: "The platform fosters collaboration by providing researchers with a comprehensive view of ongoing projects, shared resources, and potential partnerships, both within and outside the institution."
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: "Institutional Visibility",
      description: "PRIME enhances PRL's visibility by systematically showcasing research achievements, strengthening its reputation, and increasing its appeal to collaborators, funding agencies, and global academic communities."
    },
    {
      icon: <Cpu className="h-8 w-8 text-blue-600" />,
      title: "Future-Ready Design",
      description: "PRIME addresses the growing complexities of research ecosystems, offering flexibility to adapt to emerging challenges and advancements in research and technology."
    }
  ];
  const stats = [
    {
      icon: "🔓",
      title: "Total Open Access",
      value: "",
      description: "Research papers accessible without barriers"
    },
    {
      icon: "🔒",
      title: "Total Closed Access",
      value: "",
      description: "Premium research publications available"
    },
    {
      icon: "📊",
      title: "Total Altmetric Score",
      value: "",
      description: "Cumulative engagement metrics across all publications"
    },
    {
      icon: "📚",
      title: "Total Thesis",
      value: "",
      description: "Complete academic theses in our database"
    }
  ];

  return (
    <div id="key-features" className="max-w-7xl mx-auto  mt-96 px-4 py-20">
      <div className="mb-10">        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-center">{stat.title}</h3>
              <p className="text-xl font-semibold text-blue-600 mt-2">{stat.value}</p>
              <p className="text-gray-600 text-center mt-2">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Our Platform Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default KeyFeatures;