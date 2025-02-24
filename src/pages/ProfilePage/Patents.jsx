import React from 'react';
import { ScrollText, Calendar, Tag } from 'lucide-react';

const Patents = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <ScrollText className="w-6 h-6 text-gray-500" />
        <h3 className="text-xl font-semibold">Patents</h3>
      </div>
      <div className="space-y-6 pl-4 border-l-2 border-gray-200">
        {/* Patent 1 */}
        <div className="space-y-2">
          <h4 className="font-semibold">
            An Improved Solid-State Polymer Composition, a Process for its Preparation and an Improved Dye-sensitized Solar Cell
          </h4>
          <div className="flex flex-wrap gap-4 text-1rm text-gray-600">
            <div className="flex items-center gap-1">
              <ScrollText className="w-4 h-4" />
              <span>Patent No. 266300</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>Chemical Sciences</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Filed: 2007-02-03</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Published: 2015-07-13</span>
            </div>
          </div>
          <p className="text-1rm text-gray-500">Indian</p>
        </div>

        {/* Patent 2 */}
        <div className="space-y-2">
          <h4 className="font-semibold">
            Airbag Gas Generant Composition Comprising Primary fuel, oxidizer and co-oxidiser which is basic metal nitrate nanosheets along with alkali metal nitrate, that react with azide fuel to cause complete combustion without toxic residues
          </h4>
          <div className="flex flex-wrap gap-4 text-1rm text-gray-600">
            <div className="flex items-center gap-1">
              <ScrollText className="w-4 h-4" />
              <span>Patent No. IN201741038676-A</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>Engineering and Technology</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Filed: 2018-06-05</span>
            </div>
          </div>
          <p className="text-1rm text-gray-500">Indian</p>
        </div>
      </div>
    </div>
  );
};

export default Patents;