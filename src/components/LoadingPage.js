import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://i.ibb.co/YhpdpCt/igh-tap-game.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; /* Optionally cover the entire background */
`;

const LoadingText = styled.p`
  color: white;
  font-size: 18px;
  font-family: 'Orbitron', sans-serif;
  margin-top: 20px;
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 30px;
  width: 80%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
`;

const progressAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #3baeef;
  border-radius: 10px;
  animation: ${progressAnimation} 4s linear forwards;
`;

function LoadingPage() {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);

  const prefetchData = async () => {
    try {
      // Simulate loading by incrementing progress
      const incrementProgress = () => {
        setLoadingProgress((prev) => Math.min(prev + 25, 100));
      };

      // Fetch user data
      incrementProgress();
      const userID = await getUserID();
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
      
      // Fetch user level
      incrementProgress();
      await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
      
      // Fetch active background
      incrementProgress();
      await axios.get(`${process.env.REACT_APP_API_URL}/background/active`);
      
      // Fetch avatar data
      incrementProgress();
      await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}`);

      // Once all data is fetched, navigate to the home page
      navigate('/home');
    } catch (error) {
      console.error("Error pre-fetching data:", error);
      // Handle error, navigate to an error page if needed
    }
  };

  useEffect(() => {
    prefetchData();
  }, []);

  return (
    <LoadingContainer>
      <LoadingText>Loading... Please wait.</LoadingText>
      <ProgressContainer>
        <ProgressBar style={{ width: `${loadingProgress}%` }} />
      </ProgressContainer>
    </LoadingContainer>
  );
}

export default LoadingPage;
