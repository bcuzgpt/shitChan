import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const FormContainer = styled.form`
  background-color: #d6daf0;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #b7c5d9;
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

const FileInfo = styled.div`
  font-size: 12px;
  color: #800000;
  margin-top: 5px;
`;

interface ThreadFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isReply?: boolean;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ onSubmit, isReply = false }) => {
  const { boardName } = useParams<{ boardName: string }>();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Validate file if present
    const file = formData.get('image') as File;
    if (file && file.size > 0) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit');
        setIsSubmitting(false);
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(formData);
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormRow>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          maxLength={50}
        />
        <Input
          type="text"
          name="tripcode"
          placeholder="Tripcode (optional)"
          maxLength={20}
        />
      </FormRow>
      <FormRow>
        <Input
          type="password"
          name="password"
          placeholder="Password (required for deletion)"
          required
        />
        <CheckboxLabel>
          <Checkbox type="checkbox" name="sage" />
          Sage
        </CheckboxLabel>
      </FormRow>
      <TextArea
        name="content"
        placeholder="Your message"
        required
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : isReply ? 'Post Reply' : 'Create Thread'}
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default ThreadForm; 