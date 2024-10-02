import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation for the skeleton
const loading = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

// Skeleton container styles
const SkeletonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 85%;
  background-color: #000;
  padding: 7px 10px;
  border-radius: 20px;
  border: #3baeef 1px solid;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 2.75%;
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  font-family: 'Orbitron', sans-serif;
`;

// Individual skeleton items for text and icons
const SkeletonText = styled.div`
  width: ${({ width }) => width || '100px'};
  height: 14px;
  background: linear-gradient(90deg, #3a3a3a, #6c6c6c, #3a3a3a);
  background-size: 200% 200%;
  animation: ${loading} 1.5s ease infinite;
  border-radius: 4px;
`;

const SkeletonCircle = styled.div`
  width: ${({ size }) => size || '30px'};
  height: ${({ size }) => size || '30px'};
  background: linear-gradient(90deg, #3a3a3a, #6c6c6c, #3a3a3a);
  background-size: 200% 200%;
  animation: ${loading} 1.5s ease infinite;
  border-radius: 50%;
`;

// Skeleton Loader component to represent loading state
const SkeletonLoader = () => {
  return (
    <SkeletonContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SkeletonText width="60px" />
        <SkeletonText width="40px" style={{ marginLeft: '10px' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SkeletonCircle size="20px" style={{ marginRight: '5px' }} />
        <SkeletonText width="40px" />
      </div>
    </SkeletonContainer>
  );
};

export default SkeletonLoader;
