import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BottomMenu from './BottomMenu';
import LoadingPage from './LoadingPage';
import PromoModal from './PromoModal';  // Import the PromoModal component

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
  const [imageUrl, setImageUrl] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false); // State for promo modal
  const navigate = useNavigate();

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const tg = window.Telegram?.WebApp;

    // Promo Modal logic: Check if the specific promo modal has been shown
    const promoKey = 'promoModalShown_September2024'; // Change this key for different promotions
    const isPromoModalShown = localStorage.getItem(promoKey);
    
    if (!isPromoModalShown) {
      // Delay the modal by 3 seconds
      setTimeout(() => {
        setShowPromoModal(true); // Show promo modal after 3 seconds
      }, 3000);
    }

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

  const handleClosePromoModal = () => {
    setShowPromoModal(false); // Hide the promo modal
    localStorage.setItem('promoModalShown_September2024', 'true'); // Set flag for this specific promo
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (restricted) {
    return <RestrictedContainer imageUrl={imageUrl} />;
  }

  return (
    <LayoutContainer>
      <Content>{children}</Content>

      {/* Display the promo modal */}
      {showPromoModal && (
        <PromoModal
          message="The Quiz Game is now available! Spend 25,000 $GEMS to unlock the game and play for a chance to win exciting rewards!"
          onConfirm={() => {
            handleClosePromoModal();
            navigate('/games'); // Navigate to the games page when they confirm
          }}
          onCancel={handleClosePromoModal}
          loading={false}
          iconUrl="https://i.ibb.co/rMcfScz/3d-1.png" // Updated image for the promo
          title="Unlock Quiz Game"
          pointsCost={25000} // 25,000 $GEMS to unlock the game
          buttonText="Unlock Now" // Custom button text
        />
      )}

      {showBottomMenu && menuVisible && <BottomMenu />}
    </LayoutContainer>
  );
}

export default Layout;
