import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaGamepad,
  FaUserFriends,
} from "react-icons/fa";
import axios from "axios";
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
const LevelPage = () => {
  const [userLevelData, setUserLevelData] = useState(null); // Store user's level data
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state for criteria

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await getUserID(() => {}, () => {});
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`
        );
        const data = response.data;
        setUserLevelData(data);
        setLoading(false); 

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
            <GemIcon position={`${currentLevel.progress -3}%`} />
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
