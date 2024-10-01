import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SkeletonCard = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const SkeletonNameLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SkeletonLogo = styled.div`
  width: 50px;
  height: 60px;
  background-color: #2a2a2a;
  border-radius: 50%;
  flex: 0 0 18%;
`;

const SkeletonText = styled.div`
  width: ${({ width }) => width || '100%'};
  height: 20px;
  background-color: #2a2a2a;
  border-radius: 5px;
  margin-left: 10px;
  flex: ${({ flex }) => flex || '1'};
`;

const SkeletonDesc = styled.div`
  height: 14px;
  background-color: #2a2a2a;
  border-radius: 5px;
  margin-top: 10px;
`;

const SkeletonShimmer = styled.div`
  height: 14px;
  background: linear-gradient(90deg, #2a2a2a 25%, #3c3c3c 50%, #2a2a2a 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 5px;
`;

const AirdropSkeletonLoadingPage = () => {
  return (
    <SkeletonWrapper>
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonNameLogoContainer>
            <SkeletonLogo />
            <SkeletonText width="60%" />
          </SkeletonNameLogoContainer>
          <SkeletonDesc />
          <SkeletonDesc width="80%" />
          <SkeletonShimmer />
        </SkeletonCard>
      ))}
    </SkeletonWrapper>
  );
};

export default AirdropSkeletonLoadingPage;
