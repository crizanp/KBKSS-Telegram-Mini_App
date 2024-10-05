import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

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
  background: linear-gradient(135deg, #0f1a27, #0f1a27);
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
  font-size: 26px;
  color: #ffffff;
`;

// Button to confirm action
const ConfirmButton = styled.button`
  background-color: #36a8e5;
  color: white;
  font-size: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #298dc8;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
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
  width: 117px;
  height: 131px;
  display: block;
  margin: 0 auto 20px;
`;

const AvatarSelectionModal = ({ onGoAhead, onClose, isClosing, actionType, currentAvatarName, newAvatarName, gemsRequired, processing }) => {
  const isSwitchAction = actionType === "switch";

  return (
    <ModalOverlay onClick={onClose}>
      <RewardModalContainer onClick={(e) => e.stopPropagation()} isClosing={isClosing}>
        <CloseButton onClick={onClose}>×</CloseButton>

        {/* Image placed below the header */}
        <StyledImage src="https://i.ibb.co/z2c4kfZ/3d.png" alt="Crown" />

        <ModalHeader>{isSwitchAction ? "Switch Avatar" : "Unlock Avatar"}</ModalHeader>

        {/* Dynamic message based on action type */}
        <p style={{ textAlign: "center", color: "rgb(221 204 204)", fontSize: "16px" }}>
          {isSwitchAction
            ? `Are you sure you want to switch from ${currentAvatarName} to ${newAvatarName}?`
            : `Unlocking this avatar will deduct ${gemsRequired} $GEMS from your total.`}
        </p>

        {/* Confirm button changes label based on the action type */}
        <ConfirmButton onClick={onGoAhead} disabled={processing}>
          {processing ? "Processing..." : isSwitchAction ? "Switch Avatar" : "Go Ahead"}
        </ConfirmButton>
      </RewardModalContainer>
    </ModalOverlay>
  );
};

export default AvatarSelectionModal;
