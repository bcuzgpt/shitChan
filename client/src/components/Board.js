import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const BoardContainer = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 0;
`;

const BoardHeader = styled.div`
  margin-bottom: 7px;
  text-align: center;
`;

const BoardTitle = styled.h1`
  color: #AF0A0F;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: -2px;
`;

const BoardDescription = styled.div`
  font-size: 10pt;
  margin: 3px 0 7px 0;
`;

const PostFormToggleButton = styled.button`
  margin: 5px 0;
  width: 100px;
`;

const PostForm = styled.form`
  background-color: #E0EDF5;
  border: 1px solid #B7C5D9;
  padding: 5px;
  margin-bottom: 10px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ThreadContainer = styled.div`
  background-color: #F0E0D6;
  border-radius: 0;
  border: 1px solid #D9BFB7;
  margin-bottom: 15px;
  padding-bottom: 5px;
`;

const ThreadBox = styled.div`
  padding: 4px 10px;
  overflow: hidden;
`;

const OmittedReplies = styled.div`
  color: #707070;
  font-size: 9pt;
  margin: 3px 0 0 15px;
`;

const PostFile = styled.div`
  float: left;
  margin: 3px 20px 5px 0;
`;

const PostImage = styled.img`
  max-width: 150px;
  max-height: 150px;
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
  font-size: 10pt;
  margin: 5px 0;
`;

const ReplyButton = styled(Link)`
  font-size: 10pt;
  margin: 5px 0;
  display: inline-block;
`;

const FormTable = styled.table`
  margin: 0;
  width: 100%;
`;

const Board = () => {
  const { boardName } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [newThread, setNewThread] = useState({
    name: 'Anonymous',
    subject: '',
    comment: '',
    file: null
  });
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const boardDescriptions = {
    'b': 'The place for random discussion',
    'g': 'Technology and gadgets',
    'a': 'Anime and manga discussion',
    'v': 'Video games discussion',
    'pol': 'Political discussions',
    'sci': 'Science and math discussions'
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        
        let threadsData;
        try {
          // Try to fetch from API
          const response = await axios.get(`/api/boards/${boardName}/threads`);
          threadsData = response.data;
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          // Fall back to mock data if API fails
          threadsData = [
            {
              id: '1',
              subject: 'Welcome to the board',
              name: 'Anonymous',
              comment: 'This is a mock thread. The API appears to be unavailable.',
              created_at: new Date().toISOString(),
              image_url: 'https://via.placeholder.com/250',
              reply_count: 5
            },
            {
              id: '2',
              subject: 'Another thread',
              name: 'Anonymous',
              comment: 'This is another mock thread since the API is not responding.',
              created_at: new Date().toISOString(),
              image_url: 'https://via.placeholder.com/250',
              reply_count: 3
            }
          ];
        }
        
        setThreads(threadsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching threads:', error);
        setError('Failed to load threads. Please try again later.');
        setLoading(false);
      }
    };

    fetchThreads();
  }, [boardName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewThread(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newThread.comment && !newThread.file) {
      alert('Please enter a comment or select a file');
      return;
    }

    try {
      setSubmitting(true);
      
      let newThreadData;
      try {
        // Try to post to API
        const formData = new FormData();
        formData.append('name', newThread.name || 'Anonymous');
        formData.append('subject', newThread.subject);
        formData.append('comment', newThread.comment);
        if (newThread.file) {
          formData.append('image', newThread.file);
        }
        
        const response = await axios.post(
          `/api/boards/${boardName}/threads`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        newThreadData = response.data;
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fall back to creating mock data if API fails
        newThreadData = {
          id: threads.length + 1,
          name: newThread.name || 'Anonymous',
          subject: newThread.subject,
          comment: newThread.comment,
          created_at: new Date().toISOString(),
          image_url: newThread.file ? URL.createObjectURL(newThread.file) : null,
          reply_count: 0
        };
      }
      
      // Add the new thread to the list
      setThreads([newThreadData, ...threads]);
      
      // Reset form
      setNewThread({
        name: 'Anonymous',
        subject: '',
        comment: '',
        file: null
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSubmitting(false);
      setFormVisible(false);
    } catch (err) {
      console.error('Error creating thread:', err);
      alert('Error creating thread. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', margin: '20px' }}>{error}</div>;

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>/{boardName}/</BoardTitle>
        <BoardDescription>{boardDescriptions[boardName] || 'Board description'}</BoardDescription>
      </BoardHeader>
      
      <div style={{ textAlign: 'center' }}>
        <PostFormToggleButton onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'Hide Form' : 'Create Thread'}
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
                  value={newThread.name}
                  onChange={handleInputChange}
                  style={{ width: '200px' }}
                />
              </td>
            </tr>
            <tr>
              <td>Subject</td>
              <td>
                <input
                  type="text"
                  name="subject"
                  value={newThread.subject}
                  onChange={handleInputChange}
                  style={{ width: '200px' }}
                />
                <input
                  type="submit"
                  value="Post"
                  disabled={submitting}
                  style={{ marginLeft: '10px' }}
                />
              </td>
            </tr>
            <tr>
              <td>Comment</td>
              <td>
                <textarea
                  name="comment"
                  rows="5"
                  value={newThread.comment}
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
          </tbody>
        </FormTable>
      </PostForm>
      
      {threads.map(thread => (
        <ThreadContainer key={thread.id}>
          <ThreadBox>
            <PostHeader>
              {thread.subject && <span style={{ color: '#0F0C5D' }}>{thread.subject}</span>}{' '}
              {thread.name} {new Date(thread.created_at).toLocaleString()} <PostNumber>No.{thread.id}</PostNumber>
            </PostHeader>
            
            {thread.image_url && (
              <PostFile>
                <PostImage src={thread.image_url} alt="Thread attachment" />
                <div style={{ fontSize: '9pt', textAlign: 'center' }}>
                  150x150
                </div>
              </PostFile>
            )}
            
            <PostContent>{thread.comment}</PostContent>
            <div style={{ clear: 'both' }}></div>
            
            <ReplyButton to={`/thread/${thread.id}`}>
              Reply
            </ReplyButton>
          </ThreadBox>
          
          {thread.reply_count > 0 && (
            <OmittedReplies>
              {thread.reply_count} replies omitted. Click Reply to view.
            </OmittedReplies>
          )}
        </ThreadContainer>
      ))}
    </BoardContainer>
  );
};

export default Board; 