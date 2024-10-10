import React from "react";
import styled from "styled-components";
import { FaTimes, FaRegGem } from "react-icons/fa"; // Include Gem icon

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
  max-width: 564px;
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

// Modal header
const ModalHeader = styled.h2`
  text-align: center;
  font-size: 26px;
  color: #ffffff;
`;

// Points or confirmation message
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

// Gem Icon styled component (optional)
const GemIconModal = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 8px;
  font-size: 1.9rem;
`;

const GameUnlockModal = ({ message, onConfirm, onCancel, loading, iconUrl, title, showGems }) => {
  return (
    <ModalOverlay onClick={onCancel}>
      <RewardModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel}>×</CloseButton>

        {/* Display Modal Header */}
        <ModalHeader>{title}</ModalHeader>

        {/* Display Icon if provided */}
        {iconUrl && <img src={iconUrl} alt="Icon" style={{ display: 'block', margin: '20px auto', width: '117px', height: '131px' }} />}

        {/* Conditionally show the Gem icon and GEMS deduction */}
        {showGems && (
          <PointsDisplayModal>
            <GemIconModal />
            <span>$GEMS</span>
          </PointsDisplayModal>
        )}

        {/* Message Text */}
        <p style={{ textAlign: "center", color: "rgb(221 204 204)", fontSize: "16px", marginBottom: "20px" }}>
          {message}
        </p>

        {/* Confirm Button */}
        <ClaimButton onClick={onConfirm} disabled={loading}>
          {loading ? "Unlocking..." : "Let's Proceed"}
        </ClaimButton>
      </RewardModalContainer>
    </ModalOverlay>
  );
};

export default GameUnlockModal;
