import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa"; // Close button icon

// Modal Overlay
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

// Modal Container with slide-up animation
const RewardModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
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

// Modal Header
const ModalHeader = styled.h2`
  text-align: center;
  color: #333;
  font-size:34px;
`;

// Claim Button
const ClaimButton = styled.button`
  background-color: #36a8e5;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 23px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #298dc8;
  }
`;

// Close Button
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
`;

// Icon Image in the Modal
const StyledImage = styled.img`
  width: 105px;
  height: 120px;
  display: block;
  margin: 0 auto 20px;
`;

// Modal Component
const GameUnlockModal = ({ message, onConfirm, onCancel, loading, iconUrl, title, pointsCost }) => {
  return (
    <ModalOverlay onClick={onCancel}>
      <RewardModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel}>×</CloseButton>
        <ModalHeader>{title}</ModalHeader>

        {/* Icon Image */}
        <StyledImage src={iconUrl} alt="Modal Icon" />

        <p style={{ textAlign: "center", color: "#333", marginBottom: "20px",fontSize:"large" }}>{message}</p>

        <ClaimButton onClick={onConfirm} disabled={loading}>
          {loading ? "Unlocking..." : `Go Ahead`}
        </ClaimButton>
      </RewardModalContainer>
    </ModalOverlay>
  );
};

export default GameUnlockModal;
