import React, { useState } from 'react';
import { 
  BookMarked, 
  Wallet, 
  CircleCheckBig, 
  Users, 
  IndianRupee, 
  CalendarDays, 
  PlusCircle 
} from 'lucide-react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Projects = () => {
  // Existing projects data
  const projectsData = [
    {
      title: "Studies on effect of coated materials for the reduction of Nitrogen Leaching from applied fertilizers",
      fundingAgency: "UPL Ltd.",
      completed: true,
      role: "Principal investigator",
      amount: "₹ 2815000",
      period: "2019 - 2022"
    },
    // ... other project entries
  ];

  // State for student form
  const [studentForm, setStudentForm] = useState({
    title: '',
    student_name: '',
    student_email: '',
    start_year: '',
    end_year: ''
  });

  // State for handling form submission
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle student addition
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    try {
      // Get the JWT token from local storage (adjust based on your auth mechanism)
      const token = localStorage.getItem('jwt_token');

      // Make API call to add student
      const response = await axios.put('/api/students/add/', studentForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle successful response
      setSubmitStatus({
        success: true,
        error: false,
        message: 'Student Added Successfully!'
      });

      // Reset form
      setStudentForm({
        title: '',
        student_name: '',
        student_email: '',
        start_year: '',
        end_year: ''
      });
    } catch (error) {
      // Handle error
      setSubmitStatus({
        success: false,
        error: true,
        message: error.response?.data?.error || 'Error adding student'
      });
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Projects Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-6 h-6 text-gray-500" />
            <CardTitle>Projects</CardTitle>
          </div>
          
          {/* Add Student Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4"bg-white>
                <div>
                  <Label>Title</Label>
                  <Input 
                    name="title"
                    value={studentForm.title}
                    onChange={handleInputChange}
                    placeholder="Student Title"
                    required
                  />
                </div>
                <div>
                  <Label>Student Name</Label>
                  <Input 
                    name="student_name"
                    value={studentForm.student_name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <Label>Student Email</Label>
                  <Input 
                    name="student_email"
                    type="email"
                    value={studentForm.student_email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Year</Label>
                    <Input 
                      name="start_year"
                      type="number"
                      value={studentForm.start_year}
                      onChange={handleInputChange}
                      placeholder="Start Year"
                      required
                    />
                  </div>
                  <div>
                    <Label>End Year</Label>
                    <Input 
                      name="end_year"
                      type="number"
                      value={studentForm.end_year}
                      onChange={handleInputChange}
                      placeholder="End Year"
                      required
                    />
                  </div>
                </div>
                
                {submitStatus.success && (
                  <div className="text-green-600 text-sm">
                    {submitStatus.message}
                  </div>
                )}
                
                {submitStatus.error && (
                  <div className="text-red-600 text-sm">
                    {submitStatus.message}
                  </div>
                )}
                
                <Button type="submit" className="w-full">
                  Add Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {projectsData.map((project, index) => (
            <div key={index} className="p-4 rounded-lg shadow-sm mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">{project.title}</h4>
              
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="inline-block">
                    <Wallet className="w-4 h-4" />
                  </span>
                  <span>Funding Agency: {project.fundingAgency}</span>
                </div>
              </div> */}
              
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;