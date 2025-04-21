import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Board from './components/Board';
import Thread from './components/Thread';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/board/b" />} />
        <Route path="/board/:boardName" element={<Board />} />
        <Route path="/thread/:threadId" element={<Thread />} />
      </Routes>
    </Router>
  );
}

export default App; 