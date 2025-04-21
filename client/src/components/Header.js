import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: #ecf0f1;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
`;

const BoardLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
`;

const Header = () => {
  // List of boards
  const boards = [
    { name: 'b', title: 'Random' },
    { name: 'g', title: 'Technology' },
    { name: 'a', title: 'Anime' },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">shitChan</Logo>
        <Navigation>
          {boards.map((board) => (
            <BoardLink key={board.name} to={`/board/${board.name}`}>
              /{board.name}/ - {board.title}
            </BoardLink>
          ))}
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 