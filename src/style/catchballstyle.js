// src/components/ballcatchstyle.js
import styled, { keyframes, css } from 'styled-components';

// Catcher rotation animation
const rotateCatcher = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
`;

export const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;
  color: white;
  position: relative;
`;

export const Score = styled.div`
  font-size: 1.5rem;
  color: #00ff00;
  position: absolute;
  top: 10px;
  left: 10px;
`;

export const Lives = styled.div`
  font-size: 1.5rem;
  color: #ff3333;
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const CatcherContainer = styled.div`
  position: absolute;
  bottom: 10%;
  display: flex;
  justify-content: space-between;
  width: 80%;
  padding: 0 10%;
`;

export const Catcher = styled.div`
  width: 70px;
  height: 35px;
  background: linear-gradient(to bottom, red 50%, yellow 50%);
  border-radius: 20px;
  transition: transform 0.3s;
  animation: ${props => props.rotate ? css`${rotateCatcher} 0.3s linear` : 'none'};
  transform: rotate(${props => (props.rotate ? '180deg' : '0deg')});
  cursor: pointer;
`;

export const Ball = styled.div`
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  width: 20px;  /* Smaller ball size */
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  animation: fall ${props => props.speed}s linear infinite;
`;


export const GameOverScreen = styled.div`
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  font-size: 1.5rem;
  padding: 30px;
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
`;

export const Button = styled.button`
  margin-top: 20px;
  padding: 10px 25px;
  font-size: 1.2rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #ff2222;
  }
`;
