import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports researcher profile data to a PDF document
 * @param {Object} profileData - The complete profile data object
 * @param {Array} publicationsData - Publications data
 * @param {Array} chartData - Chart data for publication history
 * @returns {Promise} - Promise that resolves when PDF download is complete
 */
const handleExport = async (profileData, publicationsData, chartData) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // // Add title
    // doc.setFont('helvetica', 'bold');
    // doc.setFontSize(16);
    // doc.text('Researcher Profile', pageWidth / 2, yPosition, { align: 'center' });
    // yPosition += 10;
    
    // Add profile image if available
    if (profileData.profile.image_url) {
      const API_BASE_URL = 'http://localhost:8000';
      const imgUrl = `${API_BASE_URL}${profileData.profile.image_url}`;
      
      try {
        // Create temporary image element
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        // Convert image to canvas and then to data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        // Add image to PDF
        const imgWidth = 40;
        const imgHeight = (img.height * imgWidth) / img.width;
        doc.addImage(dataUrl, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        
        // Position text to the right of the image
        const textX = margin + imgWidth + 5;
        doc.setFontSize(14);
        doc.text(profileData.profile.name || 'Name not provided', textX, yPosition + 8);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(profileData.profile.designation || 'Designation not provided', textX, yPosition + 15);
        doc.text(profileData.profile.department || 'Department not provided', textX, yPosition + 21);
        doc.text(profileData.profile.expertise || 'Expertise not provided', textX, yPosition + 27);
        doc.text(profileData.profile.state || 'Location not provided', textX, yPosition + 33);
        
        yPosition += Math.max(imgHeight, 40) + 5;
      } catch (error) {
        console.error('Error adding profile image:', error);
        // Continue without image if there's an error
        doc.setFontSize(14);
        doc.text(profileData.profile.name || 'Name not provided', margin, yPosition + 8);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(profileData.profile.designation || 'Designation not provided', margin, yPosition + 15);
        doc.text(profileData.profile.department || 'Department not provided', margin, yPosition + 21);
        doc.text(profileData.profile.expertise || 'Expertise not provided', margin, yPosition + 27);
        doc.text(profileData.profile.state || 'Location not provided', margin, yPosition + 33);
        
        yPosition += 40;
      }
    } else {
      // No image, just add text
      doc.setFontSize(14);
      doc.text(profileData.profile.name || 'Name not provided', margin, yPosition + 8);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(profileData.profile.designation || 'Designation not provided', margin, yPosition + 15);
      doc.text(profileData.profile.department || 'Department not provided', margin, yPosition + 21);
      doc.text(profileData.profile.expertise || 'Expertise not provided', margin, yPosition + 27);
      doc.text(profileData.profile.state || 'Location not provided', margin, yPosition + 33);
      
      yPosition += 40;
    }
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    
    // Add chart if available
    if (chartData && chartData.length > 0) {
      const chartElement = document.querySelector('.publication-chart-container');
      if (chartElement) {
        try {
          // Add chart title
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Publication and Citation History', margin, yPosition);
          yPosition += 10;
          
          // Capture the chart as canvas
          const canvas = await html2canvas(chartElement, { scale: 2 });
          const chartImgData = canvas.toDataURL('image/png');
          
          // Calculate image dimensions to fit within page width
          const chartWidth = pageWidth - (margin * 4);
          const chartHeight = (canvas.height * chartWidth) / canvas.width;
          
          // Add the chart image to PDF
          doc.addImage(chartImgData, 'PNG', margin, yPosition, chartWidth, chartHeight);
          yPosition += chartHeight + 10;
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
          
          const chartTableData = chartData.map(item => [
            item.year.toString(),
            item.Publications.toString(),
            item.Citations.toString()
          ]);
          
          doc.autoTable({
            head: [['Year', 'Publications', 'Citations']],
            body: chartTableData,
            startY: yPosition,
            margin: { left: margin },
            styles: { fontSize: 10 },
            headStyles: { fillColor: [59, 130, 246] }
          });
          
          yPosition = doc.lastAutoTable.finalY + 10;
        }
      } else {
        const chartTableData = chartData.map(item => [
          item.year.toString(),
          item.Publications.toString(),
          item.Citations.toString()
        ]);
        
        doc.autoTable({
          head: [['Year', 'Publications', 'Citations']],
          body: chartTableData,
          startY: yPosition,
          margin: { left: margin },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [59, 130, 246] }
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
      }
    }
    
    // Add Academic Identity
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Academic Identity', margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    if (profileData.profile.orcid_url) {
      doc.text(`ORCID ID: ${profileData.profile.orcid_url.split('/').pop() || 'N/A'}`, margin, yPosition);
      yPosition += 5;
    }
    
    if (profileData.profile.scopus_url) {
      doc.text(`Scopus ID: ${profileData.profile.scopus_url.split('=').pop() || 'N/A'}`, margin, yPosition);
      yPosition += 5;
    }
    
    if (profileData.profile.publons_id) {
      doc.text(`Publons ID: ${profileData.profile.publons_id || 'N/A'}`, margin, yPosition);
      yPosition += 5;
    }
    
    if (profileData.profile.google_scholar_id) {
      doc.text(`Google Scholar ID: ${profileData.profile.google_scholar_id || 'N/A'}`, margin, yPosition);
      yPosition += 10;
    }
    
    // Add Research Metrics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Research Metrics', margin, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const totalPublications = publicationsData.length;
    const totalCitations = publicationsData.reduce((sum, pub) => sum + (pub.cited_by || 0), 0);
    const citationData = profileData.citation_data?.[0] || {};
    const hIndex = citationData.h_index || Math.floor(Math.sqrt(totalCitations));
    const iIndex = publicationsData.filter(pub => (pub.cited_by || 0) >= 10).length;
    
    doc.text(`Total Publications: ${totalPublications}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Total Citations: ${totalCitations}`, margin, yPosition);
    yPosition += 5;
    doc.text(`H-Index: ${hIndex}`, margin, yPosition);
    yPosition += 5;
    doc.text(`I-Index: ${iIndex}`, margin, yPosition);
    yPosition += 10;
    
    
    // Add Professional Experience Section
    yPosition = addSectionToPDF(doc, 'Professional Experience', profileData.professional_experiences || [], [
      { key: 'position', label: 'Position' },
      { key: 'organization', label: 'Organization' },
      { key: 'start_year', label: 'From' },
      { key: 'end_year', label: 'To' }
    ], yPosition, margin, contentWidth);
    
    // Add Qualifications Section
    yPosition = addSectionToPDF(doc, 'Qualifications', profileData.qualifications || [], [
      { key: 'qualification', label: 'Degree' },
      { key: 'authority', label: 'Institution' },
      { key: 'year', label: 'Year' },
    ], yPosition, margin, contentWidth);
    
    // Add Awards and Recognition Section
    yPosition = addSectionToPDF(doc, 'Awards and Recognition', profileData.honors_and_awards || [], [
      { key: 'award_name', label: 'Award' },
      { key: 'year', label: 'Year' },
      { key: 'awarding_authority', label: 'Organization' }
    ], yPosition, margin, contentWidth);
    
    // Save the PDF
    doc.save(`${profileData.profile.name || 'Researcher'}_Profile.pdf`);
    console.log('PDF export completed successfully');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Helper function to add a section to the PDF
 * @param {Object} doc - The jsPDF document
 * @param {String} title - Section title
 * @param {Array} items - Array of items to display
 * @param {Array} fields - Fields to display for each item
 * @param {Number} yPosition - Current y position
 * @param {Number} margin - Page margin
 * @param {Number} contentWidth - Width of content area
 * @returns {Number} - New y position after adding content
 */
const addSectionToPDF = (doc, title, items, fields, yPosition, margin, contentWidth) => {

  if (yPosition > 260) {
    doc.addPage();
    yPosition = 15;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, margin, yPosition);
  yPosition += 8;
  
  if (!items || items.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('No data available', margin, yPosition);
    yPosition += 10;
    return yPosition;
  }
  
  // Add items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  items.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 15;
    }
    if (items.length > 1) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}.`, margin, yPosition);
      doc.setFont('helvetica', 'normal');
    }
    
    // Add item details
    let itemYPosition = yPosition;
    fields.forEach(field => {
      const value = item[field.key] || 'N/A';
      doc.text(`${field.label}: ${value}`, margin + 5, itemYPosition);
      itemYPosition += 5;
    });
    
    yPosition = itemYPosition + 2;
  });
  
  return yPosition + 5;
};

export default handleExport;