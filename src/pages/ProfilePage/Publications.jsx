import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, ExternalLink, Award, ChevronDown } from 'lucide-react';
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { Button } from '@/components/ui/button';

const Publications = ({ profileId, onDataUpdate, data, topPublications }) => {
  const [publications, setPublications] = useState([]);
  const [topPubs, setTopPubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

 useEffect(() => {
  if (data && Array.isArray(data)) {
    // External data is provided, no need to fetch
    return;
  }
  
  const fetchData = async () => {
    // API calls here
  };
  
  fetchData();
}, [profileId, data]);

// Separate effect for processing data
useEffect(() => {
  if (data && Array.isArray(data)) {
    setPublications(data);
    setIsLoading(false);
    
    // Process top publications
    if (!topPublications || !topPublications.length) {
      const sortedByCitations = [...data]
        .sort((a, b) => (b.cited_by || 0) - (a.cited_by || 0));
      setTopPubs(sortedByCitations.slice(0, 10));
    }
    
    if (onDataUpdate) {
      onDataUpdate(data);
    }
  }
}, [data, topPublications, onDataUpdate]);

  // Format publication date to show only year
  const formatYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).getFullYear();
    } catch (e) {
      return dateString;
    }
  };

  // Sort publications based on selected option
  const sortedPublications = () => {
    const publicationsToSort = showAll ? publications : topPubs;
    
    if (!Array.isArray(publicationsToSort) || publicationsToSort.length === 0) {
      return [];
    }
    
    return [...publicationsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publication_date || 0) - new Date(a.publication_date || 0);
        case 'oldest':
          return new Date(a.publication_date || 0) - new Date(b.publication_date || 0);
        case 'citations':
          return (b.cited_by || 0) - (a.cited_by || 0);
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewMoreClick = () => {
    setShowAll(true);
  };

 const renderAuthors = (publication) => {
     if (!publication.co_authors) return null;
    
    if (!publication.prl_authors || !Array.isArray(publication.prl_authors)) {
      return <p className="text-gray-600">{publication.co_authors}</p>;
    }
    const authorsList = publication.co_authors.split(', ');
    
    const prlAuthorsMap = publication.prl_authors.reduce((map, author) => {
 
      const simpleName = author.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.) /, '').trim();
      map[simpleName] = author;
      map[author.name] = author;
      const nameParts = simpleName.split(' ');
      if (nameParts.length > 1) {
        const lastName = nameParts[nameParts.length - 1];
        const firstInitial = nameParts[0][0];
        map[`${lastName} ${firstInitial}.`] = author;
        map[`${lastName} ${firstInitial}`] = author;
      }
      return map;
    }, {});
     return (
      <p className="text-gray-600">
        {authorsList.map((authorName, index) => {
          
          const cleanName = authorName.trim().replace(/\.$/, '');
          
          const prlAuthor = prlAuthorsMap[cleanName];
          
          if (prlAuthor) {
            return (
              <React.Fragment key={index}>
                {index > 0 && ', '}
                <a 
                  href={`/profile/${prlAuthor.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {authorName}
                </a>
              </React.Fragment>
            );
          }
          
          return (
            <React.Fragment key={index}>
              {index > 0 && ', '}
              {authorName}
            </React.Fragment>
          );
        })}
      </p>
    );
  };
  const displayedPublications = sortedPublications();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <h3 className="text-xl font-semibold">
             Journal Articles 
          </h3>
          <p className='font-semibold text-red-700'>(Data Source: Scopus) </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort By:</span>
          <select 
            className="px-3 py-1 border rounded-md text-sm"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="newest">Date (newest)</option>
            <option value="oldest">Date (oldest)</option>
            <option value="citations">Citations</option>
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
        <>
          <div className="space-y-6 pl-4 border-l-2 border-gray-200">
            {displayedPublications.length > 0 ? (
              displayedPublications.map((pub, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold">
                      {pub.title}
                      {!showAll && <Award className="inline-block ml-2 w-4 h-4 text-yellow-500" />}
                    </h4>
                    
                    {pub.doi && (
                      <a 
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className=" hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {renderAuthors(pub)}
                
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
                    {pub.open_access && <span className="text-green-600">Open access</span>}
                     <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Cited by:{pub.cited_by}</span>
                    <span className="text-gray-600">
                      {pub.publication_name}
                      {pub.volume && `, Volume ${pub.volume}`}
                      {pub.issue && `, Issue ${pub.issue}`}
                      {pub.pagerange && `, Pages ${pub.pagerange}`}
                      {pub.publication_date && `, ${formatYear(pub.publication_date)}`}
                    </span>
                  </div>
                  {pub.doi && (

                    <p className="text-blue-600 text-sm">
                      <a 
                        href={`https://doi.org/${pub.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        DOI: {pub.doi}
                      </a>
                     
                    </p>
                    
                  )}
                  {(pub.cited_by !== undefined) && (
                     <div className="flex flex-wrap gap-4 text-sm">                   
                    <span className="text-gray-600">
                      {` Fb cite: ${pub.fb_cite}`}
                      {` , X cite: ${pub.x_cite}`}
                      {` , News cite: ${pub.news_cite}`}
                      { ` ,Blog cite: ${pub.blog_cite}`}
                      { ` ,Accounts cite: ${pub.accounts_cite}`}
                      { ` ,Dimenions id: ${pub.dimensions_id}`}
                       { ` ,Alt score: ${pub.alt_score}`}
                      { ` ,Mendeley cite: ${pub.mendeley_cite}`}
                      { ` ,Plumx captures: ${pub.plumx_captures}`}
                      { ` ,Plumx citations: ${pub.plumx_citations}`}
                      
                    </span>
                  </div>
                    
                    
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No publications found</div>
            )}
          </div>
          
          {!showAll && topPubs.length > 0 && publications.length > topPubs.length && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleViewMoreClick}
                className="flex items-center gap-2"
              >
                View All Publications
                <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Publications;