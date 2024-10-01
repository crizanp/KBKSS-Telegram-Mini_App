import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePoints } from "../context/PointsContext";
import UserInfo from "../components/UserInfo";
import axios from "axios";
import dollarImage from "../assets/dollar-homepage.png"; // Import the dollar image
import { FaLock } from 'react-icons/fa';

const SpinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #000000;
  color: white;
  min-height: 87vh;
  text-align: center;
  background-image: url("https://i.ibb.co/8cFCmFk/bg-1.png");
  background-size: cover;
  background-position: center;
`;

const WheelContainer = styled.div`
  margin: 20px 0;
  width: 300px;
  height: 300px;
  position: relative;
  overflow: hidden;
`;

const Wheel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  transition: transform 4s ease-out;
  transform: ${({ rotate }) => `rotate(${rotate}deg)`};
  z-index: 2; 
`;

const InnerWheel = styled.img`
  position: absolute;
    width: 155%;
    height: 103%;
    top: -6px;
    left: -87px;
    pointer-events: none;
    z-index: 1;
`;

const SpinButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb74d;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 70px;
`;

const PointsDisplay = styled.div`
  font-size: 50px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

const PrizeText = styled.div`
  font-size: 24px;
  margin-top: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const ActionButton = styled.a`
  display: inline-block;
  background-color: #1da1f2;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.3s;
  margin-top: 10px;
  text-align: center;

  &:hover {
    background-color: #1a91da;
  }
`;

const Message = styled.div`
  font-size: 18px;
  color: #ffffff;
  margin-top: 20px;
  text-align: center;
`;

const TimerText = styled.div`
  font-size: 18px;
  color: #ffb74d;
  margin-top: 10px;
  font-weight: bold;
