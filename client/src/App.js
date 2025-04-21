import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Board from './components/Board';
import Thread from './components/Thread';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const MainContent = styled.main`
  padding-top: 20px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/board/b" />} />
            <Route path="/board/:boardName" element={<Board />} />
            <Route path="/thread/:threadId" element={<Thread />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 