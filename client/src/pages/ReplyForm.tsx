import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ReplyFormProps {
  boardName: string;
  threadId: number;
  onReplyCreated: (reply: any) => void;
}

const FormContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 1px #3498db;
  }
`;

const FileInput = styled.input`
  margin-bottom: 15px;
`;

const FileInputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 14px;
  padding: 8px;
  background-color: #fdf1f0;
  border-radius: 4px;
`;

const CharacterCount = styled.div<{ isNearLimit: boolean }>`
  text-align: right;
  margin-bottom: 10px;
  font-size: 12px;
  color: ${props => props.isNearLimit ? '#e74c3c' : '#7f8c8d'};
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-bottom: 15px;
  font-size: 14px;
  padding: 8px;
  background-color: #eafaf1;
  border-radius: 4px;
`;

const ReplyForm: React.FC<ReplyFormProps> = ({ boardName, threadId, onReplyCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const MAX_CONTENT_LENGTH = 4000;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Reply content is required');
      return;
    }
    
    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be ${MAX_CONTENT_LENGTH} characters or less`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const formData = new FormData();
      formData.append('content', content);
      
      if (file) {
        formData.append('image', file);
      }
      
      const response = await axios.post(
        `/api/boards/${boardName}/threads/${threadId}/replies`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setContent('');
      setFile(null);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      if (onReplyCreated) {
        onReplyCreated(response.data);
      }
      
    } catch (err: any) {
      console.error('Error creating reply:', err);
      setError(err.response?.data?.message || 'Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        e.target.value = '';
        return;
      }
    }
    
    setFile(selectedFile);
    setError('');
  };
  
  const isNearLimit = content.length > MAX_CONTENT_LENGTH * 0.9;
  
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {showSuccess && <SuccessMessage>Reply posted successfully!</SuccessMessage>}
        
        <TextArea
          placeholder="Write your reply here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        
        <CharacterCount isNearLimit={isNearLimit || content.length > MAX_CONTENT_LENGTH}>
          {content.length}/{MAX_CONTENT_LENGTH} characters
        </CharacterCount>
        
        <FileInputLabel>
          Add an image (optional):
          <FileInput 
            type="file" 
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
          />
        </FileInputLabel>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ReplyForm; 