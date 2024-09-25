import React from 'react';
import styled from 'styled-components';

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

// Modal Container with slow slide-up animation
const PromoModalContainer = styled.div`
  width: 100%;
  max-width: 460px;
  background-color: #000000;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  position: relative;
  animation: ${(props) => (props.isClosing ? "slideDown" : "slideUp")} 1s ease-in-out; /* Slower animation (1.5s) */

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
  font-size: 40px;
  color: #d3cece;
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

// Close Button
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

// Icon Image in the Modal
const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto 20px;
`;

// PromoModal Component
const PromoModal = ({ message, onConfirm, onCancel, loading, iconUrl, title, pointsCost, buttonText }) => {
  return (
    <ModalOverlay onClick={onCancel}>
      <PromoModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel}>×</CloseButton>
        <ModalHeader>{title}</ModalHeader>

        {/* Icon Image */}
        <StyledImage src={iconUrl} alt="Modal Icon" />
        <PointsDisplayModal>
          <span style={{ fontSize: "32px" }}>{pointsCost ? ` ${pointsCost} $GEMS` : ""}</span>
        </PointsDisplayModal>
        <p style={{ textAlign: "center", color: "rgb(202 190 190)", marginBottom: "20px", fontSize: "20px" }}>
          {message}
        </p>

        {/* Dynamic Button Text */}
        <ClaimButton onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : buttonText}
        </ClaimButton>
      </PromoModalContainer>
    </ModalOverlay>
  );
};

export default PromoModal;
