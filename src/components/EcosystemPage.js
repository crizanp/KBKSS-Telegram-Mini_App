import React, { useState } from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';

const EcosystemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #1c1c1c;
  color: white;
  text-align: center;
  font-family: 'Arial, sans-serif';
  height: 100vh;
 
  
  /* Hiding scrollbar for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    /* Additional mobile-specific hiding */
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const UserInfo = styled.div`
  background-color: #4caf50;
  padding: 15px 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 480px) {
    padding: 10px 15px;
    font-size: 16px;
  }
`;

const EcosystemBox = styled.div`
  background-color: #252525;
  border-radius: 15px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SiteName = styled.h3`
  color: #ff9800;
  font-size: 20px;
  margin-bottom: 10px;
`;

const Url = styled.a`
  color: #4caf50;
  text-decoration: none;
  word-wrap: break-word;
  display: block;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #cccccc;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const VisitButton = styled.button`
  background-color: #ff9800;
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb74d;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

function EcosystemPage() {
  const { points, setPoints } = usePoints();
  const username = '@demo_username'; // Replace this with the actual username from context or props
  const [processing, setProcessing] = useState(false);

  const ecosystems = [
    {
      name: 'IGH Group Agency',
      url: 'https://ighgroup.io/',
      description: 'Our agency website.',
    },
    {
      name: 'IGH ICO Calendar',
      url: 'https://icogemhunters.com/',
      description: 'ICO/IDO/IEO listing platform.',
    },
    {
      name: 'IGH Cryptews',
      url: 'https://cryptews.com/',
      description: 'News aggregator platform.',
    },
  ];

  const handleVisit = (url) => {
    setProcessing(true);
    window.open(url, '_blank');

    setTimeout(() => {
      setPoints((prevPoints) => prevPoints + 100);
      setProcessing(false);
      alert('100 points awarded for visiting the site!');
    }, 30000);
  };

  return (
    <EcosystemContainer>
      <UserInfo>
        <div>{username}</div>
        <div>Points: {points.toFixed(2)}</div>
      </UserInfo>

      {ecosystems.map((site, index) => (
        <EcosystemBox key={index}>
          <SiteName>{site.name}</SiteName>
          <Url href={site.url} target="_blank" rel="noopener noreferrer">
            {site.url}
          </Url>
          <Description>{site.description}</Description>
          <VisitButton
            onClick={() => handleVisit(site.url)}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Visit & Earn 100 Points'}
          </VisitButton>
        </EcosystemBox>
      ))}
    </EcosystemContainer>
  );
}

export default EcosystemPage;
