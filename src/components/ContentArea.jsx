import React from 'react';
import '../styles/ContentArea.css';

const appContent = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus."
];

const documentContent = [
  "Document management systems help organizations store, manage, and track electronic documents.",
  "Cloud-based solutions provide easy access to documents from anywhere with an internet connection.",
  "Security features like encryption and access controls protect sensitive information in documents.",
  "Collaboration tools allow multiple users to work on documents simultaneously with version control.",
  "Automated workflows can route documents through approval processes and notify relevant stakeholders.",
  "Digital signatures validate the authenticity of documents and comply with legal requirements in many jurisdictions."
];

function ContentArea({ page = "0", searchQuery = "" }) {
  const content = page === "0" ? appContent : documentContent;
  
  const filteredContent = searchQuery
    ? content.filter(paragraph => 
        paragraph.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : content;
  
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={index} className="highlight">{part}</span> 
        : part
    );
  };

  return (
    <div className="content-area">
      <h2>{page === "0" ? "Apps" : "Documents"} Page</h2>
      {filteredContent.length > 0 ? (
        <div className="paragraphs">
          {filteredContent.map((paragraph, index) => (
            <p key={index} className="paragraph">
              {highlightMatch(paragraph, searchQuery)}
            </p>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No content matches your search criteria.</p>
        </div>
      )}
    </div>
  );
}

export default ContentArea;