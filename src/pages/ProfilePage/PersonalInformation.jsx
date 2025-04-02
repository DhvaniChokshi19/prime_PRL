import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, Mail, Globe, MapPin, Award, Briefcase, 
  GraduationCap, Edit, SquareUser, Trash2, PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';  
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
import axiosInstance, { API_BASE_URL } from '../../api/axios';

const PersonalInformation = ({ profileData, onProfileUpdate}) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [qualificationToDelete, setQualificationToDelete] = useState(null);
  const [deleteQualificationAlertOpen, setDeleteQualificationAlertOpen] = useState(false);
const [awardToDelete, setAwardToDelete] = useState(null);
const [deleteAwardAlertOpen, setDeleteAwardAlertOpen] = useState(false);

  // Extract data from profileData prop
  const profile = profileData?.profile || {};
  const personalInfo = profileData?.["personal_information: "]?.[0] || {};
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
    about_me:personalInfo.about_me ||'',
    email: profile.email || '',
    website: profile.website || '',
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
 // Update personal form state when profileData changes
  useEffect(() => {
    console.log("profileData:", profileData);
  console.log("personalInfo:", personalInfo);
    if (profileData) {
      setPersonalForm({
        name: profile.name || '',
        gender: personalInfo.gender || '',
        designation: profile.designation || '',
        department: profile.department || '',
        expertise: profile.expertise || '',
        about_me: personalInfo.about_me || '',
        email: profile.email || '',
        website: profile.website || '',
        address: personalInfo.address || ''
      });
  }
  }, [profileData]);
 
 
 const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    throw new Error('No authentication token found Please Login again');
  };
  const handlePersonalFormChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleProfessionalFormChange = (e) => {
    const { name, value } = e.target;
    setProfessionalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
   const handleQualificationFormChange = (e) => {
    const { name, value } = e.target;
    setQualificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleHonorsFormChange = (e) => {
  const { name, value } = e.target;
  setHonorsForm(prev => ({
    ...prev,
    [name]: value
  }));
};
  // Handle gender select change
  const handleGenderChange = (value) => {
    setPersonalForm(prev => ({
      ...prev,
      gender: value
    }));
  };

  // Handle personal form submission
  const handlePersonalFormSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare profile data
      const profileData = {
        name: personalForm.name,
        designation: personalForm.designation,
        department: personalForm.department,
        expertise: personalForm.expertise,
        website: personalForm.website,
      };
  
    // personal information data
  const personalInfoData = {
        gender: personalForm.gender,
        address: personalForm.address,
        about_me: personalForm.about_me,
      };
      const authToken = getAuthToken();
      // Update personal information
    await axiosInstance.put('api/profile/personal-information/edit', personalInfoData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      toast({
        title: "Success",
        description: "Personal information updated successfully",
        variant: "success"
      });
      
      await axiosInstance.put('api/profile/edit', profileData, {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});
     // Close edit mode
      setEditMode(null);
    
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };      
// Handle professional experience form submission (add/edit)
  const handleProfessionalFormSubmit = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (professionalForm.id) {
        // Edit existing experience
        await axiosInstance.put('api/profile/professional-experience/edit', professionalForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        toast({
          title: "Success",
          description: "Professional experience updated successfully",
          variant: "success"
        });
      } else {
        // Add new experience
        await axiosInstance.put('api/profile/professional-experience/add', professionalForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        toast({
          title: "Success",
          description: "Professional experience added successfully",
          variant: "success"
        });
      }      
      // Close edit mode
      setEditMode(null);
      // Reset form
      setProfessionalForm({
        id: null,
        position: '',
        organization: '',
        start_year: '',
        end_year: ''
      });
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error handling professional experience:", error);
      toast({
        title: "Error",
        description: "Failed to save professional experience",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
// Handle qualification form submission (add/edit)
  const handleQualificationFormSubmit = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (qualificationForm.id) {
        // Edit existing qualification
        await axiosInstance.put('api/profile/qualifications/edit', qualificationForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        toast({
          title: "Success",
          description: "Qualification updated successfully",
          variant: "success"
        });
      } else {
        // Add new qualification
        await axiosInstance.put('api/profile/qualifications/add', qualificationForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        toast({
          title: "Success",
          description: "Qualification added successfully",
          variant: "success"
        });
      }      
      // Close edit mode
      setEditMode(null);
      // Reset form
      setQualificationForm({
        id: null,
        qualification: '',
        authority: '',
        year: ''
      });
      
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error handling qualification:", error);
      toast({
        title: "Error",
        description: "Failed to save qualification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
const handleHonorsFormSubmit = async () => {
  try {
    setLoading(true);
    const authToken = getAuthToken();
    
    if (honorsForm.id) {
      // Edit existing award
      await axiosInstance.put('api/profile/honors-awards/edit', honorsForm, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      toast({
        title: "Success",
        description: "Award updated successfully",
        variant: "success"
      });
    } else {
      // Add new award
      await axiosInstance.put('api/profile/honors-awards/add', honorsForm, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      toast({
        title: "Success",
        description: "Award added successfully",
        variant: "success"
      });
    }
    
    // Close edit mode
    setEditMode(null);
    // Reset form
    setHonorsForm({
      id: null,
      year: '',
      award_name: '',
      awarding_authority: ''
    });
    
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  } catch (error) {
    console.error("Error handling award:", error);
    toast({
      title: "Error",
      description: "Failed to save award",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};
// Handle professional experience deletion
  const handleDeleteExperience = async () => {
    if (!experienceToDelete) return;
    console.log("Full experienceToDelete object:", experienceToDelete);
    const idToDelete = experienceToDelete.id;
    try {
      setLoading(true);
      const authToken = getAuthToken();
     
      await axiosInstance.delete(`api/profile/professional-experience/delete/${idToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      data: { id: idToDelete },

      });
      
      toast({
        title: "Success",
        description: "Professional experience deleted successfully",
        variant: "success"
      });
      
      // Close delete alert
      setDeleteAlertOpen(false);
      setExperienceToDelete(null);
      
      // Refresh profile data
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error deleting professional experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete professional experience",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
// Handle qualification deletion
  const handleDeleteQualification = async () => {
    if (!qualificationToDelete) return;
   
    const idToDelete = qualificationToDelete.id;
    
    try {
      setLoading(true);
      const authToken = getAuthToken();
     
      await axiosInstance.delete(`api/profile/qualifications/delete/${idToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: { id: idToDelete },
      });
      
      toast({
        title: "Success",
        description: "Qualification deleted successfully",
        variant: "success"
      });
      
      // Close delete alert
      setDeleteQualificationAlertOpen(false);
      setQualificationToDelete(null);
      
      // Refresh profile data
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error deleting qualification:", error);
      toast({
        title: "Error",
        description: "Failed to delete qualification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
const handleDeleteAward = async () => {
  if (!awardToDelete) return;
  const idToDelete = awardToDelete.id;
  
  try {
    setLoading(true);
    const authToken = getAuthToken();
    
    await axiosInstance.delete(`api/profile/honors-awards/delete/${idToDelete}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    toast({
      title: "Success",
      description: "Award deleted successfully",
      variant: "success"
    });
    
    // Close delete alert
    setDeleteAwardAlertOpen(false);
    setAwardToDelete(null);
    
    // Refresh profile data
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  } catch (error) {
    console.error("Error deleting award:", error);
    toast({
      title: "Error",
      description: "Failed to delete award",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

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
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {professionalExperiences.map((exp, index) => (
                <div key={exp.id || index} className="flex justify-between items-center">
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
                       console.log("Editing experience:", exp); 
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
                    <Button 
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                      console.log("Setting experience to delete:", exp);
                        setExperienceToDelete(exp);
                        setDeleteAlertOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualification Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-gray-500" />
                <h3 className="text-xl font-semibold">Qualification</h3>
              </div>
              <Button
                onClick={() => {
                  setQualificationForm({
                    id: null,
                    qualification: '',
                    authority: '',
                    year: ''
                  });
                  setEditMode('qualification');
                }} >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {qualifications.map((qual, index) => (
                <div key={qual.id||index} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{qual.qualification}</h4>
                    <p className="text-gray-600">{qual.authority}</p>
                    <p className="text-sm text-gray-500">{qual.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button  
                      size="icon"   
                       onClick={() => {
                        console.log("Editing qualification:", qual);
                        setQualificationForm({
                          id: qual.id,
                          qualification: qual.qualification,
                          authority: qual.authority,
                          year: qual.year
                        });
                        setEditMode('qualification');
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        console.log("Setting qualification to delete:", qual);
                        setQualificationToDelete(qual);
                        setDeleteQualificationAlertOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
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
               onClick={() => {
        setHonorsForm({
          id: null,
          year: '',
          award_name: '',
          awarding_authority: ''
        });
        setEditMode('honors');
      }}               
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {honorsAwards.map((award, index) => (
              <div key={award.id||index} className="flex justify-between items-center">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded">{award.year}</div>
                  <div>
                    <h4 className="font-semibold">{award.award_name}</h4>
                    <p className="text-sm text-gray-500">{award.awarding_authority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                     onClick={() => {
              console.log("Editing award:", award);
              setHonorsForm({
                id: award.id,
                year: award.year,
                award_name: award.award_name,
                awarding_authority: award.awarding_authority
              });
              setEditMode('honors');
            }}                  
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                 <Button 
            size="icon"
            variant="destructive"
            onClick={() => {
              console.log("Setting award to delete:", award);
              setAwardToDelete(award);
              setDeleteAwardAlertOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
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
            <a href={`mailto:${profile.email || "nithyananad.prabhu@prl.com"}`}className="text-red-600 hover:underline" >
              {profile.email || "nithyananad.prabhu@prl.com"}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Website</span>
            </div>
            <a href={profile.website || "https://prl.edu/faculty/nithyananad"} className="text-red-600 hover:underline break-all">
              {profile.website || "https://prl.edu/faculty/nithyananad"}
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
           <Dialog open={editMode === 'personal'} onOpenChange={(open) => !open && setEditMode(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 bg-white" >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={personalForm.name}
                    onChange={handlePersonalFormChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={personalForm.gender} 
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={personalForm.designation}
                    onChange={handlePersonalFormChange}
                    placeholder="Enter your designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={personalForm.department}
                    onChange={handlePersonalFormChange}
                    placeholder="Enter your department"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  value={personalForm.expertise}
                  onChange={handlePersonalFormChange}
                  placeholder="Enter your areas of expertise"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about_me">About Me</Label>
                <Textarea
                  id="about_me"
                  name="about_me"
                  value={personalForm.about_me}
                  onChange={handlePersonalFormChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  name="website"
                  value={personalForm.website}
                  onChange={handlePersonalFormChange}
                  placeholder="Enter your website URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={personalForm.address}
                  onChange={handlePersonalFormChange}
                  placeholder="Enter your address"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-white text-red-500" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
              className="bg-blue-500 text-white"
                onClick={handlePersonalFormSubmit} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Professional Experience Edit Dialog */}
        <Dialog open={editMode === 'professional'} onOpenChange={(open) => !open && setEditMode(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {professionalForm.id ? "Edit Professional Experience" : "Add Professional Experience"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 bg-white">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={professionalForm.position}
                  onChange={handleProfessionalFormChange}
                  placeholder="Enter your position/title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={professionalForm.organization}
                  onChange={handleProfessionalFormChange}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_year">Start Year</Label>
                  <Input
                    id="start_year"
                    name="start_year"
                    value={professionalForm.start_year}
                    onChange={handleProfessionalFormChange}
                    placeholder="YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_year">End Year (or leave blank for current)</Label>
                  <Input
                    id="end_year"
                    name="end_year"
                    value={professionalForm.end_year}
                    onChange={handleProfessionalFormChange}
                    placeholder="YYYY or blank for current"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-white text-red-500" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-blue-500 text-white"
                onClick={handleProfessionalFormSubmit} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

<Dialog open={editMode === 'honors'} onOpenChange={(open) => !open && setEditMode(null)}>
  <DialogContent className="sm:max-w-[550px]">
    <DialogHeader>
      <DialogTitle>
        {honorsForm.id ? "Edit Award" : "Add Award"}
      </DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4 bg-white">
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          name="year"
          value={honorsForm.year}
          onChange={handleHonorsFormChange}
          placeholder="YYYY"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="award_name">Award Name</Label>
        <Input
          id="award_name"
          name="award_name"
          value={honorsForm.award_name}
          onChange={handleHonorsFormChange}
          placeholder="Enter award name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="awarding_authority">Awarding Authority</Label>
        <Input
          id="awarding_authority"
          name="awarding_authority"
          value={honorsForm.awarding_authority}
          onChange={handleHonorsFormChange}
          placeholder="Enter awarding authority"
        />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button className="bg-white text-red-500" variant="outline">Cancel</Button>
      </DialogClose>
      <Button 
        className="bg-blue-500 text-white"
        onClick={handleHonorsFormSubmit} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        {/* Delete Professional Experience Alert Dialog */}
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the professional experience record for
                {experienceToDelete && (
                  <span className="font-medium"> {experienceToDelete.position} at {experienceToDelete.organization}</span>
                )}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteExperience}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Qualification Edit Dialog */}
        <Dialog open={editMode === 'qualification'} onOpenChange={(open) => !open && setEditMode(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {qualificationForm.id ? "Edit Qualification" : "Add Qualification"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 bg-white">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={qualificationForm.qualification}
                  onChange={handleQualificationFormChange}
                  placeholder="Enter your qualification"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authority">Authority/Institution</Label>
                <Input
                  id="authority"
                  name="authority"
                  value={qualificationForm.authority}
                  onChange={handleQualificationFormChange}
                  placeholder="Enter awarding institution"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  value={qualificationForm.year}
                  onChange={handleQualificationFormChange}
                  placeholder="YYYY"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-white text-red-500" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-blue-500 text-white"
                onClick={handleQualificationFormSubmit} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
         {/* Delete Qualification Alert Dialog */}
        <AlertDialog open={deleteQualificationAlertOpen} onOpenChange={setDeleteQualificationAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the Qualification record for
                {qualificationToDelete && (
                  <span className="font-medium"> "{qualificationToDelete.qualification}" at {qualificationToDelete.authority}</span>
                )}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteQualification}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> 
  
  <AlertDialog open={deleteAwardAlertOpen} onOpenChange={setDeleteAwardAlertOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete the award record
        {awardToDelete && (
          <span className="font-medium"> "{awardToDelete.award_name}" from {awardToDelete.awarding_authority}</span>
        )}. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteAward}
        className="bg-red-500 text-white hover:bg-red-600"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>               
      </CardContent>
    </Card>
    
  );
};

export default PersonalInformation;
