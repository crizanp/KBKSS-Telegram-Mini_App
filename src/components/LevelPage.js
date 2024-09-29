import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaArrowAltCircleLeft,
  FaGem,
  FaCheckCircle,
  FaGamepad,
  FaUserFriends,
} from "react-icons/fa";
import axios from "axios";
import UserInfo from "./UserInfo"; // Import UserInfo component
import { getUserID } from "../utils/getUserID"; // Assuming the file is named getUserID.js
import avatar1 from '../assets/avatar/1.png';
import avatar2 from '../assets/avatar/2.png';
import avatar3 from '../assets/avatar/3.png';
import avatar4 from '../assets/avatar/4.png';
import avatar5 from '../assets/avatar/5.png';

// Glowing animation for the level circle
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px ${(props) => props.color || "#36a8e5"}, 0 0 20px ${(props) => props.color || "#36a8e5"}, 0 0 30px ${(props) => props.color || "#36a8e5"}, 0 0 40px ${(props) => props.color || "#36a8e5"};
  }
  50% {
    box-shadow: 0 0 15px ${(props) => props.color || "#36a8e5"}, 0 0 30px ${(props) => props.color || "#36a8e5"}, 0 0 60px ${(props) => props.color || "#36a8e5"}, 0 0 80px ${(props) => props.color || "#36a8e5"};
  }
  100% {
    box-shadow: 0 0 5px ${(props) => props.color || "#36a8e5"}, 0 0 20px ${(props) => props.color || "#36a8e5"}, 0 0 30px ${(props) => props.color || "#36a8e5"}, 0 0 40px ${(props) => props.color || "#36a8e5"};
  }
`;

// Styled Components
const LevelPageContainer = styled.div`
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
const Avatar = styled.img`
  width: 160px;    /* Adjust size as needed */
  height: 160px;   /* Adjust size as needed */
  border-radius: 50%;   /* Make it circular */
  border: 5px solid #fff;  /* Cute white border */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);  /* Optional glow */
  margin-bottom: 15px;   /* Space below the avatar */
`;
// Arrow Button Styles
const SliderIconContainer = styled.div`
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

const LeftSliderIcon = styled(FaArrowAltCircleLeft)`
  color: #fafafa;
  font-size: 3rem;
`;

const RightSliderIcon = styled(FaArrowAltCircleLeft)`
  color: #fafafa;
  font-size: 3rem;
  transform: rotate(180deg);
`;

// Centering level content
const LevelContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

// Level Circle with glowing animation
const LevelCircle = styled.div`
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
const LevelName = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.color || "#36a8e5"};
  text-transform: uppercase;
  margin-bottom: 10px;
`;

// Progress Bar Wrapper with fixed width
const ProgressBarWrapper = styled.div`
  width: 140%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

// Progress Bar Container
const ProgressBarContainer = styled.div`
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
const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.width || "50%"};
  background-color: ${(props) => props.color || "#36a8e5"};
  border-radius: 10px;
  transition: width 0.4s ease;
`;

// Gem icon for progress
const GemIcon = styled(FaGem)`
  position: absolute;
  top: 1px;
  left: ${(props) => props.position || "0%"};
  transform: translateX(-50%);
  font-size: 1.4rem;
  color: #fff;
`;

// Task Criteria section container
const CriteriaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
  max-width: 600px;
`;

// Single criterion box with bigger width
const CriterionBox = styled.div`
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
const StatusText = styled.span`
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

const CriterionText = styled.div`
  flex: 1;
  text-align: left;
  font-size: 1.2rem;
`;

const CriterionIcon = styled.div`
  margin-right: 25px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

// Dummy data for levels with multiple criteria
const levelsData = [
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
const getAvatarByLevel = (level) => {
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
const LevelPage = () => {
  const [userLevelData, setUserLevelData] = useState(null); // Store user's level data
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state for criteria

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use no-op functions as placeholders for setUserID and setUsername
        const userID = await getUserID(() => {}, () => {});

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`
        );
        const data = response.data;
        setUserLevelData(data);
        setLoading(false); // Data has finished loading

        const currentLevel = levelsData.findIndex(
          (level) => level.level === data.currentLevel
        );
        if (currentLevel !== -1) {
          setCurrentLevelIndex(currentLevel);
        }
      } catch (error) {
        console.error("Error fetching user level data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrevious = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : levelsData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex < levelsData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentLevel = levelsData[currentLevelIndex];

  // Get avatar based on current level
  const userAvatar = getAvatarByLevel(currentLevel.level);

  // Check if criteria are completed
  const tasksCompleted =
    userLevelData?.actualTasksCompleted >=
    parseInt(currentLevel.criteria.tasks.split(" ")[1]);
  const gamesUnlocked =
    userLevelData?.actualGamesUnlocked >=
    parseInt(currentLevel.criteria.games.split(" ")[1]);
  const invitesCompleted =
    userLevelData?.actualInvites >=
    parseInt(currentLevel.criteria.invites.split(" ")[1]);

  return (
    <LevelPageContainer>
      <UserInfo />

      {/* Left arrow button */}
      <SliderIconContainer style={{ left: "10px" }} onClick={handlePrevious}>
        <LeftSliderIcon />
      </SliderIconContainer>

      {/* Display the current level */}
      <LevelContent>
        <Avatar src={userAvatar} alt="User Avatar" />

        {/* Show level name with "(current)" if it's the user's current level */}
        <LevelName style={{ color: currentLevel.color }}>
          Lvl {currentLevel.level}{" "}
          {currentLevel.level === userLevelData?.currentLevel && "(current)"}
        </LevelName>

        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            <ProgressFill
              width={`${currentLevel.progress}%`}
              color={currentLevel.color}
            />
            <GemIcon position={`${currentLevel.progress}%`} />
          </ProgressBarContainer>
        </ProgressBarWrapper>
      </LevelContent>

      {/* Task Criteria Section */}
      <CriteriaContainer>
        <CriterionBox completed={tasksCompleted}>
          <CriterionIcon>
            <FaCheckCircle />
          </CriterionIcon>
          <CriterionText>{currentLevel.criteria.tasks}</CriterionText>
          <StatusText completed={loading ? null : tasksCompleted}>
            {loading ? "Checking..." : tasksCompleted ? "Completed" : "Not Completed"}
          </StatusText>
        </CriterionBox>

        <CriterionBox completed={gamesUnlocked}>
          <CriterionIcon>
            <FaGamepad />
          </CriterionIcon>
          <CriterionText>{currentLevel.criteria.games}</CriterionText>
          <StatusText completed={loading ? null : gamesUnlocked}>
            {loading ? "Checking..." : gamesUnlocked ? "Completed" : "Not Completed"}
          </StatusText>
        </CriterionBox>

        <CriterionBox completed={invitesCompleted}>
          <CriterionIcon>
            <FaUserFriends />
          </CriterionIcon>
          <CriterionText>{currentLevel.criteria.invites}</CriterionText>
          <StatusText completed={loading ? null : invitesCompleted}>
            {loading ? "Checking..." : invitesCompleted ? "Completed" : "Not Completed"}
          </StatusText>
        </CriterionBox>
      </CriteriaContainer>

      {/* Right arrow button */}
      <SliderIconContainer style={{ right: "10px" }} onClick={handleNext}>
        <RightSliderIcon />
      </SliderIconContainer>
    </LevelPageContainer>
  );
};

export default LevelPage;
