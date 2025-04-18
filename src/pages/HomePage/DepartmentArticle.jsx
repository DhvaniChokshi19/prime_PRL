import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, ExternalLink, Award, ChevronDown } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { Button } from '@/components/ui/button';

const DepartmentArticles = ({ department_id }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [departmentName, setDepartmentName] = useState('');

  const departmentIdToName = {
    1: 'Astronomy and Astrophysics',
    2: 'Atomic, Molecular and Optical Physics',
    3: 'Geosciences',
    4: 'Planetary Sciences',
    5: 'Space and Atmospheric Sciences',
    6: 'Theoretical Physics',
    7: 'Udaipur Solar Observatory',
    8: 'Workshop',
    9: 'CNIT Services',
    10: 'Medical Services',
    11: 'Administration',
    12: 'Library Services',
    13: 'Unknown',
    14: 'Others'
  };

  useEffect(() => {
    const fetchDepartmentArticles = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/departments/${department_id}`);
        setArticles(response.data);
        setDepartmentName(departmentIdToName[department_id] || 'Unknown Department');
      } catch (err) {
        setError('Failed to load department articles');
        console.error('Error fetching department articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentArticles();
  }, [department_id]);

  const formatYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).getFullYear();
    } catch (e) {
      return dateString;
    }
  };

  const sortedArticles = () => {
    if (!Array.isArray(articles) || articles.length === 0) {
      return [];
    }
    
    const displayArticles = showAll ? articles : articles.slice(0, 10);
    
    return [...displayArticles].sort((a, b) => {
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

  const renderAuthors = (article) => {
    if (!article.co_authors) return null;
    
    if (!article.prl_authors || !Array.isArray(article.prl_authors)) {
      return <p className="text-gray-600">{article.co_authors}</p>;
    }

    const authorsList = article.co_authors.split(', ');
    
    const prlAuthorsMap = article.prl_authors.reduce((map, author) => {
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

  const displayedArticles = sortedArticles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <h3 className="text-2xl font-semibold">
            {departmentName} Publications
          </h3>
          <p>(Data Source: Scopus) </p>
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
            {displayedArticles.length > 0 ? (
              displayedArticles.map((article, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold">
                      {article.title}
                    </h4>
                    
                    {article.doi && (
                      <a 
                        href={`https://doi.org/${article.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {renderAuthors(article)}
                
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Article</span>
                    {article.open_access && <span className="text-green-600 flex items-center"><Lock className="w-3 h-3 mr-1" />Open access</span>}
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Cited by: {article.cited_by}</span>
                    <span className="text-gray-600">
                      {article.publication_name}
                      {article.volume && `, Volume ${article.volume}`}
                      {article.issue && `, Issue ${article.issue}`}
                      {article.pagerange && `, Pages ${article.pagerange}`}
                      {article.publication_date && `, ${formatYear(article.publication_date)}`}
                    </span>
                  </div>
                  {article.doi && (
                    <p className="text-blue-600 text-sm">
                      <a 
                        href={`https://doi.org/${article.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        DOI: {article.doi}
                      </a>
                    </p>
                  )}
                  {(article.cited_by !== undefined) && (
                    <div className="text-sm text-gray-500">
                      <details className="mt-2">
                        <summary className="cursor-pointer hover:text-blue-600">View metrics</summary>
                        <div className="grid grid-cols-2 gap-2 p-2 mt-2 bg-gray-50 rounded-md">
                          <span>Facebook: {article.fb_cite || 0}</span>
                          <span>Twitter: {article.x_cite || 0}</span>
                          <span>News: {article.news_cite || 0}</span>
                          <span>Blog: {article.blog_cite || 0}</span>
                          <span>Accounts: {article.accounts_cite || 0}</span>
                          <span>Altmetric score: {article.alt_score || 0}</span>
                          <span>Mendeley: {article.mendeley_cite || 0}</span>
                          <span>PlumX captures: {article.plumx_captures || 0}</span>
                          <span>PlumX citations: {article.plumx_citations || 0}</span>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No publications found for this department</div>
            )}
          </div>
          
          {!showAll && articles.length > 10 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleViewMoreClick}
                className="flex items-center gap-2"
              >
                View All Publications ({articles.length})
                <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DepartmentArticles;