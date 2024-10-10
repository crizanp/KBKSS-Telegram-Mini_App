import React, { useState } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaParachuteBox, FaGamepad } from 'react-icons/fa';
import { GiReceiveMoney, GiHiveMind } from 'react-icons/gi';
import { SiEagle } from 'react-icons/si';

const GlobalStyle = createGlobalStyle`
  * {
    -webkit-user-select: none; 
    -webkit-touch-callout: none; 
    outline: none; 
    -webkit-tap-highlight-color: transparent; 
  }
`;

const BottomMenuContainer = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 564px;
  ${'' /* padding: 0px 0px 10px 0px;  */}
  margin: 0 auto;
  z-index: 999;
  ${'' /* border-top: 2px solid #c5b8b8;  */}

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;


const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

const PoweredBy = styled.div`
  background-color: #ffffff;
  color: #000000;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  margin-bottom: 5px;
  font-size: 12px;

  a {
    color: #000000;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const MenuItems = styled.div`
  display: flex;
  justify-content: space-between; /* Ensures equal spacing between items */
  width: 100%;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #dfcec0;
  font-size: 12px;
  text-decoration: none;
  padding: 10px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent')}; /* Dimmed background */
  border-top: ${({ isActive }) => (isActive ? '4px solid #fff' : 'none')}; /* Thick top border */

  flex-grow: 1; /* Ensures each item occupies equal space */
  flex-basis: 0; /* Distributes items evenly */

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;


const BouncingIcon = styled.div`
  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${pulseAnimation} 1.5s infinite;
    `}
`;


const MenuLabel = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 600;
  margin-top: 3px;

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;
const VibrationMenuItem = (props) => {
  const handleClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); 
    }

    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <MenuItem onClick={handleClick} isActive={props.isActive}>
      <BouncingIcon isActive={props.isActive}>{props.children}</BouncingIcon>
      <MenuLabel>{props.label}</MenuLabel>
    </MenuItem>
  );
};


function BottomMenu() {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const [activeMenu, setActiveMenu] = useState(location.pathname); 

  const handleMenuClick = (path) => {
    setActiveMenu(path);
    navigate(path);
  };

  return (
    <>
      <GlobalStyle /> {/* Apply global styles */}
      <BottomMenuContainer>
        {/* Conditionally render the PoweredBy section based on location */}
        {/* {location.pathname !== '/home' && (
          <PoweredBy>
            Powered by{' '}
            <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">
              IGH Group [ ICOGEMHUNTERS ]
            </a>
          </PoweredBy>
        )} */}
        <MenuItems>
          <VibrationMenuItem
            label="Friend"
            onClick={() => handleMenuClick('/friend')}
            isActive={activeMenu === '/friend'}
          >
            <GiHiveMind
              size={26}
              color={activeMenu === '/friend' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Earn"
            onClick={() => handleMenuClick('/earn')}
            isActive={activeMenu === '/earn'}
          >
            <GiReceiveMoney
              size={26}
              color={activeMenu === '/earn' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Home"
            onClick={() => handleMenuClick('/home')}
            isActive={activeMenu === '/home'}
          >
            <SiEagle
              size={26}
              color={activeMenu === '/home' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Airdrop"
            onClick={() => handleMenuClick('/airdrop')}
            isActive={activeMenu === '/airdrop'}
          >
            <FaParachuteBox
              size={26}
              color={activeMenu === '/airdrop' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Games"
            onClick={() => handleMenuClick('/games')}
            isActive={activeMenu === '/games'}
          >
            <FaGamepad
              size={26}
              color={activeMenu === '/games' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
        </MenuItems>
      </BottomMenuContainer>
    </>
  );
}

export default BottomMenu;
