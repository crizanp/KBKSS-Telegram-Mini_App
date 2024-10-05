import { FaRegGem } from 'react-icons/fa';
import styled, { keyframes } from "styled-components";

// Keyframes for pulse effect
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
`;

export const ActiveAvatarAnimation = styled.div`
  display: inline-block;
  animation: ${pulseAnimation} 3s ease-in-out infinite; // Slight pulse effect
`;
// Container styling for main content
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  color: #f0f0f0;
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 86px;
  }
`;

// Top section styling
export const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// Left section styling for unlocked avatars
export const LeftSection = styled.div`
  width: 25%;
  max-height: 496px;
  overflow-y: auto; /* Enable scrolling for the avatar list */
  padding-right: 20px;
  @media (max-width: 768px) {
    width: 30%;
  }
`;

// Avatar list styling
export const AvatarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Right section styling for active avatar display
export const RightSection = styled.div`
  width: 70%;
  height: 496px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1c1c1c;
  text-align: center;
  @media (max-width: 768px) {
    width: 65%;
    height: auto;
  }
`;

// Avatar card styling with dynamic border and hover effects
export const AvatarCard = styled.div`
  position: relative;
  border: ${(props) => (props.isLocked ? '2px solid grey' : '2px solid #0039ff')};
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: ${(props) => (props.isLocked ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.isLocked ? 0.6 : 1)};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: white;
  background-color: ${(props) => (props.isLocked ? '#2c2c2c' : '#3374f514')};
  &:hover {
    transform: ${(props) => (props.isLocked ? 'none' : 'none')};
    box-shadow: ${(props) => (props.isLocked ? 'none' : '0px 4px 12px rgba(255, 255, 255, 0.2)')};
  }
`;

// Avatar image styling within card
export const AvatarImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-bottom: 5px;
  border-radius: 50%;
`;

// Active avatar image styling
export const CurrentAvatarImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

// Avatar information text
export const AvatarInfo = styled.div`
  font-size: 18px;
  color: #d2d2d2;
`;

// Title for avatar name
export const Title = styled.h3`
  font-size: 28px;
  margin: 10px 0;
  color: #d2d2d2;
`;

// Gems and level display styling
export const GemsDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #00aaff;
  margin-bottom: 10px;
`;

// Icon for gems display
export const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 0.8rem;
`;

// Level display styling for each avatar card
export const LevelDisplay = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  font-size: 10px;
  font-weight: bold;
  color: #ffac00;
`;

// Section for more avatars
export const MoreAvatarsSection = styled.div`
  margin-top: 30px;
`;

// Title for more avatars section
export const MoreAvatarsTitle = styled.h3`
  text-align: center;
  color: #d2d2d2;
  margin-bottom: 15px;
`;

// Grid layout for avatars
export const MoreAvatarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  overflow-x: scroll;
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Top-right gems display for avatar card
export const TopRightGems = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: white;
`;
