import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserInfo from './UserInfo';
import GameUnlockModal from "./GameUnlockModal";
import { usePoints } from "../context/PointsContext";

// Import styles from external file
import {
  GamesContainer,
  GameList,
  GameItem,
  LockIcon,
  DimmedIconWrapper,
  IconWrapper,
  GameTitle,
  GameDescription,
  GameIcon,
  GameItemTitle // Import the new title component
} from './GamesPageStyles'; // Import styled components

function GamesPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const { userID, points: userPoints, setPoints } = usePoints();

  useEffect(() => {
    if (!userID) return;

    const localUnlocked = localStorage.getItem(`quizUnlocked_${userID}`);
    if (localUnlocked) {
      setQuizUnlocked(true);
    } else {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
          setQuizUnlocked(response.data.quizUnlocked);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    }
  }, [userID]);

  const handleUnlockQuiz = async () => {
    setUnlocking(true);
    const newPoints = userPoints - 25000;
    setPoints(newPoints);
    localStorage.setItem(`points_${userID}`, newPoints);

    setQuizUnlocked(true); 
    localStorage.setItem(`quizUnlocked_${userID}`, true);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/user-info/unlock-quiz/${userID}`, {
        points: newPoints,
      });
      toast.success('Success! You have unlocked the quiz!', { 
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '10px',
        },
      });
    } catch (error) {
      console.error('Error syncing unlock with server:', error);
      toast.error('Error unlocking quiz. Please try again!', { 
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '10px',
        },
      });

      setPoints(userPoints);
      localStorage.setItem(`points_${userID}`, userPoints);
      setQuizUnlocked(false);
      localStorage.removeItem(`quizUnlocked_${userID}`);
    } finally {
      setUnlocking(false);
      setModalOpen(false);
    }
  };

  const confirmUnlockQuiz = () => {
    if (userPoints >= 25000 && !quizUnlocked) {
      setModalOpen(true);
    } else if (userPoints < 25000) {
      toast.warn('Oops! You do not have sufficient balance to unlock this game.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '10px',
        },
      });
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
        {!quizUnlocked ? (
          <GameItem onClick={confirmUnlockQuiz} locked={userPoints < 25000}>
            <LockIcon />
            <DimmedIconWrapper>
              <GameIcon src="https://i.ibb.co/rMcfScz/3d-1.png" alt="Quiz Icon" />
            </DimmedIconWrapper>
            <GameItemTitle>Quiz</GameItemTitle>
          </GameItem>
        ) : (
          <GameItem as={Link} to="/ecosystem">
            <IconWrapper>
              <GameIcon src="https://i.ibb.co/rMcfScz/3d-1.png" alt="Quiz Icon" />
            </IconWrapper>
            <GameItemTitle>Quiz</GameItemTitle>
          </GameItem>
        )}

        <GameItem as={Link} to="/spin-wheel">
          <IconWrapper>
            <GameIcon src="https://i.ibb.co/W3tQ6hf/3d-2.png" alt="Spin the Wheel Icon" />
          </IconWrapper>
          <GameItemTitle>Spin Wheel</GameItemTitle>
        </GameItem>

        <GameItem onClick={() => toast.warn('Oops! You do not have sufficient balance to unlock this game.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '10px',
          },
        })} locked>
          <LockIcon />
          <DimmedIconWrapper>
            <GameIcon src="https://i.ibb.co/20zNsDw/3d-3.png" alt="Treasure Hunt Icon" />
          </DimmedIconWrapper>
          <GameItemTitle>Treasure Hunt</GameItemTitle>
        </GameItem>

        <GameItem onClick={() => toast.warn('this game is on the way keep calm.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '10px',
          },
        })} locked>
          <LockIcon />
          <DimmedIconWrapper>
            <GameIcon src="https://cdn-icons-png.freepik.com/512/8853/8853822.png" alt="Predict & Win Icon" />
          </DimmedIconWrapper>
          <GameItemTitle>Predict & Win</GameItemTitle>
        </GameItem>

        <GameItem onClick={() => toast.warn('this game is on the way keep calm', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '10px',
          },
        })} locked>
          <LockIcon />
          <DimmedIconWrapper>
            <GameIcon src="https://www.freeiconspng.com/thumbs/eagle-icon-png/eagle-icon-png-9.png" alt="Catch the Eagle Icon" />
          </DimmedIconWrapper>
          <GameItemTitle>Catch the Eagle</GameItemTitle>
        </GameItem>

        <GameItem comingSoon>
          <IconWrapper>
            <GameIcon src="https://i.ibb.co/887LhN5/3d-4.png" alt="Coming Soon Icon" />
          </IconWrapper>
          <GameItemTitle>Coming Soon</GameItemTitle>
        </GameItem>
      </GameList>

      {isModalOpen && (
        <GameUnlockModal
          message={`Are you sure you want to spend 25,000 points to unlock the quiz?`}
          onConfirm={handleUnlockQuiz}
          onCancel={() => setModalOpen(false)}
          loading={unlocking}
          iconUrl="https://i.ibb.co/z2c4kfZ/3d.png"
          title="Unlock Quiz"
          pointsCost={25000}
        />
      )}

      <ToastContainer />
    </GamesContainer>
  );
}

export default GamesPage;
