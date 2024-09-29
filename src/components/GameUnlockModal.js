import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { FaRegGem } from "react-icons/fa"; // Gem icon import

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

// Gem Icon styled component
const GemIconModal = styled(FaRegGem)`
  color: #36a8e5;
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.9rem;
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

// Button to confirm an action
const ClaimButton = styled.button`
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
`;

// Display points or confirmation message
const PointsDisplayModal = styled.div`
  font-size: 22px;
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
  width: 117px;
  height: 131px;
  display: block;
  margin: 0 auto 20px;
`;

// GameUnlockModal Component
const GameUnlockModal = ({ message, onConfirm, onCancel, loading, iconUrl, title, pointsCost }) => {
  return (
    <ModalOverlay onClick={onCancel}>
      <RewardModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel}>×</CloseButton>
        
        <StyledImage src={iconUrl} alt="Modal Icon" />

        <ModalHeader>{title}</ModalHeader>

        {/* Updated Points Display with Gem Icon */}
        <PointsDisplayModal>
          <GemIconModal /> {/* This is where the gem icon is added */}
          <span style={{ fontSize: "22px" }}>- {pointsCost} $GEMS</span>
        </PointsDisplayModal>

        <p style={{ textAlign: "center", color: "rgb(221 204 204)", fontSize: "16px", marginBottom: "20px" }}>
          {message}
        </p>

        <ClaimButton onClick={onConfirm} disabled={loading}>
          {loading ? "Unlocking..." : "Go Ahead"}
        </ClaimButton>
      </RewardModalContainer>
    </ModalOverlay>
  );
};

export default GameUnlockModal;
