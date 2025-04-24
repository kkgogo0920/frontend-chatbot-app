import React, { useState } from 'react';
import { Upload, Message } from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';

export default function FileUpload({ onFileContent }) {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = async (files) => {
    const file = files[0];
    if (!file) return;

    try {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size should not exceed 10MB');
      }

      if (file.type !== 'text/plain') {
        throw new Error('Only .txt files are supported');
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          onFileContent(e.target.result, file.name);
        } catch (error) {
          Message.error('Failed to read file content');
          console.error('File reading error:', error);
        }
      };

      reader.onerror = () => {
        Message.error('Failed to read file');
      };

      reader.readAsText(file);
    } catch (error) {
      Message.error(error.message || 'Failed to process file');
      console.error('File processing error:', error);
    }
  };

  return (
    <Upload
      drag
      accept=".txt"
      multiple={false}
      showUploadList={false}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onChange={handleFileChange}
      className={`file-upload-zone ${dragging ? 'dragging' : ''}`}
    >
      <div className="upload-content">
        <div className="upload-icon">
          <IconUpload />
        </div>
        <div className="upload-text">
          <p>Click or drag file to this area to upload</p>
          <p className="upload-hint">Support for .txt files only (Max: 10MB)</p>
        </div>
      </div>
    </Upload>
  );
} 