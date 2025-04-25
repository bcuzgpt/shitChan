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

const TermsOfService: React.FC = () => {
  return (
    <Container>
      <Title>Terms of Service</Title>
      
      <Section>
        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Paragraph>
          By accessing and using this image board, you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use the service.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. User Conduct</SectionTitle>
        <Paragraph>
          Users must not post content that is illegal, harmful, threatening, abusive, harassing,
          defamatory, vulgar, obscene, or otherwise objectionable.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>3. Content Guidelines</SectionTitle>
        <Paragraph>
          All posted content must comply with applicable laws and regulations. Users are responsible
          for the content they post and must ensure they have the right to share such content.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>4. Moderation</SectionTitle>
        <Paragraph>
          The site administrators reserve the right to remove any content that violates these terms
          or is otherwise inappropriate, without prior notice.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>5. Disclaimer</SectionTitle>
        <Paragraph>
          The service is provided "as is" without any warranties. We are not responsible for any
          content posted by users.
        </Paragraph>
      </Section>
    </Container>
  );
};

export default TermsOfService; 