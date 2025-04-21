import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: #D6DAF0;
  border-bottom: 1px solid #B7C5D9;
  color: #000;
  padding: 5px 0;
`;

const HeaderContent = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BoardNavigation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px 0;
  font-size: 11px;
`;

const BoardLink = styled(Link)`
  margin: 0 5px;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SiteName = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #AF0A0F;
  text-align: center;
  letter-spacing: -2px;
  margin: 5px 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  font-size: 8pt;
`;

const FooterLink = styled(Link)`
  margin: 0 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  // List of boards
  const boards = [
    { name: 'a', title: 'Anime & Manga' },
    { name: 'b', title: 'Random' },
    { name: 'g', title: 'Technology' },
    { name: 'v', title: 'Video Games' },
    { name: 'pol', title: 'Politically Incorrect' },
    { name: 'sci', title: 'Science & Math' }
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <SiteName>shitChan</SiteName>
        <BoardNavigation>
          {boards.map((board, index) => (
            <React.Fragment key={board.name}>
              <BoardLink to={`/board/${board.name}`}>
                /{board.name}/ - {board.title}
              </BoardLink>
              {index < boards.length - 1 && ' / '}
            </React.Fragment>
          ))}
        </BoardNavigation>
        <Footer>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <span>•</span>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </Footer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 