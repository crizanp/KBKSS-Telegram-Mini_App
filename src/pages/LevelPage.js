import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaGamepad, FaUserFriends } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserInfo from "../components/UserInfo";
import { getUserID } from "../utils/getUserID";
import {
  CriterionIcon,
  CriterionText,
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
  getAvatarByLevel,
} from "../style/LevelPageStyle";
import styled from "styled-components";

// Dynamic Glowing Check Icon
const GlowingCheckIcon = styled(FaCheckCircle)`
  color: ${({ color }) => color};
  font-size: 21px;
  animation: 1.5s infinite ease-in-out;
  vertical-align: middle;
  margin-bottom: 8px;
  border-radius: 50%;
  padding: 0;
`;

// Styled Components for "Done" and "Not Done" Icons
const DoneIcon = styled(FaCheckCircle)`
  color: #4caf50; /* Green for done */
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;
`;

const NotDoneIcon = styled(FaTimesCircle)`
  color: #f44336; /* Red for not done */
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;

`;

// Function to fetch user level data using React Query
const fetchUserLevelData = async () => {
  const userID = await getUserID();
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`
  );
  return response.data;
};

// Function to fetch levels criteria from backend
const fetchLevelsData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/level-management/levels`);
  return response.data;
};

const LevelPage = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // Track level index

  // Fetch user level data and levels data using React Query
  const { data: userLevelData, isLoading: userLoading, isError: userError } = useQuery(
    ["userLevelData"],
    fetchUserLevelData,
    {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    }
  );

  const { data: levelsData, isLoading: levelsLoading, isError: levelsError } = useQuery(
    ["levelsData"],
    fetchLevelsData,
    {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    }
  );

  // Sort levelsData in ascending order
  const sortedLevelsData = levelsData?.sort((a, b) => a.levelNumber - b.levelNumber) || [];

  // Find the user's current level index in the levelsData
  useEffect(() => {
    if (userLevelData && sortedLevelsData.length > 0) {
      const currentLevel = sortedLevelsData.findIndex(
        (level) => level.levelNumber === userLevelData.currentLevel
      );
      if (currentLevel !== -1) {
        setCurrentLevelIndex(currentLevel);
      }
    }
  }, [userLevelData, sortedLevelsData]);

  const handlePrevious = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : sortedLevelsData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex < sortedLevelsData.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (userLoading || levelsLoading) {
    return <div>Loading...</div>;
  }

  if (userError || levelsError) {
    return <div>Error loading data...</div>;
  }

  const currentLevel = sortedLevelsData[currentLevelIndex];
  const userAvatar = getAvatarByLevel(currentLevel.levelNumber);

  // Calculate the width percentage for each level
  const totalLevels = sortedLevelsData.length;
  const levelWidthPercentage = 100 / totalLevels; // Divide the full width equally among all levels

  // Calculate progress for the level based on criteria
  const calculateProgress = () => {
    let totalCriteria = 0;
    let completedCriteria = 0;

    Object.keys(currentLevel.criteria).forEach((key) => {
      totalCriteria++;
      const actualValue = userLevelData[`actual${key.charAt(0).toUpperCase() + key.slice(1)}`];
      const requiredValue = parseInt(currentLevel.criteria[key]);

      if (actualValue >= requiredValue) {
        completedCriteria++;
      }
    });

    // Calculate percentage of criteria completion
    return (completedCriteria / totalCriteria) * 100;
  };

  // Calculate total progress for all levels
  const calculateTotalProgress = () => {
    const currentLevelProgress = calculateProgress();
    const totalProgress = currentLevelIndex * levelWidthPercentage + (currentLevelProgress * levelWidthPercentage) / 100;
    return totalProgress;
  };

  // Dynamically check criteria completion
  const checkCriteriaCompletion = (criteriaKey) => {
    let actualValue;
  
    // Map criteria to actual data in userLevelData
    if (criteriaKey === "tasks") {
      actualValue = userLevelData.actualTasksCompleted;
    } else if (criteriaKey === "games") {
      actualValue = userLevelData.actualGamesUnlocked;
    } else if (criteriaKey === "invites") {
      actualValue = userLevelData.actualInvites;
    } else if (criteriaKey === "avatarsUnlocked") {
      actualValue = userLevelData.actualAvatarsUnlocked;
    }

    const requiredValue = parseInt(currentLevel.criteria[criteriaKey]);

    console.log(`Checking completion for ${criteriaKey}: Actual=${actualValue}, Required=${requiredValue}`);

    return actualValue >= requiredValue;
  };

  // Render criteria dynamically based on level data
  const renderCriteria = () => {
    return Object.keys(currentLevel.criteria).map((key) => {
      let IconComponent;
      if (key === "tasks") {
        IconComponent = FaCheckCircle;
      } else if (key === "games") {
        IconComponent = FaGamepad;
      } else if (key === "invites") {
        IconComponent = FaUserFriends;
      } else {
        IconComponent = FaCheckCircle; // Default icon
      }

      const isCompleted = checkCriteriaCompletion(key);

      return (
        <CriterionBox key={key} completed={isCompleted}>
          <CriterionIcon>
            <IconComponent />
          </CriterionIcon>
          <CriterionText>{key.charAt(0).toUpperCase() + key.slice(1)}: {currentLevel.criteria[key]}</CriterionText>
          {/* Display a green or red icon based on completion status */}
          {isCompleted ? <DoneIcon /> : <NotDoneIcon />}
        </CriterionBox>
      );
    });
  };

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
          Lvl {currentLevel.levelNumber}{" "}
          {currentLevel.levelNumber === userLevelData?.currentLevel && (
            <GlowingCheckIcon color={currentLevel.color} />
          )}
        </LevelName>

        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            {/* Dynamically set the total progress for all levels */}
            <ProgressFill
              width={`${calculateTotalProgress()}%`}  // Set total progress
              color={currentLevel.color}
            />
            <GemIcon position={`${calculateTotalProgress()}%`} />
          </ProgressBarContainer>
        </ProgressBarWrapper>
      </LevelContent>

      {/* Task Criteria Section */}
      <CriteriaContainer>{renderCriteria()}</CriteriaContainer>

      {/* Right arrow button */}
      <SliderIconContainer style={{ right: "10px" }} onClick={handleNext}>
        <RightSliderIcon />
      </SliderIconContainer>
    </LevelPageContainer>
  );
};

export default LevelPage;
