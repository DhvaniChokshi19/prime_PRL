// import React from 'react';
// import { ScrollText, Calendar, Tag } from 'lucide-react';

// const Patents = () => {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2 mb-4">
//         <div className="flex items-center space-x-2 mb-4">
//         <ScrollText className="w-6 h-6 text-gray-500" />
//         <h3 className="text-xl font-semibold">Patents</h3>
//         </div>
//       </div>
//       <div className="space-y-6 pl-4 border-l-2 border-gray-200">
//         {/* Patent 1 */}
//         <div className="space-y-2">
//           <h4 className="font-semibold">
//             An Improved Solid-State Polymer Composition, a Process for its Preparation and an Improved Dye-sensitized Solar Cell
//           </h4>
//           <div className="flex flex-wrap gap-4 text-1rm text-gray-600">
//             <div className="flex items-center gap-1">
//               <ScrollText className="w-4 h-4" />
//               <span>Patent No. 266300</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Tag className="w-4 h-4" />
//               <span>Chemical Sciences</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar className="w-4 h-4" />
//               <span>Filed: 2007-02-03</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar className="w-4 h-4" />
//               <span>Published: 2015-07-13</span>
//             </div>
//           </div>
//           <p className="text-1rm text-gray-500">Indian</p>
//         </div>

//         {/* Patent 2 */}
//         <div className="space-y-2">
//           <h4 className="font-semibold">
//             Airbag Gas Generant Composition Comprising Primary fuel, oxidizer and co-oxidiser which is basic metal nitrate nanosheets along with alkali metal nitrate, that react with azide fuel to cause complete combustion without toxic residues
//           </h4>
//           <div className="flex flex-wrap gap-4 text-1rm text-gray-600">
//             <div className="flex items-center gap-1">
//               <ScrollText className="w-4 h-4" />
//               <span>Patent No. IN201741038676-A</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Tag className="w-4 h-4" />
//               <span>Engineering and Technology</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar className="w-4 h-4" />
//               <span>Filed: 2018-06-05</span>
//             </div>
//           </div>
//           <p className="text-1rm text-gray-500">Indian</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patents;

import React, { useState, useEffect } from 'react';
import { ScrollText, Calendar, Tag, FileText, Users } from 'lucide-react';

const Patents = ({ profileId }) => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch patents for the profile
    const fetchPatents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profiles/${profileId}/patents/`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If it's not JSON, get the text and throw it as an error
          const text = await response.text();
          throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patents');
        }
        
        const data = await response.json();
        setPatents(data);
        setLoading(false);
      } catch (err) {
        console.error('Patent fetch error:', err);
        setError(err.message || 'Failed to load patents');
        setLoading(false);
      }
    };

    if (profileId) {
      fetchPatents();
    } else {
      setLoading(false);
      setError('Profile ID is required');
    }
  }, [profileId]);

  // For development/testing - remove in production
  // This provides fallback data when API fails
  const useFallbackData = () => {
    console.log('Using fallback patent data');
    return [
      {
        id: 1,
        patent_name: "An Improved Solid-State Polymer Composition, a Process for its Preparation and an Improved Dye-sensitized Solar Cell",
        patent_number: "266300",
        authors: "John Doe, Jane Smith",
        subject: "Chemical Sciences",
        status: "PUBLISHED",
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
        status: "PENDING",
        date_filed: "2018-06-05",
        date_published: null,
        country: "Indian"
      }
    ];
  };

  // Status badge color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'PUBLISHED': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // For development - comment out in production
  if (error && process.env.NODE_ENV === 'development') {
    // Use fallback data in development when API fails
    const fallbackData = useFallbackData();
    if (fallbackData.length > 0) {
      return (
        <div className="space-y-4">
          <div className="p-2 mb-2 bg-yellow-100 text-yellow-800 rounded">
            ⚠️ Using fallback data. API Error: {error}
          </div>
          <RenderPatents patents={fallbackData} getStatusColor={getStatusColor} />
        </div>
      );
    }
  }

  if (loading) return <div className="p-4 text-center">Loading patents...</div>;
  
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  if (patents.length === 0) {
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        No patents found for this profile.
      </div>
    );
  }

  return <RenderPatents patents={patents} getStatusColor={getStatusColor} />;
};

const RenderPatents = ({ patents, getStatusColor }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <ScrollText className="w-6 h-6 text-gray-500" />
        <h3 className="text-xl font-semibold">Patents</h3>
      </div>

      <div className="space-y-6 pl-4 border-l-2 border-gray-200">
        {patents.map((patent, index) => (
          <div key={patent.id || index} className="space-y-2">
            <h4 className="font-semibold">{patent.patent_name}</h4>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {patent.authors && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{patent.authors}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Patent No. {patent.patent_number || 'Pending'}</span>
              </div>
              
              {patent.subject && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{patent.subject}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Filed: {new Date(patent.date_filed).toLocaleDateString()}</span>
              </div>
              
              {patent.date_published && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Published: {new Date(patent.date_published).toLocaleDateString()}</span>
                </div>
              )}
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
                {patent.status}
              </span>
            </div>
            
            {patent.country && <p className="text-sm text-gray-500">{patent.country}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patents;