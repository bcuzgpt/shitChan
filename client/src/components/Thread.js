import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ThreadContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ThreadHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const ThreadTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const ThreadContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ThreadText = styled.p`
  margin-bottom: 15px;
  line-height: 1.6;
`;

const ThreadImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  display: block;
`;

const ThreadMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
`;

const RepliesSection = styled.div`
  margin-top: 30px;
`;

const Reply = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;

const ReplyText = styled.p`
  margin-bottom: 10px;
`;

const ReplyMeta = styled.div`
  font-size: 12px;
  color: #888;
`;

const Thread = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        // Mock data since we don't have a real API yet
        setThread({
          id: threadId,
          title: 'Sample Thread Title',
          content: 'This is a sample thread content with some text to display.',
          created_at: new Date().toISOString(),
          image_url: 'https://via.placeholder.com/400x300',
          replies: [
            {
              id: 1,
              content: 'This is a reply to the thread.',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              content: 'Another reply with some text.',
              created_at: new Date().toISOString(),
            }
          ]
        });
        setLoading(false);
      } catch (err) {
        setError('Error loading thread. Please try again later.');
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!thread) return <div>Thread not found</div>;

  return (
    <ThreadContainer>
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>
          Posted: {new Date(thread.created_at).toLocaleString()}
        </ThreadMeta>
      </ThreadHeader>

      <ThreadContent>
        <ThreadText>{thread.content}</ThreadText>
        {thread.image_url && <ThreadImage src={thread.image_url} alt="Thread image" />}
      </ThreadContent>

      <RepliesSection>
        <h2>Replies ({thread.replies.length})</h2>
        {thread.replies.map(reply => (
          <Reply key={reply.id}>
            <ReplyText>{reply.content}</ReplyText>
            <ReplyMeta>
              Posted: {new Date(reply.created_at).toLocaleString()}
            </ReplyMeta>
          </Reply>
        ))}
      </RepliesSection>
    </ThreadContainer>
  );
};

export default Thread; 