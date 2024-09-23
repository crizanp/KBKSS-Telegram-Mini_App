import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import UserInfo from './UserInfo';
import ConfirmationModal from "./ConfirmationModal";  // Your confirmation modal component
import { usePoints } from "../context/PointsContext"; // Import usePoints from your context

// Animations
const fadeIn = keyframes`
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
const GamesContainer = styled.div`
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

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-top: 30px;
  animation: ${fadeIn} 1s ease;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

const GameItem = styled(Link)`
  background-color: rgba(31, 31, 31, 0.85);
  padding: 30px 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 22px;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);
  position: relative;

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
    pointer-events: none;
    &:hover {
      transform: none;
      background-color: rgba(31, 31, 31, 0.85);
      box-shadow: none;
    }
  `}
`;

// Lock icon styling on the left with silver color
const LockIcon = styled(FaLock)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  color: #c0c0c0;
`;

const DimmedIconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const IconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 10px;
  color: #00bfff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const GameTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #cad2d5;
`;

const GameDescription = styled.p`
  font-size: 16px;
  color: #cfcfcf;
  max-width: 600px;
`;

const GameIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

// Define ComingSoonText here
const ComingSoonText = styled.small`
  font-style: italic;
  color: grey;
`;

function GamesPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false); // Check if quiz is unlocked

  // Retrieve userID and points from the context
  const { userID, points: userPoints, setPoints } = usePoints(); // Get userID from PointsContext

  // Function to handle unlock quiz
  const handleUnlockQuiz = async () => {
    setUnlocking(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-info/unlock-quiz/${userID}`);
      setPoints(response.data.points); // Update points after unlocking
      setQuizUnlocked(true);
      setModalOpen(false); // Close modal after success
    } catch (error) {
      console.error('Error unlocking quiz:', error);
    } finally {
      setUnlocking(false);
    }
  };

  // Show modal to confirm unlock
  const confirmUnlockQuiz = () => {
    if (userPoints >= 25000 && !quizUnlocked) {
      setModalOpen(true);
    }
  };

  return (
    <GamesContainer>
      <UserInfo />
      <GameTitle>Choose Your Game</GameTitle>
      <GameDescription>
        Play and earn points by completing exciting challenges!
      </GameDescription>
      <GameList>
        {/* Quiz Game - Lock/Unlock logic */}
        {!quizUnlocked ? (
          <GameItem onClick={confirmUnlockQuiz} locked={userPoints < 25000}>
            <LockIcon />
            <DimmedIconWrapper>
              <GameIcon src="https://i.ibb.co/rMcfScz/3d-1.png" alt="Quiz Icon" />
            </DimmedIconWrapper>
            <div>Quiz</div>
            <small>Unlock by spending 25,000 points!</small>
          </GameItem>
        ) : (
          <GameItem to="/quiz">
            <IconWrapper>
              <GameIcon src="https://i.ibb.co/rMcfScz/3d-1.png" alt="Quiz Icon" />
            </IconWrapper>
            <div>Quiz</div>
            <small>Test your knowledge!</small>
          </GameItem>
        )}
         {/* Spin the Wheel */}
         <GameItem to="/spin-wheel">
          <IconWrapper>
            <GameIcon src="https://i.ibb.co/W3tQ6hf/3d-2.png" alt="Spin the Wheel Icon" />
          </IconWrapper>
          <div>Spin the Wheel</div>
          <small>Spin and win points!</small>
        </GameItem>

        {/* Treasure Hunt - Locked */}
        <GameItem locked>
          <LockIcon /> {/* Displaying the lock icon at the left */}
          <DimmedIconWrapper>
            <GameIcon src="https://i.ibb.co/20zNsDw/3d-3.png" alt="Treasure Hunt Icon" />
          </DimmedIconWrapper>
          <div>Treasure Hunt</div>
          <small>Uncover hidden treasures and win big reward!</small>
        </GameItem>

        {/* Coming Soon Game */}
        <GameItem comingSoon>
          <IconWrapper>
            <GameIcon src="https://i.ibb.co/887LhN5/3d-4.png" alt="Coming Soon Icon" />
          </IconWrapper>
          <div>Coming Soon</div>
          <ComingSoonText>More games on the way!</ComingSoonText>
        </GameItem>
      </GameList>

      {/* Confirmation Modal */}
      {isModalOpen && (
  <ConfirmationModal
    message={`Are you sure you want to spend 25,000 points to unlock the quiz?`}
    onConfirm={handleUnlockQuiz}
    onCancel={() => setModalOpen(false)}
    loading={unlocking}
  />
)}
    </GamesContainer>
  );
}

export default GamesPage;
