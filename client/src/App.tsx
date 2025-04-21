import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Board from './components/Board';
import ThreadDetail from './components/ThreadDetail';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/board/b" replace />} />
          <Route path="/board/:boardName" element={<Board />} />
          <Route path="/thread/:threadId" element={<ThreadDetail />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App; 