import React from 'react';
import styled from 'styled-components';

const PolicyContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #F0E0D6;
  border: 1px solid #D9BFB7;
`;

const PolicyTitle = styled.h1`
  color: #800000;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.div`
  margin: 15px 0;
`;

const SectionTitle = styled.h2`
  color: #0F0C5D;
  font-size: 18px;
  margin: 10px 0;
`;

const Text = styled.p`
  margin: 10px 0;
  font-size: 10pt;
  line-height: 1.4;
`;

const List = styled.ul`
  margin: 10px 0 10px 20px;
  
  li {
    margin: 5px 0;
    font-size: 10pt;
  }
`;

const PrivacyPolicy = () => {
  return (
    <PolicyContainer>
      <PolicyTitle>shitChan Privacy Policy</PolicyTitle>
      
      <Section>
        <Text>Last Updated: {new Date().toLocaleDateString()}</Text>
        <Text>
          This Privacy Policy describes how shitChan ("we", "our", or "us") collects, uses, and
          shares information when you use our website (the "Service").
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Information We Collect</SectionTitle>
        <Text>
          We collect minimal information from users to provide our Service. This includes:
        </Text>
        <List>
          <li>IP addresses (for spam prevention only)</li>
          <li>Uploaded content (posts, images)</li>
          <li>Usage data (for analytics purposes)</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>How We Use Information</SectionTitle>
        <Text>
          We use the information we collect to:
        </Text>
        <List>
          <li>Provide, maintain, and improve the Service</li>
          <li>Prevent abuse and illegal activities</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Enforce our Terms of Service</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Data Retention</SectionTitle>
        <Text>
          We retain IP addresses for spam prevention for up to 90 days. Content posted on the
          platform (posts, images) may remain indefinitely unless removed by moderation or
          through a valid removal request.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Your Rights</SectionTitle>
        <Text>
          You have the right to request the removal of content you've posted. However, due to
          the anonymous nature of the platform, you'll need to provide information that verifies
          you as the original poster.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Cookies and Analytics</SectionTitle>
        <Text>
          We use cookies to enhance your experience on our Service. We also use analytical tools
          to better understand how users interact with our Service. This data is anonymized and
          does not personally identify you.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Third-Party Services</SectionTitle>
        <Text>
          We may use third-party services to help operate our Service, such as cloud storage for
          images and analytics. These providers have their own privacy policies, and we recommend
          reviewing them to understand how your data is processed.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Changes to This Policy</SectionTitle>
        <Text>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by posting the new policy on this page. You are advised to review this Privacy Policy
          periodically for any changes.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Text>
          If you have any questions about this Privacy Policy, please contact us at:
          privacy@shitchan.com
        </Text>
      </Section>
    </PolicyContainer>
  );
};

export default PrivacyPolicy; 