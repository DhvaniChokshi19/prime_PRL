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
    if (topPublications && Array.isArray(topPublications) && topPublications.length > 0) {
      setTopPubs(topPublications);
    }
    if (data && Array.isArray(data) && data.length > 0) {
      setPublications(data);
      setIsLoading(false);
      if (!topPublications || !topPublications.length) {
        const sortedByCitations = [...data]
          .sort((a, b) => (b.cited_by || 0) - (a.cited_by || 0));
        setTopPubs(sortedByCitations.slice(0, 10));
      }
      
      if (onDataUpdate) {
        onDataUpdate(data);
      }
      return;
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all publications
        const publicationsResponse = await axiosInstance.get('/api/profile/publications', {
          params: { profile_id: profileId }
        });
        
        setPublications(publicationsResponse.data);
        
        // If top publications weren't provided via props, check if they need to be fetched
        if (!topPublications || !topPublications.length) {
          try {
            // Try to fetch profile data which includes top publications
            const profileResponse = await axiosInstance.get('/api/profile', {
              params: { profile_id: profileId }
            });
            
            // If backend provides top publications, use them
            if (profileResponse.data.top_publications && 
                Array.isArray(profileResponse.data.top_publications)) {
              setTopPubs(profileResponse.data.top_publications);
            } else {
              // Otherwise derive top publications from all publications
              const sortedByCitations = [...publicationsResponse.data]
                .sort((a, b) => (b.cited_by || 0) - (a.cited_by || 0));
              setTopPubs(sortedByCitations.slice(0, 10));
            }
          } catch (err) {
            // If profile fetch fails, derive top publications from all publications
            const sortedByCitations = [...publicationsResponse.data]
              .sort((a, b) => (b.cited_by || 0) - (a.cited_by || 0));
            setTopPubs(sortedByCitations.slice(0, 10));
            console.error('Error fetching profile data:', err);
          }
        }
        
        // Update parent component if needed
        if (onDataUpdate) {
          onDataUpdate(publicationsResponse.data);
        }
      } catch (err) {
        setError('Failed to load publications');
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileId, onDataUpdate, data, topPublications]);

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
   
    if (!publication.prl_authors || !Array.isArray(publication.prl_authors) || publication.prl_authors.length === 0) {
      return <p className="text-gray-600">{publication.co_authors}</p>;
    }
    const allAuthors = publication.co_authors.split(', ').map(author => author.trim());
    
    const prlAuthorsMap = {};
    const prlAuthorNameVariations = {};
    
    publication.prl_authors.forEach(author => {
      
      prlAuthorsMap[author.id] = author;
      
      const cleanName = author.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.) /, '').trim();
      prlAuthorNameVariations[cleanName] = author.id;
      prlAuthorNameVariations[author.name] = author.id;
      
      const nameParts = cleanName.split(' ');
      if (nameParts.length > 1) {
        const lastName = nameParts[nameParts.length - 1];
        const firstInitial = nameParts[0][0];
        prlAuthorNameVariations[`${lastName} ${firstInitial}.`] = author.id;
        prlAuthorNameVariations[`${lastName} ${firstInitial}`] = author.id;
      }
    });
    const prlAuthorsInList = [];
    const nonPrlAuthors = [];
    
    allAuthors.forEach(authorName => {
      const cleanName = authorName.trim().replace(/\.$/, '');
      const authorId = prlAuthorNameVariations[cleanName];
      
      if (authorId && prlAuthorsMap[authorId]) {
        prlAuthorsInList.push({ name: authorName, id: authorId });
      } else {
        nonPrlAuthors.push(authorName);
      }
    });
    return (
      <p className="text-gray-600">
      
        {prlAuthorsInList.map((author, index) => (
          <React.Fragment key={`prl-${author.id}`}>
            {index > 0 && ', '}
            <a 
              href={`/profile/${author.id}`}
              className="text-blue-600 hover:underline"
            >
              {author.name}
            </a>
          </React.Fragment>
        ))}
        {prlAuthorsInList.length > 0 && nonPrlAuthors.length > 0 && ', '}
        
        {nonPrlAuthors.map((name, index) => (
          <React.Fragment key={`non-prl-${index}`}>
            {index > 0 && ', '}
            {name}
          </React.Fragment>
        ))}
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
             
              Publications 
          </h3>
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
          <div className='flex items-center space-x-3' >
           <p className='text-sm text-black'>Data Source: Scopus</p>
        </div>
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
                    <div className="flex-shrink-0">
                      {pub.open_access === false && <Lock className="w-4 h-4 text-gray-500" />}
                      {pub.open_access === true && <ExternalLink className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                  {renderAuthors(pub)}
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
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Cited by: <span className="font-medium">{pub.cited_by}</span></span>
                    <p className='text-gray-600'> {pub.sjr && `, SJR: ${pub.sjr}`}</p>
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