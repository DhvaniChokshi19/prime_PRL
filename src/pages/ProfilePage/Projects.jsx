import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  CircleCheckBig, 
  Users, 
  IndianRupee, 
  CalendarDays, 
  PlusCircle,
  Edit,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from "@/hooks/use-toast";

// Initial form state
const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  student_name: '',
  student_email: '',
  start_year: '',
  end_year: ''
};

const Projects = () => {
  // State for students/projects
  const [students, setStudents] = useState([]);
  
  // State for student form
  const [studentForm, setStudentForm] = useState(INITIAL_FORM_STATE);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const getAuthToken = () => {
   const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    throw new Error('No authentication token found in cookies');

  };
  

  // Fetch students method
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get('api/profile/students/view', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const { title, student_name, student_email, start_year, end_year } = studentForm;
    
    // Basic validation
    if (!title || !student_name || !student_email || !start_year || !end_year) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Year validation
    const startYear = parseInt(start_year);
    const endYear = parseInt(end_year);
    if (isNaN(startYear) || isNaN(endYear) || startYear >= endYear) {
      toast({
        title: "Validation Error",
        description: "Invalid year range",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Handle student addition/edit
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();

      // Determine if we're adding or editing
      const endpoint = studentForm.id 
        ? '/api/profile/students/edit' 
        : '/api/profile/students/add';

      const response = await axios.put(endpoint, studentForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Show success toast
      toast({
        title: "Success",
        description: studentForm.id 
          ? 'Student Updated Successfully!' 
          : 'Student Added Successfully!',
        variant: "default"
      });

      // Refresh students list
      fetchStudents();

      // Reset form
      setStudentForm(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Error processing student:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 'Error processing student',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (studentId) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();

      await axios.delete('/api/profile/students/delete', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { id: studentId }
      });

      // Show success toast
      toast({
        title: "Success",
        description: 'Student Deleted Successfully!',
        variant: "default"
      });

      // Refresh students list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 'Error deleting student',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit student method
  const handleEditStudent = (student) => {
    setStudentForm({
      id: student.id,
      title: student.title,
      student_name: student.student_name,
      student_email: student.student_email,
      start_year: student.start_year,
      end_year: student.end_year
    });
  };

  return (
    <div className="space-y-8 p-6">
      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-6 h-6 text-gray-500" />
            <CardTitle>Projects</CardTitle>
          </div>
          
          {/* Add Student Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setStudentForm(INITIAL_FORM_STATE)}
              >
                <PlusCircle className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {studentForm.id ? 'Edit Student' : 'Add New Student'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 bg-white">
                <div>
                  <Label>Title</Label>
                  <Input 
                    name="title"
                    value={studentForm.title || ''}
                    onChange={handleInputChange}
                    placeholder="Student Title"
                    required
                  />
                </div>
                <div>
                  <Label>Student Name</Label>
                  <Input 
                    name="student_name"
                    value={studentForm.student_name || ''}
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
                    value={studentForm.student_email || ''}
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
                      value={studentForm.start_year || ''}
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
                      value={studentForm.end_year || ''}
                      onChange={handleInputChange}
                      placeholder="End Year"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (studentForm.id ? 'Update Student' : 'Add Student')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No students found. Add a student to get started.
            </div>
          ) : (
            students.map((student) => (
              <div 
                key={student.id} 
                className="p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    {student.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span>{student.student_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4 text-yellow-500" />
                      <span>{student.start_year} - {student.end_year}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={studentForm.id !== null} onOpenChange={() => setStudentForm(INITIAL_FORM_STATE)}>
                    <DialogTrigger asChild>
                      <Button  
                        size="icon" 
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {studentForm.id ? 'Edit Student' : 'Add New Student'}
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleAddStudent} className="space-y-4 bg-white">
      <div>
        <Label>Title</Label>
        <Input 
          name="title"
          value={studentForm.title || ''}
          onChange={handleInputChange}
          placeholder="Student Title"
          required
        />
      </div>
      <div>
        <Label>Student Name</Label>
        <Input 
          name="student_name"
          value={studentForm.student_name || ''}
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
          value={studentForm.student_email || ''}
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
            value={studentForm.start_year || ''}
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
            value={studentForm.end_year || ''}
            onChange={handleInputChange}
            placeholder="End Year"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : (studentForm.id ? 'Update Student' : 'Add Student')}
      </Button>
    </form>
  </DialogContent>
                  </Dialog>
                  <AlertDialog >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the student record.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;