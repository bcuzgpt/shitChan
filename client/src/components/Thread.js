import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const ThreadContainer = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 0;
`;

const ThreadHeader = styled.div`
  margin-bottom: 7px;
  text-align: center;
`;

const BoardTitle = styled.h1`
  color: #AF0A0F;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: -2px;
`;

const BoardLink = styled(Link)`
  margin-right: 5px;
`;

const PostForm = styled.form`
  background-color: #E0EDF5;
  border: 1px solid #B7C5D9;
  padding: 5px;
  margin: 10px 0;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FormTable = styled.table`
  margin: 0;
  width: 100%;
`;

const ThreadBox = styled.div`
  background-color: #F0E0D6;
  border: 1px solid #D9BFB7;
  margin-bottom: 7px;
`;

const Post = styled.div`
  padding: 4px 10px;
  overflow: hidden;
  clear: both;
`;

const PostFile = styled.div`
  float: left;
  margin: 3px 20px 5px 0;
`;

const PostImage = styled.img`
  max-width: ${props => props.op ? '250px' : '150px'};
  max-height: ${props => props.op ? '250px' : '150px'};
  border: 1px solid #ccc;
`;

const PostHeader = styled.div`
  color: #117743;
  font-weight: bold;
  font-size: 10pt;
  margin-bottom: 5px;
`;

const PostNumber = styled.span`
  color: #000;
  font-weight: normal;
`;

const PostContent = styled.div`
  margin: 5px 0;
  font-size: 10pt;
`;

const PostFormToggleButton = styled.button`
  margin: 5px 0;
  width: 100px;
`;

const ReplyContainer = styled.div`
  border-top: 1px solid #D9BFB7;
  margin-top: 5px;
  padding-top: 5px;
`;

const Reply = styled.div`
  background-color: #F0E0D6;
  border: 1px solid #D9BFB7;
  margin: 4px 0;
`;

const Thread = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [newReply, setNewReply] = useState({
    name: 'Anonymous',
    comment: '',
    file: null
  });
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        // In a real app, we would call the API:
        // const response = await axios.get(`/api/threads/${threadId}`);
        // setThread(response.data);
        
        // Mock data for display
        setThread({
          id: threadId,
          name: 'Anonymous',
          subject: 'This is a thread title',
          comment: 'This is the original post content with some text to display.',
          created_at: new Date().toISOString(),
          image_url: 'https://via.placeholder.com/250',
          board: 'b',
          replies: [
            {
              id: 1,
              name: 'Anonymous',
              comment: 'This is a reply to the thread.',
              created_at: new Date().toISOString(),
              image_url: null
            },
            {
              id: 2,
              name: 'Anonymous',
              comment: 'Another reply with some text.',
              created_at: new Date().toISOString(),
              image_url: 'https://via.placeholder.com/150'
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReply(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewReply(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReply.comment && !newReply.file) {
      alert('Please enter a comment or select a file');
      return;
    }

    try {
      setSubmitting(true);
      // In a real app, we would call the API:
      // const formData = new FormData();
      // formData.append('name', newReply.name);
      // formData.append('comment', newReply.comment);
      // if (newReply.file) {
      //   formData.append('image', newReply.file);
      // }
      // await axios.post(`/api/threads/${threadId}/replies`, formData);
      
      // Simulate API call success
      setTimeout(() => {
        // Add new reply to the thread
        const newReplyObj = {
          id: (thread.replies.length > 0 ? Math.max(...thread.replies.map(r => r.id)) : 0) + 1,
          name: newReply.name || 'Anonymous',
          comment: newReply.comment,
          created_at: new Date().toISOString(),
          image_url: newReply.file ? URL.createObjectURL(newReply.file) : null
        };
        
        setThread(prev => ({
          ...prev,
          replies: [...prev.replies, newReplyObj]
        }));
        
        // Reset form
        setNewReply({
          name: 'Anonymous',
          comment: '',
          file: null
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSubmitting(false);
        setFormVisible(false);
      }, 1000);
    } catch (err) {
      alert('Error posting reply. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', margin: '20px' }}>{error}</div>;
  if (!thread) return <div style={{ textAlign: 'center', margin: '20px' }}>Thread not found</div>;

  return (
    <ThreadContainer>
      <ThreadHeader>
        <BoardTitle>
          <BoardLink to={`/board/${thread.board}`}>/{thread.board}/</BoardLink>
          {thread.subject && `- ${thread.subject}`}
        </BoardTitle>
      </ThreadHeader>
      
      <div style={{ textAlign: 'center' }}>
        <PostFormToggleButton onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'Hide Form' : 'Post Reply'}
        </PostFormToggleButton>
      </div>
      
      <PostForm visible={formVisible} onSubmit={handleSubmit}>
        <FormTable cellSpacing="0">
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <input
                  type="text"
                  name="name"
                  placeholder="Anonymous"
                  value={newReply.name}
                  onChange={handleInputChange}
                  style={{ width: '200px' }}
                />
              </td>
            </tr>
            <tr>
              <td>Comment</td>
              <td>
                <textarea
                  name="comment"
                  rows="5"
                  value={newReply.comment}
                  onChange={handleInputChange}
                  style={{ width: '400px' }}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td>File</td>
              <td>
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/*"
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <input
                  type="submit"
                  value="Post Reply"
                  disabled={submitting}
                />
              </td>
            </tr>
          </tbody>
        </FormTable>
      </PostForm>
      
      <ThreadBox>
        <Post>
          <PostHeader>
            {thread.subject && <span style={{ color: '#0F0C5D' }}>{thread.subject}</span>}{' '}
            {thread.name} {new Date(thread.created_at).toLocaleString()} <PostNumber>No.{thread.id}</PostNumber>
          </PostHeader>
          
          {thread.image_url && (
            <PostFile>
              <PostImage src={thread.image_url} alt="Thread attachment" op={true} />
              <div style={{ fontSize: '9pt', textAlign: 'center' }}>
                250x250
              </div>
            </PostFile>
          )}
          
          <PostContent>{thread.comment}</PostContent>
          <div style={{ clear: 'both' }}></div>
        </Post>
        
        {thread.replies.length > 0 && (
          <ReplyContainer>
            {thread.replies.map(reply => (
              <Reply key={reply.id}>
                <Post>
                  <PostHeader>
                    {reply.name} {new Date(reply.created_at).toLocaleString()} <PostNumber>No.{reply.id}</PostNumber>
                  </PostHeader>
                  
                  {reply.image_url && (
                    <PostFile>
                      <PostImage src={reply.image_url} alt="Reply attachment" />
                      <div style={{ fontSize: '9pt', textAlign: 'center' }}>
                        150x150
                      </div>
                    </PostFile>
                  )}
                  
                  <PostContent>{reply.comment}</PostContent>
                  <div style={{ clear: 'both' }}></div>
                </Post>
              </Reply>
            ))}
          </ReplyContainer>
        )}
      </ThreadBox>
      
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <PostFormToggleButton onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'Hide Form' : 'Post Reply'}
        </PostFormToggleButton>
      </div>
    </ThreadContainer>
  );
};

export default Thread; 