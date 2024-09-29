import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaArrowAltCircleLeft, FaGem, FaCheckCircle, FaGamepad, FaUserFriends } from 'react-icons/fa';
import UserInfo from './UserInfo'; // Import UserInfo component

// Glowing animation for the level circle
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px ${(props) => props.color || '#36a8e5'}, 0 0 20px ${(props) => props.color || '#36a8e5'}, 0 0 30px ${(props) => props.color || '#36a8e5'}, 0 0 40px ${(props) => props.color || '#36a8e5'};
  }
  50% {
    box-shadow: 0 0 10px ${(props) => props.color || '#36a8e5'}, 0 0 30px ${(props) => props.color || '#36a8e5'}, 0 0 60px ${(props) => props.color || '#36a8e5'}, 0 0 80px ${(props) => props.color || '#36a8e5'};
  }
  100% {
    box-shadow: 0 0 5px ${(props) => props.color || '#36a8e5'}, 0 0 20px ${(props) => props.color || '#36a8e5'}, 0 0 30px ${(props) => props.color || '#36a8e5'}, 0 0 40px ${(props) => props.color || '#36a8e5'};
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
  font-family: 'Orbitron', sans-serif;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
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

// Left Arrow Button
const LeftSliderIcon = styled(FaArrowAltCircleLeft)`
  color:#fafafa;
  font-size: 3rem;
`;

// Right Arrow Button
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
  background-color: ${(props) => props.color || '#36a8e5'};
  border-radius: 50%;
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  color: white;
  animation: ${glow} 2s ease-in-out infinite;
  margin-bottom: 10px;
`;

// Level name display
const LevelName = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.color || '#36a8e5'};
  text-transform: uppercase;
  margin-bottom: 10px;
`;

// Progress Bar Wrapper with fixed width
const ProgressBarWrapper = styled.div`
  width: 100%;
  max-width: 500px; // All progress bars will have the same width
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

// Progress Bar Container with fixed width and overflow fix
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
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
  width: ${(props) => props.width || '50%'};
  background-color: ${(props) => props.color || '#36a8e5'};
  border-radius: 10px;
  transition: width 0.4s ease;
`;

// Gem icon for progress
const GemIcon = styled(FaGem)`
  position: absolute;
  top: -2px;
  left: ${(props) => props.position || '0%'};
  transform: translateX(-50%);
  font-size: 1.45rem;
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
  color: #e0e0e0;
`;
const CriterionIcon = styled.div`
  margin:  0px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;
const CriterionText = styled.div`
  flex: 1;
  text-align: left;
  font-size: 1.2rem;
`;

// Dummy data for levels with multiple criteria
const levelsData = [
  {
    level: 1,
    name: 'Novice',
    criteria: {
      points: 'Collect 10,000 $GEMS',
      tasks: 'Finish 5 tasks',
      games: 'Unlock 1 game',
      invite: 'Invite 1 friend',
    },
    color: '#36a8e5',
    progress: 30,
    starsNeeded: 50, // Example stars needed for the next level
  },
  {
    level: 2,
    name: 'Apprentice',
    criteria: {
      points: 'Collect 50,000 $GEMS',
      tasks: 'Finish 15 tasks',
      games: 'Unlock 1 games',
      invite: 'Invite 3 friends',
    },
    color: '#4caf50',
    progress: 50,
    starsNeeded: 100,
  },
  {
    level: 3,
    name: 'Warrior',
    criteria: {
      points: 'Collect 100,000 $GEMS',
      tasks: 'Finish 20 tasks',
      games: 'Unlock 1 game',
      invite: 'Invite 5 friends',
    },
    color: '#ff5722',
    progress: 70,
    starsNeeded: 200,
  },
  {
    level: 4,
    name: 'Champion',
    criteria: {
      points: 'Collect 200,000 $GEMS',
      tasks: 'Finish 25 tasks',
      games: 'Unlock 2 games',
      invite: 'Invite 10 friends',
    },
    color: '#36a8e5',
    progress: 80,
    starsNeeded: 400,
  },
  {
    level: 5,
    name: 'Legend',
    criteria: {
      points: 'Collect 500,000 $GEMS',
      tasks: 'Finish 25 tasks',
      games: 'Unlock 2 games',
      invite: 'Invite 20 friends',
    },
    color: '#9c27b0',
    progress: 95,
    starsNeeded: 800,
  },
];

const LevelPage = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentStars, setCurrentStars] = useState(0); // Example state for current stars

  // Navigate to the previous level
  const handlePrevious = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : levelsData.length - 1
    );
  };

  // Navigate to the next level
  const handleNext = () => {
    setCurrentLevelIndex((prevIndex) =>
      prevIndex < levelsData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const { level, name, criteria, color, progress } = levelsData[currentLevelIndex];

  return (
    <LevelPageContainer>
      {/* Include UserInfo at the top */}
      <UserInfo />

      {/* Left arrow button */}
      <SliderIconContainer style={{ left: '10px' }} onClick={handlePrevious}>
        <LeftSliderIcon />
      </SliderIconContainer>

      {/* Display the current level */}
      <LevelContent>
        <LevelCircle color={color}>{level}</LevelCircle>
        <LevelName style={{ color }}>{name}</LevelName>

        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            <ProgressFill width={`${progress}%`} color={color} />
            <GemIcon position={`${progress}%`} />
          </ProgressBarContainer>
        </ProgressBarWrapper>
      </LevelContent>

      {/* Task Criteria Section */}
      <CriteriaContainer>
        <CriterionBox>
          <CriterionIcon>
            <FaCheckCircle />
          </CriterionIcon>
          <CriterionText>{criteria.points}</CriterionText>
        </CriterionBox>

        <CriterionBox>
          <CriterionIcon>
            <FaCheckCircle />
          </CriterionIcon>
          <CriterionText>{criteria.tasks}</CriterionText>
        </CriterionBox>

        <CriterionBox>
          <CriterionIcon>
            <FaGamepad />
          </CriterionIcon>
          <CriterionText>{criteria.games}</CriterionText>
        </CriterionBox>

        <CriterionBox>
          <CriterionIcon>
            <FaUserFriends />
          </CriterionIcon>
          <CriterionText>{criteria.invite}</CriterionText>
        </CriterionBox>
      </CriteriaContainer>

      {/* Right arrow button */}
      <SliderIconContainer style={{ right: '10px' }} onClick={handleNext}>
        <RightSliderIcon />
      </SliderIconContainer>
    </LevelPageContainer>
  );
};

export default LevelPage;
