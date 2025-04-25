import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ReplyForm from './ReplyForm';
import { formatDistanceToNow } from 'date-fns';

interface ThreadDetailParams {
  boardName: string;
  threadId: string;
}

interface Reply {
  id: number;
  content: string;
  image_url?: string;
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  replies: Reply[];
}

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const ThreadContainer = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  padding: 20px;
`;

const ThreadHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;

const ThreadTitle = styled.h1`
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  color: #7f8c8d;
  font-size: 14px;
`;

const ThreadContent = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
`;

const RepliesContainer = styled.div`
  margin-top: 30px;
`;

const RepliesHeader = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #2c3e50;
`;

const ReplyContainer = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
`;

const ReplyMeta = styled.div`
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ReplyContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ReplyImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background-color: #fdf1f0;
  border-radius: 4px;
  padding: 15px;
  color: #e74c3c;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 8px 12px;
  background-color: #f1f2f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #dfe4ea;
  }
`;

const ThreadDetail: React.FC = () => {
  const { boardName, threadId } = useParams<ThreadDetailParams>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/boards/${boardName}/threads/${threadId}`);
        setThread(response.data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching thread:', err);
        setError(err.response?.data?.message || 'Failed to load thread. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThread();
  }, [boardName, threadId]);
  
  const handleReplyCreated = (newReply: Reply) => {
    if (thread) {
      setThread({
        ...thread,
        replies: [...thread.replies, newReply]
      });
    }
  };
  
  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };
  
  const goBack = () => {
    window.history.back();
  };
  
  if (loading) {
    return <LoadingMessage>Loading thread...</LoadingMessage>;
  }
  
  if (error) {
    return (
      <PageContainer>
        <BackButton onClick={goBack}>← Back</BackButton>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }
  
  if (!thread) {
    return (
      <PageContainer>
        <BackButton onClick={goBack}>← Back</BackButton>
        <ErrorMessage>Thread not found.</ErrorMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackButton onClick={goBack}>← Back to board</BackButton>
      
      <ThreadContainer>
        <ThreadHeader>
          <ThreadTitle>{thread.title}</ThreadTitle>
          <ThreadMeta>
            {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
          </ThreadMeta>
        </ThreadHeader>
        
        <ThreadContent>{thread.content}</ThreadContent>
        
        {thread.image_url && (
          <ThreadImage 
            src={thread.image_url} 
            alt="Thread image" 
            onClick={() => handleImageClick(thread.image_url!)}
          />
        )}
      </ThreadContainer>
      
      <ReplyForm 
        boardName={boardName!} 
        threadId={parseInt(threadId!)} 
        onReplyCreated={handleReplyCreated} 
      />
      
      <RepliesContainer>
        <RepliesHeader>
          {thread.replies.length > 0 
            ? `${thread.replies.length} ${thread.replies.length === 1 ? 'Reply' : 'Replies'}`
            : 'No replies yet'}
        </RepliesHeader>
        
        {thread.replies.map(reply => (
          <ReplyContainer key={reply.id}>
            <ReplyMeta>
              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
            </ReplyMeta>
            
            <ReplyContent>{reply.content}</ReplyContent>
            
            {reply.image_url && (
              <ReplyImage 
                src={reply.image_url} 
                alt="Reply image" 
                onClick={() => handleImageClick(reply.image_url!)}
              />
            )}
          </ReplyContainer>
        ))}
      </RepliesContainer>
    </PageContainer>
  );
};

export default ThreadDetail; 