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
import { CgProfile } from "react-icons/cg";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient for query invalidation
import styled, { keyframes } from "styled-components";
import { useUserAvatar } from "../context/UserAvatarContext";
import { useBackground } from "../context/BackgroundContext"; // Import the context

import {
  HomeContainer,
  PointsDisplayContainer,
  PointsDisplay,
  MiddleSection,
  Message,
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
  IconContainer,
} from "../style/HomePageStyles";
import UserInfo from "../components/UserInfo";
import { getUserID } from "../utils/getUserID";

const EagleContainer = styled.div`
  border-radius: 50%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: center;
  -webkit-user-drag: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

function HomePage() {
  const { points, setPoints, pointsPerTap, userID, setUserID } = usePoints();
  const { energy, maxEnergy, decreaseEnergy, isEnergyLoading } = useEnergy(); // Access energy loading state
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis] = useState([]);
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
  const [remainingTime, setRemainingTime] = useState(null); // For showing remaining time
  const {
    activeAvatar,
    fallbackAvatar,
    setActiveAvatar,
    setFallbackAvatar,
    fetchActiveAvatar,
  } = useUserAvatar();
  const queryClient = useQueryClient();
  const [unsyncedPoints, setUnsyncedPoints] = useState(0);
  const { backgroundImage } =
    useBackground(); // Use the context

  // Confetti window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Fetch fallback avatar dynamically
  const fetchFallbackAvatar = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/fallback-avatar`
      );
      if (data && data.length > 0) {
        setFallbackAvatar(data[0].fallbackAvatarUrl); // Set fallback avatar URL
      }
    } catch (error) {
      console.error("Error fetching fallback avatar:", error);
    }
  }, []);

  useEffect(() => {
    if (!activeAvatar && !fallbackAvatar && !isLoading) {
      fetchFallbackAvatar(); // Load fallback avatar if neither is available
    }
  }, [activeAvatar, fallbackAvatar, isLoading, fetchFallbackAvatar]);

  const memoizedEagleImage = useMemo(() => {
    if (!activeAvatar && !fallbackAvatar) return null; // Don't render if neither avatar is available
    return (
      <EagleImage
        src={activeAvatar || fallbackAvatar} // Use active avatar if available, fallback otherwise
        alt="Avatar"
        loading="lazy"
        className="eagle-image"

      />
    );
  }, [activeAvatar, fallbackAvatar]);

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
        setRemainingTime(0); // No timer if reward is available
      } else {
        setIsRewardAvailable(false); // Reward is not available, button stays disabled

        // Calculate remaining time and update the state
        const timeUntilNextClaim =
          24 * 60 * 60 * 1000 - (now - new Date(lastDailyReward));
        setRemainingTime(timeUntilNextClaim); // Set remaining time for the next reward
      }
    } finally {
      setIsLoading(false); // End loading state
    }
  }, [userID]);

  // Update the remaining time every second if reward is not available
  // Update the remaining time every second if reward is not available
  useEffect(() => {
    let interval;
    if (!isRewardAvailable && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1000); // Decrease the remaining time by 1 second
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isRewardAvailable, remainingTime]);

  const formatRemainingTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format as "hours:minutes:seconds"
    if (hours > 1) {
      return `${hours} hr left`; // Show only hours left if more than 1 hour
    }
    return `${hours}h ${minutes}m ${seconds}s left`; // Show full timer for less than 1 hour
  };
  const initializeUser = useCallback(async () => {
    if (!userID) {
      // Get userID asynchronously if not already set
      const fetchedUserID = await getUserID();
      setUserID(fetchedUserID); // Set the userID in state
    }

    // Fetch points from localStorage if available, else initialize it
    const savedPoints = localStorage.getItem(`points_${userID}`);
    if (savedPoints) {
      setPoints(parseFloat(savedPoints)); // Set points from localStorage
    }

    // Check reward availability after userID is set
    if (userID) {
      await checkDailyRewardAvailability(); // Ensure reward logic executes after setting userID
    }
  }, [userID, setUserID, setPoints, checkDailyRewardAvailability]);
  useEffect(() => {
    initializeUser(); // Call once when component mounts
  }, [initializeUser]); // Dependency is the memoized initializeUser function
  const handleContextMenu = (e) => {
    e.preventDefault(); // This will prevent the default long-press behavior
  };
  // Refetch avatar if the user changes it
  useEffect(() => {
    if (userID) {
      fetchActiveAvatar(userID); // Fetch the active avatar after getting the userID
    }
  }, [userID, fetchActiveAvatar]);

  // Invalidate the avatar queries to refetch when avatar is changed
  useEffect(() => {
    const invalidateAvatar = () => {
      queryClient.invalidateQueries(["activeAvatar", userID]); // Refetch active avatar
    };

    window.addEventListener("avatarChanged", invalidateAvatar); // Custom event listener

    return () => {
      window.removeEventListener("avatarChanged", invalidateAvatar);
    };
  }, [userID, queryClient]);
  useEffect(() => {
    if (userID) {
      fetchActiveAvatar(userID); // Fetch the active avatar after getting userID
    }
  }, [userID, fetchActiveAvatar]);

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
      // Close the modal immediately after the claim button is clicked
      setShowModal(false);

      // Make the API call to claim the reward
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/claim-daily-reward/${userID}`
      );

      // Get the new points after claiming the reward
      const newPoints = response.data.points;

      // Update the points in the state and local storage
      setPoints(newPoints);
      localStorage.setItem(`points_${userID}`, newPoints);

      // Mark the reward as claimed and set the timer to reset for 24 hours
      setIsRewardAvailable(false);
      setRemainingTime(24 * 60 * 60 * 1000); // Reset to 24 hours (86400000 milliseconds)

      // Play the celebration sound and show confetti
      setShowConfetti(true);
      audioRef.current.play(); // Play the celebration sound

      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
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
      onTouchStart={(e) => {
        // Check if the target is one of the elements that should not trigger a tap
        if (
          e.target.closest(".leaderboard-container") ||
          e.target.closest(".boost-container")
        ) {
          return; // Don't trigger the handleTap function
        }
        handleTap(e); // Trigger the handleTap function for other areas
      }}
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
        <EagleContainer>{memoizedEagleImage}</EagleContainer>
      </MiddleSection>

      {/* Right-side menu container to handle Boost and Leaderboard */}
      <RightSideMenuContainer>
        {/* Boost with hover, floating and gradient background */}
        {/* Boost with hover, floating and gradient background */}
        <Link
          to="/boosts"
          onClick={(e) => e.stopPropagation()} // Prevent tap propagation
          style={{
            marginBottom: "15px",
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <BoostContainer className="boost-container">
            <BoostIcon />
          </BoostContainer>
          <IconLabel>Boost</IconLabel>
        </Link>

        {/* Leaderboard with hover, floating and gradient background */}
        <Link
          to="/leaderboard"
          onClick={(e) => e.stopPropagation()} // Prevent tap propagation
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <LeaderboardContainer className="leaderboard-container">
            <RightCenterLeaderboardImage
              src={leaderboardImage}
              alt="Leaderboard"
            />
          </LeaderboardContainer>
          <IconLabel>Leaderboard</IconLabel>
        </Link>
        <Link
          to="/avatars"
          onClick={(e) => e.stopPropagation()} // Prevent tap propagation
          style={{
            marginTop: "15px",
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <BoostContainer className="boost-container">
            <CgProfile size={30} color="#fff" />
          </BoostContainer>
          <IconLabel>Use Avatar</IconLabel>
        </Link>
      </RightSideMenuContainer>

      {/* Bottom container with only Energy and Claim */}
      <BottomContainer ref={bottomMenuRef} className="bottom-menu">
        <EnergyContainer>
          {/* Conditionally render based on isEnergyLoading */}
          {isEnergyLoading ? (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <p>Analyzing Energy...</p>
            </div>
          ) : (
            <>
              <EnergyIcon energy={energy} />
              <EnergyCounter>
                {Math.floor(energy)}/{maxEnergy}
              </EnergyCounter>
            </>
          )}
        </EnergyContainer>

        <Link
          to="#"
          onClick={isRewardAvailable ? openModal : null}
          style={{
            textDecoration: "none",
            pointerEvents: isRewardAvailable ? "auto" : "none",
            opacity: isRewardAvailable ? 1 : 0.5, // Dim the button if reward is not available
          }}
        >
          {/* Show the timer if reward is not available and remaining time is greater than 0 */}
          {!isRewardAvailable && remainingTime > 0 && (
            <SmallTimerText>
              {formatRemainingTime(remainingTime)}{" "}
              {/* Call the formatting function */}
            </SmallTimerText>
          )}
          <EnergyContainer>
            <FireIcon $available={isRewardAvailable} />
            Daily Reward
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
