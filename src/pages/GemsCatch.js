import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaGem } from "react-icons/fa";
import clickSound from './click.mp3'; // Placeholder for button click sound
import matchSound from '../assets/celebration.mp3'; // Placeholder for match sound

// Keyframes for the falling gems
const gemFall = keyframes`
  0% { top: -50px; }
  100% { top: 85%; }
`;

// Keyframes for particle effects when gems match
const particleExplosion = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

// Keyframes for fading in/out game over text
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components for Game Layout and Design
const GameContainer = styled.div`
  width: 400px;
  height: 700px;
  margin: 50px auto;
  background: linear-gradient(135deg, #11151c, #2c3e50);
  border-radius: 20px;
  padding: 20px;
  color: white;
  text-align: center;
  position: relative;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const PointsDisplay = styled.h1`
  color: #e1ad01;
  font-size: 3em;
  margin-bottom: 20px;
`;

const Button = styled.div`
  width: 120px;
  height: 120px;
  background-color: transparent;
  position: absolute;
  bottom: 10%;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.5s ease-in-out;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 3px solid white;
  &:hover {
    transform: scale(1.1);
  }
`;

const TopHalf = styled.div`
  width: 100%;
  height: 50%;
  background-color: ${({ color }) => color};
`;

const BottomHalf = styled(TopHalf)`
  background-color: ${({ color }) => color};
`;

const LeftButton = styled(Button)`
  left: 10%;
  transform: ${({ isFlipped }) => (isFlipped ? "rotate(180deg)" : "rotate(0deg)")};
`;

const RightButton = styled(Button)`
  right: 10%;
  transform: ${({ isFlipped }) => (isFlipped ? "rotate(180deg)" : "rotate(0deg)")};
`;

const GemsContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  top: -50px;
  animation: ${gemFall} ${({ speed }) => speed}ms linear;
  z-index: 0;
  opacity: ${({ isVanished }) => (isVanished ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const Gem = styled(FaGem)`
  font-size: 3em;
  color: ${({ color }) => color};
`;

const ParticleEffect = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  animation: ${particleExplosion} 1s forwards;
  z-index: 2;
`;

const GameOverText = styled.h1`
  color: #e74c3c;
  font-size: 2.5em;
  animation: ${fadeIn} 1s forwards;
`;

const GameOverPoints = styled.h1`
  color: #e1ad01;
  font-size: 3em;
  animation: ${fadeIn} 1s forwards 0.5s;
`;

const Logo = styled.div`
  width: 120px;
  height: 120px;
  margin: 30px auto;
  background: linear-gradient(135deg, #e74c3c, #2980b9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3em;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  box-shadow: 0px 5px 15px rgba(231, 76, 60, 0.5);

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #3498db, #e74c3c);
  }
`;

const MessageBox = styled.div`
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 10px;
  font-size: 1.2em;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.8s ease;
`;

