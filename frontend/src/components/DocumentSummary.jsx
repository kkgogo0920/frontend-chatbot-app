import React, { useState } from 'react';
import { Card, Typography, Message, Spin } from '@arco-design/web-react';
import SummaryForm from './SummaryForm';
import ResultDisplay from './ResultDisplay';
import { API_URL } from '../constants/config';
import { useAuth } from '../contexts/AuthContext';
import '../styles/DocumentSummary.css';

const { Title } = Typography;

const DocumentSummary = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      let response;
      const token = localStorage.getItem('token');
      
      if (formData.file) {
        // Handle file upload
        const fileData = new FormData();
        fileData.append('file', formData.file);
        fileData.append('length', formData.length);
        
        response = await fetch(`${API_URL}/ai/summarize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: fileData,
        });
      } else {
        // Handle text input
        response = await fetch(`${API_URL}/ai/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: formData.text,
            length: formData.length
          }),
        });
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setResults(data);
      Message.success('Summary generated successfully');
    } catch (err) {
      setError(err.message);
      Message.error({
        content: err.message,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="document-summary-container">
        <Card title="AI Document Summarizer" bordered={false}>
          <div className="error-message">
            Please log in to use the document summarizer.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="document-summary-container">
      <Card title="AI Document Summarizer" bordered={false}>
        <Spin loading={loading} tip="Generating summary...">
          <SummaryForm onSubmit={handleSubmit} loading={loading} />
          
          {(results || error) && (
            <div className="summary-results">
              <ResultDisplay results={results} error={error} />
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default DocumentSummary; 