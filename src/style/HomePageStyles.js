import styled, { keyframes } from "styled-components";
import { FaBolt } from "react-icons/fa";
import {  FaRegGem, FaFire,FaCog  } from "react-icons/fa";
import { FaRocket } from "react-icons/fa"; // Import a rocket icon for boost

const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  85% {
    opacity: 1;  /* Stay fully visible up to 85% of the animation */
    transform: translateY(-200px) scale(2);  /* Move further up, increase -120px to -200px */
  }
  100% {
    opacity: 0;  /* Completely vanish by the end */
    transform: translateY(-200px) scale(2);  /* Keep the same position */
  }
`;

export const slapEffectAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0) translateX(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-8px) translateX(8px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5) translateY(-16px) translateX(-16px);
    opacity: 0;
  }
`;

export const HomeContainer = styled.div`
  font-family: "Orbitron", sans-serif;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 88vh;
  overflow: hidden;
  user-select: none;
  padding: 20px 20px;
  position: relative;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PointsDisplay = styled.div`
  font-size: 37px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: bold;
  justify-content: center;
`;

export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

export const MiddleSection = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  justify-content: flex-end;
  align-content: space-around;
  flex-direction: column;
  margin-top: 5px;
`;

export const Message = styled.div`
  color: white;
  text-transform: uppercase;
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

export const EagleContainer = styled.div`
  border-radius: 50%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: center;
`;

export const EagleImage = styled.img`
  width: 110%;
  height: 110%;
  margin-top: 10px;
  -webkit-tap-highlight-color: transparent;
  margin-top: 10px;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
  pointer-events: auto;
  z-index: 500; // Lower z-index than the right-side menu

  // Apply subtle animation on tap
  &.tapped {
    animation: bounceEffect 0.1s ease-out;
  }

  @keyframes bounceEffect {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04); /* Scale up slightly */
    }
    100% {
      transform: scale(1); /* Return to original size */
    }
  }
`;


export const BottomContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers the content horizontally */
  align-items: flex-end; /* Centers the content vertically */
  left: 50%;
  transform: translateX(-1%); /* Center it horizontally */
  width: auto; /* Let the content define the width */
  max-width: 400px;
  gap: 0; /* No gap between items */
  z-index: 501;
  padding-bottom: 20px;
`;


export const EarnMoreBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #2a2a2a00;
  border-radius: 13px;
  padding: 10px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  width: 110px;
  height: 45px;
  text-align: right;
  border: 2px solid #1fa3e6;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  & svg {
    margin-right: 5px;
  }

  &:hover {
    background-color: #575757;
  }
`;

export const EnergyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a00;
  border-radius: 30px;
  padding: 0px 9px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  width: 107px;
  height: 35px;
  text-align: justify;
  border: 2px solid #1fa3e6;
  text-decoration: none;
  color: white;
  margin-left: 10px;

  & svg {
    margin-right: 5px;
  }
`;

export const EnergyIcon = styled(FaBolt)`
  width: 20px;
  height: 20px;
  color: ${({ energy }) => (energy > 500 ? "#ffcc00" : "#ff6600")};
  transition: color 0.3s ease;
`;

export const EnergyCounter = styled.div`
  font-size: 14px;
  color: white;
  font-weight: bold;
`;

export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 36px;
  color: #ffffff;
  animation: ${pointFlyingAnimation} 0.75s ease-in-out;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  z-index: 502;
  pointer-events: none;
  transform: translate(-50%, -100%); /* Adjust for proper centering */

  /* Ensure the points fade away completely */
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
`;

export const SlapEmojiImage = styled.img`
  position: absolute;
  width: 350px; /* Reduced size */
  height: 350px;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  transform: translate(-50%, -50%); /* Center the image */
  animation: fadeOut 0.75s ease-out forwards; /* Add fade-out animation */
  pointer-events: none; /* Make sure it doesn't interfere with user interactions */
  z-index: 100;

  @keyframes fadeOut {
    0% {
      opacity: 0.55; /* Reduced opacity for more transparency */
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) translateY(-20px); /* Moves it upwards slightly before disappearing */
    }
  }
