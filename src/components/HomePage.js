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
import styled from "styled-components";
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
  animation: tiltEffect 5s ease-in-out infinite; // Slower and smoother tilting animation

  @keyframes tiltEffect {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(10deg); // Tilts 5 degrees to the right
    }
    50% {
      transform: rotate(-10deg); // Tilts 5 degrees to the left
    }
    75% {
      transform: rotate(7deg); // Tilts back slightly to the right
    }
    100% {
      transform: rotate(0deg); // Returns to original position
    }
  }
`;


function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const { energy, decreaseEnergy } = useEnergy();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [offlinePoints, setOfflinePoints] = useState(0);
  const [isRewardAvailable, setIsRewardAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state
  const [rewardClaimed, setRewardClaimed] = useState(false); // Reward claimed state
  const audioRef = useRef(null); // Ref for playing sound
  const [isClosing, setIsClosing] = useState(false);
  const curvedBorderRef = useRef(null);
  const bottomMenuRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(""); // Holds the active background URL

  // Accumulate unsynced points to avoid sending too many server requests
  const [unsyncedPoints, setUnsyncedPoints] = useState(0);

  // Confetti window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const fetchActiveBackground = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/background/active`);
      console.log("Background response:", response.data); // Add this line to log the response
  
      if (response.data && response.data.url) {
        setBackgroundImage(response.data.url); // Set the active background
      } else {
        console.warn("No background URL found in the response.");
      }
    } catch (error) {
      console.error("Error fetching active background:", error);
    }
  }, []);
  useEffect(() => {
    // Fetch the active background when the component mounts
    fetchActiveBackground();
  }, [fetchActiveBackground]); // Add fetchActiveBackground as a dependency

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

  const checkDailyRewardAvailability = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading state while checking
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-info/${userID}`
      );

      const lastDailyReward = response.data.lastDailyReward || new Date(0);
      const now = new Date();
      const hoursSinceLastClaim = Math.floor(
        (now - new Date(lastDailyReward)) / (1000 * 60 * 60)
      ); // Calculate hours since the last claim

      if (hoursSinceLastClaim >= 24) {
        setIsRewardAvailable(true); // Reward is available, button becomes clickable
      } else {
        setIsRewardAvailable(false); // Reward is not available, button stays disabled
      }
    } finally {
      setIsLoading(false); // End loading state
    }
  }, [userID]);

  const initializeUser = useCallback(async () => {
    if (!userID) {
      const userId = await getUserID(setUserID);
      setUserID(userId);
    }

    const savedPoints = localStorage.getItem(`points_${userID}`);
    if (savedPoints) {
      setPoints(parseFloat(savedPoints));
    }

    checkDailyRewardAvailability();
  }, [userID, setUserID, setPoints, checkDailyRewardAvailability]);
  const handleContextMenu = (e) => {
    e.preventDefault(); // This will prevent the default long-press behavior
  };
  useEffect(() => {
    if (userID) {
      initializeUser();
    }
  }, [userID, initializeUser]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  const calculatePoints = () => {
    return 1;
  };

  const syncPointsWithServer = useCallback(
    debounce(async (totalPointsToAdd) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
          { pointsToAdd: totalPointsToAdd }
        );
        setPoints(response.data.points);
        localStorage.setItem(`points_${userID}`, response.data.points);
        setUnsyncedPoints(0); // Reset unsynced points after successful sync
      } catch (error) {
        console.error("Error syncing points with server:", error);
      }
    }, 2000),
    [userID, setPoints]
  );

  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) {
        return;
      }
  
      if (curvedBorderRef.current && bottomMenuRef.current) {
        const curvedBorderRect = curvedBorderRef.current.getBoundingClientRect();
        const bottomMenuRect = bottomMenuRef.current.getBoundingClientRect();
  
        const isDoubleTap = e.touches && e.touches.length === 2;
        const isValidTap = e.touches.length <= 2; // Allow only up to 2 fingers
  
        if (!isValidTap) {
          return; // Ignore if more than 2 fingers are used
        }
  
        const pointsToAdd = calculatePoints() * (isDoubleTap ? 2 : 1); // Always add a maximum of 2 points
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
  
          const animateFlyingPoints = () => {
            const id = Date.now();
            setFlyingNumbers((prevNumbers) => [
              ...prevNumbers,
              { id, x: clickX, y: clickY - 30, value: pointsToAdd },
            ]);
  
            setTimeout(() => {
              setFlyingNumbers((prevNumbers) =>
                prevNumbers.filter((num) => num.id !== id)
              );
            }, 750);
          };
  
          animateFlyingPoints();
  
          setSlapEmojis((prevEmojis) => [
            ...prevEmojis,
            { id: Date.now(), x: clickX, y: clickY },
          ]);
  
          setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + pointsToAdd);
          setUnsyncedPoints((prevUnsyncedPoints) => prevUnsyncedPoints + pointsToAdd);
  
          decreaseEnergy(isDoubleTap ? 2 : 1);
  
          if (navigator.onLine) {
            syncPointsWithServer(unsyncedPoints + pointsToAdd);
          }
        }
      }
    },
    [syncPointsWithServer, setPoints, unsyncedPoints, offlinePoints, energy, decreaseEnergy, userID]
  );
  

  const claimDailyReward = async () => {
    try {
      setShowModal(false); // Close the modal immediately after the claim button is clicked

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/claim-daily-reward/${userID}`
      );
      const newPoints = response.data.points;

      setPoints(newPoints);
      localStorage.setItem(`points_${userID}`, newPoints); // Update points in local storage
      setIsRewardAvailable(false);
      setShowConfetti(true);
      audioRef.current.play(); // Play celebration sound

      setTimeout(() => {
        setShowConfetti(false); // Hide confetti after 5 seconds
      }, 5000);
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    }
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setShowModal(false); // Hide the modal after the slide-down animation completes
      setIsClosing(false); // Reset the closing state
    }, 500); // Ensure this timeout matches the animation duration (500ms)
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
        {/* Use getMessage directly as a value, not a function */}
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            className="eagle-image"
            onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
          />
        </EagleContainer>
      </MiddleSection>

      <BottomContainer ref={bottomMenuRef} className="bottom-menu">
  {/* Leaderboard section with animated image */}
  <Link to="/leaderboard" style={{ textDecoration: "none" }}>
      <LeaderboardImage src={leaderboardImage} alt="Leaderboard" />
  </Link>

  <EnergyContainer>
    <EnergyIcon energy={energy} />
    <EnergyCounter>{Math.floor(energy)}/1000</EnergyCounter>
  </EnergyContainer>

  {/* Daily Reward Button with Fire Icon */}
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
            isClosing={isClosing} // Pass the closing state as a prop
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

      {/* Confetti */}
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