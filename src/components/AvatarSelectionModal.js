import React from "react";
import styled from "styled-components";
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

// Modal container with slide-up animation
const ModalContainer = styled.div`
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
  margin-bottom: 20px;
`;

// Display points or confirmation message
const ModalMessage = styled.p`
  font-size: 16px;
  text-align: center;
  color: #d3cece;
  margin-bottom: 20px;
`;

// Modal action buttons container
const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

// Button component
const Button = styled.button`
  flex: 1;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isCancel ? "#555" : "#36a8e5")};
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isCancel ? "#444" : "#298dc8")};
  }
`;

// Gem Icon for modal
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 1.5rem;
`;

const AvatarSelectionModal = ({ message, title, onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        {/* Header */}
        <ModalHeader>{title}</ModalHeader>

        {/* Message */}
        <ModalMessage>{message}</ModalMessage>

        {/* Actions */}
        <ModalActions>
          <Button isCancel onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <GemIcon />
            Confirm
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AvatarSelectionModal;
