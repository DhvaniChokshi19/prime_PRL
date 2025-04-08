import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  CircleCheckBig, 
  Users, 
  IndianRupee, 
  CalendarDays, 
  PlusCircle,
  Edit,
  Trash2,
  Globe,
  Building,
  Briefcase
} from 'lucide-react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
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

// Initial form state with all required fields from the backend
const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  status: '',
  principal_investigator: '',
  co_investigators: '',
  team_members: '',
  institute: '',
  department: '',
  project_url: '',
  funding_agency: '',
  project_amt: '',
  start_year: '',
  end_year: ''
};

const Projects = ({ profileId, projects: initialProjects, onDataUpdate }) => {
  // State for projects
  const [projects, setProjects] = useState(initialProjects || []);
  
  // State for project form
  const [projectForm, setProjectForm] = useState(INITIAL_FORM_STATE);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(!initialProjects);
  
  // Error state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
      setIsLoading(false);
      return;
    }

    fetchProjects();
  }, [profileId, initialProjects, onDataUpdate]);

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
  
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
       const id = profileId || getCurrentProfileIdFromUrl();
    
    if (!id) {
      throw new Error('Profile ID not found');
    }
    const response = await axiosInstance.get(`api/profile/projects/view?id=${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    setProjects(response.data);
    if (onDataUpdate) onDataUpdate(response.data);
    setError(null);
  } catch (err) {
    console.error('Projects fetch error:', err);
    setError(err.response?.data?.message || 'Failed to load projects');
    toast({
      title: "Error",
      description: "Failed to fetch projects",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const { 
      title, 
      status, 
      principal_investigator,
      institute,
      start_year, 
      end_year 
    } = projectForm;
    
    // Basic validation for required fields
    if (!title || !status || !principal_investigator || !institute || !start_year || !end_year) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
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

  // Handle project addition/edit
  const handleAddProject = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add or edit projects",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
      const endpoint = projectForm.id 
        ? 'api/profile/projects/edit' 
        : 'api/profile/projects/add';

      const payload = projectForm.id 
        ? { ...projectForm } 
        : projectForm;

      const response = await axiosInstance.put(endpoint, payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });

      // Show success toast
      toast({
        title: "Success",
        description: projectForm.id 
          ? 'Project Updated Successfully!' 
          : 'Project Added Successfully!',
        variant: "default"
      });
      
      fetchProjects();
      setProjectForm(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Error processing project:', error);
      if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add or edit projects",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add or edit projects",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
      await axiosInstance.delete(`/api/profile/projects/delete/${projectId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        },
        data: { id: projectId }
      });
      
      toast({
        title: "Success",
        description: 'Project Deleted Successfully!',
        variant: "default"
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      console.error('Error processing project:', error);
    toast({
      title: "Error",
      description: error.response?.status === 401 
        ? "Authentication required. Please login."
        : (error.response?.data?.message || 'Error processing project'),
      variant: "destructive"
    });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setProjectForm({
      id: project.id,
      title: project.title || '',
      status: project.status || '',
      principal_investigator: project.principal_investigator || '',
      co_investigators: project.co_investigators || '',
      team_members: project.team_members || '',
      institute: project.institute || '',
      department: project.department || '',
      project_url: project.project_url || '',
      funding_agency: project.funding_agency || '',
      project_amt: project.project_amt || '',
      start_year: project.start_year || '',
      end_year: project.end_year || ''
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Completed': 'bg-blue-100 text-blue-800',
      'Ongoing': 'bg-green-300 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };
const isAuthenticated = () => {
  return !!getAuthToken();
};
  const renderProjectsList = (projectsList) => {
    if (projectsList.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No Projects found.{isAuthenticated() && "Add a Project to get started."}
        </div>
      );
    }
    return projectsList.map((project) => (
      <div 
        key={project.id} 
        className="p-4 rounded-lg shadow-sm mb-4"
      >
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 pr-16">
            {project.title}
          </h4>
          {isAuthenticated() && (
          <div className="flex items-center gap-2">
            <Dialog 
              open={projectForm.id === project.id} 
              onOpenChange={() => {
                if (projectForm.id === project.id) {
                  setProjectForm(INITIAL_FORM_STATE);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditProject(project)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                {renderProjectForm()}
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
                    This will permanently delete the Project record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteProject(project.id)}
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
          {project.principal_investigator && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Principle Investigator: {project.principal_investigator}</span>
            </div>
          )}
          
          {project.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          )}
          
          {project.start_year && project.end_year && (
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>{project.start_year} - {project.end_year}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {project.project_url && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4 text-gray-500" />
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-blue-500"
              >
                {project.project_url}
              </a>
            </div>
          )}
          
          {project.institute && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-500" />
              <span>Institute: {project.institute}</span>
            </div>
          )}
          
          {project.funding_agency && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>Funding Agency: {project.funding_agency}</span>
            </div>
          )}
          
          {project.project_amt && (
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee className="w-4 h-4 text-gray-500" />
              <span> {project.project_amt}</span>
            </div>
          )}
          
          {project.co_investigators && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Co-Investigators: {project.co_investigators}</span>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderProjectForm = () => {
    return (
      <form onSubmit={handleAddProject} className="space-y-6 w-full max-w-4xl bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="title">Title*</Label>
            <Input 
              id="title"
              name="title"
              value={projectForm.title}
              onChange={handleInputChange}
              placeholder="Project Title"
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Project Status*</Label>
            <Input 
              id="status"
              name="status"
              value={projectForm.status}
              onChange={handleInputChange}
              placeholder="e.g. Ongoing, Completed"
              required
            />
          </div>
          <div>
            <Label htmlFor="principal_investigator">Principal Investigator*</Label>
            <Input 
              id="principal_investigator"
              name="principal_investigator"
              value={projectForm.principal_investigator}
              onChange={handleInputChange}
              placeholder="Principal Investigator"
              required
            />
          </div>
          <div>
            <Label htmlFor="co_investigators">Co-Investigators</Label>
            <Input 
              id="co_investigators"
              name="co_investigators"
              value={projectForm.co_investigators}
              onChange={handleInputChange}
              placeholder="Co-Investigators"
            />
          </div>
          <div>
            <Label htmlFor="team_members">Team Members</Label>
            <Input 
              id="team_members"
              name="team_members"
              value={projectForm.team_members}
              onChange={handleInputChange}
              placeholder="Team Members"
            />
          </div>
          <div>
            <Label htmlFor="institute">Institute*</Label>
            <Input 
              id="institute"
              name="institute"
              value={projectForm.institute}
              onChange={handleInputChange}
              placeholder="Institute"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input 
              id="department"
              name="department"
              value={projectForm.department}
              onChange={handleInputChange}
              placeholder="Department"
            />
          </div>
          <div>
            <Label htmlFor="project_url">Project URL</Label>
            <Input 
              id="project_url"
              name="project_url"
              value={projectForm.project_url}
              onChange={handleInputChange}
              placeholder="Project URL"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="funding_agency">Funding Agency</Label>
              <Input 
                id="funding_agency"
                name="funding_agency"
                value={projectForm.funding_agency}
                onChange={handleInputChange}
                placeholder="Funding Agency"
              />
            </div>
            <div>
              <Label htmlFor="project_amt">Project Amount</Label>
              <Input 
                id="project_amt"
                name="project_amt"
                type="number"
                value={projectForm.project_amt}
                onChange={handleInputChange}
                placeholder="Project Amount"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_year">Start Year*</Label>
              <Input 
                id="start_year"
                name="start_year"
                type="number"
                value={projectForm.start_year}
                onChange={handleInputChange}
                placeholder="Start Year"
                required
              />
            </div>
            <div>
              <Label htmlFor="end_year">End Year*</Label>
              <Input 
                id="end_year"
                name="end_year"
                type="number"
                value={projectForm.end_year}
                onChange={handleInputChange}
                placeholder="End Year"
                required
              />
            </div>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full mt-4 bg-yellow-600 hover:bg-green-600 text-white" 
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (projectForm.id ? 'Update Project' : 'Add Project')}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-6 h-6 text-gray-500" />
            <CardTitle>Projects</CardTitle>
          </div>
           {isAuthenticated() && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setProjectForm(INITIAL_FORM_STATE)}
              >
                <PlusCircle className="w-4 h-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {projectForm.id ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
              </DialogHeader>
              {renderProjectForm()}
            </DialogContent>
          </Dialog>
           )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading Projects...</div>
          ) : error && projects.length === 0 ? (
            <div className="text-center py-4 text-red-500">
              Error: {error}. Please try again.
            </div>
          ) : (
            renderProjectsList(projects)
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;