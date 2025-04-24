import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Message,
  Form,
  Radio,
  Upload,
  Button,
  Space,
  Spin,
  Alert,
  Divider
} from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';
import SummaryForm from './SummaryForm';
import { summarizeDocument, checkAIHealth } from '../services/aiService';

const DocumentSummarizer = () => {
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await checkAIHealth();
        setIsBackendConnected(true);
        setError(null);
      } catch (err) {
        setIsBackendConnected(false);
        setError('AI Service is currently unavailable. Please try again later.');
        console.error('Backend connection error:', err);
      }
    };

    checkBackendConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (files) => {
    if (files && files.length > 0) {
      const file = files[0].originFile;
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        Message.error('File size should not exceed 10MB');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await summarizeDocument({ file, length: summaryLength });
        setSummary(response.summary);
        setText('');
      } catch (err) {
        setError(err.message || 'Failed to process file');
        console.error('File processing error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await summarizeDocument({ text, length: summaryLength });
      setSummary(response.summary);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
      console.error('Summary generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Typography.Title heading={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        AI Document Summarizer
      </Typography.Title>

      {error && (
        <Alert
          type="error"
          content={error}
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card>
        <Form>
          <Form.Item label="Summary Length">
            <Radio.Group
              value={summaryLength}
              onChange={setSummaryLength}
              type="button"
            >
              <Radio value="short">Short</Radio>
              <Radio value="medium">Medium</Radio>
              <Radio value="long">Long</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Upload File">
            <Upload
              drag
              accept=".pdf,.txt"
              limit={1}
              onDrop={handleFileUpload}
              disabled={!isBackendConnected || loading}
            >
              <div style={{ padding: '20px 0' }}>
                <IconUpload style={{ fontSize: '24px' }} />
                <Typography.Text>
                  Click or drag file to this area to upload
                </Typography.Text>
                <Typography.Text type="secondary">
                  Support for PDF and TXT files
                </Typography.Text>
              </div>
            </Upload>
          </Form.Item>

          <Divider>OR</Divider>

          <Form.Item label="Input Text">
            <Form.TextArea
              value={text}
              onChange={setText}
              placeholder="Enter your text here..."
              style={{ minHeight: '200px' }}
              disabled={!isBackendConnected || loading}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!text.trim() || !isBackendConnected}
              long
            >
              Generate Summary
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {summary && (
        <Card style={{ marginTop: '24px' }}>
          <Typography.Title heading={4}>Summary</Typography.Title>
          <Typography.Paragraph>
            {summary}
          </Typography.Paragraph>
        </Card>
      )}
    </div>
  );
};

export default DocumentSummarizer; 