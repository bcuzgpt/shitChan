import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BoardHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const BoardTitle = styled.h1`
  font-size: 24px;
  color: #333;
`;

const ThreadsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const ThreadItem = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ThreadTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ThreadContent = styled.p`
  margin-bottom: 10px;
  color: #555;
`;

const ThreadMeta = styled.div`
  font-size: 12px;
  color: #888;
`;

const ThreadLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Board = () => {
  const { boardName } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        // Just for display purposes since we don't have a real API yet
        // In a real app this would be an API call like:
        // const response = await axios.get(`/api/boards/${boardName}/threads`);
        // setThreads(response.data.threads);
        
        // Mock data for display
        setThreads([
          {
            id: 1,
            title: 'Welcome to shitChan',
            content: 'This is a sample thread showing what the board will look like.',
            created_at: new Date().toISOString(),
            reply_count: 5
          },
          {
            id: 2,
            title: 'Another sample thread',
            content: 'This is another example thread on the board.',
            created_at: new Date().toISOString(),
            reply_count: 2
          }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Error loading threads. Please try again later.');
        setLoading(false);
      }
    };

    fetchThreads();
  }, [boardName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>/{boardName}/ - Board</BoardTitle>
      </BoardHeader>
      
      <ThreadsContainer>
        {threads.map(thread => (
          <ThreadItem key={thread.id}>
            <ThreadLink to={`/thread/${thread.id}`}>
              <ThreadTitle>{thread.title}</ThreadTitle>
              <ThreadContent>{thread.content}</ThreadContent>
              <ThreadMeta>
                Replies: {thread.reply_count} | Posted: {new Date(thread.created_at).toLocaleString()}
              </ThreadMeta>
            </ThreadLink>
          </ThreadItem>
        ))}
      </ThreadsContainer>
    </BoardContainer>
  );
};

export default Board; 