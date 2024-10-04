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

// Skeleton wrapper for the entire avatar section
const SkeletonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: #1c1c1c;
`;

// Skeleton for the left-side avatar list
const LeftSkeleton = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Skeleton for each small avatar box (on the left)
const SmallSkeletonAvatar = styled.div`
  width: 80px;
  height: 120px;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  border-radius: 10px;
  animation: ${shimmer} 1.2s infinite;
`;

// Skeleton for the right-side large avatar
const RightSkeleton = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

// Skeleton for the large avatar image on the right
const LargeSkeletonAvatar = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  border-radius: 10px;
  animation: ${shimmer} 1.2s infinite;
`;

// Skeleton for the title under the large avatar
const SkeletonText = styled.div`
  width: 60%;
  height: 20px;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: ${shimmer} 1.2s infinite;
`;

// Skeleton grid for the more avatars section (below the main avatars)
const BottomSkeletonGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Skeleton for each small avatar box in the more avatars section
const BottomSkeletonAvatar = styled.div`
  width: 100px;
  height: 120px;
  background: linear-gradient(90deg, #1f1f1f 25%, #2b2b2b 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  border-radius: 10px;
  animation: ${shimmer} 1.2s infinite;
`;

const AvatarSkeleton = () => {
  return (
    <>
      <SkeletonWrapper>
        {/* Left side avatar list skeleton */}
        <LeftSkeleton>
          {[...Array(3)].map((_, index) => (
            <SmallSkeletonAvatar key={index} />
          ))}
        </LeftSkeleton>

        {/* Right side large avatar skeleton */}
        <RightSkeleton>
          <LargeSkeletonAvatar />
          <SkeletonText />
        </RightSkeleton>
      </SkeletonWrapper>

      {/* Bottom more avatars section skeleton */}
      <BottomSkeletonGrid>
        {[...Array(9)].map((_, index) => (
          <BottomSkeletonAvatar key={index} />
        ))}
      </BottomSkeletonGrid>
    </>
  );
};


export default AvatarSkeleton;
