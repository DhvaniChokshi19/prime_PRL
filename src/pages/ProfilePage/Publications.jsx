import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, ChevronDown, Newspaper, ComputerIcon, UserCheck, Download, FileText } from 'lucide-react';
import fb from "../../assets/fb.jpg";
import X from "../../assets/x.jpg";
import altm from "../../assets/alt.png";
import mend from "../../assets/mendley.png";
import axiosInstance, { API_BASE_URL } from '../../api/axios';
import { Button } from '@/components/ui/button';
import plum from '../../assets/plumx.png';


const Publications = ({ profileId, onDataUpdate, data, topPublications }) => {
  const [publications, setPublications] = useState([]);
  const [topPubs, setTopPubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => 
          new Date(b.publication_date || 0) - new Date(a.publication_date || 0)
        );
      setPublications(data);
      setIsLoading(false);
    
      if (!topPublications || !topPublications.length) {
        setTopPubs(sortedData.slice(0, 10));
      } else {
        setTopPubs(topPublications);
      }    
      if (onDataUpdate) {
        onDataUpdate(data);
      }
    }
  }, [data, topPublications, onDataUpdate]);

  const formatYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).getFullYear();
    } catch (e) {
      return dateString;
    }
  };

  const sortedPublications = () => {
    const publicationsToSort = showAll ? publications : topPubs;
    
    if (!Array.isArray(publicationsToSort) || publicationsToSort.length === 0) {
      return [];
    }
    const filteredPublications = publicationsToSort.filter(pub => {
      return pub.type === 'article' || !pub.type; 
    });  
    return [...filteredPublications].sort((a, b) => {
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

  // Download functions
  const downloadCSV = () => {
    const currentPublications = sortedPublications();
    if (currentPublications.length === 0) {
      alert('No publications to download');
      return;
    }

    const headers = [
      'Title',
      'Authors',
      'Publication Name',
      'Type',
      'Publication Date',
      'Volume',
      'Issue',
      'Page Range',
      'Citations',
      'DOI',
      'Open Access',
      'Facebook Citations',
      'X Citations',
      'News Citations',
      'Blog Citations',
      'Accounts Citations',
      'Altmetric Score',
      'Mendeley Citations',
      'PlumX Citations'
    ];

    const csvContent = [
      headers.join(','),
      ...currentPublications.map(pub => [
        `"${(pub.title || '').replace(/"/g, '""')}"`,
        `"${(pub.co_authors || '').replace(/"/g, '""')}"`,
        `"${(pub.publication_name || '').replace(/"/g, '""')}"`,
        `"${pub.type || 'article'}"`,
        `"${formatYear(pub.publication_date) || ''}"`,
        `"${pub.volume || ''}"`,
        `"${pub.issue || ''}"`,
        `"${pub.pagerange || ''}"`,
        `"${pub.cited_by || 0}"`,
        `"${pub.doi || ''}"`,
        `"${pub.open_access ? 'Yes' : 'No'}"`,
        `"${pub.fb_cite || 0}"`,
        `"${pub.x_cite || 0}"`,
        `"${pub.news_cite || 0}"`,
        `"${pub.blog_cite || 0}"`,
        `"${pub.accounts_cite || 0}"`,
        `"${pub.alt_score || 0}"`,
        `"${pub.mendeley_cite || 0}"`,
        `"${pub.plumx_citations || 0}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Journal_Articles_publications.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    const currentPublications = sortedPublications();
    if (currentPublications.length === 0) {
      alert('No publications to download');
      return;
    }

    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Set up the document
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      
      // Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Journal Articles Publications', margin, yPosition);
      yPosition += 15;
      
      // Add generation date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;
      
      // Publications
      currentPublications.forEach((pub, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Publication number
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const numberText = `${index + 1}.`;
        doc.text(numberText, margin, yPosition);
        
        // Title
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        const titleLines = doc.splitTextToSize(pub.title || 'Untitled', maxWidth - 15);
        doc.text(titleLines, margin + 15, yPosition);
        yPosition += titleLines.length * 5;
        
        // Authors
        if (pub.co_authors) {
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          const authorLines = doc.splitTextToSize(`Authors: ${pub.co_authors}`, maxWidth - 15);
          doc.text(authorLines, margin + 15, yPosition);
          yPosition += authorLines.length * 4;
        }
        
        // Publication details
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        let details = [];
        if (pub.publication_name) details.push(pub.publication_name);
        if (pub.volume) details.push(`Volume ${pub.volume}`);
        if (pub.issue) details.push(`Issue ${pub.issue}`);
        if (pub.pagerange) details.push(`Pages ${pub.pagerange}`);
        if (pub.publication_date) details.push(`${formatYear(pub.publication_date)}`);
        
        if (details.length > 0) {
          const detailsText = details.join(', ');
          const detailLines = doc.splitTextToSize(detailsText, maxWidth - 15);
          doc.text(detailLines, margin + 15, yPosition);
          yPosition += detailLines.length * 4;
        }
        
        // Citations and metrics
        const metrics = [];
        if (pub.cited_by !== undefined) metrics.push(`Citations: ${pub.cited_by}`);
        if (pub.open_access) metrics.push('Open Access');
        if (pub.alt_score) metrics.push(`Altmetric: ${pub.alt_score}`);
        if (pub.mendeley_cite) metrics.push(`Mendeley: ${pub.mendeley_cite}`);
        
        if (metrics.length > 0) {
          doc.text(metrics.join(' | '), margin + 15, yPosition);
          yPosition += 4;
        }
        
        // DOI
        if (pub.doi) {
          doc.setTextColor(0, 0, 255);
          doc.text(`DOI: ${pub.doi}`, margin + 15, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 4;
        }
        
        yPosition += 8; // Space between publications
      });
      
      // Add footer with page numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      }
      
      // Save the PDF
      doc.save('Journal_Articles_Publications.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
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
        
        // Exact match check first
        let prlAuthor = prlAuthorsMap[cleanName.toLowerCase()];
        
        if (!prlAuthor) {
          // More strict matching criteria
          const SIMILARITY_THRESHOLD = 85; // Increased from 75
          let bestMatch = null;
          let highestSimilarity = 0;
          
          prlAuthorsArray.forEach(entry => {
            // Base similarity check
            let similarity = calculateSimilarity(cleanName, entry.fullName);
            
            if (entry.nameParts.length > 1) {
              const lastName = entry.nameParts[entry.nameParts.length - 1];
              const initials = entry.nameParts.slice(0, -1).map(part => part[0]).join('');
              
             
              const authorParts = cleanName.split(' ');
              if (authorParts.length === 2) {
                const authorLastName = authorParts[0];
                const authorInitial = authorParts[1];
                
                if (authorInitial.length === 1) {
                
                  const lastNameSimilarity = calculateSimilarity(authorLastName, lastName);
                  
                  const initialMatches = entry.nameParts[0][0].toLowerCase() === authorInitial.toLowerCase();
                  
                  if (lastNameSimilarity > 80 && initialMatches) {
                    similarity = lastNameSimilarity;
                  } else {
                    
                    similarity = 0;
                  }
                }
              }
              
              const lastNameWithInitials = `${lastName} ${initials}`;
              const initialsWithLastName = `${initials} ${lastName}`;
              
              similarity = Math.max(
                similarity,
                calculateSimilarity(cleanName, lastNameWithInitials),
                calculateSimilarity(cleanName, initialsWithLastName)
              );
            }
            
            const cleanNameParts = cleanName.split(' ');
            const hasSingleLetterInitial = cleanNameParts.some(part => part.length === 1);
            
            if (hasSingleLetterInitial) {
            
              const authorInitials = cleanNameParts
                .filter(part => part.length === 1)
                .map(initial => initial.toLowerCase());
          
              const entryFirstNameInitial = entry.nameParts[0][0].toLowerCase();
              
              if (authorInitials.length > 0 && !authorInitials.includes(entryFirstNameInitial)) {
                similarity = 0;
              }
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

  const getTabIcon = (tabName) => {
    switch(tabName) {
      case 'journal':
        return <BookOpen className="w-5 h-5" />;
      case 'bookchapter':
        return <Book className="w-5 h-5" />;
      case 'reviews':
        return <FileText className="w-5 h-5" />;
      case 'conference':
        return <Users className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTabLabel = (tabName) => {
    switch(tabName) {
      case 'journal':
        return 'Journal Articles';
      case 'bookchapter':
        return 'Book Chapters';
      case 'reviews':
        return 'Reviews';
      case 'conference':
        return 'Conference';
      default:
        return 'Publications';
    }
  };

  const displayedPublications = sortedPublications();
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-xl font-semibold">
              Journal Articles
            </h3>
            <p className='font-semibold text-red-700'>(Data Source: Scopus) </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Download buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCSV}
                className="flex items-center gap-2"
                disabled={displayedPublications.length === 0}
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="flex items-center gap-2"
                disabled={displayedPublications.length === 0}
              >
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
            
            {/* Sort dropdown */}
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
                    <div className="flex items-start gap-4">
                    
                      <span className="font-bold text-gray-600 min-w-6 mt-1">
                        {index + 1}.
                      </span>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-semibold">
                            {pub.title}
                          </h4>
                          
                          {pub.doi && (
                            <a 
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {renderAuthors(pub)}
                      
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Article
                          </span>
                          {pub.open_access && <span className="text-green-600">Open access</span>}
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Cited by: {pub.cited_by}</span>
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
                          <div className="text-sm text-gray-500">
                            <details className="mt-2">
                              <summary className="cursor-pointer hover:text-blue-600">View metrics</summary>
                              <div className="flex flex-wrap gap-4 p-2 mt-2 bg-gray-50 rounded-md">
                                <span className="flex items-center"><img className="w-7 h-7 mr-1" src={fb} alt="Facebook" /> {pub.fb_cite || 0}</span>
                                <span className="flex items-center"><img className="w-7 h-7 mr-1" src={X} alt="X" /> {pub.x_cite || 0}</span>
                                <span className="flex items-center"><Newspaper className="w-5 h-5 text-orange-600 mr-1" /> {pub.news_cite || 0}</span>
                                <span className='flex items-center'><ComputerIcon className="w-5 h-5 text-black mr-1"/>Blog: {pub.blog_cite || 0}</span>
                                <span className="flex items-center"><UserCheck className='w-5 h-5 text-orange-500 mr-1'/>Accounts: {pub.accounts_cite || 0}</span>
                                <span className="flex items-center"><img className="w-7 h-7 " src={altm} alt="Altmetric"/>Altmetric: {pub.alt_score || 0}</span>
                                <span className="flex items-center"><img className="w-7 h-7 " src={mend} alt="Mendeley"/>Mendeley: {pub.mendeley_cite || 0}</span>
                                <span className="flex items-center"><img className='w-7 h-7' src={plum}alt="plumc"></img> PlumX citations: {pub.plumx_citations || 0}</span>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No journal articles found</div>
              )}
            </div>
            
            {!showAll && topPubs.length > 0 && publications.length > topPubs.length && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleViewMoreClick}
                  className="flex items-center gap-2"
                >
                  View All Journal Articles
                  <ChevronDown size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Publications;