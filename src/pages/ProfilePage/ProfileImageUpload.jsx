import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ProfileImageUpload = ({ profileImage, onImageUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = getTokenFromCookies();
        setIsLoggedIn(!!token);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getTokenFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('authToken='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token;
    }
    
    throw new Error('No authentication token found in cookies');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!previewImage) {
      return;
    }
    
    const fileInput = e.target.elements.profileImage;
    const file = fileInput.files[0];
    
    if (!file) {
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await axiosInstance.put(`/api/profile/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        onImageUpdate(`${API_BASE_URL}/profile_images/${file.name}`);
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile photo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPreviewImage(null);
    }
  };

  return (
    <div className="relative">
      <img 
        src={previewImage || profileImage || `${API_BASE_URL}/api/placeholder/150/150`}
        alt="Profile"
        className="w-48 h-48 rounded-lg object-cover"
      />
      
      {isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              
            />
            <label htmlFor="profileImage">
              <Button
                type="button"
                variant="secondary"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Camera size={16} />
                Change Photo
              </Button>
            </label>
            
            {previewImage && (
              <div className="mt-2 flex justify-center">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading ? "Uploading..." : "Save"}
                </Button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;