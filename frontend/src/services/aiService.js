import { API_URL } from '../constants/config';
import axios from 'axios';

export const summarizeDocument = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not logged in, please log in first.');
    }

    if (data.file) {
      // Handle file upload
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.length) {
        formData.append('length', data.length);
      }

      const response = await axios.post(`${API_URL}/ai/summarize`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (!response.data || response.data.error) {
        throw new Error(response.data?.error || 'Failed to generate summary.');
      }
      
      return response.data;
    } else if (data.text) {
      // Handle text input
      const response = await axios.post(`${API_URL}/ai/summarize`, {
        text: data.text,
        length: data.length || 'medium'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.data || response.data.error) {
        throw new Error(response.data?.error || 'Failed to generate summary.');
      }
      
      return response.data;
    } else {
      throw new Error('Please provide text or file.');
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to generate summary, please try again later.');
    }
  }
};

export const checkAIHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/ai/health`);
    return response.data;
  } catch (error) {
    console.error('Health Check Error:', error);
    throw new Error(error.response?.data?.error || '健康检查失败');
  }
}; 