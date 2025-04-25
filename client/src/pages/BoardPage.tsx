import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Thread from '../components/Thread';
import ThreadForm from '../components/ThreadForm';

interface ThreadData {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  reply_count: number;
}

const BoardPageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const BoardHeader = styled.div`
  margin-bottom: 20px;
`;

const BoardTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 10px 0;
`;

const BoardDescription = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
`;

const ThreadsContainer = styled.div`
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #7f8c8d;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fadbd8;
  border-radius: 4px;
  color: #c0392b;
  margin-bottom: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 16px;
  margin: 0 5px;
  background-color: ${props => props.isActive ? '#3498db' : '#fff'};
  color: ${props => props.isActive ? '#fff' : '#3498db'};
  border: 1px solid #3498db;
  border-radius: 4px;
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? '#3498db' : '#eaf2fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyBoardMessage = styled.div`
  padding: 40px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #7f8c8d;
  font-size: 18px;
  margin-bottom: 20px;
`;

const NewThreadContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const NewThreadTitle = styled.h2`
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
`;

const BoardPage: React.FC = () => {
  const { boardName } = useParams<{ boardName: string }>();
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current page from URL query params or default to 1
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page') || '1', 10);

  const getBoardTitle = (name: string) => {
    switch (name) {
      case 'b':
        return 'Random';
      case 'g':
        return 'Technology';
      case 'a':
        return 'Anime & Manga';
      case 'v':
        return 'Video Games';
      default:
        return name;
    }
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/boards/${boardName}/threads`, {
        params: { page: currentPage, limit: 10 }
      });
      
      setThreads(response.data.threads);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError('Failed to load threads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardName) {
      fetchThreads();
    }
  }, [boardName, currentPage]);

  const handlePageChange = (page: number) => {
    navigate(`/board/${boardName}?page=${page}`);
  };

  const handleThreadCreated = (newThread: ThreadData) => {
    setThreads([newThread, ...threads]);
  };

  if (loading) {
    return <LoadingMessage>Loading threads...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!boardName) {
    return <ErrorMessage>Board not found</ErrorMessage>;
  }

  return (
    <BoardPageContainer>
      <Helmet>
        <title>/{boardName}/ - {getBoardTitle(boardName)} | shitChan</title>
      </Helmet>

      <BoardHeader>
        <BoardTitle>/{boardName}/ - {getBoardTitle(boardName)}</BoardTitle>
        <BoardDescription>Anonymous discussion board</BoardDescription>
      </BoardHeader>

      <NewThreadContainer>
        <NewThreadTitle>Create New Thread</NewThreadTitle>
        <ThreadForm 
          boardName={boardName} 
          onThreadCreated={handleThreadCreated} 
        />
      </NewThreadContainer>

      <ThreadsContainer>
        {threads.length > 0 ? (
          threads.map(thread => (
            <Thread key={thread.id} thread={thread} />
          ))
        ) : (
          <EmptyBoardMessage>
            No threads found. Be the first to create a thread!
          </EmptyBoardMessage>
        )}
      </ThreadsContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </PaginationButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationButton
              key={page}
              isActive={page === currentPage}
              onClick={() => page !== currentPage && handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}
          
          <PaginationButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </BoardPageContainer>
  );
};

export default BoardPage; 