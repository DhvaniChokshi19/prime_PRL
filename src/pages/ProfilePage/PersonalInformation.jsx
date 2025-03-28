import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, Mail, Globe, MapPin, Award, Briefcase, 
  GraduationCap, Edit, SquareUser, Trash2, PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogFooter,DialogClose } from '@/components/ui/dialog';
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
import axios from 'axios';

const PersonalInformation = ({ profileData, onProfileUpdate}) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);
 const [selectedExperience, setSelectedExperience] = useState();

  // Extract data from profileData prop
  const profile = profileData?.profile || {};
  const personalInfo = profileData?.personal_information?.[0] || {};
  const professionalExperiences = profileData?.professional_experiences || [];
  const qualifications = profileData?.qualifications || [];
  const honorsAwards = profileData?.honors_and_awards || [];

  // Initial form states
  const [personalForm, setPersonalForm] = useState({
    
    name: profile.name || '',
    gender: personalInfo.gender || '',
    designation: profile.designation || '',
    department: profile.department || '',
    expertise: profile.expertise || '',
    aboutme:personalInfo.about_me ||'',
    email: personalInfo.email || '',
    website_url: personalInfo.website_url || '',
    address: personalInfo.address || ''
  });

  const [professionalForm, setProfessionalForm] = useState({
    id: null,
    position: '',
    organization: '',
    start_year: '',
    end_year: ''
  });

  const [qualificationForm, setQualificationForm] = useState({
    id: null,
    qualification: '',
    authority: '',
    year: ''
  });

  const [honorsForm, setHonorsForm] = useState({
    id: null,
    year: '',
    award_name: '',
    awarding_authority: ''
  });
 
  const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    throw new Error('No authentication token found in cookies');
  };
   const handleEditProfessionalExperience = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = getAuthToken();
      const response = await axios.put(
        '/api/profile/professional-experience/edit', 
        {
          id: professionalForm.id,
          position: professionalForm.position,
          organization: professionalForm.organization,
          start_year: professionalForm.start_year,
          end_year: professionalForm.end_year
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      const updatedExperiences = professionalExperiences.map(exp => 
        exp.id === professionalForm.id 
          ? { ...exp, ...professionalForm } 
          : exp
      );
      setProfessionalExperiences(updatedExperiences);

      toast({
        title: "Success",
        description: "Professional experience updated successfully."
      });

      // Close the dialog
      setEditMode(null);
      setSelectedExperience(null);
    } catch (error) {
      console.error('Error updating professional experience:', error);
      toast({
        title: "Error",
        description: "Failed to update professional experience.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Professional Experience
  const handleDeleteProfessionalExperience = async () => {
    if (!selectedExperience) return;

    try {
      const authToken = getAuthToken();
      const response = await axios.delete(
        '/api/profile/professional-experience/delete', 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          data: { id: selectedExperience.id }
        }
      );

      // Update local state
      const updatedExperiences = professionalExperiences.filter(
        exp => exp.id !== selectedExperience.id
      );
      setProfessionalExperiences(updatedExperiences);

      toast({
        title: "Success",
        description: "Professional experience deleted successfully."
      });

      // Close the dialog
      setEditMode(null);
      setSelectedExperience(null);
    } catch (error) {
      console.error('Error deleting professional experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete professional experience.",
        variant: "destructive"
      });
    }
  };

  // Professional Experience Edit Modal
  const ProfessionalExperienceEditModal = () => (
    <Dialog open={editMode === 'professional'} onOpenChange={() => setEditMode(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {professionalForm.id ? 'Edit Professional Experience' : 'Add Professional Experience'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleEditProfessionalExperience} className="space-y-4">
          <div>
            <Label>Position</Label>
            <Input 
              value={professionalForm.position}
              onChange={(e) => setProfessionalForm({
                ...professionalForm, 
                position: e.target.value
              })}
              required 
            />
          </div>
          
          <div>
            <Label>Organization</Label>
            <Input 
              value={professionalForm.organization}
              onChange={(e) => setProfessionalForm({
                ...professionalForm, 
                organization: e.target.value
              })}
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Year</Label>
              <Input 
                type="text" 
                value={professionalForm.start_year}
                onChange={(e) => setProfessionalForm({
                  ...professionalForm, 
                  start_year: e.target.value
                })}
                required 
              />
            </div>
            
            <div>
              <Label>End Year</Label>
              <Input 
                type="text" 
                value={professionalForm.end_year}
                onChange={(e) => setProfessionalForm({
                  ...professionalForm, 
                  end_year: e.target.value
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            {professionalForm.id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this professional experience.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProfessionalExperience}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
  return (
    
    <Card className="w-full border-none bg-white">
      <CardContent className="p-6">
       
        {/* Basic Information Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <SquareUser className="w-6 h-6 text-gray-500" />
            <h3 className="text-xl font-semibold">Personal Information</h3>
          </div>
          <Button 
            onClick={() => setEditMode('personal')}
            className="flex items-center gap-2"
          >
            Edit
            <Edit size={20} />
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{profile.name || "Dr. Nithyananad Prabhu"}</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <p className="text-lg text-gray-600">{personalInfo.gender || "Male"}</p>
            <p className="text-lg text-red-600">{profile.designation || "Research Scientist"}</p>
            <p className="text-lg text-gray-600">{profile.department || "Electrical Engineering"}</p>
          </div>
          <p className="text-gray-600 mt-2">{profile.expertise || "Nanomaterials, Electrochemistry, Energy Storage Applications"}</p>
          <div>
            <p className = "text-base text-gray-600">{personalInfo.about_me || "About Me"}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Experience Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-gray-500" />
                <h3 className="text-xl font-semibold">Professional Experience</h3>
              </div>
              <Button 
                size="icon" 
                onClick={() => {
                setProfessionalForm({ 
                  id: null, 
                  position: '', 
                  organization: '', 
                  start_year: '', 
                  end_year: '' 
                });
                setEditMode('professional');
              }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {professionalExperiences.map((exp, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-gray-600">{exp.organization}</p>
                    <p className="text-sm text-gray-500">
                      {exp.start_year}-{exp.end_year || "Current"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                       onClick={() => {
                      setProfessionalForm({
                        id: exp.id,
                        position: exp.position,
                        organization: exp.organization,
                        start_year: exp.start_year,
                        end_year: exp.end_year
                      });
                      setSelectedExperience(exp);
                      setEditMode('professional');
                    }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
<ProfessionalExperienceEditModal />
          {/* Qualification Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-gray-500" />
                <h3 className="text-xl font-semibold">Qualification</h3>
              </div>
              <Button
                size="icon" 
                             >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {qualifications.map((qual, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{qual.qualification}</h4>
                    <p className="text-gray-600">{qual.authority}</p>
                    <p className="text-sm text-gray-500">{qual.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button  
                      size="icon" 
                      
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="space-y-4 my-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-semibold">Awards and Recognition</h3>
            </div>
            <Button 
              size="icon" 
              
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {honorsAwards.map((award, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded">{award.year}</div>
                  <div>
                    <h4 className="font-semibold">{award.award_name}</h4>
                    <p className="text-sm text-gray-500">{award.awarding_authority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                   
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Email</span>
            </div>
            <a href={`mailto:nithyananad.prabhu@prl.com`} className="text-red-600 hover:underline">
              {"nithyananad.prabhu@prl.com"}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Website</span>
            </div>
            <a href={personalInfo.website_url || "https://prl.edu/faculty/nithyananad"} className="text-red-600 hover:underline break-all">
              {personalInfo.website_url || "https://prl.edu/faculty/nithyananad"}
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Address</span>
          </div>
          <div className="text-gray-600">
            <p>{personalInfo.address || "Ahmedabad, Gujarat, India"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
  );
};

export default PersonalInformation;
