import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Thread from './Thread';
import ThreadForm from './ThreadForm';

interface BoardParams {
  boardName: string;
}

interface ThreadData {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  reply_count: number;
}

const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BoardHeader = styled.div`
  margin-bottom: 30px;
`;

const BoardTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 10px 0;
  color: #2c3e50;
`;

const BoardDescription = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
`;

const ThreadsContainer = styled.div`
  margin-top: 30px;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #7f8c8d;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.isActive ? '#3498db' : '#f1f2f6'};
  color: ${props => props.isActive ? 'white' : '#2c3e50'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.isActive ? '#2980b9' : '#dfe4ea'};
  }
  
  &:disabled {
    background-color: #f1f2f6;
    color: #b2bec3;
    cursor: not-allowed;
  }
`;

const FormContainer = styled.div`
  margin-bottom: 30px;
`;

const FormToggleButton = styled.button`
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

// Function to get board title based on name
const getBoardTitle = (name: string): string => {
  switch (name) {
    case 'b':
      return 'Random';
    case 'a':
      return 'Anime & Manga';
    case 'v':
      return 'Video Games';
    case 'g':
      return 'Technology';
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

// Function to get board description based on name
const getBoardDescription = (name: string): string => {
  switch (name) {
    case 'b':
      return 'The place for random discussions and shitposting';
    case 'a':
      return 'Discussion of anime and manga';
    case 'v':
      return 'Video game discussions';
    case 'g':
      return 'Technology and programming discussions';
    default:
      return `Discussion board for ${name}`;
  }
};

const Board: React.FC = () => {
  const { boardName } = useParams<BoardParams>();
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const threadsPerPage = 10;
  
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/boards/${boardName}/threads`, {
          params: { page, limit: threadsPerPage }
        });
        
        setThreads(response.data.threads);
        setTotalPages(Math.ceil(response.data.total / threadsPerPage));
        setError('');
      } catch (err: any) {
        console.error('Error fetching threads:', err);
        setError(err.response?.data?.message || 'Failed to load threads. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [boardName, page]);
  
  const handleThreadCreated = (newThread: ThreadData) => {
    setThreads([newThread, ...threads]);
    setShowForm(false);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };
  
  if (loading && page === 1) {
    return <LoadingMessage>Loading threads...</LoadingMessage>;
  }
  
  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>/{boardName}/ - {getBoardTitle(boardName!)}</BoardTitle>
        <BoardDescription>{getBoardDescription(boardName!)}</BoardDescription>
      </BoardHeader>
      
      <FormToggleButton onClick={toggleForm}>
        {showForm ? 'Cancel' : 'Create New Thread'}
      </FormToggleButton>
      
      {showForm && (
        <FormContainer>
          <ThreadForm boardName={boardName!} onThreadCreated={handleThreadCreated} />
        </FormContainer>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ThreadsContainer>
        {threads.length === 0 ? (
          <EmptyMessage>No threads found. Be the first to post!</EmptyMessage>
        ) : (
          threads.map(thread => (
            <Link 
              key={thread.id} 
              to={`/board/${boardName}/thread/${thread.id}`} 
              style={{ textDecoration: 'none' }}
            >
              <Thread thread={thread} />
            </Link>
          ))
        )}
      </ThreadsContainer>
      
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
          >
            Previous
          </PaginationButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <PaginationButton 
              key={pageNum}
              isActive={pageNum === page}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </PaginationButton>
          ))}
          
          <PaginationButton 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </BoardContainer>
  );
};

export default Board; 