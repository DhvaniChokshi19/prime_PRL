import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, ExternalLink, ChevronDown, Newspaper,ComputerIcon, UserCheck,Quote, FolderOpen, LockOpen } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { Button } from '@/components/ui/button';
import pubimg from '../../assets/pub_bg.jpg';
import fb from "../../assets/fb.jpg"
import X from "../../assets/x.jpg"
import altm from "../../assets/alt.png"
import mend from "../../assets/mendley.png"
import plum from '../../assets/plumx.png';
const DepartmentArticles = ({ department_id }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [departmentName, setDepartmentName] = useState('');
  const [yearRange, setYearRange] = useState({
    from: '',
    to: ''
  });

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
        12: 'CMG Services',
        13: 'Library Services',
        14: 'Unknown',
        15: 'Others'
  };

  useEffect(() => {
    const fetchDepartmentArticles = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/departments/${department_id}`);
        
        // Sort the articles immediately when they come from the API
        const sortedData = sortArticlesByType(response.data, sortBy);
        setArticles(sortedData);
        
        setDepartmentName(departmentIdToName[department_id] || 'Unknown Department');
        console.log("articles",response);
        // Set initial year range based on available data
        if (sortedData && sortedData.length > 0) {
          const years = sortedData
            .map(article => article.publication_date ? new Date(article.publication_date).getFullYear() : null)
            .filter(year => year !== null);
          
          if (years.length > 0) {
            const minYear = Math.min(...years);
            const maxYear = Math.max(...years);
            setYearRange({
              from: minYear.toString(),
              to: maxYear.toString()
            });
          }
        }
      } catch (err) {
        setError('Failed to load department articles');
        console.error('Error fetching department articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentArticles();
  }, [department_id, sortBy]);

  // Helper function to sort articles
  const sortArticlesByType = (articlesToSort, sortType) => {
    if (!Array.isArray(articlesToSort) || articlesToSort.length === 0) {
      return [];
    }
    
    return [...articlesToSort].sort((a, b) => {
      switch (sortType) {
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

  const formatYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).getFullYear();
    } catch (e) {
      return dateString;
    }
  };

  const getArticleYear = (article) => {
    if (!article.publication_date) return null;
    try {
      return new Date(article.publication_date).getFullYear();
    } catch (e) {
      return null;
    }
  };

  // Use this function to apply filters and sorting
  const getDisplayArticles = () => {
    if (!Array.isArray(articles) || articles.length === 0) {
      return [];
    }
    
    // Filter by year range
    const filteredArticles = articles.filter(article => {
      const year = getArticleYear(article);
      if (!year) return false;
      
      const fromYear = yearRange.from ? parseInt(yearRange.from) : 0;
      const toYear = yearRange.to ? parseInt(yearRange.to) : 9999;
      
      return year >= fromYear && year <= toYear;
    });
    
    return showAll ? filteredArticles : filteredArticles.slice(0, 10);
  };

  useEffect(() => {
    setArticles(prev => sortArticlesByType([...prev], sortBy));
  }, [sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setYearRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewMoreClick = () => {
    setShowAll(true);
  };
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize the matrix
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  
  return dp[m][n];
};

const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100; 
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return ((maxLength - distance) / maxLength) * 100;
};
// Enhanced renderAuthors function with fuzzy matching
const renderAuthors = (article) => {
  if (!article.co_authors) return null;
  
  if (!article.prl_authors || !Array.isArray(article.prl_authors)) {
    return <p className="text-gray-600">{article.co_authors}</p>;
  }

  const authorsList = article.co_authors.split(', ');
  
  const prlAuthorsMap = {};
  const prlAuthorsArray = [];
  
  article.prl_authors.forEach(author => {
    const fullName = author.name;
    const nameWithoutTitle = fullName.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|MS\.) /i, '').trim();
    
    prlAuthorsMap[fullName.toLowerCase()] = author;
    prlAuthorsMap[nameWithoutTitle.toLowerCase()] = author;
    
    prlAuthorsArray.push({
      author: author,
      fullName: fullName,
      cleanName: nameWithoutTitle,
      nameParts: nameWithoutTitle.split(' ')
    });
  
  });

  return (
    <p className="text-gray-600">
      {authorsList.map((authorName, index) => {
        const cleanName = authorName.trim();
        
        let prlAuthor = prlAuthorsMap[cleanName.toLowerCase()];
        
        if (!prlAuthor) {
          const SIMILARITY_THRESHOLD = 75; 
          let bestMatch = null;
          let highestSimilarity = 0;
          
          prlAuthorsArray.forEach(entry => {
            let similarity = calculateSimilarity(cleanName, entry.fullName);
            
            if (entry.nameParts.length > 1) {
              const lastName = entry.nameParts[entry.nameParts.length - 1];
              const initials = entry.nameParts.slice(0, -1).map(part => part[0]).join('');
              const lastNameWithInitials = `${lastName} ${initials}`;
              const initialsWithLastName = `${initials} ${lastName}`;
              
              similarity = Math.max(
                similarity,
                calculateSimilarity(cleanName, lastNameWithInitials),
                calculateSimilarity(cleanName, initialsWithLastName)
              );
            }
            
            if (similarity > highestSimilarity && similarity >= SIMILARITY_THRESHOLD) {
              highestSimilarity = similarity;
              bestMatch = entry.author;
            }
          });
          
          if (bestMatch) {
            prlAuthor = bestMatch;
          }
        }
        
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
  const displayedArticles = getDisplayArticles();
  const filteredCount = articles.filter(article => {
    const year = getArticleYear(article);
    if (!year) return false;
    
    const fromYear = yearRange.from ? parseInt(yearRange.from) : 0;
    const toYear = yearRange.to ? parseInt(yearRange.to) : 9999;
    
    return year >= fromYear && year <= toYear;
  }).length;

  return (
    <div className='bg-blue-200 mx-auto max-w-9xl p-3'>
      <div className="relative w-full h-40">
        <img 
          src={pubimg} 
          alt="Dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 "> 
          <div className="container mx-auto px-8 h-52">
            <div className="flex items-center justify-between mb-2 mt-7">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-gray-500" />
                <h3 className="text-2xl font-semibold">
                  {departmentName} Publications
                </h3>
                <p className="font-semibold text-red-700">(Data Source: Scopus) </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Year:</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      name="from"
                      placeholder="From"
                      value={yearRange.from}
                      onChange={handleYearChange}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="to"
                      placeholder="To"
                      value={yearRange.to}
                      onChange={handleYearChange}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                    />
                  </div>
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
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
              <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin fast-spin"></div>

                <span className="text-gray-600 text-sm">
                  Fetching Articles...
                </span>
              </div>
            </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <>
        <div className="space-y-6 pl-4 pr-4 py-6 bg-white border-l-4 border-blue-300 rounded-md shadow-sm">

  {displayedArticles.length > 0 ? (
    displayedArticles.map((article, index) => (
      <div 
        key={index} 
        className="bg-white rounded-lg shadow hover:shadow-md transition p-5 border border-gray-100"
      >
        <div className="flex items-start gap-4">

          {/* Index Circle */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full font-medium">
              {index + 1}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">

            {/* Title + DOI */}
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-lg leading-snug text-gray-800 hover:text-blue-700">
                {article.title}
              </h4>

              {article.doi && (
                <a 
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Authors */}
            <div className="text-sm">
              {renderAuthors(article)}
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2 text-sm mt-2">

              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Article
              </span>

              {article.open_access && (
                <span className="flex items-center text-green-700 text-xs bg-green-100 px-2 py-1 rounded">
                  <LockOpen className="w-3 h-3 mr-1" /> Open Access
                </span>
              )}

              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                Citations: {article.cited_by}
              </span>

              <span className="text-gray-600 text-xs flex items-center">
                {article.publication_name}
                {article.volume && ` • Vol. ${article.volume}`}
                {article.issue && ` • Issue ${article.issue}`}
                {article.pagerange && ` • Pages ${article.pagerange}`}
                {article.publication_date && ` • ${formatYear(article.publication_date)}`}
              </span>
            </div>

            {/* DOI Line */}
            {article.doi && (
              <p className="text-blue-600 text-sm mt-1">
                <a 
                  href={`https://doi.org/${article.doi}`} 
                  target="_blank"
                  className="hover:underline"
                >
                  DOI: {article.doi}
                </a>
              </p>
            )}

            {/* Metrics Collapsible */}
            {(article.cited_by !== undefined) && (
              <details className="mt-3 bg-gray-50 p-3 rounded border">
                <summary className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 font-medium">
                  View Metrics
                </summary>

                <div className="flex flex-wrap gap-4 p-2 mt-3">

                  <span className="flex items-center text-sm">
                    <img className="w-5 h-5 mr-1" src={fb} /> {article.fb_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <img className="w-5 h-5 mr-1" src={X} /> {article.x_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <Newspaper className="w-5 h-5 text-orange-600 mr-1" /> {article.news_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <ComputerIcon className="w-5 h-5 mr-1" /> Blog: {article.blog_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <UserCheck className="w-5 h-5 text-orange-500 mr-1" /> Accounts: {article.accounts_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <img className="w-6 h-6 mr-1" src={altm} /> Altmetric: {article.alt_score || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <img className="w-6 h-6 mr-1" src={mend} /> Mendeley: {article.mendeley_cite || 0}
                  </span>

                  <span className="flex items-center text-sm">
                    <img className="w-6 h-6 mr-1" src={plum} /> PlumX: {article.plumx_citations || 0}
                  </span>

                </div>
              </details>
            )}

          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-gray-500 text-center py-6">
      No publications found for this department in the selected year range
    </div>
  )}
</div>

          
          {!showAll && filteredCount > 10 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleViewMoreClick}
                className="flex items-center gap-2"
              >
                View All Publications ({filteredCount})
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