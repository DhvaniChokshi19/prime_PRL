import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Building, 
  User, 
  Globe, 
  PlusCircle, 
  Edit, 
  Trash2 
} from 'lucide-react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
// import { toast } from "@/hooks/use-toast";
import { toast,  Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import '../../App.css';

// Initial form state
const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  
  student: '',
  institute: '',
  department: '',
  funding_agency: '',
  website_url: '',
  start_year: '',
  end_year: ''
};

const Thesis = ({ profileId, thesis: initialThesis, onDataUpdate }) => {

  const [thesis, setThesis] = useState(initialThesis || []);
  
  const [thesisForm, setThesisForm] = useState(INITIAL_FORM_STATE);
  
  const [isLoading, setIsLoading] = useState(!initialThesis);
  const [error, setError] = useState(null);

const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {
    if (initialThesis) {
      setThesis(initialThesis);
      setIsLoading(false);
      return;
    }

    fetchThesis();
  }, [profileId, initialThesis, onDataUpdate]);

  const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      // check token validity
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds
      if (decoded.exp < currentTime) {
        // token expired
        toast.error("Session expired. Please log in again.");
        //redirect to logout
        setTimeout(() => {
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        }, 2000);
        return null;
      }
      else{
      return token;

      }
      return null;
    }
    return null;
  };

  const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.profile_id; // must match backend payload
  } catch (err) {
    return null;
  }
};
const getCurrentProfileIdFromUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    const idIndex = pathSegments.findIndex(segment => segment === 'profile') + 1;
    
    if (idIndex > 0 && idIndex < pathSegments.length) {
      return pathSegments[idIndex];
    }
    
    return null;
  };
  const canModify = () => {
  const loggedUserId = getUserIdFromToken();
  const profileIdFromUrl = getCurrentProfileIdFromUrl();
  return loggedUserId && profileIdFromUrl && loggedUserId.toString() === profileIdFromUrl.toString();
};
  
  const fetchThesis = async () => {
    try {
      setIsLoading(true);
       const id = profileId || getCurrentProfileIdFromUrl();
    
    if (!id) {
      throw new Error('Profile ID not found');
    }
    const response = await axiosInstance.get(`api/profile/thesis/view?id=${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
      setThesis(response.data);
      if (onDataUpdate) onDataUpdate(response.data);
      setError(null);
    } catch (err) {
      console.error('Thesis fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load thesis');
      toast.error("Failed to load thesis data.");
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch thesis",
      //   variant: "destructive"
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setThesisForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { title, student, institute } = thesisForm;
    
    if (!title || !student || !institute) {
      toast.error("Please fill in all required fields.");
      // toast({
      //   title: "Validation Error",
      //   description: "Please fill in all required fields",
      //   variant: "destructive"
      // });
      return false;
    }

    return true;
  };

  const handleAddThesis = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const endpoint = thesisForm.id 
        ? '/api/profile/thesis/edit' 
        : '/api/profile/thesis/add';

      const payload = thesisForm;

      const response = await axiosInstance.put(endpoint, payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });
      toast.success(thesisForm.id ? 'Thesis updated successfully!' : 'Thesis added successfully!');
      // toast({
      //   title: "Success",
      //   description: thesisForm.id 
      //     ? 'Thesis Updated Successfully!' 
      //     : 'Thesis Added Successfully!',
      //  variant: "default"
      //});

      fetchThesis();
      setThesisForm(INITIAL_FORM_STATE);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error processing thesis:', error);
      toast.error("Error processing thesis.");
      // toast({
      //   title: "Error",
      //   description: error.response?.data?.message || 'Error processing thesis',
      //   variant: "destructive"
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteThesis = async (thesisId) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      await axiosInstance.delete(`/api/profile/thesis/delete/${thesisId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });
      toast.success("Thesis deleted successfully!");
      // toast({
      //   title: "Success",
      //   description: 'Thesis Deleted Successfully!',
      //   variant: "default"
      // });

      fetchThesis();
    } catch (error) {
      console.error('Error deleting thesis:', error);
      toast.error("Error deleting thesis.");
      // toast({
      //   title: "Error",
      //   description: error.response?.data?.message || 'Error deleting thesis',
      //   variant: "destructive"
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditThesis = (thesis) => {
    setThesisForm({
      id: thesis.id,
      title: thesis.title || '',
      
      student: thesis.student || '',
      institute: thesis.institute || '',
      department: thesis.department || '',
      funding_agency: thesis.funding_agency || '',
      website_url: thesis.website_url || '',
      start_year: thesis.start_year || '',
      end_year: thesis.end_year || ''
    });
  };

  const renderThesisList = (thesisList) => {
    if (thesisList.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No thesis found. Add a thesis to get started.
        </div>
      );
    }

    return thesisList.map((thesis, index) => (
      <div 
        key={thesis.id} 
        className="p-4 rounded-lg shadow-sm mb-4"
      >
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 pr-16">
            {index + 1}. {thesis.title}
          </h4>
          {canModify() && (
          <div className="flex items-center gap-2">
            <Dialog 
              open={thesisForm.id === thesis.id} 
              onOpenChange={() => {
                if (thesisForm.id === thesis.id) {
                  setThesisForm(INITIAL_FORM_STATE);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditThesis(thesis)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Thesis</DialogTitle>
                </DialogHeader>
                {renderThesisForm()}
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the thesis record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDeleteThesis(thesis.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {thesis.student && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-500" />
              <span>Student: {thesis.student}</span>
            </div>
          )}
          
          {thesis.institute && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-500" />
              <span>{thesis.institute}</span>
            </div>
          )}
          
          {thesis.department && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>{thesis.department}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {thesis.start_year && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Started: {thesis.start_year}</span>
            </div>
          )}
          
          {thesis.end_year && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Completed: {thesis.end_year}</span>
            </div>
          )}
          
          {thesis.funding_agency && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>Funded by: {thesis.funding_agency}</span>
            </div>
          )}
          
          {thesis.website_url && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4 text-gray-500" />
              <a 
                href={thesis.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderThesisForm = () => {
    return (
      <form onSubmit={handleAddThesis} className="space-y-4 bg-white beautiful-form">
        <div>
          <Label>Thesis Title</Label>
          <Input 
            name="title"
            value={thesisForm.title}
            onChange={handleInputChange}
            placeholder="Thesis Title"
            required
          />
        </div>
      
        <div>
          <Label>Student Name</Label>
          <Input 
            name="student"
            value={thesisForm.student}
            onChange={handleInputChange}
            placeholder="Student Name"
            required
          />
        </div>
        <div>
          <Label>Institute</Label>
          <Input 
            name="institute"
            value={thesisForm.institute}
            onChange={handleInputChange}
            placeholder="Institute"
            required
          />
        </div>
        <div>
          <Label>Department</Label>
          <Input 
            name="department"
            value={thesisForm.department}
            onChange={handleInputChange}
            placeholder="Department"
          />
        </div>
        <div>
          <Label>Funding Agency</Label>
          <Input 
            name="funding_agency"
            value={thesisForm.funding_agency}
            onChange={handleInputChange}
            placeholder="Funding Agency (if applicable)"
          />
        </div>
        <div>
          <Label>Website URL</Label>
          <Input 
            name="website_url"
            value={thesisForm.website_url}
            onChange={handleInputChange}
            placeholder="Website URL (if available)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Year</Label>
            <Input 
              name="start_year"
              type="number"
              value={thesisForm.start_year}
              onChange={handleInputChange}
              placeholder="YYYY"
              min="1900"
              max="2099"
            />
          </div>
          <div>
            <Label>End Year</Label>
            <Input 
              name="end_year"
              type="number"
              value={thesisForm.end_year}
              onChange={handleInputChange}
              placeholder="YYYY"
              min="1900"
              max="2099"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-yellow-600 hover:bg-green-600 text-white" 
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (thesisForm.id ? 'Update Thesis' : 'Add Thesis')}
        </Button>
      </form>
    );
  };

  if (error && process.env.NODE_ENV === 'development') {
    // Use fallback data in development when API fails
    const fallbackData = [
      {
        id: 1,
        title: "Advanced Machine Learning Techniques for Natural Language Processing",
        student: "Jane Smith",
        institute: "MIT",
        department: "Computer Science",
        funding_agency: "National Science Foundation",
        website_url: "https://example.com/thesis1",
        start_year: "2019",
        end_year: "2022"
      },
      {
        id: 2,
        title: "Sustainable Engineering in Urban Development",
        student: "John Doe",
        institute: "Stanford University",
        department: "Civil Engineering",
        funding_agency: "Department of Energy",
        website_url: "https://example.com/thesis2",
        start_year: "2020",
        end_year: "2023"
      }
    ];
    
    if (fallbackData.length > 0) {
      return (
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-gray-500" />
              <CardTitle>Thesis</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                Using fallback data (API Error)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderThesisList(fallbackData)}
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-gray-500" />
            <CardTitle>Thesis</CardTitle>
          </div>
          {canModify() && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setThesisForm(INITIAL_FORM_STATE); // reset when closed
              }}>
            <DialogTrigger asChild>
              <Button 
              type="button"
                className="flex items-center gap-2"
                onClick={() => {setThesisForm(INITIAL_FORM_STATE)
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle className="w-4 h-4" />
                Add Thesis
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>
                  {thesisForm.id ? 'Edit Thesis' : 'Add New Thesis'}
                </DialogTitle>
              </DialogHeader>
              {renderThesisForm()}
            </DialogContent>
          </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading thesis...</div>
          ) : error && thesis.length === 0 ? (
            <div className="text-center py-4 text-red-500">
              Error: {error}. Please try again.
            </div>  
          ) : (
            renderThesisList(thesis)
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Thesis;