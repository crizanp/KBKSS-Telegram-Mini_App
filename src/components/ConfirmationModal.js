import React from "react";
import styled, { keyframes } from "styled-components";

// Define the slide-up animation
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end; // Align the modal at the bottom of the screen
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 500px;
  text-align: center;
  animation: ${slideUp} 0.4s ease; // Apply the slide-up animation
  box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 25px;
  background-color: ${(props) => (props.cancel ? "#e74c3c" : "#3498db")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.cancel ? "#c0392b" : "#2980b9")};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ModalText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color:black;
`;

function ConfirmationModal({ message, onConfirm, onCancel, loading }) {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>{message}</ModalText>
        <ButtonContainer>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Unlocking..." : "Yes"}
          </Button>
          <Button onClick={onCancel} cancel>
            Cancel
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ConfirmationModal;
