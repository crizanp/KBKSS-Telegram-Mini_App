import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import { useEnergy } from "../context/EnergyContext";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { FaTasks, FaRegGem, FaFire } from "react-icons/fa";
import Confetti from "react-confetti";
import celebrationSound from "../assets/celebration.mp3";
import styled,{ keyframes }  from "styled-components";
import leaderboardImage from "../assets/leaderboard.png";

import {
  HomeContainer,
  PointsDisplayContainer,
  PointsDisplay,
  MiddleSection,
  Message,
  EagleContainer,
  EagleImage,
  FlyingNumber,
  SlapEmoji,
  EnergyContainer,
  CurvedBorderContainer,
  EnergyCounter,
  EnergyIcon,
  BottomContainer,
} from "./HomePageStyles";
import UserInfo from "./UserInfo";
import { getUserID } from "../utils/getUserID";
import eagleImage from "../assets/eagle.png";

// Styled Gem Icon
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.9rem;
`;

// Styled Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const FireIcon = styled(FaFire)`
  font-size: 1rem;
  margin-right: 0px;
  color: ${(props) =>
    props.$available
      ? "#f39c12"
      : "#a0a0a0"}; // Yellow if available, grey if not
`;

const RewardModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  position: relative;
  animation: ${(props) => (props.isClosing ? "slideDown" : "slideUp")} 0.5s
    ease-in-out;

  @keyframes slideUp {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

const ModalHeader = styled.h2`
  text-align: center;
  color: #333;
`;

const ClaimButton = styled.button`
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
`;

const PointsDisplayModal = styled.div`
  font-size: 1.5rem;
  text-align: center;
  color: #36a8e5;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