// Main Game Component
const Game = () => {
  const [points, setPoints] = useState(0);
  const [stage, setStage] = useState("home");
  const [gems, setGems] = useState([]);
  const [gameInterval, setGameInterval] = useState(null);
  const [leftButtonActive, setLeftButtonActive] = useState(false);
  const [rightButtonActive, setRightButtonActive] = useState(false);
  const [speed, setSpeed] = useState(4000);
  const [particles, setParticles] = useState([]);
  const [message, setMessage] = useState("Click the gem to start!");
  const [leftButtonColors, setLeftButtonColors] = useState({ top: "#e74c3c", bottom: "#2980b9" });
  const [rightButtonColors, setRightButtonColors] = useState({ top: "#e74c3c", bottom: "#2980b9" });

  const gemColors = ["#e74c3c", "#2980b9"]; // Darker shades of red and blue

  // Play sound
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  // Start the game
  const startGame = () => {
    setPoints(0);
    setGems([]);
    setParticles([]);
    setStage("play");
    setSpeed(4000);
    setMessage("Get ready!");

    const interval = setInterval(() => {
      generateGems();
    }, 2000);
    setGameInterval(interval);
  };

  // Generate new random gems
  const generateGems = () => {
    const leftGemColor = gemColors[Math.floor(Math.random() * gemColors.length)];
    const rightGemColor = gemColors[Math.floor(Math.random() * gemColors.length)];

    setGems((prevGems) => [
      ...prevGems,
      { leftGem: leftGemColor, rightGem: rightGemColor, isVanished: false },
    ]);
  };

  // Handle the end of gem animation
  const handleGemAnimationEnd = (gemObject, index) => {
    const { leftGem, rightGem } = gemObject;

    const leftMatch = leftButtonColors.top === leftGem;
    const rightMatch = rightButtonColors.top === rightGem;

    if (!leftMatch || !rightMatch) {
      playSound(clickSound); // Play sound on match/mismatch
      setMessage("Game Over!");
      setStage("gameover"); // Game over if incorrect
      if (gameInterval) clearInterval(gameInterval); // Stop game loop
    } else {
      playSound(matchSound); // Play sound on successful match
      setPoints((prevPoints) => prevPoints + 10); // Add points for correct match
      setSpeed((prevSpeed) => Math.max(prevSpeed - 200, 1500)); // Speed up falling gems

      // Trigger particle effect
      setParticles((prevParticles) => [
        ...prevParticles,
        { leftGem, rightGem, id: Date.now() },
      ]);

      // Mark gem as vanished to make it disappear
      setGems((prevGems) =>
        prevGems.map((gem, i) =>
          i === index ? { ...gem, isVanished: true } : gem
        )
      );
    }
  };

  // Toggle left button's active state (rotate the circle)
  const handleLeftButtonClick = () => {
    playSound(clickSound);
    setLeftButtonActive((prevState) => !prevState);
    // Swap the colors
    setLeftButtonColors((prevColors) => ({
      top: prevColors.bottom,
      bottom: prevColors.top,
    }));
  };

  // Toggle right button's active state (rotate the circle)
  const handleRightButtonClick = () => {
    playSound(clickSound);
    setRightButtonActive((prevState) => !prevState);
    // Swap the colors
    setRightButtonColors((prevColors) => ({
      top: prevColors.bottom,
      bottom: prevColors.top,
    }));
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameInterval]);

  return (
    <GameContainer>
      {stage === "play" && <PointsDisplay>{points}</PointsDisplay>}

      {stage === "home" && (
        <Logo onClick={startGame}>
          <FaGem />
        </Logo>
      )}

      {stage === "play" && (
        <MessageBox>{message}</MessageBox>
      )}

      {stage === "play" &&
        gems.map((gemObject, index) => (
          <React.Fragment key={index}>
            <GemsContainer
              speed={speed}
              isVanished={gemObject.isVanished}
              style={{ left: "15%" }}
              onAnimationEnd={() => handleGemAnimationEnd(gemObject, index)}
            >
              <Gem color={gemObject.leftGem} />
            </GemsContainer>

            <GemsContainer
              speed={speed}
              isVanished={gemObject.isVanished}
              style={{ left: "75%" }}
              onAnimationEnd={() => handleGemAnimationEnd(gemObject, index)}
            >
              <Gem color={gemObject.rightGem} />
            </GemsContainer>
          </React.Fragment>
        ))}

      {particles.map((particle) => (
        <ParticleEffect
          key={particle.id}
          style={{ left: particle.leftGem ? "15%" : "75%" }}
          color={particle.leftGem || particle.rightGem}
        />
      ))}

      {stage === "gameover" && (
        <div>
          <GameOverText>Game Over!</GameOverText>
          <GameOverPoints>{points}</GameOverPoints>
          <Logo onClick={() => setStage("home")}>
            <FaGem />
          </Logo>
        </div>
      )}

      {stage === "play" && (
        <>
          <LeftButton
            isFlipped={leftButtonActive}
            onClick={handleLeftButtonClick}
          >
            <TopHalf color={leftButtonColors.top} />
            <BottomHalf color={leftButtonColors.bottom} />
          </LeftButton>

          <RightButton
            isFlipped={rightButtonActive}
            onClick={handleRightButtonClick}
          >
            <TopHalf color={rightButtonColors.top} />
            <BottomHalf color={rightButtonColors.bottom} />
          </RightButton>
        </>
      )}
    </GameContainer>
  );
};

export default Game;
