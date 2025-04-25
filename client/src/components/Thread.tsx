import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface Reply {
  id: number;
  name: string;
  content: string;
  image_url?: string;
  created_at: string;
  tripcode?: {
    name?: string;
    tripcode: string;
  };
}

interface ThreadProps {
  thread: {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
    board_name: string;
    reply_count?: number;
    replies?: Reply[];
    tripcode?: {
      name?: string;
      tripcode: string;
    };
  };
  isThreadPage?: boolean;
  onThreadDeleted?: () => void;
  onReplyDeleted?: (replyId: number) => void;
}

const ThreadContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
`;

const ThreadHeader = styled.div`
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eaeaea;
`;

const ThreadTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 18px;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const ThreadContent = styled.div`
  padding: 15px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    max-height: 300px;
  }
  
  @media (max-width: 480px) {
    max-height: 200px;
  }
`;

const ThreadFooter = styled.div`
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReplyCount = styled.span`
  font-size: 14px;
  color: #7f8c8d;
`;

const ThreadLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RepliesContainer = styled.div`
  margin-top: 20px;
`;

const ReplyContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ReplyMeta = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const ReplyContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReplyImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    max-height: 200px;
  }
  
  @media (max-width: 480px) {
    max-height: 150px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
`;

const ImageInfo = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 5px;
`;

const PostMeta = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const Tripcode = styled.span`
  color: #3498db;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const DeleteInput = styled.input`
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  width: 150px;
  margin-right: 5px;
`;

const DeleteSubmit = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

const Thread: React.FC<ThreadProps> = ({ 
  thread, 
  isThreadPage = false,
  onThreadDeleted,
  onReplyDeleted
}) => {
  const timeAgo = formatDistanceToNow(new Date(thread.created_at), { addSuffix: true });
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };
  
  const handleDeleteClick = () => {
    setShowDeleteForm(true);
  };
  
  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');
    setIsDeleting(true);
    
    try {
      await axios.post(`/api/threads/${thread.id}/delete`, {
        password: deletePassword
      });
      
      if (onThreadDeleted) {
        onThreadDeleted();
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || 'Failed to delete thread');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleReplyDelete = async (replyId: number, password: string) => {
    try {
      await axios.post(`/api/replies/${replyId}/delete`, {
        password
      });
      
      if (onReplyDeleted) {
        onReplyDeleted(replyId);
      }
    } catch (err: any) {
      return err.response?.data?.error || 'Failed to delete reply';
    }
  };
  
  const formatName = (name: string, tripcode?: { name?: string; tripcode: string }) => {
    if (!tripcode) return name;
    
    if (tripcode.name) {
      return `${tripcode.name} !${tripcode.tripcode}`;
    }
    
    return `${name} !${tripcode.tripcode}`;
  };
  
  return (
    <ThreadContainer>
      <ThreadHeader>
        <ThreadTitle>{thread.title || 'Untitled'}</ThreadTitle>
        <ThreadMeta>
          {formatName(thread.name || 'Anonymous', thread.tripcode)} • {timeAgo} • No.{thread.id}
          <DeleteButton onClick={handleDeleteClick}>Delete</DeleteButton>
        </ThreadMeta>
        {showDeleteForm && (
          <DeleteForm onSubmit={handleDeleteSubmit}>
            <DeleteInput
              type="password"
              placeholder="Enter password to delete"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
            />
            <DeleteSubmit type="submit" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </DeleteSubmit>
          </DeleteForm>
        )}
        {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
      </ThreadHeader>
      <ThreadContent>
        {thread.image_url && (
          <ImageContainer>
            <ThreadImage 
              src={thread.image_url} 
              alt="Thread" 
              onClick={() => handleImageClick(thread.image_url!)}
            />
            <ImageInfo>Click to view full size</ImageInfo>
          </ImageContainer>
        )}
        {thread.content}
      </ThreadContent>
      {!isThreadPage && (
        <ThreadFooter>
          <ReplyCount>
            {thread.reply_count || 0} {(thread.reply_count === 1) ? 'Reply' : 'Replies'}
          </ReplyCount>
          <ThreadLink to={`/board/${thread.board_name}/thread/${thread.id}`}>
            View Thread →
          </ThreadLink>
        </ThreadFooter>
      )}
      {isThreadPage && thread.replies && (
        <RepliesContainer>
          {thread.replies.map(reply => (
            <ReplyContainer key={reply.id}>
              <ReplyMeta>
                {formatName(reply.name || 'Anonymous', reply.tripcode)} • {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
              </ReplyMeta>
              {reply.image_url && (
                <ImageContainer>
                  <ReplyImage 
                    src={reply.image_url} 
                    alt="Reply" 
                    onClick={() => handleImageClick(reply.image_url!)}
                  />
                  <ImageInfo>Click to view full size</ImageInfo>
                </ImageContainer>
              )}
              <ReplyContent>{reply.content}</ReplyContent>
            </ReplyContainer>
          ))}
        </RepliesContainer>
      )}
    </ThreadContainer>
  );
};

export default Thread; 