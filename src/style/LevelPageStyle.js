import styled, { keyframes } from 'styled-components';
import { FaArrowAltCircleLeft, FaGem } from 'react-icons/fa';
import avatar1 from '../assets/avatar/1.png';
import avatar2 from '../assets/avatar/2.png';
import avatar3 from '../assets/avatar/3.png';
import avatar4 from '../assets/avatar/4.png';
import avatar5 from '../assets/avatar/5.png';
import {  FaArrowUp,FaFire } from "react-icons/fa";

// Styled Components
export const LevelPageContainer = styled.div`
  background-color: #090c12;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Orbitron", sans-serif;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
`;
export const Avatar = styled.img`
  width: 160px;    /* Adjust size as needed */
  height: 160px;   /* Adjust size as needed */
  border-radius: 50%;   /* Make it circular */
  border: 5px solid #fff;  /* Cute white border */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);  /* Optional glow */
  margin-bottom: 15px;   /* Space below the avatar */
`;
// Arrow Button Styles
export const SliderIconContainer = styled.div`
  position: absolute;
  top: 36%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
`;

export const LeftSliderIcon = styled(FaArrowAltCircleLeft)`
  color: #fafafa;
  font-size: 3rem;
`;

export const RightSliderIcon = styled(FaArrowAltCircleLeft)`
  color: #fafafa;
  font-size: 3rem;
  transform: rotate(180deg);
`;

// Centering level content
export const LevelContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

// Level Circle with glowing animation
export const LevelCircle = styled.div`
  background-color: ${(props) => props.color || "#36a8e5"};
  border-radius: 50%;
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  color: white;
  box-shadow: ${(props) => (props.$isActive ? "0 0 15px #36a8e5" : "none")};
`;

// Level name display with "(current)" if it's the user's current level
export const LevelName = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.color || "#36a8e5"};
  text-transform: uppercase;
  margin-bottom: 10px;
`;

// Progress Bar Wrapper with fixed width
export const ProgressBarWrapper = styled.div`
  width: 140%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

// Progress Bar Container
export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

// Progress Bar Fill, using dynamic width for progress
export const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.width || "50%"};
  background-color: ${(props) => props.color || "#36a8e5"};
  border-radius: 10px;
  transition: width 0.4s ease;
`;

// Gem icon for progress
export const GemIcon = styled(FaGem)`
  position: absolute;
  top: 0px;
  left: ${(props) => props.position  || "0%"};
  transform: translateX(-50%);
  font-size: 1.6rem;
  color: #fff;
`;

// Task Criteria section container
export const CriteriaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
  max-width: 600px;
`;

// Single criterion box with bigger width
export const CriterionBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 0px;
  border-radius: 10px;
  margin: 10px 0;
  font-size: 1.2rem;
  color: ${(props) => (props.completed ? "#4caf50" : "#e0e0e0")}; // Green for completed criteria
`;

// Styled for small "Completed", "Not Completed", or "Checking..." text
export const StatusText = styled.span`
  font-size: 0.9rem;
  background-color: ${(props) =>
    props.completed === null
      ? "transparent"
      : props.completed
      ? "#fff"
      : "transparent"};
  color: ${(props) =>
    props.completed === null ? "#e0e0e0" : props.completed ? "#000" : "#e0e0e0"};
  padding: 2px 5px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 15px;
`;

export const CriterionText = styled.div`
  flex: 1;
  text-align: left;
  font-size: 1.2rem;
`;

export const CriterionIcon = styled.div`
  margin-right: 25px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;
// Dummy data for levels with multiple criteria
export const levelsData = [
  {
    level: 1,
    name: "Novice",
    criteria: {
      tasks: "Finish 5 tasks",
      games: "Unlock 1 game",
      invites: "Invite 1 friend",
    },
    color: "#36a8e5",
    progress: 30,
    starsNeeded: 50,
  },
  {
    level: 2,
    name: "Apprentice",
    criteria: {
      tasks: "Finish 15 tasks",
      games: "Unlock 1 game",
      invites: "Invite 3 friends",
    },
    color: "#4caf50",
    progress: 50,
    starsNeeded: 100,
  },
  {
    level: 3,
    name: "Warrior",
    criteria: {
      tasks: "Finish 20 tasks",
      games: "Unlock 1 game",
      invites: "Invite 5 friends",
    },
    color: "#ff5722",
    progress: 70,
    starsNeeded: 200,
  },
  {
    level: 4,
    name: "Champion",
    criteria: {
      tasks: "Finish 25 tasks",
      games: "Unlock 2 games",
      invites: "Invite 10 friends",
    },
    color: "#36a8e5",
    progress: 80,
    starsNeeded: 400,
  },
  {
    level: 5,
    name: "Legend",
    criteria: {
      tasks: "Finish 25 tasks",
      games: "Unlock 2 games",
      invites: "Invite 20 friends",
    },
    color: "#9c27b0",
    progress: 95,
    starsNeeded: 800,
  },
];
// Define a function to return avatar based on level
export const getAvatarByLevel = (level) => {
  switch (level) {
    case 1:
      return avatar1;
    case 2:
      return avatar2;
    case 3:
      return avatar3;
    case 4:
      return avatar4;
    case 5:
      return avatar5;
    default:
      return avatar1; // Default avatar if level is out of range
  }
};



//boost page
export const BoostPageContainer = styled.div`
  background-color: #090c12;
  color: white;
  min-height: 100vh;
  padding: 20px;
  font-family: "Orbitron", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  color: #e1e8eb;
  font-size: 1.8rem;
  margin-bottom: 15px;
`;

export const BoostButton = styled.button`
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

  &:disabled {
    background-color: rgb(165 245 165);
    cursor: not-allowed;
    color: white;
  }
`;

export const EnergyIcon = styled(FaFire)`
  color: #f39c12;
  font-size: 2rem;
`;

export const TapIcon = styled(FaGem)`
  color: #36a8e5;
  font-size: 2rem;
`;

export const MaxEnergyIcon = styled(FaArrowUp)`
  color: #e67e22;
  font-size: 2rem;
`;

export const BoostOption = styled.button`
  background-color: ${(props) =>
    props.selected ? "rgb(165 245 165)" : props.loading ? "#ccc" : "#fff"};
  color: ${(props) => (props.selected ? "#000" : "#000")};
  border: ${(props) => (props.selected ? "none" : "1px solid #ccc")};
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0px;
  width: 100%;
  display: flex;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: ${(props) =>
      props.selected ? "rgb(165 245 165)" : "#eee"};
  }
  &:disabled {
    background-color: rgb(165 245 165);
    cursor: not-allowed;
    color: #000000;
  }
`;

export const EligibleTag = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #544e4e;
  color: #fff;
  padding: 3px 8px;
  font-size: 0.7rem;
  border-radius: 4px;
`;

export const Spacer = styled.div`
  height: 60px;
`;