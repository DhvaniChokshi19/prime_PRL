// PostDoctoralFellow.jsx
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
import axiosInstance from '../../api/axios';
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
import '../../App.css';

// Initial form state (area_of_research replaces title; fellow replaces student)
const INITIAL_FORM_STATE = {
  id: null,
  area_of_research: '',
  fellow: '',
  institute: '',
  department: '',
  funding_agency: '',
  website_url: '',
  start_year: '',
  end_year: ''
};

const PostDoctoralFellow = ({ profileId, postdocs: initialPostdocs, onDataUpdate }) => {
  const [postdocs, setPostdocs] = useState(initialPostdocs || []);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(!initialPostdocs);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (initialPostdocs) {
      setPostdocs(initialPostdocs);
      setIsLoading(false);
      return;
    }
    fetchPostdocs();
  }, [profileId, initialPostdocs, onDataUpdate]);

  const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    return null;
  };

  const getCurrentProfileIdFromUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    const idIndex = pathSegments.findIndex(segment => segment === 'profile') + 1;
    if (idIndex > 0 && idIndex < pathSegments.length) {
      return pathSegments[idIndex];
    }
    return null;
  };

  const fetchPostdocs = async () => {
    try {
      setIsLoading(true);
      const id = profileId || getCurrentProfileIdFromUrl();
      if (!id) throw new Error('Profile ID not found');

      const response = await axiosInstance.get(`api/profile/pdf/view?id=${id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      setPostdocs(response.data);
      if (onDataUpdate) onDataUpdate(response.data);
      setError(null);
    } catch (err) {
      console.error('PostDoc fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load postdoctoral fellows');
      toast({
        title: "Error",
        description: "Failed to fetch postdoctoral fellows",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { area_of_research, fellow, institute } = form;
    if (!area_of_research || !fellow || !institute) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const endpoint = form.id 
        ? '/api/profile/pdf/edit' 
        : '/api/profile/pdf/add';

      const payload = form;
      console.log('Submitting payload:', payload);

      const response = await axiosInstance.put(endpoint, payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success",
        description: form.id 
          ? 'Postdoctoral Fellow Updated Successfully!' 
          : 'Postdoctoral Fellow Added Successfully!',
        variant: "default"
      });

      // optional alert for parity with original code
      alert("Postdoctoral fellow processed successfully.");
      fetchPostdocs();
      setForm(INITIAL_FORM_STATE);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error processing postdoctoral fellow:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error processing postdoctoral fellow',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      await axiosInstance.delete(`/api/profile/pdf/delete/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success",
        description: 'Postdoctoral Fellow Deleted Successfully!',
        variant: "default"
      });

      fetchPostdocs();
    } catch (error) {
      console.error('Error deleting postdoctoral fellow:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error deleting postdoctoral fellow',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
const normalizeYear = (value) => {
  if (!value) return "";
  if (typeof value === "number") return String(value);

  // Handle tuple format like "(2020,)"
  if (typeof value === "string" && value.match(/^\(\d+,?\)$/)) {
    return value.replace(/\(|\)|,/g, "").trim();
  }

  return value;
};

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      area_of_research: item.area_of_research || '',
      fellow: item.fellow || '',
      institute: item.institute || '',
      department: item.department || '',
      funding_agency: item.funding_agency || '',
      website_url: item.website_url || '',
      start_year: normalizeYear(item.start_year),
      end_year: normalizeYear(item.end_year)
    });
    setIsDialogOpen(true);
  };

  const renderList = (list) => {
    if (!list || list.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No postdoctoral fellows found. Add one to get started.
        </div>
      );
    }

    return list.map((item, index) => (
      <div key={item.id} className="p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 pr-16">
            {index + 1}. {item.area_of_research}
          </h4>
          <div className="flex items-center gap-2">
            <Dialog 
              open={form.id === item.id} 
              onOpenChange={() => {
                if (form.id === item.id) {
                  setForm(INITIAL_FORM_STATE);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Postdoctoral Fellow</DialogTitle>
                </DialogHeader>
                {renderForm()}
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
                    This will permanently delete the postdoctoral fellow record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          {item.fellow && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-500" />
              <span>Fellow: {item.fellow}</span>
            </div>
          )}

          {item.institute && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-500" />
              <span>{item.institute}</span>
            </div>
          )}

          {item.department && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>{item.department}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          {item.start_year && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Started: {item.start_year}</span>
            </div>
          )}

          {item.end_year && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Completed: {item.end_year}</span>
            </div>
          )}

          {item.funding_agency && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>Funded by: {item.funding_agency}</span>
            </div>
          )}

          {item.website_url && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4 text-gray-500" />
              <a 
                href={item.website_url} 
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

  const renderForm = () => {
    return (
      <form onSubmit={handleAddOrEdit} className="space-y-4 bg-white beautiful-form">
        <div>
          <Label>Area of Research</Label>
          <Input 
            name="area_of_research"
            value={form.area_of_research}
            onChange={handleInputChange}
            placeholder="Area of Research"
            required
          />
        </div>

        <div>
          <Label>Fellow Name</Label>
          <Input 
            name="fellow"
            value={form.fellow}
            onChange={handleInputChange}
            placeholder="Fellow Name"
            required
          />
        </div>

        <div>
          <Label>PhD Awarding Institute</Label>
          <Input 
            name="institute"
            value={form.institute}
            onChange={handleInputChange}
            placeholder="Institute"
            required
          />
        </div>

        <div>
          <Label>Department</Label>
          <Input 
            name="department"
            value={form.department}
            onChange={handleInputChange}
            placeholder="Department"
          />
        </div>

        <div>
          <Label>Funding Agency</Label>
          <Input 
            name="funding_agency"
            value={form.funding_agency}
            onChange={handleInputChange}
            placeholder="Funding Agency (if applicable)"
          />
        </div>

        <div>
          <Label>Website URL</Label>
          <Input 
            name="website_url"
            value={form.website_url}
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
              value={form.start_year}
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
              value={form.end_year}
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
          {isLoading ? 'Processing...' : (form.id ? 'Update PostDoc' : 'Add PostDoc')}
        </Button>
      </form>
    );
  };

  // Development fallback data if API errors and in development mode
  if (error && process.env.NODE_ENV === 'development') {
    const fallbackData = [
      {
        id: 1,
        area_of_research: "Quantum Algorithms for Optimization",
        fellow: "Dr. Alice Johnson",
        institute: "MIT",
        department: "Physics",
        funding_agency: "National Science Foundation",
        website_url: "https://example.com/postdoc1",
        start_year: "2021",
        end_year: "2023"
      },
      {
        id: 2,
        area_of_research: "Synthetic Biology for Therapeutics",
        fellow: "Dr. Bob Lee",
        institute: "Stanford University",
        department: "Bioengineering",
        funding_agency: "NIH",
        website_url: "https://example.com/postdoc2",
        start_year: "2022",
        end_year: ""
      }
    ];

    if (fallbackData.length > 0) {
      return (
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-gray-500" />
              <CardTitle>Postdoctoral Fellows</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                Using fallback data (API Error)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderList(fallbackData)}
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
            <CardTitle>Postdoctoral Fellows</CardTitle>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setForm(INITIAL_FORM_STATE);
          }}>
            <DialogTrigger asChild>
              <Button 
                type="button"
                className="flex items-center gap-2"
                onClick={() => {
                  setForm(INITIAL_FORM_STATE);
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle className="w-4 h-4" />
                Add PostDoc
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>
                  {form.id ? 'Edit Postdoctoral Fellow' : 'Add New Postdoctoral Fellow'}
                </DialogTitle>
              </DialogHeader>
              {renderForm()}
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading postdoctoral fellows...</div>
          ) : error && postdocs.length === 0 ? (
            <div className="text-center py-4 text-red-500">
              Error: {error}. Please try again.
            </div>
          ) : (
            renderList(postdocs)
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDoctoralFellow;
