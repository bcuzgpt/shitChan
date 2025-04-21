import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Navigate to="/board/b" />} />
          <Route path="/board/:boardName" element={<div>Board Page</div>} />
          <Route path="/thread/:threadId" element={<div>Thread Page</div>} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App; 