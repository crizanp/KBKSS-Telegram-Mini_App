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

// Skeleton for header text
const SkeletonHeader = styled.div`
  width: 250px;
  height: 35px;
  border-radius: 8px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for category buttons
const SkeletonCategoryButton = styled.div`
  width: 100px;
  height: 40px;
  border-radius: 8px;
  background-color: #4a4a4a;
  margin-right: 15px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Container to hold multiple category buttons
const SkeletonCategoryContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
`;

// Skeleton for quiz container (question, options, and submit button)
const SkeletonQuizBox = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #1c1c1c;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

// Skeleton for quiz question text
const SkeletonQuestionText = styled.div`
  width: 80%;
  height: 25px;
  background-color: #4a4a4a;
  border-radius: 8px;
  margin-bottom: 15px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for option items in the quiz
const SkeletonOption = styled.div`
  width: 100%;
  height: 40px;
  background-color: #4a4a4a;
  border-radius: 8px;
  margin-bottom: 10px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for submit button
const SkeletonSubmitButton = styled.div`
  width: 150px;
  height: 45px;
  background-color: #4a4a4a;
  border-radius: 8px;
  margin-top: 20px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for next button
const SkeletonNextButton = styled.div`
  width: 120px;
  height: 45px;
  background-color: #4a4a4a;
  border-radius: 12px;
  margin-top: 20px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for completion image (used when all quizzes are completed)
const SkeletonCompletionImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: #4a4a4a;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Skeleton for the "All done" message
const SkeletonCompletionText = styled.div`
  width: 200px;
  height: 25px;
  background-color: #4a4a4a;
  border-radius: 8px;
  margin-bottom: 10px;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
`;

// Separate SkeletonQuiz component for modularity
const SkeletonQuiz = () => (
  <SkeletonQuizBox>
    <SkeletonQuestionText />
    <SkeletonOption />
    <SkeletonOption />
    <SkeletonOption />
    <SkeletonOption />
    <SkeletonSubmitButton />
  </SkeletonQuizBox>
);

const SkeletonLoaderEcosystemPage = () => {
  // Example state to manage loading and completion
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCompleted, setIsCompleted] = React.useState(false);

  // Simulate loading and completion (for demonstration purposes)
  React.useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(false); // Set to true if you want to show completion skeleton
    }, 3000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>

      {/* Single skeleton quiz box */}
      {isLoading && <SkeletonQuiz />}

     

      {/* Completion state skeleton (conditionally rendered) */}
      {!isLoading && isCompleted && (
        <div>
          <SkeletonCompletionImage />
          <SkeletonCompletionText />
        </div>
      )}
    </div>
  );
};

export default SkeletonLoaderEcosystemPage;
