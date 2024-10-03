import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for the skeleton shimmer effect
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Styled container for the skeleton card
const SkeletonCard = styled.div`
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background-color: #1c1c1c;
  width: 80px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

// Skeleton animation style
const SkeletonAvatarImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s infinite;
`;

const SkeletonText = styled.div`
  width: 60px;
  height: 15px;
  margin-top: 10px;
  border-radius: 5px;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s infinite;
`;

// AvatarSkeleton component
const AvatarSkeleton = () => {
  return (
    <SkeletonCard>
      <SkeletonAvatarImage />
      <SkeletonText />
    </SkeletonCard>
  );
};

export default AvatarSkeleton;
