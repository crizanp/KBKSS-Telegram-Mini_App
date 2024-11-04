// components/GameOverModal.js
import React from 'react';
import styled from 'styled-components';

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
`;

const ModalButton = styled.button`
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

function GameOverModal({ score, onReset }) {
  return (
    <Modal>
      <h2>Game Over</h2>
      <p>Your final score: {score}</p>
      <ModalButton onClick={onReset}>Play Again</ModalButton>
    </Modal>
  );
}

export default GameOverModal;
