import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Calendar, 
  Tag, 
  FileText, 
  Users, 
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Initial form state
const INITIAL_FORM_STATE = {
  id: null,
  patent_name: '',
  patent_number: '',
  authors: '',
  subject: '',
  status: 'Filed',
  date_filed: '',
  date_published: '',
  country: ''
};

const Patents = ({ profileId, patents: initialPatents, onDataUpdate }) => {
  // State for patents
  const [patents, setPatents] = useState(initialPatents || []);
  
  // State for patent form
  const [patentForm, setPatentForm] = useState(INITIAL_FORM_STATE);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(!initialPatents);
  
  // Error state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialPatents) {
      setPatents(initialPatents);
      setIsLoading(false);
      return;
    }

    fetchPatents();
  }, [profileId, initialPatents, onDataUpdate]);

  const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    return null;
  };

  const fetchPatents = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await axios.get('api/profile/patents/view', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });
      
      setPatents(response.data);
      if (onDataUpdate) onDataUpdate(response.data);
      setError(null);
    } catch (err) {
      console.error('Patent fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load patents');
      toast({
        title: "Error",
        description: "Failed to fetch patents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setPatentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { patent_name, authors, date_filed } = patentForm;
    
    // Basic validation
    if (!patent_name || !authors || !date_filed) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAddPatent = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const endpoint = patentForm.id 
        ? '/api/profile/patents/edit' 
        : '/api/profile/patents/add';

      const payload = patentForm.id 
        ? { ...patentForm } 
        : patentForm;

      const response = await axios.put(endpoint, payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success",
        description: patentForm.id 
          ? 'Patent Updated Successfully!' 
          : 'Patent Added Successfully!',
        variant: "default"
      });

      fetchPatents();
      setPatentForm(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Error processing patent:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error processing patent',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatent = async (patentId) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      await axios.delete(`/api/profile/patents/delete/${patentId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success",
        description: 'Patent Deleted Successfully!',
        variant: "default"
      });

      fetchPatents();
    } catch (error) {
      console.error('Error deleting patent:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error deleting patent',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatent = (patent) => {
    setPatentForm({
      id: patent.id,
      patent_name: patent.patent_name || '',
      patent_number: patent.patent_number || '',
      authors: patent.authors || '',
      subject: patent.subject || '',
      status: patent.status || 'Filed',
      date_filed: patent.date_filed || '',
      date_published: patent.date_published || '',
      country: patent.country || ''
    });
  };

  // Status badge color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'Filed': 'bg-yellow-100 text-yellow-800',
      'Published': 'bg-blue-100 text-blue-800',
      'Granted': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // For development - comment out in production
  if (error && process.env.NODE_ENV === 'development') {
    // Use fallback data in development when API fails
    const fallbackData = [
      {
        id: 1,
        patent_name: "An Improved Solid-State Polymer Composition, a Process for its Preparation and an Improved Dye-sensitized Solar Cell",
        patent_number: "266300",
        authors: "John Doe, Jane Smith",
        subject: "Chemical Sciences",
        status: "Published",
        date_filed: "2007-02-03",
        date_published: "2015-07-13",
        country: "Indian"
      },
      {
        id: 2,
        patent_name: "Airbag Gas Generant Composition Comprising Primary fuel, oxidizer and co-oxidiser",
        patent_number: "IN201741038676-A",
        authors: "Robert Johnson, Sarah Williams",
        subject: "Engineering and Technology",
        status: "Pending",
        date_filed: "2018-06-05",
        date_published: null,
        country: "Indian"
      }
    ];
    
    if (fallbackData.length > 0) {
      return (
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <ScrollText className="w-6 h-6 text-gray-500" />
              <CardTitle>Patents</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                Using fallback data (API Error)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderPatentsList(fallbackData)}
          </CardContent>
        </Card>
      );
    }
  }

  const renderPatentsList = (patentsList) => {
    if (patentsList.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No patents found. Add a patent to get started.
        </div>
      );
    }

    return patentsList.map((patent) => (
      <div 
        key={patent.id} 
        className="p-4 rounded-lg shadow-sm mb-4"
      >
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 pr-16">
            {patent.patent_name}
          </h4>
          <div className="flex items-center gap-2">
            <Dialog 
              open={patentForm.id === patent.id} 
              onOpenChange={() => {
                if (patentForm.id === patent.id) {
                  setPatentForm(INITIAL_FORM_STATE);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditPatent(patent)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Patent</DialogTitle>
                </DialogHeader>
                {renderPatentForm()}
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the patent record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeletePatent(patent.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {patent.authors && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{patent.authors}</span>
            </div>
          )}
          
          {patent.patent_number ? (
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Patent No. {patent.patent_number}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Patent No. Pending</span>
            </div>
          )}
          
          {patent.subject && (
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4 text-gray-500" />
              <span>{patent.subject}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {patent.date_filed && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Filed: {new Date(patent.date_filed).toLocaleDateString()}</span>
            </div>
          )}
          
          {patent.date_published && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Published: {new Date(patent.date_published).toLocaleDateString()}</span>
            </div>
          )}
          
          {patent.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
              {patent.status}
            </span>
          )}
          
          {patent.country && (
            <span className="text-sm text-gray-500">
              {patent.country}
            </span>
          )}
        </div>
      </div>
    ));
  };

  const renderPatentForm = () => {
    return (
      <form onSubmit={handleAddPatent} className="space-y-4 bg-white">
        <div>
          <Label>Patent Name</Label>
          <Input 
            name="patent_name"
            value={patentForm.patent_name}
            onChange={handleInputChange}
            placeholder="Patent Name"
            required
          />
        </div>
        <div>
          <Label>Patent Number</Label>
          <Input 
            name="patent_number"
            value={patentForm.patent_number}
            onChange={handleInputChange}
            placeholder="Patent Number (if available)"
          />
        </div>
        <div>
          <Label>Authors</Label>
          <Input 
            name="authors"
            value={patentForm.authors}
            onChange={handleInputChange}
            placeholder="Authors"
            required
          />
        </div>
        <div>
          <Label>Subject</Label>
          <Input 
            name="subject"
            value={patentForm.subject}
            onChange={handleInputChange}
            placeholder="Subject Area"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select 
            name="status" 
            value={patentForm.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Filed">Filed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Granted">Granted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date Filed</Label>
            <Input 
              name="date_filed"
              type="date"
              value={patentForm.date_filed}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Date Published</Label>
            <Input 
              name="date_published"
              type="date"
              value={patentForm.date_published}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Label>Country</Label>
          <Input 
            name="country"
            value={patentForm.country}
            onChange={handleInputChange}
            placeholder="Country"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (patentForm.id ? 'Update Patent' : 'Add Patent')}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <ScrollText className="w-6 h-6 text-gray-500" />
            <CardTitle>Patents</CardTitle>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setPatentForm(INITIAL_FORM_STATE)}
              >
                <PlusCircle className="w-4 h-4" />
                Add Patent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {patentForm.id ? 'Edit Patent' : 'Add New Patent'}
                </DialogTitle>
              </DialogHeader>
              {renderPatentForm()}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading patents...</div>
          ) : error && patents.length === 0 ? (
            <div className="text-center py-4 text-red-500">
              Error: {error}. Please try again.
            </div>
          ) : (
            renderPatentsList(patents)
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Patents;