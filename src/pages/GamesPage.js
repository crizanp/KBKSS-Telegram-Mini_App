import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserInfo from "../components/UserInfo";
import GameUnlockModal from "../components/GameUnlockModal";
import { usePoints } from "../context/PointsContext";
import { showToast } from "../components/ToastNotification"; // Import showToast function
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

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
  GameItemTitle,
} from "../style/GamesPageStyles";

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
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user-info/${userID}`
          );
          setQuizUnlocked(response.data.quizUnlocked);
        } catch (error) {
          showToast("Error fetching user info.", "error");
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
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/unlock-quiz/${userID}`,
        {
          points: newPoints,
        }
      );
      showToast("Success! You have unlocked the quiz!", "success");
    } catch (error) {
      showToast("Error unlocking quiz. Please try again!", "error");
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
      showToast(
        "Oops! You do not have sufficient balance to unlock this game.",
        "warn"
      );
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
              <GameIcon
                src="https://i.ibb.co/rMcfScz/3d-1.png"
                alt="Quiz Icon"
              />
            </DimmedIconWrapper>
            <GameItemTitle>Quiz</GameItemTitle>
          </GameItem>
        ) : (
          <GameItem as={Link} to="/ecosystem">
            <IconWrapper>
              <GameIcon
                src="https://i.ibb.co/rMcfScz/3d-1.png"
                alt="Quiz Icon"
              />
            </IconWrapper>
            <GameItemTitle>Quiz</GameItemTitle>
          </GameItem>
        )}

        <GameItem as={Link} to="/spin-wheel">
          <IconWrapper>
            <GameIcon
              src="https://i.ibb.co/W3tQ6hf/3d-2.png"
              alt="Spin the Wheel Icon"
            />
          </IconWrapper>
          <GameItemTitle>Spin Wheel</GameItemTitle>
        </GameItem>

        <GameItem
          onClick={() =>
            showToast(
              "Oops! You do not have sufficient balance to unlock this game.",
              "warn"
            )
          }
          locked
        >
          <LockIcon />
          <DimmedIconWrapper>
            <GameIcon
              src="https://i.ibb.co/20zNsDw/3d-3.png"
              alt="Treasure Hunt Icon"
            />
          </DimmedIconWrapper>
          <GameItemTitle>Treasure Hunt</GameItemTitle>
        </GameItem>

        <GameItem
          onClick={() =>
            showToast("This game is on the way, stay tuned.", "warn")
          }
          locked
        >
          <LockIcon />
          <DimmedIconWrapper>
            <GameIcon
              src="https://cdn-icons-png.freepik.com/512/8853/8853822.png"
              alt="Predict & Win Icon"
            />
          </DimmedIconWrapper>
          <GameItemTitle>Predict & Win</GameItemTitle>
        </GameItem>

        {/* <GameItem as={Link} to="/catch-eagle">
          <IconWrapper>
            <GameIcon
              src="https://www.freeiconspng.com/thumbs/eagle-icon-png/eagle-icon-png-9.png"
              alt="Catch the Eagle Icon"
            />
          </IconWrapper>
          <GameItemTitle>Catch the Eagle</GameItemTitle>
        </GameItem>  */}
        <GameItem comingSoon>
          <IconWrapper>
            <GameIcon
              src="https://www.freeiconspng.com/thumbs/eagle-icon-png/eagle-icon-png-9.png"
              alt="Catch the Eagle Icon"
            />
          </IconWrapper>
          <GameItemTitle>Catch the Eagle</GameItemTitle>
        </GameItem>

        <GameItem comingSoon>
          <IconWrapper>
            <GameIcon
              src="https://i.ibb.co/887LhN5/3d-4.png"
              alt="Coming Soon Icon"
            />
          </IconWrapper>
          <GameItemTitle>Coming Soon</GameItemTitle>
        </GameItem>
      </GameList>

      {isModalOpen && (
        <GameUnlockModal
          message={`Are you sure you want to spend 25,000 $GEMS to unlock the quiz?`}
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
