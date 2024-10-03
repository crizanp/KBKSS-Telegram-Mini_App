import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaGamepad,
  FaUserFriends,
} from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserInfo from "../components/UserInfo"; 
import { getUserID } from "../utils/getUserID"; 
import {
  CriterionIcon,
  CriterionText,
  StatusText,
  CriterionBox,
  CriteriaContainer,
  GemIcon,
  ProgressFill,
  ProgressBarContainer,
  ProgressBarWrapper,
  LevelName,
  LevelContent,
  RightSliderIcon,
  LeftSliderIcon,
  SliderIconContainer,
  LevelPageContainer,
  Avatar,
  levelsData,
  getAvatarByLevel,
} from "../style/LevelPageStyle";
import styled, { keyframes } from "styled-components";

// Define keyframe animation for glowing effect
// const glow = keyframes`
//   0% {
//     box-shadow: 0 0 5px #f7f206, 0 0 10px #fff828, 0 0 15px #f7f206, 0 0 20px #f7f206;
//   }
//   50% {
//     box-shadow: 0 0 10px #fff700, 0 0 20px #fff700, 0 0 30px #e6ff00, 0 0 40px #ebff00;
//   }
//   100% {
//     box-shadow: 0 0 5px #f7f206, 0 0 10px #f7f206, 0 0 15px #f7f206, 0 0 20px #f7f206;
//   }
// `;

// Style for the glowing check icon with dynamic color
const GlowingCheckIcon = styled(FaCheckCircle)`
  color: ${({ color }) => color}; /* Dynamic color based on currentLevel.color */
  font-size: 21px;
  animation:  1.5s infinite ease-in-out;  // Apply glowing effect
  vertical-align: middle;
  background: none; /* Ensure no background */
  margin-bottom: 8px;
  border-radius: 50%; /* Ensure the checkmark is circular */
  padding: 0; /* Remove any padding around the icon */
  box-shadow: none; /* Remove any box-shadow if applied unintentionally */
`;

// Fallback non-animated icon when not completed
const StaticIcon = styled(FaCheckCircle)`
  color: #ccc;
  font-size: 24px;
  transition: color 0.3s ease;
`;

// Function to fetch user level data using React Query
const fetchUserLevelData = async () => {
  const userID = await getUserID();
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`
  );
  return response.data;
};

const LevelPage = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // Track level index

  // Use React Query to fetch user level data, ensure queryKey is an array
  const { data: userLevelData, isLoading, isError } = useQuery(
    ['userLevelData'], // queryKey should be an array
    fetchUserLevelData, // queryFn
    {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    }
  );

  // Find the user's current level index in the levelsData
  useEffect(() => {
    if (userLevelData) {
      const currentLevel = levelsData.findIndex(
        (level) => level.level === userLevelData.currentLevel
      );
      if (currentLevel !== -1) {
        setCurrentLevelIndex(currentLevel);
      }
    }
  }, [userLevelData]);

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

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (isError) {
    return <div>Error loading data...</div>; // Error state
  }

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

        {/* Show level name with "(current)" and dynamic colored glowing checkmark */}
        <LevelName style={{ color: currentLevel.color }}>
          Lvl {currentLevel.level}{" "}
          {currentLevel.level === userLevelData?.currentLevel && (
            <>
              <GlowingCheckIcon color={currentLevel.color} />  {/* Pass the dynamic color */}
            </>
          )}
        </LevelName>

        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            <ProgressFill
              width={`${currentLevel.progress}%`}
              color={currentLevel.color}
            />
            <GemIcon position={`${currentLevel.progress - 1}%`} />
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
          <StatusText completed={isLoading ? null : tasksCompleted}>
            {isLoading ? "Checking..." : tasksCompleted ? "Completed" : "Not Completed"}
          </StatusText>
        </CriterionBox>

        <CriterionBox completed={gamesUnlocked}>
          <CriterionIcon>
            <FaGamepad />
          </CriterionIcon>
          <CriterionText>{currentLevel.criteria.games}</CriterionText>
          <StatusText completed={isLoading ? null : gamesUnlocked}>
            {isLoading ? "Checking..." : gamesUnlocked ? "Completed" : "Not Completed"}
          </StatusText>
        </CriterionBox>

        <CriterionBox completed={invitesCompleted}>
          <CriterionIcon>
            <FaUserFriends />
          </CriterionIcon>
          <CriterionText>{currentLevel.criteria.invites}</CriterionText>
          <StatusText completed={isLoading ? null : invitesCompleted}>
            {isLoading ? "Checking..." : invitesCompleted ? "Completed" : "Not Completed"}
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
