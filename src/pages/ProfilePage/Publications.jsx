import React from 'react';
import { BookOpen, Lock } from 'lucide-react';

const Publications = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <h3 className="text-xl font-semibold">Publications (793)</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort By:</span>
          <select className="px-3 py-1 border rounded-md text-sm">
            <option> Date (newest)</option>
            <option> Date (oldest)</option>
            <option> Relevance</option>
          </select>
        </div>
      </div>

      <div className="space-y-6 pl-4 border-l-2 border-gray-200">
        {/* Publication 1 */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h4 className="font-semibold">
              Nonprecious and shape-controlled Co3O4-CoO@Co electrocatalysts with defect-rich and spin-state altering properties to accelerate hydrogen evolution reaction at large current densities over a wide pH range
            </h4>
            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </div>
          <p className="text-gray-600">
            Karuppasamy L.;Gurusamy L.;Anandan S.;Barton S.C.;Liu C.H.;Wu J.J.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
            <span className="text-gray-600">Chemical Engineering Journal, Volume 495, Year 2024</span>
          </div>
          <p className="text-blue-600 text-sm">DOI:10.1016/j.cej.2024.153442</p>
          <span class="__dimensions_badge_embed__" data-doi="10.1016/j.cej.2024.153442" data-hide-zero-citations="true" data-style="small_circle"></span><script async src="https://badge.dimensions.ai/badge.js" charset="utf-8"></script>
        </div>

        {/* Publication 2 */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h4 className="font-semibold">
              Effect of nutrition intervention on cognitive development among malnourished preschool children: randomized controlled trial
            </h4>
            <div className="flex items-center gap-2">
              {/* <Citation className="w-4 h-4 text-gray-500" /> */}
              <span className="text-gray-600">8</span>
            </div>
          </div>
          <p className="text-gray-600">
            Ansuya, B.S., Nayak, Baby S., U., Bhaskaran, Unnikrishnan, Y.N., Shashidhara, Y. N., S.C., Mundkur, Suneel C.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
            <span className="text-green-600">Open access</span>
            <span className="text-gray-600">Scientific Reports, 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publications;