import React, { useState, useRef, useEffect } from 'react';
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
  &::-webkit-file-upload-button {
    background: #3498db;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    
    &:hover {
      background: #2980b9;
    }
  }
`;

const FileInfo = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 5px;
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
  display: block;
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

const AnonOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const AnonOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const Label = styled.label`
  font-size: 14px;
  color: #2c3e50;
`;

const PasswordInput = styled(Input)`
  width: 200px;
`;

const TripcodeInput = styled(Input)`
  width: 200px;
`;

const AnonInfo = styled.div`
  font-size: 12px;
  color: #7f8c8d;
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
  const [name, setName] = useState('');
  const [tripcode, setTripcode] = useState('');
  const [password, setPassword] = useState('');
  const [sage, setSage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      if (name) {
        formData.append('name', name);
      }
      if (tripcode) {
        formData.append('tripcode', tripcode);
      }
      if (password) {
        formData.append('password', password);
      }
      if (sage) {
        formData.append('sage', 'true');
      }
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
      setName('');
      setTripcode('');
      setPassword('');
      setSage(false);
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
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
        setPreviewUrl(null);
        e.target.value = '';
        return;
      }
      if (!selectedFile.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed');
        setFile(null);
        setPreviewUrl(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
        />
        <FileInfo>Max file size: 5MB. Allowed formats: JPEG, PNG, GIF, WebP</FileInfo>
        {previewUrl && <ImagePreview src={previewUrl} alt="Preview" />}
        
        <AnonOptions>
          <AnonOption>
            <Label htmlFor="name">Name:</Label>
            <Input
              id="name"
              type="text"
              placeholder="Anonymous (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </AnonOption>
          
          <AnonOption>
            <Label htmlFor="tripcode">Tripcode:</Label>
            <TripcodeInput
              id="tripcode"
              type="password"
              placeholder="Optional identity verification"
              value={tripcode}
              onChange={(e) => setTripcode(e.target.value)}
            />
            <AnonInfo>Format: name#tripcode</AnonInfo>
          </AnonOption>
          
          <AnonOption>
            <Label htmlFor="password">Password:</Label>
            <PasswordInput
              id="password"
              type="password"
              placeholder="For post deletion"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </AnonOption>
          
          <AnonOption>
            <Checkbox
              id="sage"
              type="checkbox"
              checked={sage}
              onChange={(e) => setSage(e.target.checked)}
            />
            <Label htmlFor="sage">Sage (prevent thread bumping)</Label>
          </AnonOption>
        </AnonOptions>
        
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