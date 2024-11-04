import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Styled Components for Game Layout
const GameContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  overflow: hidden;
  border: 3px solid #ffe200;
  background: linear-gradient(135deg, #2d2d2d, #1e1e1e);
  display: flex;
`;

const Side = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
`;

const Catcher = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%) rotate(${(props) => props.rotation}deg);
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
`;

const Part = styled.div`
  width: 100%;
  height: 50%;
  position: absolute;
`;

const TopPart = styled(Part)`
  background-color: red;
  top: 0;
  border-radius: 50% 50% 0 0;
`;

const BottomPart = styled(Part)`
  background-color: yellow;
  bottom: 0;
  border-radius: 0 0 50% 50%;
`;

const ballDrop = keyframes`
  from { transform: translateY(-100px); }
  to { transform: translateY(100vh); }
`;

const BallStyled = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  animation: ${ballDrop} ${(props) => props.speed}s linear forwards;
  left: ${(props) => (props.side === 'left' ? '25%' : '75%')};
`;

const ScoreDisplay = styled.div`
  font-size: 18px;
  position: absolute;
  top: 27px;
  left: 10px;
  color: #fff;
`;

const LivesDisplay = styled.div`
  font-size: 18px;
  position: absolute;
  top: 27px;
  right: 10px;
  color: #fff;
`;

const Message = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  color: ${(props) => props.color};
  top: 50px;
  text-align: center;
`;

const Modal = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2a2a2a;
  color: #ffffff;
  border: 2px solid #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
`;

const PlayAgainButton = styled.button`
  background-color: #ff5555;
  border: none;
  padding: 10px 20px;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #ff7777;
  }
`;

const BallCatchGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [balls, setBalls] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [leftRotation, setLeftRotation] = useState(0);
  const [rightRotation, setRightRotation] = useState(0);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('white');
  const [ballSpeed, setBallSpeed] = useState(2);
  const [ballDropRate, setBallDropRate] = useState(2000);

  // Audio References
  const successSoundRef = useRef(null);
  const outSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const rotateSoundRef = useRef(null);

  // Initialize Audio Files with error handling
  useEffect(() => {
    successSoundRef.current = new Audio('/success.mp3');
    outSoundRef.current = new Audio('/out.mp3');
    gameOverSoundRef.current = new Audio('/gameover.mp3');
    rotateSoundRef.current = new Audio('/rotate.wav');

    [successSoundRef, outSoundRef, gameOverSoundRef, rotateSoundRef].forEach((ref) => {
      ref.current.onerror = () => console.error(`Audio file failed to load: ${ref.current.src}`);
    });
  }, []);

  const playSound = (soundRef) => {
    if (soundRef && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch((error) => {
        console.warn(`Failed to play sound: ${error.message}`);
      });
    }
  };

  const rotateCatcher = (side) => {
    playSound(rotateSoundRef);
    if (side === 'left') {
      setLeftRotation((prev) => (prev + 180) % 360);
    } else if (side === 'right') {
      setRightRotation((prev) => (prev + 180) % 360);
    }
  };

  const createBall = () => {
    if (!gameOver) {
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const color = Math.random() < 0.5 ? 'red' : 'yellow';
      const newBall = { id: Date.now(), color, side, top: 0 };
      setBalls((prevBalls) => [...prevBalls, newBall]);
    }
  };

  useEffect(() => {
    if (!gameOver) {
      const dropInterval = setInterval(() => createBall(), ballDropRate);
      return () => clearInterval(dropInterval);
    }
  }, [gameOver, ballDropRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => ({ ...ball, top: ball.top + ballSpeed }))
          .filter((ball) => ball.top < window.innerHeight - 120 || handleCatch(ball))
      );
    }, 20);
    return () => clearInterval(interval);
  }, [balls, score, ballSpeed]);

  const handleCatch = (ball) => {
    if (gameOver) return false;

    const correctCatch =
      (ball.side === 'left' && leftRotation % 360 === 0 && ball.color === 'red') ||
      (ball.side === 'right' && rightRotation % 360 === 0 && ball.color === 'red') ||
      (ball.side === 'left' && leftRotation % 360 !== 0 && ball.color === 'yellow') ||
      (ball.side === 'right' && rightRotation % 360 !== 0 && ball.color === 'yellow');

    if (correctCatch) {
      playSound(successSoundRef);
      setScore((prev) => prev + 1);
      setMessage('Nice Catch!');
      setMessageColor('lightgreen');
      setBallDropRate((prev) => Math.max(prev - 30, 800));
      setBallSpeed((prev) => Math.min(prev + 0.1, 5));
      return true;
    } else {
      playSound(outSoundRef);
      setLives((prev) => prev - 1);
      setMessage('Missed Catch!');
      setMessageColor('red');
      if (lives - 1 <= 0) {
        playSound(gameOverSoundRef);
        setGameOver(true);
      }
      return true;
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setBalls([]);
    setMessage('');
    setBallDropRate(2000);
    setBallSpeed(2);
  };

  return (
    <GameContainer>
      <Side>
        <Catcher rotation={leftRotation} onClick={() => rotateCatcher('left')}>
          <TopPart />
          <BottomPart />
        </Catcher>
      </Side>
      <Side>
        <Catcher rotation={rightRotation} onClick={() => rotateCatcher('right')}>
          <TopPart />
          <BottomPart />
        </Catcher>
      </Side>
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      <LivesDisplay>Lives: {'❤️'.repeat(Math.max(0, lives))}</LivesDisplay>
      <Message color={messageColor}>{message}</Message>

      {balls.map((ball) => (
        <BallStyled key={ball.id} color={ball.color} side={ball.side} speed={ballSpeed} />
      ))}

      <Modal show={gameOver}>
        <h2>Game Over</h2>
        <p>Your final score: {score}</p>
        <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
      </Modal>
    </GameContainer>
  );
};

export default BallCatchGame;
