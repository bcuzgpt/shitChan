import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ReplyFormProps {
  boardName: string;
  threadId: number;
  onReplyCreated: (reply: any) => void;
}

const FormContainer = styled.div`
  background-color: #d6daf0;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #b7c5d9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  background-color: #efeff0;
  border: 1px solid #b7c5d9;
  padding: 3px;
  font-family: 'Verdana', sans-serif;
  font-size: 12px;
  width: 200px;
`;

const TextArea = styled.textarea`
  background-color: #efeff0;
  border: 1px solid #b7c5d9;
  padding: 3px;
  font-family: 'Verdana', sans-serif;
  font-size: 12px;
  width: 100%;
  height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: #d6daf0;
  border: 1px solid #b7c5d9;
  padding: 3px 8px;
  font-family: 'Verdana', sans-serif;
  font-size: 12px;
  cursor: pointer;
  color: #800000;

  &:hover {
    background-color: #b7c5d9;
  }
`;

const FileInput = styled.div`
  margin-bottom: 5px;
`;

const ErrorMessage = styled.div`
  color: #800000;
  font-size: 12px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #008000;
  font-size: 12px;
  margin-top: 5px;
`;

const FileInfo = styled.div`
  font-size: 12px;
  color: #800000;
  margin-top: 5px;
`;

const CheckboxLabel = styled.label`
  font-size: 12px;
  color: #800000;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const ReplyForm: React.FC<ReplyFormProps> = ({
  boardName,
  threadId,
  onReplyCreated
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !fileInputRef.current?.files?.length) {
      setError('Please provide at least content or an image');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData();
    formData.append('comment', content);
    
    // Add name and sage if provided
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const sageInput = document.querySelector('input[name="sage"]') as HTMLInputElement;
    
    if (nameInput && nameInput.value) {
      formData.append('name', nameInput.value);
    }
    
    if (sageInput && sageInput.checked) {
      formData.append('sage', 'true');
    }
    
    // Add file if present
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit');
        setIsSubmitting(false);
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed');
        setIsSubmitting(false);
        return;
      }
      
      formData.append('image', file);
    }
    
    try {
      const response = await axios.post(
        `/api/threads/${threadId}/replies`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSuccess('Reply posted successfully!');
      onReplyCreated(response.data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error posting reply:', err);
      setError(err.response?.data?.message || 'Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            maxLength={50}
          />
          <CheckboxLabel>
            <Checkbox type="checkbox" name="sage" />
            Sage
          </CheckboxLabel>
        </FormRow>
        <TextArea
          placeholder="Enter your reply here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required={!fileInputRef.current?.files?.length}
        />
        
        <FileInput>
          <Input 
            type="file" 
            name="image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            ref={fileInputRef}
          />
          <FileInfo>Max file size: 5MB. Allowed formats: JPEG, PNG, GIF, WebP</FileInfo>
        </FileInput>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ReplyForm; 