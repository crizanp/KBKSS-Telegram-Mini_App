import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframe for skeleton loading animation
const skeletonLoading = keyframes`
  0% {
    background-color: #2a2a2a;
  }
  50% {
    background-color: #3d3d3d;
  }
  100% {
    background-color: #2a2a2a;
  }
`;

// Skeleton component for task category container with margin below
export const SkeletonTaskCategory = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  background-color: #1c1c1c;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton component for task item container with proper flex alignment
export const SkeletonTaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;  // Ensures left and right sections are spaced properly
  padding: 10px;
  margin: 10px 0;
  border-radius: 15px;
  background-color: #333;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton component for the left part (icon + task details) with proper max-width
const SkeletonTaskLeft = styled.div`
  display: flex;
  align-items: center;
  max-width: 80%;  // Prevents the left side from expanding too much
`;

// Skeleton component for the task icon
const SkeletonTaskIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #4a4a4a;
  border-radius: 50%;
  margin-right: 10px;
`;

// Skeleton component for the task details (title + points)
const SkeletonTaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

// Skeleton task title
const SkeletonTaskTitle = styled.div`
  width: 100px;
  height: 15px;
  background-color: #4a4a4a;
  border-radius: 8px;
`;

// Skeleton task points
const SkeletonTaskPoints = styled.div`
  width: 50px;
  height: 15px;
  background-color: #4a4a4a;
  border-radius: 8px;
`;

// Skeleton component for the right part (status indicator) with fixed width
const SkeletonTaskStatus = styled.div`
  width: 60px;
  height: 30px;
  background-color: #4a4a4a;
  border-radius: 8px;
  flex-shrink: 0; // Prevents the status from shrinking or moving out of bounds
`;

const SkeletonLoaderTaskPage = () => {
  return (
    <>
      {/* First Section */}
      <SkeletonTaskCategory>
        {/* Task Items */}
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
      </SkeletonTaskCategory>

      {/* Second Section */}
      <SkeletonTaskCategory>
        {/* Task Items */}
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
      </SkeletonTaskCategory>

      {/* Third Section */}
      <SkeletonTaskCategory>
        {/* Task Items */}
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
        <SkeletonTaskItem>
          <SkeletonTaskLeft>
            <SkeletonTaskIcon />
            <SkeletonTaskDetails>
              <SkeletonTaskTitle />
              <SkeletonTaskPoints />
            </SkeletonTaskDetails>
          </SkeletonTaskLeft>
          <SkeletonTaskStatus />
        </SkeletonTaskItem>
      </SkeletonTaskCategory>
    </>
  );
};

export default SkeletonLoaderTaskPage;