`;

export const CurvedBorderContainer = styled.div`
  width: 110%;
  height: 21px;
  margin-top: 70px;
  border-top: solid 3px #c5b8b8;
  border-radius: 50% / 100px 100px 0 0;
  position: relative;
  box-sizing: border-box;
`;

export const UserInfoSection = styled.div`
  /* Your existing styles for the UserInfo component */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;
export const BackgroundWrapper = styled.div`
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: calc(100vh - 150px); // Adjusted to fit between sections
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;
// Styled Gem Icon
export const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.9rem;
`;
export const SettingsIcon = styled(FaCog)`
 position: absolute;
    bottom: 8px;
    padding-left: 16px;
    /* right: 22px; */
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;
`;

// Styled Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;
export const FireIcon = styled(FaFire)`
  font-size: 1rem;
  margin-right: 0px;
  color: ${(props) =>
    props.$available
      ? "#f39c12"
      : "#a0a0a0"}; // Yellow if available, grey if not
`;

export const RewardModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  position: relative;
  animation: ${(props) => (props.isClosing ? "slideDown" : "slideUp")} 0.5s
    ease-in-out;

  @keyframes slideUp {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

export const ModalHeader = styled.h2`
  text-align: center;
  color: #333;
`;

export const ClaimButton = styled.button`
  background-color: #36a8e5;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #298dc8;
  }
`;

export const PointsDisplayModal = styled.div`
  font-size: 1.5rem;
  text-align: center;
  color: #36a8e5;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
`;
export const LeaderboardImage = styled.img`
  width: 40px;
  height: 36px;
  animation: tiltEffect 5s ease-in-out infinite; // Slower and smoother tilting animation

  @keyframes tiltEffect {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(10deg); // Tilts 5 degrees to the right
    }
    50% {
      transform: rotate(-10deg); // Tilts 5 degrees to the left
    }
    75% {
      transform: rotate(7deg); // Tilts back slightly to the right
    }
    100% {
      transform: rotate(0deg); // Returns to original position
    }
  }
`;

export const SmallTimerText = styled.span`
  font-size: 12px;
  color: #ccc;
  text-align: center;
  margin-bottom: 5px; /* Add space between timer and claim button */
`;
// Right-side menu container with centered layout and high z-index
export const RightSideMenuContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 35%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
  pointer-events: auto;

  @keyframes floatEffect {
    0% {
      transform: translateY(-50%) translateX(0);
    }
    50% {
      transform: translateY(calc(-50% - 5px)) translateX(0); /* Float slightly up */
    }
    100% {
      transform: translateY(-50%) translateX(0);
    }
  }

  animation: floatEffect 3s ease-in-out infinite;  // Infinite float animation
`;

// Common styles for both Boost and Leaderboard icons
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px; // Set consistent padding for both containers
  border-radius: 36%;
  background: linear-gradient(135deg, #f82959eb, #6f32b1);  // Gradient background
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);  // Shadow for floating effect
  transition: transform 0.3s ease, box-shadow 0.3s ease;  // Smooth hover transition

  &:hover {
    transform: translateY(-10px);  // Lift on hover
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);  // Increase shadow on hover
  }
`;
// Boost Icon styled component with gradient background and animation
export const BoostIcon = styled(FaRocket)`
  font-size: 2.5rem; // Uniform size
  color: white;
`;
// Leaderboard Icon styled component with same gradient style
export const RightCenterLeaderboardImage = styled.img`
  width: 2.5rem; // Set the same width as BoostIcon for consistency
  height: 2.5rem; // Set the same height as BoostIcon for consistency
`;

// Styled Icon Label with some spacing and color adjustments
export const IconLabel = styled.div`
  color: white;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
`;

// Wrapping Boost Icon inside a styled container for floating and effects
export const BoostContainer = styled(IconContainer)`
  background: linear-gradient(135deg, #f82959eb, #f37129);  // Gradient specific to Boost
  height:30px;
  width:30px;
`;

// Wrapping Leaderboard Icon inside a styled container for floating and effects
export const LeaderboardContainer = styled(IconContainer)`
  background: linear-gradient(135deg, #3aafff, #32b1e2);  // Gradient specific to Leaderboard
  height:30px;
  width:30px;
`;