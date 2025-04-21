import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ThreadProps {
  thread: {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
    reply_count: number;
  };
}

const ThreadContainer = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ThreadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ThreadTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  font-size: 14px;
  color: #7f8c8d;
`;

const ThreadContent = styled.div`
  margin: 15px 0;
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ThreadImage = styled.img`
  max-width: 250px;
  max-height: 250px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ThreadFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const ReplyCount = styled.span`
  color: #7f8c8d;
  font-size: 14px;
`;

const ThreadLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const timeAgo = formatDistanceToNow(new Date(thread.created_at), { addSuffix: true });

  return (
    <ThreadContainer>
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>Posted {timeAgo}</ThreadMeta>
      </ThreadHeader>
      <ThreadContent>{thread.content}</ThreadContent>
      {thread.image_url && (
        <ThreadImage
          src={thread.image_url}
          alt="Thread attachment"
          onClick={() => window.open(thread.image_url!, '_blank')}
        />
      )}
      <ThreadFooter>
        <ReplyCount>{thread.reply_count} replies</ReplyCount>
        <ThreadLink to={`/thread/${thread.id}`}>View Thread →</ThreadLink>
      </ThreadFooter>
    </ThreadContainer>
  );
};

export default Thread; 