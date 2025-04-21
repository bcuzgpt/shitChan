import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  padding: 15px 0;
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
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
`;

const BoardLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #34495e;
  }
`;

const Header: React.FC = () => {
  const boards = [
    { name: 'b', title: 'Random' },
    { name: 'g', title: 'Technology' },
    { name: 'a', title: 'Anime' },
    { name: 'v', title: 'Video Games' },
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