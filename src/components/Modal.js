import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa"; // Close button icon

// Overlay for the modal background
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

// Modal container with slide-up animation
const RewardModalContainer = styled.div`
  width: 100%;
  max-width: 460px;
  background-color: #000000;
    border: 2px solid #e1e3d6;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  position: relative;
  animation: ${(props) => (props.isClosing ? "slideDown" : "slideUp")} 0.5s ease-in-out;

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

// Header for the modal
const ModalHeader = styled.h2`
  text-align: center;
  font-size: 34px;
    color: #d3cece;
`;

// Button to claim or confirm an action
const ClaimButton = styled.button`
  background-color: #36a8e5;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 20px;
  font-size: 22px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #298dc8;
  }
`;

// Display points or confirmation message
const PointsDisplayModal = styled.div`
  font-size: 1.5rem;
  text-align: center;
  color: #36a8e5;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Close button
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 40px;
    color: #d3cece;
  background: none;
  border: none;
  cursor: pointer;
`;

// Styled image component
const StyledImage = styled.img`
 width: 135px;
 height: 150px;
  display: block;
  margin: 0 auto 20px;
`;

const Modal = ({ onGoAhead, onClose, isClosing }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <RewardModalContainer onClick={(e) => e.stopPropagation()} isClosing={isClosing}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>View Correct Answer</ModalHeader>

        {/* Image placed below the header */}
        <StyledImage src="https://i.ibb.co/z2c4kfZ/3d.png" alt="Crown" />

        <PointsDisplayModal>
          <span style={{ fontSize:"32px" }}>50 $GEMS</span>
        </PointsDisplayModal>

        <p style={{ textAlign: "center", color: "rgb(221 204 204)",fontSize:"20px" }}>
          Viewing the correct answer will deduct 50 $GEMS from your total.
        </p>

        <ClaimButton onClick={onGoAhead}>Go Ahead</ClaimButton>
      </RewardModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
