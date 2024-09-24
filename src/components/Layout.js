import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BottomMenu from './BottomMenu';  // Make sure the path is correct
import LoadingPage from './LoadingPage';  // Make sure the path is correct

const LayoutContainer = styled.div`
  font-family: 'Orbitron',sans-serif;
  background-color: #090c12;
  max-width: 460px;
  
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
`;

const RestrictedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 460px;

  background-image: ${(props) => `url(${props.imageUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
  overflow-x: hidden;
`;

function Layout({ children }) {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');  // State to store the image URL
  const navigate = useNavigate();

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const tg = window.Telegram?.WebApp;

    if (isLocalhost) {
      console.log('Running on localhost:3000');
      setShowBottomMenu(true);
      setLoading(false);
    } else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const platform = tg.platform;

      if (platform === 'android' || platform === 'ios') {
        console.log('Confirmed: Running inside Telegram mobile app');
        tg.expand();
        setShowBottomMenu(true);
        setLoading(false);

        // Disable vertical swipes to prevent app collapse
        tg.disableVerticalSwipes();
      } else {
        console.log('Restricted: Running on Telegram Desktop or Web');
        setRestricted(true);
        setImageUrl('https://i.postimg.cc/qBX0zdSb/igh-tap-game-2.jpg'); // Set image for Telegram Desktop or Web
        setLoading(false);
      }
    } else {
      console.log('Not confirmed: Running outside Telegram');
      setLoading(true);
      navigate('/');
    }

    const menuTimer = setTimeout(() => {
      setMenuVisible(true);
    }, 4000);

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(menuTimer);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  if (restricted) {
    return <RestrictedContainer imageUrl={imageUrl} />;  // Pass the imageUrl as a prop
  }

  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && menuVisible && <BottomMenu />}
    </LayoutContainer>
  );
}

export default Layout;
