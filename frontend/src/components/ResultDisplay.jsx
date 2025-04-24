import React from 'react';
import { Typography, Alert } from '@arco-design/web-react';

const { Title, Paragraph } = Typography;

export default function ResultDisplay({ results, error }) {
  if (error) {
    return (
      <Alert
        type="error"
        className="error-message"
        title="Error"
        content={error}
      />
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div>
      <div className="summary-content">
        <Title heading={6}>Summary</Title>
        <Paragraph>{results.summary}</Paragraph>
      </div>

      {results.key_points && (
        <div className="key-points">
          <Title heading={6}>Key Points</Title>
          <ul>
            {results.key_points.map((point, index) => (
              <li key={index}>
                <Paragraph>{point}</Paragraph>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 