`;

function SpinWheelPage() {
  const { points, setPoints, userID } = usePoints();
  const [rotateDegrees, setRotateDegrees] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [spinLocked, setSpinLocked] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [extraSpinUsed, setExtraSpinUsed] = useState(false);
  const [actionType, setActionType] = useState("twitter"); // twitter, telegram, none
  const [timeLeft, setTimeLeft] = useState(0); // State to hold the countdown timer

  const segments = [150, 10, 30, 40, 50, 60, 70, 80, 90, 120, 100, 20];
  const segmentDegrees = 360 / segments.length; // Calculate degrees per segment

  const SPIN_COOLDOWN_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
  const TWITTER_FOLLOW_COOLDOWN_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const TELEGRAM_SUBSCRIBE_COOLDOWN_TIME = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    const lastSpinTime = localStorage.getItem("lastSpinTime");
    if (lastSpinTime) {
      const timePassed = Date.now() - parseInt(lastSpinTime, 10);
      if (timePassed < SPIN_COOLDOWN_TIME) {
        setSpinLocked(true);
        setTimeLeft(SPIN_COOLDOWN_TIME - timePassed);
      } else {
        localStorage.removeItem("lastSpinTime");
      }
    }

    const lastTwitterFollowTime = localStorage.getItem("clickedTwitter");
    const lastTelegramSubscribeTime = localStorage.getItem("clickedTelegram");

    if (lastTelegramSubscribeTime) {
      const timePassed = Date.now() - parseInt(lastTelegramSubscribeTime, 10);
      if (timePassed < TELEGRAM_SUBSCRIBE_COOLDOWN_TIME) {
        setActionType("none");
      } else {
        localStorage.removeItem("clickedTelegram");
      }
    } else if (lastTwitterFollowTime) {
      const timePassed = Date.now() - parseInt(lastTwitterFollowTime, 10);
      if (timePassed < TWITTER_FOLLOW_COOLDOWN_TIME) {
        setActionType("telegram");
      } else {
        localStorage.removeItem("clickedTwitter");
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000);
      }, 1000);
      return () => clearInterval(timer);
    } else if (spinLocked) {
      setSpinLocked(false);
      setTimeLeft(0);
    }
  }, [timeLeft, spinLocked]);
  const spinWheel = () => {
    if (spinning || spinLocked) return;

    const randomSpin = Math.floor(Math.random() * segments.length);
    const newRotation = rotateDegrees + 360 * 4 + randomSpin * segmentDegrees;

    setRotateDegrees(newRotation);
    setSpinning(true);

    setTimeout(() => {
        const actualRotation = newRotation % 360; // Normalize to a 360-degree rotation
        let prizeIndex = Math.floor((actualRotation + segmentDegrees / 2) / segmentDegrees) % segments.length;

        // Adjust if needed (we observe the exact behavior)
        const prizePoints = segments[prizeIndex];

        setPrize(prizePoints);

        // Update points in the backend
        updatePoints(prizePoints);

        setSpinning(false);

        // Save the current time as the last spin time
        if (!extraSpinUsed) {
            localStorage.setItem("lastSpinTime", Date.now().toString());
            setSpinLocked(true);
            setTimeLeft(SPIN_COOLDOWN_TIME);
        }
        setExtraSpinUsed(true);
    }, 4000); // 4 seconds spin time
};




  const updatePoints = async (pointsToAdd) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
        { pointsToAdd }
      );

      setPoints(response.data.points); // Update points in the frontend
    } catch (error) {
      console.error("Error updating points:", error);
      alert("Failed to update points. Please try again.");
    }
  };

  const handleFollowTwitter = () => {
    setLoadingAction(true);
    setTimeout(() => {
      setLoadingAction(false);
      setSpinLocked(false);
      setExtraSpinUsed(false); // Allow one more spin
      setActionType("telegram"); // Move to next action
      localStorage.setItem("clickedTwitter", Date.now().toString());
    }, 10000); // Simulate 10 seconds loading
  };

  const handleSubscribeTelegram = () => {
    setLoadingAction(true);
    setTimeout(() => {
      setLoadingAction(false);
      setSpinLocked(false);
      setExtraSpinUsed(false); // Allow one more spin
      setActionType("none"); // No more actions
      localStorage.setItem("clickedTelegram", Date.now().toString());
    }, 10000); // Simulate 10 seconds loading
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SpinContainer>
      <UserInfo />
      <PointsDisplayContainer>
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" /> {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>
      <h2>Spin the Wheel and Earn!</h2>
      <WheelContainer>
        <Wheel rotate={rotateDegrees}>
          <img src="https://i.postimg.cc/T11czMNZ/10-3.png" alt="Spin Wheel" />
        </Wheel>
        <InnerWheel
          src="https://i.postimg.cc/zvSCg2gd/10-2.png"
          alt="Inner Wheel"
        />
      </WheelContainer>
      {/* <SpinButton onClick={spinWheel} disabled={spinning || spinLocked}> */}
      <SpinButton onClick={spinWheel} disabled>
    {spinning ? (
      "Spinning..."
    ) : spinLocked ? (
      `Unlock more spins after ${formatTime(timeLeft)}`
    ) : (
      <>
        <FaLock  /> Locked 
      </>
    )}
  </SpinButton>
      {prize && <PrizeText>You won {prize} points!</PrizeText>}
      {spinLocked && !spinning && actionType !== "none" && (
        <>
          <Message>
            {actionType === "twitter"
              ? "Unlock more spins by following us on Twitter!"
              : "Unlock more spins by subscribing to our Telegram channel!"}
          </Message>
          {actionType === "twitter" && (
            <ActionButton
              href="https://x.com/icogemhunters"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleFollowTwitter}
              disabled={loadingAction || extraSpinUsed}
            >
              {loadingAction ? "Following..." : "Follow on Twitter"}
            </ActionButton>
          )}
          {actionType === "telegram" && (
            <ActionButton
              href="https://t.me/icogemhunters"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSubscribeTelegram}
              disabled={loadingAction || extraSpinUsed}
              style={{ backgroundColor: "#0088cc" }} // Change color for Telegram
            >
              {loadingAction ? "Subscribing..." : "Subscribe to Telegram"}
            </ActionButton>
          )}
        </>
      )}
    </SpinContainer>
  );
}

export default SpinWheelPage;
