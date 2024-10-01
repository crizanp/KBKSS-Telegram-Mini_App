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
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import celebrationSound from "../assets/celebration.mp3";
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
  SlapEmojiImage,
  EnergyContainer,
  CurvedBorderContainer,
  EnergyCounter,
  EnergyIcon,
  BottomContainer,
  SmallTimerText,
  LeaderboardImage,
  CloseButton,
  PointsDisplayModal,
  ClaimButton,
  ModalHeader,
  RewardModalContainer,
  FireIcon,
  ModalOverlay,
  SettingsIcon,
  GemIcon,
  RightCenterLeaderboardImage,
  IconLabel,
  BoostIcon,
  RightSideMenuContainer,
  BoostContainer,
  LeaderboardContainer,
  IconContainer
} from "../style/HomePageStyles";
import UserInfo from "../components/UserInfo";
import { getUserID } from "../utils/getUserID";
import eagleImage from "../assets/eagle.png";

function HomePage() {
  const { points, setPoints, pointsPerTap, userID, setUserID } = usePoints();
  const { energy, maxEnergy, decreaseEnergy } = useEnergy(); // Access maxEnergy dynamically
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
  const [remainingTime, setRemainingTime] = useState(null); // For showing remaining time

  // Accumulate unsynced points to avoid sending too many server requests
  const [unsyncedPoints, setUnsyncedPoints] = useState(0);

  // Confetti window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const fetchActiveBackground = useCallback(async () => {
    try {
      const cachedBackground = localStorage.getItem("activeBackground");

      if (cachedBackground) {
        setBackgroundImage(cachedBackground); // Use cached background if available
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/background/active`
        );
        if (response.data && response.data.url) {
          setBackgroundImage(response.data.url);
          localStorage.setItem("activeBackground", response.data.url); // Cache the background URL
        } else {
          console.warn("No background URL found in the response.");
        }
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
    const handleBeforeUnload = () => {
      localStorage.removeItem("activeBackground"); // Clear the background on page reload/close
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
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

  // ** Timer calculation logic **
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

        // Calculate remaining time and update the state
        const timeUntilNextClaim =
          24 * 60 * 60 * 1000 - (now - new Date(lastDailyReward));
        setRemainingTime(timeUntilNextClaim);
      }
    } finally {
      setIsLoading(false); // End loading state
    }
  }, [userID]);

  // Update the remaining time every second if reward is not available
  useEffect(() => {
    let interval;
    if (!isRewardAvailable && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1000); // Decrease the remaining time by 1 second
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRewardAvailable, remainingTime]);

  const formatRemainingTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 1) {
      return `${hours} hr left`; // Show only hours left if more than 1 hour
    }
    return `${hours}h ${minutes}m ${seconds}s left`; // Show full timer for less than 1 hour
  };

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

  const syncPointsWithServer = useCallback(async () => {
    const pointsToSync = parseInt(
      localStorage.getItem(`unsyncedPoints_${userID}`) || 0
    );

    if (pointsToSync > 0) {
      try {
        // Optimistically clear localStorage before API call
        localStorage.removeItem(`unsyncedPoints_${userID}`);

        // Send points to server
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
          { pointsToAdd: pointsToSync }
        );

        // Update points in state and localStorage with the server's response
        setPoints(response.data.points);
        localStorage.setItem(`points_${userID}`, response.data.points);
        setUnsyncedPoints(0); // Reset unsynced points
      } catch (error) {
        // If the request fails, add the points back to localStorage
        const existingUnsyncedPoints = parseInt(
          localStorage.getItem(`unsyncedPoints_${userID}`) || 0
        );
        localStorage.setItem(
          `unsyncedPoints_${userID}`,
          existingUnsyncedPoints + pointsToSync
        );
        console.error("Error syncing points with server:", error);
      }
    }
  }, [userID, setPoints]);
  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) return; // Prevent tapping if there's no energy

      // Trigger the bounce animation on the eagle image
      const eagleElement = document.querySelector(".eagle-image");
      if (eagleElement) {
        eagleElement.classList.add("tapped");

        // Remove the class after animation completes to allow re-triggering
        setTimeout(() => {
          eagleElement.classList.remove("tapped");
        }, 300); // Match the duration of the animation (0.3s)
      }

      // Get the touch or click event data (support both mobile and desktop)
      const touches = e.touches
        ? Array.from(e.touches)
        : [{ clientX: e.clientX, clientY: e.clientY }];

      // Limit to a maximum of 4 simultaneous finger taps
      const validTouches = touches.length <= 4 ? touches : touches.slice(0, 4);

      validTouches.forEach((touch, index) => {
        const tapX = touch.clientX; // X coordinate of tap
        const tapY = touch.clientY; // Y coordinate of tap

        // Get the boundaries of the interactive area to ensure valid taps
        const topBoundaryElement = curvedBorderRef.current;
        const bottomBoundaryElement = bottomMenuRef.current;

        if (topBoundaryElement && bottomBoundaryElement) {
          const topBoundary = topBoundaryElement.getBoundingClientRect().bottom;
          const bottomBoundary =
            bottomBoundaryElement.getBoundingClientRect().top;

          // Ensure tap is within the interactive area (between top and bottom sections)
          if (tapY < topBoundary || tapY > bottomBoundary) {
            return;
          }

          // Points to add per tap (assuming 1 point per tap for simplicity)
          const pointsToAdd = pointsPerTap || 1; // Use the dynamic points per tap

          // Update points optimistically (before syncing with server)
          setPoints((prevPoints) => {
            const newPoints = prevPoints + pointsToAdd;
            localStorage.setItem(`points_${userID}`, newPoints); // Save updated points locally
            return newPoints; // Update state with new points
          });

          // Increase tap count (for UI feedback messages)
          setTapCount((prevTapCount) => prevTapCount + 1);

          // Add flying number animation for tap feedback
          const animateFlyingPoints = () => {
            const id = Date.now() + index; // Unique ID for flying number (per finger tap)
            setFlyingNumbers((prevNumbers) => [
              ...prevNumbers,
              {
                id,
                x: tapX + index * 10,
                y: tapY - 30 + index * 10,
                value: pointsToAdd,
              }, // Offset each flying number slightly
            ]);

            // Remove flying number after animation completes
            setTimeout(() => {
              setFlyingNumbers((prevNumbers) =>
                prevNumbers.filter((num) => num.id !== id)
              );
            }, 750); // Animation duration: 750ms
          };

          animateFlyingPoints(); // Trigger flying number animation

          // Offline points accumulation for syncing later
          setOfflinePoints(
            (prevOfflinePoints) => prevOfflinePoints + pointsToAdd
          );
          setUnsyncedPoints(
            (prevUnsyncedPoints) => prevUnsyncedPoints + pointsToAdd
          );

          // Deduct energy for each tap (1 energy per tap)
          decreaseEnergy(1);

          // Save unsynced points to localStorage
          const currentUnsyncedPoints = parseInt(
            localStorage.getItem(`unsyncedPoints_${userID}`) || 0
          );
          localStorage.setItem(
            `unsyncedPoints_${userID}`,
            currentUnsyncedPoints + pointsToAdd
          );

          // Trigger the sync after a timeout (if no other taps happen within the interval)
          clearTimeout(window.syncTimeout);
          window.syncTimeout = setTimeout(() => {
            if (navigator.onLine) {
              syncPointsWithServer(); // Sync points if online
            }
          }, 5000); // Sync after 5 seconds of inactivity
        }
      });

      // Haptic feedback when the user taps
      if (window.Telegram && window.Telegram.WebApp) {
        try {
          // Trigger light haptic feedback on tap
          window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
        } catch (error) {
          console.error("Haptic feedback not supported:", error);
        }
      }
    },
    [
      energy,
      pointsPerTap,
      setPoints,
      setTapCount,
      setFlyingNumbers,
      setOfflinePoints,
      setUnsyncedPoints,
      decreaseEnergy,
      syncPointsWithServer,
      userID,
    ]
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
      setIsRewardAvailable(false); // Reward just claimed, so it's no longer available

      // Reset the remaining time to 24 hours (86400000 milliseconds)
      setRemainingTime(24 * 60 * 60 * 1000);

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
        {/* <Message>{getMessage}</Message>{" "} */}
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            className="eagle-image"
            onContextMenu={(e) => e.preventDefault()}
          />
        </EagleContainer>
      </MiddleSection>

      {/* Right-side menu container to handle Boost and Leaderboard */}
<RightSideMenuContainer>
  {/* Boost with hover, floating and gradient background */}
  <Link to="/boosts" style={{ marginBottom: "15px", textDecoration: "none", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <BoostContainer>
      <BoostIcon />
    </BoostContainer>
    <IconLabel>Boost</IconLabel>
  </Link>

  {/* Leaderboard with hover, floating and gradient background */}
  <Link to="/leaderboard" style={{ textDecoration: "none", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <LeaderboardContainer>
      <RightCenterLeaderboardImage
        src={leaderboardImage}
        alt="Leaderboard"
      />
    </LeaderboardContainer>
    <IconLabel>Leaderboard</IconLabel>
  </Link>
</RightSideMenuContainer>


      {/* Bottom container with only Energy and Claim */}
      <BottomContainer ref={bottomMenuRef} className="bottom-menu">
        <EnergyContainer>
          <EnergyIcon energy={energy} />
          <EnergyCounter>
            {Math.floor(energy)}/{maxEnergy}
          </EnergyCounter>
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
          {!isRewardAvailable && remainingTime > 0 && (
            <SmallTimerText>
              {formatRemainingTime(remainingTime)}
            </SmallTimerText>
          )}
          <EnergyContainer>
            <FireIcon $available={isRewardAvailable} />
            Claim
          </EnergyContainer>
        </Link>
      </BottomContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <RewardModalContainer
            onClick={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
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
        <SlapEmojiImage
          key={emoji.id}
          x={emoji.x}
          y={emoji.y}
          src="https://clipart.info/images/ccovers/1516938336sparkle-png-transparent.png"
          alt="Slap"
        />
      ))}
    </HomeContainer>
  );
}

export default HomePage;