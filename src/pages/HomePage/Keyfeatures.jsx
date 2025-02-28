import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, LineChart, Shield, Users, Eye, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const Keyfeatures = () => {
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
      description: "PRIME enhances PRL’s visibility by systematically showcasing research achievements, strengthening its reputation, and increasing its appeal to collaborators, funding agencies, and global academic communities."
    },
    {
      icon: <Cpu className="h-8 w-8 text-blue-600" />,
      title: "Future-Ready Design",
      description: "PRIME addresses the growing complexities of research ecosystems, offering flexibility to adapt to emerging challenges and advancements in research and technology."
    }
  ];
 const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState('');
  const [isAnimating, setIsAnimating] = React.useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };


  return (
    <div id="key-features" className="max-w-7xl mx-auto px-4 py-64">
      <h1 className="text-4xl font-bold text-center mb-12">Key Features</h1>
      
<div className="relative">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-3xl mx-auto"
        >
          <CarouselContent>
            {features.map((feature, index) => (
              <CarouselItem key={index}>
                <Card className="shadow-lg bg-gray-100 hover:shadow-xl transition-all duration-500">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 md:-left-12" />
          <CarouselNext className="right-0 md:-right-12" />
        </Carousel>
      </div>
    </div>
  );
};

export default Keyfeatures;