import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import styled from 'styled-components';
import axios from 'axios';

// Styled component for loading screen
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://i.ibb.co/YhpdpCt/igh-tap-game.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

// Data fetching functions for userInfo, userLevel, and tasks
const fetchUserInfo = async (userID) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
  return data;
};

const fetchUserLevel = async (userID) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
  return data;
};

const fetchTasks = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
  return data;
};

const LoadingPage = () => {
  const navigate = useNavigate();

  // Determine if it's running on localhost or inside Telegram WebApp
  const isLocalhost = window.location.hostname === 'localhost';
  const tg = window.Telegram?.WebApp;
  const userID = isLocalhost ? 'mockUserID123' : tg?.initDataUnsafe?.user?.id;

  // Use React Query's `useQueries` to fetch all necessary data in parallel
  const results = useQueries({
    queries: [
      { queryKey: ['userInfo', userID], queryFn: () => fetchUserInfo(userID), enabled: !!userID },
      { queryKey: ['userLevel', userID], queryFn: () => fetchUserLevel(userID), enabled: !!userID },
      { queryKey: 'tasks', queryFn: fetchTasks }
    ]
  });

  // Check if any queries are loading or if there are errors
  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);

  useEffect(() => {
    if (!isLoading && !isError) {
      // Navigate to the home page when data is loaded
      setTimeout(() => navigate('/home'), 1000); // Short delay before navigating
    }
  }, [isLoading, isError, navigate]);

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (isError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return <LoadingContainer />;
};

export default LoadingPage;
