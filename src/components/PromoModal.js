import React from 'react';
import styled from 'styled-components';

// Modal Overlay with a subtle blur effect
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Darker backdrop */
  backdrop-filter: blur(0px); /* Reduced blur effect */
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

// Modal Container with gradient background and slow slide-up animation
const PromoModalContainer = styled.div`
  width: 100%;
  max-width: 460px;
  background: linear-gradient(135deg, #0f1a27, #0f1a27); /* Gradient background */
  padding: 25px;
  border-radius: 20px 20px 0 0;
  position: relative;
  animation: ${(props) => (props.isClosing ? "slideDown" : "slideUp")} 0.8s ease-in-out;

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

// Modal Header with gradient text
const ModalHeader = styled.h2`
  text-align: center;
  font-size: 30px;
  background: linear-gradient(45deg, #ffffff, #f1eaea); /* Gradient text color */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

// Claim Button with gradient background and hover effect
const ClaimButton = styled.button`
  background: #3e9ed1;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
        padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background 0.3s ease, transform 0.2s;

  &:hover {
    background: #00d2ff; /* Change gradient on hover */
    transform: translateY(-3px); /* Slight raise effect on hover */
  }
  
  &:active {
    transform: translateY(0px); /* Reset when clicked */
  }
`;

// Points display with more elegant design
const PointsDisplayModal = styled.div`
  font-size: 1.8rem;
  text-align: center;
  color: #36d1dc;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Close Button with improved styling
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 36px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #ff416c; /* Hover color change */
  }
`;

// Icon Image in the Modal
const StyledImage = styled.img`
  width: 130px;
  height: 130px;
  display: block;
  margin: 0 auto 20px;
  border-radius: 50%; /* Rounded icon */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* Soft shadow for the icon */
`;

// PromoModal Component
const PromoModal = ({ message, onConfirm, onCancel, loading, iconUrl, title, pointsCost, buttonText }) => {
  return (
    <ModalOverlay onClick={onCancel}>
      <PromoModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel}>×</CloseButton>
        {/* Icon Image */}
          <StyledImage src={iconUrl} alt="Modal Icon" />

        <ModalHeader>{title}</ModalHeader>

        
        {/* <PointsDisplayModal>
          <span>{pointsCost ? `Spend ${pointsCost} $GEMS` : ""}</span>
        </PointsDisplayModal> */}
        <p style={{ textAlign: "center", color: "#fff", marginBottom: "20px", fontSize: "16px" }}>
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
