import { useState } from 'react';
import { Form, Button, Radio, Input, Space, Divider, Upload, Message } from '@arco-design/web-react';
import { IconSend, IconUpload } from '@arco-design/web-react/icon';
import SummaryOptions from './SummaryOptions';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default function SummaryForm({ onSubmit, loading }) {
  const [form] = Form.useForm();
  const [inputType, setInputType] = useState('text');
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (files) => {
    const uploadedFile = files[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
      Message.error('File size should not exceed 10MB');
      return;
    }

    setFile(uploadedFile);

    // If it's a text file, show preview
    if (uploadedFile.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
        form.setFieldValue('textContent', e.target.result);
      };
      reader.onerror = () => {
        Message.error('Failed to read file');
      };
      reader.readAsText(uploadedFile);
    } else if (uploadedFile.type === 'application/pdf') {
      setFileContent('PDF file selected: ' + uploadedFile.name);
      form.setFieldValue('textContent', 'PDF file will be processed on the server');
    } else {
      Message.error('Only .txt and .pdf files are supported');
      setFile(null);
      setFileContent(null);
    }
  };

  const handleSubmit = async (values) => {
    if (inputType === 'file' && !file) {
      Message.error('Please select a file');
      return;
    }

    const formData = {
      length: values.summaryLength,
    };

    if (inputType === 'file') {
      formData.file = file;
    } else {
      formData.text = values.textContent;
    }
    
    await onSubmit(formData);
  };

  const handleReset = () => {
    form.resetFields();
    setFile(null);
    setFileContent(null);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onSubmit={handleSubmit}
      autoComplete="off"
      initialValues={{
        inputType: 'text',
        summaryLength: 'medium'
      }}
    >
      <FormItem 
        label="Input Method" 
        field="inputType"
      >
        <Radio.Group 
          type="button" 
          value={inputType} 
          onChange={setInputType}
        >
          <Radio value="text">Paste Text</Radio>
          <Radio value="file">Upload File</Radio>
        </Radio.Group>
      </FormItem>

      {inputType === 'text' ? (
        <FormItem
          label="Text Content"
          field="textContent"
          rules={[{ required: true, message: 'Please enter text to summarize' }]}
        >
          <TextArea
            placeholder="Paste your document text here..."
            style={{ minHeight: 200 }}
            showWordLimit
            maxLength={20000}
          />
        </FormItem>
      ) : (
        <FormItem
          label="Upload Document"
          field="textContent"
          rules={[{ required: true, message: 'Please upload a file' }]}
        >
          <Upload
            drag
            accept=".txt,.pdf"
            multiple={false}
            showUploadList={false}
            onChange={handleFileChange}
            className="file-upload-zone"
          >
            <div className="upload-content">
              <div className="upload-icon">
                <IconUpload />
              </div>
              <div className="upload-text">
                <p>Click or drag file to this area to upload</p>
                <p className="upload-hint">Support for .txt and .pdf files (Max: 10MB)</p>
              </div>
            </div>
          </Upload>

          {fileContent && (
            <div className="file-preview">
              <TextArea
                value={fileContent}
                style={{ minHeight: 200, marginTop: 16 }}
                readOnly
              />
            </div>
          )}
        </FormItem>
      )}

      <Divider />

      <FormItem
        label="Summary Length"
        field="summaryLength"
      >
        <SummaryOptions />
      </FormItem>

      <FormItem>
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<IconSend />}
          >
            Summarize
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </FormItem>
    </Form>
  );
} 