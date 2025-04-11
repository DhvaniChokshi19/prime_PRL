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
  const [showLoginError, setShowLoginError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profile = profileData?.profile || {};
  const personalInfo = profileData?.["personal_information: "]?.[0] || {};
  const professionalExperiences = profileData?.professional_experiences || [];
  const qualifications = profileData?.qualifications || [];
  const honorsAwards = profileData?.honors_and_awards || [];
const [localProfileData, setLocalProfileData] = useState({
    profile: {},
    personal_information: [],
    professional_experiences: [],
    qualifications: [],
    honors_and_awards: []
  });
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
    scopus_id: profile.scopus_id || '',
    orc_id: profile.orc_id || '',
    google_scholar_id: profile.google_scholar_id || '',
    publons_id: profile.publons_id || '',
    address: personalInfo.address || '',
    state:profile.state ||'',
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
 useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = getAuthToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  useEffect(() => {
    if (profileData) {
      const formattedData = {
        ...profileData,
        personal_information: profileData["personal_information: "] || []
      };
      
      setLocalProfileData(formattedData);

      setPersonalForm({
        name: profile.name || '',
        gender: personalInfo.gender || '',
        designation: profile.designation || '',
        department: profile.department || '',
        expertise: profile.expertise || '',
        about_me: personalInfo.about_me || '',
        email: profile.email || '',
        website: profile.website || '',
        scopus_id: profile.scopus_id || '',
        orc_id: profile.orc_id || '',
        google_scholar_id: profile.google_scholar_id || '',
        publons_id: profile.publons_id || '',
        state: profile.state ||'',
        address: personalInfo.address || '',
        
      });
  }
  }, [profileData]);
 const getCurrentProfileIdFromUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    const idIndex = pathSegments.findIndex(segment => segment === 'profile') + 1;
    
    if (idIndex > 0 && idIndex < pathSegments.length) {
      return pathSegments[idIndex];
    }
    
    return null;
  };
 const fetchUpdatedData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
          const id = profile.id || getCurrentProfileIdFromUrl();    
    if (!id) {
      throw new Error('Profile ID not found');
    }
      const profileDataResponse = await axiosInstance.get(`api/profile/view?id=${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const personalInfoResponse = await axiosInstance.get(`api/profile/personal-information/view?id=${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
     
      const experiencesResponse = await axiosInstance.get(`api/profile/professional-experience/view?id=${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const qualificationsResponse = await axiosInstance.get(`api/profile/qualifications/view?id=${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const awardsResponse = await axiosInstance.get(`api/profile/honors-awards/view?id=${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setLocalProfileData(prev => ({
        ...prev,
        profile: profileDataResponse.data?.profile || {},
        personal_information: [profileDataResponse.data?.personal_information || {}],
        professional_experiences: experiencesResponse.data?.professional_experiences || [],
        qualifications: qualificationsResponse.data?.qualifications || [],
        honors_and_awards: awardsResponse.data?.honors_and_awards || []
      }));
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      
    } catch (error) {
      console.error("Error fetching updated profile data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
 
 const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    throw new Error('No authentication token found Please Login again');
  };
   const checkAuthentication = () => {
    if (!isAuthenticated) {
      setShowLoginError(true);
      alert("Please login to perform this action");
      toast({
        title: "Authentication Error",
        description: "Please login to perform this action",
        variant: "destructive"
      });
      return false;
    }
    return true;
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

  const handleGenderChange = (value) => {
    setPersonalForm(prev => ({
      ...prev,
      gender: value
    }));
  };

 
  const handlePersonalFormSubmit = async () => {
    if (!checkAuthentication()) return;
    try {
      setLoading(true);
       const originalProfile = localProfileData.profile || {};
    const originalPersonalInfo = localProfileData.personal_information?.[0] || {};
      // Prepare profile data
     const profileData = {
      name: personalForm.name || originalProfile.name,
      designation: personalForm.designation || originalProfile.designation,
      department: personalForm.department || originalProfile.department,
      expertise: personalForm.expertise || originalProfile.expertise,
      website: personalForm.website || originalProfile.website,
      state: personalForm.state || originalProfile.state,
      scopus_id: personalForm.scopus_id || originalProfile.scopus_id,
      orc_id: personalForm.orc_id || originalProfile.orc_id,
      google_scholar_id: personalForm.google_scholar_id || originalProfile.google_scholar_id,
      publons_id: personalForm.publons_id || originalProfile.publons_id,
    };
    // personal information data
  const personalInfoData = {
      gender: personalForm.gender || originalPersonalInfo.gender,
      address: personalForm.address || originalPersonalInfo.address,
      about_me: personalForm.about_me || originalPersonalInfo.about_me,
    };
      const authToken = getAuthToken();
     
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
setLocalProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData
        },
        personal_information: [{
          ...prev.personal_information?.[0] || {},
          ...personalInfoData
        }]
      }));
     // Close edit mode
      setEditMode(null);
    
     await fetchUpdatedData();
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
  const handleProfessionalFormSubmit = async () => {
     if (!checkAuthentication()) return;
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (professionalForm.id) {
        
        await axiosInstance.put('api/profile/professional-experience/edit', professionalForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setLocalProfileData(prev => ({
          ...prev,
          professional_experiences: prev.professional_experiences.map(exp => 
            exp.id === professionalForm.id ? professionalForm : exp
          )
        }));
        toast({
          title: "Success",
          description: "Professional experience updated successfully",
          variant: "success"
        });
      } else {
       
        const response = await axiosInstance.put('api/profile/professional-experience/add', professionalForm, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const newExperience = response.data?.experience || {
          ...professionalForm,
          id: Date.now() // Fallback ID if API doesn't return it
        };
        
        // Update local state
        setLocalProfileData(prev => ({
          ...prev,
          professional_experiences: [...prev.professional_experiences, newExperience]
        }));
       
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
       await fetchUpdatedData();
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
     if (!checkAuthentication()) return;
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
        setLocalProfileData(prev => ({
          ...prev,
          qualifications: prev.qualifications.map(qual => 
            qual.id === qualificationForm.id ? qualificationForm : qual
          )
        }));
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
        const newQualification = response.data?.qualification || {
          ...qualificationForm,
          id: Date.now() 
        };
        
        // Update local state
        setLocalProfileData(prev => ({
          ...prev,
          qualifications: [...prev.qualifications, newQualification]
        }));
        
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
       await fetchUpdatedData();
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
   if (!checkAuthentication()) return;
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
      setLocalProfileData(prev => ({
          ...prev,
          honors_and_awards: prev.honors_and_awards.map(award => 
            award.id === honorsForm.id ? honorsForm : award
          )
        }));
        
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
        const newAward = response.data?.award || {
          ...honorsForm,
          id: Date.now() // Fallback ID if API doesn't return it
        };
        
        // Update local state
        setLocalProfileData(prev => ({
          ...prev,
          honors_and_awards: [...prev.honors_and_awards, newAward]
        }));
        
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
     await fetchUpdatedData();
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
     if (!checkAuthentication()) return;
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
      setLocalProfileData(prev => ({
        ...prev,
        professional_experiences: prev.professional_experiences.filter(exp => exp.id !== idToDelete)
      }));
      toast({
        title: "Success",
        description: "Professional experience deleted successfully",
        variant: "success"
      });
      
      // Close delete alert
      setDeleteAlertOpen(false);
      setExperienceToDelete(null);
      await fetchUpdatedData();
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
     if (!checkAuthentication()) return;
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
       setLocalProfileData(prev => ({
        ...prev,
        qualifications: prev.qualifications.filter(qual => qual.id !== idToDelete)
      }));
      toast({
        title: "Success",
        description: "Qualification deleted successfully",
        variant: "success"
      });
      
      // Close delete alert
      setDeleteQualificationAlertOpen(false);
      setQualificationToDelete(null);
      
      await fetchUpdatedData();
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
  if (!checkAuthentication()) return;
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
     setLocalProfileData(prev => ({
        ...prev,
        honors_and_awards: prev.honors_and_awards.filter(award => award.id !== idToDelete)
      }));
    toast({
      title: "Success",
      description: "Award deleted successfully",
      variant: "success"
    });
    
    // Close delete alert
    setDeleteAwardAlertOpen(false);
    setAwardToDelete(null);
   await fetchUpdatedData();
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
const LoginErrorDialog = () => (
    <Dialog open={showLoginError} onOpenChange={setShowLoginError}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Please log in to perform this action.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return (
    <Card className="w-full border-none bg-white">
      <CardContent className="p-6">
       <LoginErrorDialog />
        {/* Basic Information Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <SquareUser className="w-6 h-6 text-gray-500" />
            <h3 className="text-xl font-semibold">Personal Information</h3>
          </div>
          {isAuthenticated && (
          <Button 
            onClick={() => setEditMode('personal')}
            className="flex items-center gap-2"
          >
            Edit
            <Edit size={20} />
          </Button>
           )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{profile.name || "Dr. Nithyananad Prabhu"}</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <p className="text-lg text-gray-600">{personalInfo.gender || "Male"}</p>
            <p className="text-lg text-red-600">{profile.designation || "Research Scientist"}</p>
            <p className="text-lg text-gray-600">{profile.department || "Electrical Engineering"}</p>
            <p className='text-lg text-gray-600'>{profile.state || "Location not provided"}</p>
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
              {isAuthenticated && (
              <Button
                onClick={() => {
                 setProfessionalForm({
                    id: null,
                        position: "",
                        organization: '',
                        start_year:'',
                        end_year: ''
                  });
                  setEditMode('professional');
                }} >
                <PlusCircle className="h-4 w-4" />
              </Button>
               )}             
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
                     {isAuthenticated && (
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
                    )};
                    {isAuthenticated && (
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
                    )}
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
               {isAuthenticated && (
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
               )}
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              {qualifications.map((qual, index) => (
                <div key={qual.id||index} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{qual.qualification}</h4>
                    <p className="text-gray-600">{qual.authority}</p>
                    <p className="text-sm text-gray-500">{qual.year}</p>
                  </div>
                   {isAuthenticated && (
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
                   )}
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
             {isAuthenticated && (
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
             )}
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
                 {isAuthenticated && (
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
                 )}
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
            <a href={`mailto:${profile.email || "abc@prl.com"}`}className="text-red-600 hover:underline" >
              {profile.email || "abc@prl.com"}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500 " />
              <span className="font-medium">Website</span>
            </div>
            <a href={profile.website || "www.example.com"} className="text-red-600 hover:underline break-all">
              {profile.website || "www.example.com"}
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
          <DialogContent className="sm:max-w-4xl h-svh  bg-white">
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2 bg-white" >
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
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              
              </div>
              
             
              <div className="space-y-2">
                <Label htmlFor="about_me">About Me</Label>
                <Textarea
                  id="about_me"
                  name="about_me"
                  value={personalForm.about_me}
                  onChange={handlePersonalFormChange}
                  placeholder="Tell us about yourself"x
                  rows={2}
                />
              </div>
                            
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className='space-y-2'>
                <Label htmlFor="scopus_id">Scopus id</Label>
                <Input 
                id="scopus_id"
                name="scopus_id"
                value={personalForm.scopus_id}
                onChange={handlePersonalFormChange}
                placeholder="Enter your Scopus ID"
                />
                </div>
                <div className='space-y-2'>
                <Label htmlFor="orc_id">Orc id</Label>
                <Input
                id="orc_id"
                name="orc_id"
                value={personalForm.orc_id}
                onChange={handlePersonalFormChange}
                placeholder="Enter your Orc ID"
                />
                </div>
                <div className='space-y-2'>
                <Label htmlFor="google_scholar_id">Google Scholar ID</Label>
                <Input
                id="google_scholar_id"
                name="google_scholar_id"
                value={personalForm.google_scholar_id}
                onChange={handlePersonalFormChange}
                placeholder="Enter your Google Scholar ID"
                />
                </div>
                <div className='space-y-2'>
                <Label htmlFor="publons_id">Publons ID</Label>
                <Input
                id="publons_id"
                name="publons_id"
                value={personalForm.publons_id}
                onChange={handlePersonalFormChange}
                placeholder="Enter your Publons ID"
                />
                </div>
</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={personalForm.state}
                  onChange={handlePersonalFormChange}
                  placeholder="Enter your State"
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
                  <Label htmlFor="end_year">End Year </Label>
                  <Input
                    id="end_year"
                    name="end_year"
                    value={professionalForm.end_year}
                    onChange={handleProfessionalFormChange}
                    placeholder="YYYY"
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
          <AlertDialogContent className="bg-white">
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
          <AlertDialogContent className="bg-white">
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
  <AlertDialogContent className="bg-white">
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
