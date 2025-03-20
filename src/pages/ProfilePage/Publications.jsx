// import React, {useState} from 'react';
// import { BookOpen, Lock } from 'lucide-react';

//   const Publications = () => {

//   const [publications, setPublications] = useState([
//     {
//       title: 'Advances in Nanomaterials for Energy Storage',
//       journal: 'Journal of Energy Materials',
//       year: 2022,
//       doi: '10.1000/xyz123'
//     },
//     {
//       title: 'Electrochemical Properties of Novel Composite Materials',
//       journal: 'Electrochemistry Communications',
//       year: 2021,
//       doi: '10.1000/abc456'
//     },
//     {
//       title: 'Sustainable Energy Storage Solutions',
//       journal: 'Applied Energy',
//       year: 2020,
//       doi: '10.1000/def789'
//     }
//   ]);

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <BookOpen className="w-6 h-6 text-gray-500" />
//           <h3 className="text-xl font-semibold">Publications (793)</h3>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium">Sort By:</span>
//           <select className="px-3 py-1 border rounded-md text-sm">
//             <option> Date (newest)</option>
//             <option> Date (oldest)</option>
//             <option> Relevance</option>
//           </select>
//         </div>
//       </div>

//       <div className="space-y-6 pl-4 border-l-2 border-gray-200">
//         {/* Publication 1 */}
//         <div className="space-y-2">
//           <div className="flex items-start justify-between gap-4">
//             <h4 className="font-semibold">
//               Nonprecious and shape-controlled Co3O4-CoO@Co electrocatalysts with defect-rich and spin-state altering properties to accelerate hydrogen evolution reaction at large current densities over a wide pH range
//             </h4>
//             <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
//           </div>
//           <p className="text-gray-600">
//             Karuppasamy L.;Gurusamy L.;Anandan S.;Barton S.C.;Liu C.H.;Wu J.J.
//           </p>
//           <div className="flex flex-wrap gap-4 text-sm">
//             <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
//             <span className="text-gray-600">Chemical Engineering Journal, Volume 495, Year 2024</span>
//           </div>
//           <p className="text-blue-600 text-sm">DOI:10.1016/j.cej.2024.153442</p>
//           <span class="__dimensions_badge_embed__" data-doi="10.1016/j.cej.2024.153442" data-hide-zero-citations="true" data-style="small_circle"></span><script async src="https://badge.dimensions.ai/badge.js" charset="utf-8"></script>
//         </div>

//         {/* Publication 2 */}
//         <div className="space-y-2">
//           <div className="flex items-start justify-between gap-4">
//             <h4 className="font-semibold">
//               Effect of nutrition intervention on cognitive development among malnourished preschool children: randomized controlled trial
//             </h4>
//             <div className="flex items-center gap-2">
//               {/* <Citation className="w-4 h-4 text-gray-500" /> */}
//               <span className="text-gray-600">8</span>
//             </div>
//           </div>
//           <p className="text-gray-600">
//             Ansuya, B.S., Nayak, Baby S., U., Bhaskaran, Unnikrishnan, Y.N., Shashidhara, Y. N., S.C., Mundkur, Suneel C.
//           </p>
//           <div className="flex flex-wrap gap-4 text-sm">
//             <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
//             <span className="text-green-600">Open access</span>
//             <span className="text-gray-600">Scientific Reports, 2023</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Publications;

import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Publications = ({ profileId }) => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint and parameters
        const response = await axios.get(`/api/profile/publications${profileId ? `?profile_id=${profileId}` : ''}`);
        setPublications(response.data);
      } catch (err) {
        setError('Failed to load publications');
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [profileId]);

  // Format publication date to show only year
  const formatYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <h3 className="text-xl font-semibold">Publications ({publications.length || 0})</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort By:</span>
          <select className="px-3 py-1 border rounded-md text-sm">
            <option>Date (newest)</option>
            <option>Date (oldest)</option>
            <option>Citations</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="text-gray-500">Loading publications...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-6 pl-4 border-l-2 border-gray-200">
          {Array.isArray(publications) ? (
            publications.map((pub, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold">{pub.title}</h4>
                  {!pub.open_access && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                  {pub.open_access && <ExternalLink className="w-4 h-4 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-gray-600">{pub.co_authors}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
                  {pub.open_access && <span className="text-green-600">Open access</span>}
                  <span className="text-gray-600">
                    {pub.publication_name}
                    {pub.volume && `, Volume ${pub.volume}`}
                    {pub.issue && `, Issue ${pub.issue}`}
                    {pub.pagerange && `, Pages ${pub.pagerange}`}
                    {pub.publication_date && `, ${formatYear(pub.publication_date)}`}
                  </span>
                </div>
                {pub.doi && (
                  <p className="text-blue-600 text-sm">DOI:{pub.doi}</p>
                  
                )}
                {pub.cited_by > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{pub.cited_by}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No publications found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Publications;