`;

const LeaderboardImage = styled.img`
  width: 50px; // Adjust the size as needed
  height: auto;
  animation: tiltEffect 5s ease-in-out infinite;

  @keyframes tiltEffect {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(7deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
// Define a keyframe for the shiny effect
const shineAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

// Styled Shiny Overlay
const ShinyOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 40%);
  animation: ${shineAnimation} 0.5s ease-in-out forwards;
  pointer-events: none; // Prevent interaction with the overlay
`;

function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const { energy, decreaseEnergy } = useEnergy();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [offlinePoints, setOfflinePoints] = useState(0);
  const [isRewardAvailable, setIsRewardAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const audioRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const curvedBorderRef = useRef(null);
  const bottomMenuRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState("");
const [showShinyEffect, setShowShinyEffect] = useState(false);

  const [unsyncedPoints, setUnsyncedPoints] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const fetchActiveBackground = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/background/active`
      );
      if (response.data && response.data.url) {
        setBackgroundImage(response.data.url);
      }
    } catch (error) {
      console.error("Error fetching active background:", error);
    }
  }, []);

  useEffect(() => {
    fetchActiveBackground();
  }, [fetchActiveBackground]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculatePoints = () => {
    return 1;
  };

  const syncPointsWithServer = useCallback(
    async (totalPointsToAdd) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
          { pointsToAdd: totalPointsToAdd }
        );
        setPoints(response.data.points);
        localStorage.removeItem(`points_${userID}`);
        setUnsyncedPoints(0);
      } catch (error) {
        console.error("Error syncing points with server:", error);
        setUnsyncedPoints((prev) => prev + totalPointsToAdd);
      }
    },
    [userID, setPoints]
  );

  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) {
        return;
      }

      if (curvedBorderRef.current && bottomMenuRef.current) {
        const curvedBorderRect =
          curvedBorderRef.current.getBoundingClientRect();
        const bottomMenuRect = bottomMenuRef.current.getBoundingClientRect();

        const isDoubleTap = e.touches && e.touches.length === 2;
        const isValidTap = e.touches.length <= 2;

        if (!isValidTap) {
          return;
        }

        const pointsToAdd = calculatePoints() * (isDoubleTap ? 2 : 1);
        const clickX = e.touches[0].clientX;
        const clickY = e.touches[0].clientY;

        if (clickY > curvedBorderRect.bottom && clickY < bottomMenuRect.top) {
          const eagleElement = document.querySelector(".eagle-image");
          eagleElement.classList.add("shift-up");
          setTimeout(() => {
            eagleElement.classList.remove("shift-up");
          }, 300);

          setPoints((prevPoints) => {
            const newPoints = prevPoints + pointsToAdd;
            localStorage.setItem(`points_${userID}`, newPoints);
            return newPoints;
          });

          setTapCount((prevTapCount) => prevTapCount + 1);

          const id = Date.now();
          setFlyingNumbers((prevNumbers) => [
            ...prevNumbers,
            { id, x: clickX, y: clickY - 30, value: pointsToAdd },
          ]);

          setSlapEmojis((prevEmojis) => [
            ...prevEmojis,
            { id: Date.now(), x: clickX, y: clickY },
          ]);

          setOfflinePoints(
            (prevOfflinePoints) => prevOfflinePoints + pointsToAdd
          );
          setUnsyncedPoints(
            (prevUnsyncedPoints) => prevUnsyncedPoints + pointsToAdd
          );

          decreaseEnergy(isDoubleTap ? 2 : 1);

          if (timeoutId) clearTimeout(timeoutId);

          const newTimeoutId = setTimeout(() => {
            if (unsyncedPoints > 0 && navigator.onLine) {
              syncPointsWithServer(unsyncedPoints);
            }
          }, 3000);

          setTimeoutId(newTimeoutId);
        }
      }
      setShowShinyEffect(true);
    setTimeout(() => {
      setShowShinyEffect(false);
    }, 500); // Duration of the shiny effect
    },
    [
      syncPointsWithServer,
      setPoints,
      unsyncedPoints,
      timeoutId,
      offlinePoints,
      energy,
      decreaseEnergy,
      userID,
    ]
  );

  const claimDailyReward = async () => {
    try {
      setShowModal(false);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/claim-daily-reward/${userID}`
      );
      const newPoints = response.data.points;

      setPoints(newPoints);
      localStorage.setItem(`points_${userID}`, newPoints);
      setIsRewardAvailable(false);
      setShowConfetti(true);
      audioRef.current.play();

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    }
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 500);
  };

  useEffect(() => {
    const syncBeforeUnload = (e) => {
      if (navigator.onLine && unsyncedPoints > 0) {
        syncPointsWithServer(unsyncedPoints);
      }
    };
    window.addEventListener("beforeunload", syncBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", syncBeforeUnload);
    };
  }, [unsyncedPoints, syncPointsWithServer]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  return (
    <HomeContainer
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      onTouchStart={handleTap}
    >
      <UserInfo />
      <CurvedBorderContainer ref={curvedBorderRef} className="curved-border" />
      <PointsDisplayContainer>
        <PointsDisplay>
          <GemIcon />
          {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message>{" "}
        <EagleContainer>
  <EagleImage
    src={eagleImage}
    alt="Eagle"
    className="eagle-image"
    onContextMenu={(e) => e.preventDefault()}
  />
  {showShinyEffect && <ShinyOverlay />} {/* Render the shiny effect */}
</EagleContainer>

      </MiddleSection>

      <BottomContainer ref={bottomMenuRef} className="bottom-menu">
        <Link to="/leaderboard" style={{ textDecoration: "none" }}>
          <LeaderboardImage src={leaderboardImage} alt="Leaderboard" />
        </Link>

        <EnergyContainer>
          <EnergyIcon energy={energy} />
          <EnergyCounter>{Math.floor(energy)}/1000</EnergyCounter>
        </EnergyContainer>

        <Link
          to="#"
          onClick={isRewardAvailable ? openModal : null}
          style={{
            textDecoration: "none",
            pointerEvents: isRewardAvailable ? "auto" : "none",
            opacity: isRewardAvailable ? 1 : 0.5,
          }}
        >
          <EnergyContainer>
            <FireIcon $available={isRewardAvailable} />
            Daily Reward
          </EnergyContainer>
        </Link>
      </BottomContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <RewardModalContainer
            onClick={(e) => e.stopPropagation()}
            isClosing={isClosing}
          >
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ModalHeader>Claim Your Daily Reward!</ModalHeader>

            <PointsDisplayModal>
              <GemIcon /> +10000 GEMS
            </PointsDisplayModal>

            <ClaimButton onClick={claimDailyReward} disabled={rewardClaimed}>
              {rewardClaimed ? "Reward Claimed!" : "Claim Reward"}
            </ClaimButton>
          </RewardModalContainer>
        </ModalOverlay>
      )}

      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <audio ref={audioRef} src={celebrationSound} />

      {flyingNumbers.map((number) => (
        <FlyingNumber key={number.id} x={number.x} y={number.y}>
          +{number.value}
        </FlyingNumber>
      ))}
      {slapEmojis.map((emoji) => (
        <SlapEmoji key={emoji.id} x={emoji.x} y={emoji.y}>
          👋
        </SlapEmoji>
      ))}
    </HomeContainer>
  );
}

export default HomePage;
