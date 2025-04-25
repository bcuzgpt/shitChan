import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import ReplyForm from './ReplyForm';

interface ThreadDetailParams {
  boardName: string;
  threadId: string;
}

interface Reply {
  id: number;
  content: string;
  image_url: string | null;
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  reply_count: number;
  replies: Reply[];
}

const ThreadDetailContainer = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
`;

const ThreadHeader = styled.div`
  border-bottom: 1px solid #dfe4ea;
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const ThreadTitle = styled.h1`
  font-size: 24px;
  margin: 0 0 10px;
  color: #2f3640;
`;

const ThreadContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
  white-space: pre-wrap;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  object-fit: contain;
`;

const ThreadMeta = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ReplySection = styled.div`
  margin-top: 30px;
`;

const ReplyCount = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: #2f3640;
  border-bottom: 1px solid #dfe4ea;
  padding-bottom: 10px;
`;

const ReplyItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ReplyContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 10px;
  white-space: pre-wrap;
`;

const ReplyImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  object-fit: contain;
`;

const ReplyMeta = styled.div`
  font-size: 14px;
  color: #7f8c8d;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  font-size: 18px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  font-size: 18px;
  color: #e74c3c;
`;

const ThreadDetail: React.FC = () => {
  const { boardName, threadId } = useParams<ThreadDetailParams>();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchThread = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/boards/${boardName}/threads/${threadId}`);
      setThread(response.data);
    } catch (err: any) {
      console.error('Error fetching thread:', err);
      setError(err.response?.data?.message || 'Failed to load thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (boardName && threadId) {
      fetchThread();
    }
  }, [boardName, threadId]);
  
  const handleReplyCreated = (newReply: Reply) => {
    if (thread) {
      setThread({
        ...thread,
        replies: [...thread.replies, newReply],
        reply_count: thread.reply_count + 1
      });
    }
  };
  
  const handleGoBack = () => {
    navigate(`/board/${boardName}`);
  };
  
  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };
  
  if (loading) {
    return <LoadingMessage>Loading thread...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (!thread) {
    return <ErrorMessage>Thread not found</ErrorMessage>;
  }
  
  return (
    <ThreadDetailContainer>
      <BackButton onClick={handleGoBack}>Back to /{boardName}/</BackButton>
      
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>
          Posted {formatDistanceToNow(new Date(thread.created_at))} ago
        </ThreadMeta>
        <ThreadContent>{thread.content}</ThreadContent>
        {thread.image_url && (
          <ThreadImage 
            src={thread.image_url} 
            alt="Thread" 
            onClick={() => handleImageClick(thread.image_url!)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
              target.onerror = null;
            }}
          />
        )}
      </ThreadHeader>
      
      <ReplyForm 
        boardName={boardName!} 
        threadId={parseInt(threadId!)} 
        onReplyCreated={handleReplyCreated} 
      />
      
      <ReplySection>
        <ReplyCount>{thread.replies.length} Replies</ReplyCount>
        
        {thread.replies.length === 0 ? (
          <p>No replies yet. Be the first to reply!</p>
        ) : (
          thread.replies.map((reply) => (
            <ReplyItem key={reply.id}>
              <ReplyContent>{reply.content}</ReplyContent>
              {reply.image_url && (
                <ReplyImage 
                  src={reply.image_url} 
                  alt="Reply" 
                  onClick={() => handleImageClick(reply.image_url!)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.svg';
                    target.onerror = null;
                  }}
                />
              )}
              <ReplyMeta>
                Posted {formatDistanceToNow(new Date(reply.created_at))} ago
              </ReplyMeta>
            </ReplyItem>
          ))
        )}
      </ReplySection>
    </ThreadDetailContainer>
  );
};

export default ThreadDetail; 