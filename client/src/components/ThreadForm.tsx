import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ThreadFormProps {
  boardName: string;
  onThreadCreated: (thread: any) => void;
  isReply?: boolean;
  threadId?: number;
}

const FormContainer = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FileInput = styled.input`
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const ThreadForm: React.FC<ThreadFormProps> = ({
  boardName,
  onThreadCreated,
  isReply = false,
  threadId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (!isReply) {
        formData.append('title', title);
      }
      formData.append('content', content);
      if (file) {
        formData.append('image', file);
      }

      let response;
      if (isReply && threadId) {
        response = await axios.post(
          `/api/threads/${threadId}/replies`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        response = await axios.post(
          `/api/boards/${boardName}/threads`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      onThreadCreated(response.data);
      setTitle('');
      setContent('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        setFile(null);
        e.target.value = '';
        return;
      }
      if (!selectedFile.type.match(/^image\/(jpeg|png|gif)$/)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        {!isReply && (
          <Input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        )}
        <TextArea
          placeholder={isReply ? "Reply Content" : "Thread Content"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isReply
              ? 'Posting Reply...'
              : 'Creating Thread...'
            : isReply
            ? 'Post Reply'
            : 'Create Thread'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ThreadForm; 