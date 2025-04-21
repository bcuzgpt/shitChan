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

const TermsOfService = () => {
  return (
    <PolicyContainer>
      <PolicyTitle>shitChan Terms of Service</PolicyTitle>
      
      <Section>
        <Text>Last Updated: {new Date().toLocaleDateString()}</Text>
        <Text>
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using
          the shitChan website (the "Service") operated by us.
        </Text>
        <Text>
          Your access to and use of the Service is conditioned on your acceptance of and compliance
          with these Terms. These Terms apply to all visitors, users, and others who access or use
          the Service.
        </Text>
        <Text>
          By accessing or using the Service, you agree to be bound by these Terms. If you disagree
          with any part of the terms, then you may not access the Service.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Content</SectionTitle>
        <Text>
          Our Service allows you to post, link, store, share, and otherwise make available certain
          information, text, graphics, or other material ("Content"). You are responsible for the
          Content that you post on or through the Service, including its legality, reliability,
          and appropriateness.
        </Text>
        <Text>
          By posting Content on or through the Service, you represent and warrant that:
        </Text>
        <List>
          <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.</li>
          <li>The posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Prohibited Content</SectionTitle>
        <Text>
          The following types of content are prohibited on shitChan:
        </Text>
        <List>
          <li>Content that is illegal under US law or the laws of your jurisdiction</li>
          <li>Child pornography or sexualized content involving minors</li>
          <li>Content that violates copyright or intellectual property rights</li>
          <li>Personal and confidential information of others shared without consent</li>
          <li>Content intended to harass, intimidate, or threaten others</li>
          <li>Content that promotes violence or illegal activities</li>
          <li>Malware, phishing attempts, or other harmful code</li>
        </List>
        <Text>
          We reserve the right to remove any content that violates these Terms or is deemed inappropriate at our sole discretion.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Moderation</SectionTitle>
        <Text>
          We reserve the right, but not the obligation, to:
        </Text>
        <List>
          <li>Remove or refuse to post any content for any or no reason</li>
          <li>Take any action with respect to any content that we deem necessary or appropriate</li>
          <li>Disclose information about users to law enforcement authorities as required by law</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Termination</SectionTitle>
        <Text>
          We may terminate or suspend access to our Service immediately, without prior notice or
          liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>DMCA Compliance</SectionTitle>
        <Text>
          If you believe that material available on our Service infringes on your copyright,
          please notify us by sending a DMCA notice to dmca@shitchan.com with the following information:
        </Text>
        <List>
          <li>Identification of the copyrighted work claimed to be infringed</li>
          <li>Identification of the material that is claimed to be infringing</li>
          <li>Your contact information, including your address, telephone number, and email</li>
          <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Changes</SectionTitle>
        <Text>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
          If a revision is material, we will try to provide at least 30 days' notice prior to any new
          terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Text>
      </Section>
      
      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <Text>
          If you have any questions about these Terms, please contact us at:
          terms@shitchan.com
        </Text>
      </Section>
    </PolicyContainer>
  );
};

export default TermsOfService; 