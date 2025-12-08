import React, { useState, useEffect } from 'react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
//import { toast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { toast,  Toaster } from 'react-hot-toast';

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
      toast.success("Photo selected — click Save to upload");
    }
  };

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

const handleSubmit = async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("profileImageInput");
  const file = fileInput?.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    setLoading(true);
    const token = getAuthToken();
    const response = await axiosInstance.put(`/api/profile/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      onImageUpdate(`${API_BASE_URL}/profile_images/${file.name}`);
      toast.success("Profile photo updated successfully");
    }
  } catch (error) {
    toast.error("Failed to update profile photo");
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
    <div className="relative group w-52 h-56">
      {/* Image */}
      <img
        src={previewImage || profileImage || `${API_BASE_URL}/api/placeholder/150/150`}
        alt="Profile"
        className="w-full h-full rounded-lg object-cover shadow-md"
      />

      {/* Overlay */}
      {canModify() && (
        <div className="
            absolute inset-0 rounded-lg 
            bg-black/40 opacity-0 
            group-hover:opacity-100 
            transition-opacity duration-200
            flex flex-col items-center justify-center gap-3
        ">
          <input
            type="file"
            id="profileImageInput"
            name="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Upload Button */}
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-white transition">
              <Camera size={18} />
              <span className="font-medium text-sm">Change Photo</span>
            </div>
          </label>

          {/* Save Button */}
          {previewImage && (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md"
            >
              {loading ? "Uploading..." : (
                <>
                  <Upload size={16} />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;