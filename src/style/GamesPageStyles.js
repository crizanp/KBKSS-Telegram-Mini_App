import styled, { keyframes } from "styled-components";
import { FaLock } from "react-icons/fa";

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
export const GamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 73px 20px;
  background-color: #121212;
  color: white;
  min-height: 87vh;
  text-align: center;
  background-image: url("/path-to-your-background-image.jpg");
  background-size: cover;
  background-position: center;
`;

export const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  animation: ${fadeIn} 1s ease;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

export const GameItem = styled.div`
  background-color: rgba(31, 31, 31, 0.85);
  padding: 30px 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 22px;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);
  position: relative;
  ${'' /* height: 180px; */}
  text-decoration: none;

  &:hover {
    transform: translateY(-8px);
    background-color: #282828;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }

  ${({ comingSoon }) =>
    comingSoon &&
    `
    background-color: #333;
    color: grey;
    cursor: default;
    &:hover {
      transform: none;
      background-color: #333;
      box-shadow: none;
    }
  `}

  ${({ locked }) =>
    locked &&
    `
    position: relative;
    &:hover {
      transform: none;
      background-color: rgba(31, 31, 31, 0.85);
      box-shadow: none;
    }
  `}
`;

export const LockIcon = styled(FaLock)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  color: #c0c0c0;
`;

export const DimmedIconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const IconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 10px;
  color: #00bfff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const GameTitle = styled.h2`
  font-size: 24px;
    font-weight: bold;
    margin-top: 28px;
    margin-bottom: 10px;
    color: white;
    font-family: 'Orbitron',sans-serif;
`;

export const GameDescription = styled.p`
  font-size: 14px;
  color: #cfcfcf;
  max-width: 600px;
  font-family: 'Orbitron',sans-serif;
`;

export const GameIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 10px; // Reduced margin for compact spacing
`;

// New component for game titles inside GameItem
export const GameItemTitle = styled.div`
  margin-top: 10px; // Add consistent margin-top for all game titles
  font-size: 18px;
  color: white;
`;

