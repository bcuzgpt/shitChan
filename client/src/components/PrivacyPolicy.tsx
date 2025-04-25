import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #d6daf0;
`;

const Title = styled.h1`
  color: #800000;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #800000;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  margin-bottom: 15px;
  line-height: 1.6;
`;

const PrivacyPolicy: React.FC = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      
      <Section>
        <SectionTitle>1. Information Collection</SectionTitle>
        <Paragraph>
          We collect minimal information necessary to operate the image board. This includes
          IP addresses for moderation purposes and any information you choose to provide in your posts.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. Use of Information</SectionTitle>
        <Paragraph>
          The information we collect is used solely for the operation and moderation of the image board.
          We do not sell or share your information with third parties.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>3. Cookies</SectionTitle>
        <Paragraph>
          We use cookies to maintain your session and preferences. These cookies are essential for
          the basic functionality of the site.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>4. Data Retention</SectionTitle>
        <Paragraph>
          Posts and associated data are retained indefinitely unless removed by moderators or
          requested for deletion by users.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>5. Your Rights</SectionTitle>
        <Paragraph>
          You have the right to request deletion of your posts and associated data. Please contact
          the site administrators for such requests.
        </Paragraph>
      </Section>
    </Container>
  );
};

export default PrivacyPolicy; 