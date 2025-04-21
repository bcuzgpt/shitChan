import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import Thread from './Thread';
import ThreadForm from './ThreadForm';

interface Thread {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  reply_count: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BoardHeader = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const BoardTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const ThreadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? '#3498db' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#2980b9' : '#f0f0f0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const Board: React.FC = () => {
  const { boardName } = useParams<{ boardName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/boards/${boardName}/threads`, {
          params: {
            page: currentPage,
            limit: 10,
          },
        });
        setThreads(response.data.threads);
        setPagination(response.data.pagination);
      } catch (error) {
        setError('Failed to load threads. Please try again.');
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [boardName, currentPage]);

  const handleNewThread = (newThread: Thread) => {
    setThreads([newThread, ...threads]);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (loading) {
    return <LoadingMessage>Loading threads...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>/{boardName}/ - {getBoardTitle(boardName)}</BoardTitle>
      </BoardHeader>
      <ThreadForm boardName={boardName} onThreadCreated={handleNewThread} />
      <ThreadList>
        {threads.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </ThreadList>
      {pagination && (
        <PaginationContainer>
          <PageButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === pagination.totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span>...</span>
                )}
                <PageButton
                  onClick={() => handlePageChange(page)}
                  active={currentPage === page}
                >
                  {page}
                </PageButton>
              </React.Fragment>
            ))}
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
          >
            Last
          </PageButton>
        </PaginationContainer>
      )}
    </BoardContainer>
  );
};

const getBoardTitle = (boardName: string): string => {
  const boardTitles: { [key: string]: string } = {
    b: 'Random',
    g: 'Technology',
    a: 'Anime & Manga',
    v: 'Video Games',
  };
  return boardTitles[boardName] || 'Unknown Board';
};

export default Board; 