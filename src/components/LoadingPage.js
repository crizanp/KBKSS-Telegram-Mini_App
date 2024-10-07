import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://i.ibb.co/YhpdpCt/igh-tap-game.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; /* Optionally cover the entire background */
`;

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkEnvironment = () => {
      const isLocalhost = window.location.hostname === 'localhost';
      const tg = window.Telegram.WebApp;

      if (isLocalhost) {
        // If running on localhost, navigate to home directly after 4 seconds
        setTimeout(() => navigate('/home'), 4000);
      } else if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // If running in Telegram, wait 4 seconds and then navigate to home
        setTimeout(() => navigate('/home'), 4000);
      } else {
        // If not in Telegram and not on localhost, stay on loading page
        // Additional logic could be added here if needed
      }
    };

    checkEnvironment();
  }, [navigate]);

  return <LoadingContainer />;
}

export default LoadingPage;