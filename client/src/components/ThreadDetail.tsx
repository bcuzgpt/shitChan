import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ThreadForm from './ThreadForm';

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
  board: string;
  replies: Reply[];
}

const ThreadDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ThreadHeader = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ThreadTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
`;

const ThreadContent = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 15px;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const RepliesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReplyContainer = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ReplyContent = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 10px;
`;

const ReplyImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ReplyMeta = styled.div`
  font-size: 14px;
  color: #7f8c8d;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const ThreadDetail: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get(`/api/threads/${threadId}`);
        setThread(response.data);
      } catch (err) {
        setError('Failed to load thread. Please try again.');
        console.error('Error fetching thread:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  const handleNewReply = (newReply: Reply) => {
    if (thread) {
      setThread({
        ...thread,
        replies: [...thread.replies, newReply],
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      try {
        await axios.delete(`/api/threads/${threadId}`);
        navigate(`/board/${thread?.board}`);
      } catch (err) {
        setError('Failed to delete thread. Please try again.');
        console.error('Error deleting thread:', err);
      }
    }
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
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>
          <span>
            Posted {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
          </span>
          <DeleteButton onClick={handleDelete}>Delete Thread</DeleteButton>
        </ThreadMeta>
        <ThreadContent>{thread.content}</ThreadContent>
        {thread.image_url && (
          <ThreadImage
            src={thread.image_url}
            alt="Thread attachment"
            onClick={() => window.open(thread.image_url!, '_blank')}
          />
        )}
      </ThreadHeader>

      <ThreadForm
        boardName={thread.board}
        onThreadCreated={handleNewReply}
        isReply={true}
        threadId={thread.id}
      />

      <RepliesList>
        {thread.replies.map((reply) => (
          <ReplyContainer key={reply.id}>
            <ReplyContent>{reply.content}</ReplyContent>
            {reply.image_url && (
              <ReplyImage
                src={reply.image_url}
                alt="Reply attachment"
                onClick={() => window.open(reply.image_url!, '_blank')}
              />
            )}
            <ReplyMeta>
              Posted {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
            </ReplyMeta>
          </ReplyContainer>
        ))}
      </RepliesList>
    </ThreadDetailContainer>
  );
};

export default ThreadDetail; 