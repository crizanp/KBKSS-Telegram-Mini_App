// components/GameContainer.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Catcher from './Catcher';
import Ball from './Ball';
import Bonus from './Bonus';
import GameOverModal from './GameOverModal';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 100%;
  overflow: hidden;
  border: 3px solid #ffe200;
  background: linear-gradient(135deg, #2d2d2d, #1e1e1e);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  display: flex;
`;

const Score = styled.div`
  font-size: 24px;
  position: absolute;
  top: 27px;
  left: 10px;
`;

const Lives = styled.div`
  font-size: 24px;
  position: absolute;
  top: 27px;
  right: 10px;
`;

function GameContainer() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [balls, setBalls] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (lives <= 0) setGameOver(true);
  }, [lives]);

  const dropBall = () => {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const color = Math.random() < 0.5 ? 'red' : 'yellow';
    setBalls((prev) => [...prev, { id: Date.now(), side, color }]);
  };

  const handleCatch = (caught) => {
    if (caught) setScore((prev) => prev + 1);
    else setLives((prev) => prev - 1);
  };

  return (
    <Container>
      <Catcher side="left" onCatch={handleCatch} />
      <Catcher side="right" onCatch={handleCatch} />
      <Score>Score: {score}</Score>
      <Lives>Lives: {'❤️'.repeat(lives) + '🖤'.repeat(5 - lives)}</Lives>
      {balls.map((ball) => (
        <Ball key={ball.id} color={ball.color} side={ball.side} />
      ))}
      {bonuses.map((bonus) => (
        <Bonus key={bonus.id} type={bonus.type} side={bonus.side} />
      ))}
      {gameOver && <GameOverModal score={score} />}
    </Container>
  );
}

export default GameContainer;
