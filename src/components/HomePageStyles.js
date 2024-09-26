import styled, { keyframes, css } from "styled-components";
import { FaBolt } from "react-icons/fa";
const eagleShiftUp = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Slight upward movement */
  }
  100% {
    transform: translateY(0); /* Return to original position */
  }
`;

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




const slapEffectAnimation = keyframes`
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
  min-height: 87vh;
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
  justify-content: space-around;
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
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

export const EagleImage = styled.img`
  width: 95%;
  height: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 10px;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
  z-index: 1000;

  &.shift-up {
    animation: ${eagleShiftUp} 0.2s ease-in-out; /* Slight and quick animation */
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: center; // Centers horizontally
  align-items: center;     // Centers vertically
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  align-items: flex-end;


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
  z-index: 1001;
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
      opacity: 0.5; /* Reduced opacity for more transparency */
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
