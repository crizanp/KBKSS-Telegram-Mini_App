import styled, { keyframes } from "styled-components";

// Skeleton loading animation
const loadingAnimation = keyframes`
  0% {
    background-color: #2e2e2e;
  }
  50% {
    background-color: #333333;
  }
  100% {
    background-color: #2e2e2e;
  }
`;

const SkeletonTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SkeletonRow = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0;
`;

const SkeletonCell = styled.div`
  flex: 1;
  height: 20px;
  margin-right: 10px;
  background-color: #2e2e2e;
  animation: ${loadingAnimation} 1.5s infinite ease-in-out;
  border-radius: 5px;
`;

const SkeletonLoader = () => (
  <SkeletonTable>
    {Array(7)
      .fill(0)
      .map((_, index) => (
        <SkeletonRow key={index}>
          <SkeletonCell style={{ flex: 0.2 }} />
          <SkeletonCell style={{ flex: 0.8 }} />
          <SkeletonCell style={{ flex: 0.4 }} />
        </SkeletonRow>
      ))}
  </SkeletonTable>
);

export default SkeletonLoader;
