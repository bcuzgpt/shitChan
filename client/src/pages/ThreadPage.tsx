import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { formatDistanceToNow } from 'date-fns';
import ReplyForm from '../components/ReplyForm';

interface ThreadData {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  replies: ReplyData[];
}

interface ReplyData {
  id: number;
  content: string;
  created_at: string;
  image_url: string | null;
}

const ThreadPageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const ThreadHeader = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const ThreadTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const ThreadContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  white-space: pre-wrap;
`;

const ThreadMeta = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  display: block;
  margin: 15px 0;
  border-radius: 4px;
  cursor: pointer;
`;

const RepliesSection = styled.div`
  margin-top: 30px;
`;

const RepliesHeader = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
`;

const Reply = styled.div`
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  white-space: pre-wrap;
`;

const ReplyMeta = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const ReplyContent = styled.div`
  margin-bottom: 15px;
`;

const ReplyImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  display: block;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
`;

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 20px;
  color: #3498db;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #e74c3c;
  background-color: #fdf1f0;
  border-radius: 4px;
`;

const ThreadPage: React.FC = () => {
  const { boardName, threadId } = useParams<{ boardName: string; threadId: string }>();
  const navigate = useNavigate();
  
  const [thread, setThread] = useState<ThreadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchThread = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/boards/${boardName}/threads/${threadId}`);
      setThread(response.data);
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError('Failed to load thread. It may have been deleted or doesn\'t exist.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchThread();
  }, [boardName, threadId]);
  
  const handleReplyCreated = (newReply: ReplyData) => {
    if (thread) {
      setThread({
        ...thread,
        replies: [...thread.replies, newReply],
      });
    }
  };
  
  const goBack = () => {
    navigate(`/board/${boardName}`);
  };
  
  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };
  
  if (loading) {
    return (
      <ThreadPageContainer>
        <Helmet>
          <title>Loading Thread | shitChan</title>
        </Helmet>
        <LoadingMessage>Loading thread...</LoadingMessage>
      </ThreadPageContainer>
    );
  }
  
  if (error || !thread) {
    return (
      <ThreadPageContainer>
        <Helmet>
          <title>Thread Not Found | shitChan</title>
        </Helmet>
        <BackLink onClick={goBack}>← Back to board</BackLink>
        <ErrorMessage>{error || 'Thread not found'}</ErrorMessage>
      </ThreadPageContainer>
    );
  }
  
  const timeAgo = formatDistanceToNow(new Date(thread.created_at), { addSuffix: true });
  
  return (
    <ThreadPageContainer>
      <Helmet>
        <title>{thread.title} | shitChan</title>
      </Helmet>
      
      <BackLink onClick={goBack}>← Back to board</BackLink>
      
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>Posted {timeAgo}</ThreadMeta>
      </ThreadHeader>
      
      <ThreadContent>
        {thread.content}
        {thread.image_url && (
          <ThreadImage 
            src={thread.image_url} 
            alt="Thread image" 
            onClick={() => openImageInNewTab(thread.image_url as string)}
          />
        )}
      </ThreadContent>
      
      <ReplyForm
        threadId={thread.id}
        boardName={boardName || ''}
        onReplyCreated={handleReplyCreated}
      />
      
      <RepliesSection>
        <RepliesHeader>
          {thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}
        </RepliesHeader>
        
        {thread.replies.length === 0 ? (
          <p>No replies yet. Be the first to reply!</p>
        ) : (
          thread.replies.map((reply) => {
            const replyTimeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
            
            return (
              <Reply key={reply.id}>
                <ReplyMeta>Posted {replyTimeAgo}</ReplyMeta>
                <ReplyContent>{reply.content}</ReplyContent>
                {reply.image_url && (
                  <ReplyImage 
                    src={reply.image_url} 
                    alt="Reply image"
                    onClick={() => openImageInNewTab(reply.image_url as string)}
                  />
                )}
              </Reply>
            );
          })
        )}
      </RepliesSection>
    </ThreadPageContainer>
  );
};

export default ThreadPage; 