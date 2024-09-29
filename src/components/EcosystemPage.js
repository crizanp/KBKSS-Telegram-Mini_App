import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Confetti from "react-confetti"; // Import react-confetti
import { usePoints } from "../context/PointsContext";
import { showToast } from "./ToastNotification"; // Use toast messages
import ToastNotification from "./ToastNotification"; // For displaying toast notifications globally
import celebrationSound from "../assets/celebration.mp3"; // Import the celebration sound
import UserInfo from "./UserInfo";
import Modal from "./Modal"; // Modal for showing correct answer
import { FaRegGem } from "react-icons/fa"; // For the gem icon
import wrongAnswerSound from "../assets/wrong-answer.mp3";
import SkeletonLoaderEcosystemPage from "./SkeletonLoaderEcosystemPage"; // Import the skeleton loader

import {
  QuizContainer,
  ScrollableContent,
  QuizBox,
  QuestionText,
  Option,
  SubmitButton,
  HeaderText,
  CategoryContainer,
  CategoryButton,
  NextButton,
  NoQuestionsMessage,
  CompletionImage,
  CompletionContainer,
  PointsContainer, // New container for quiz points
} from "./EcosystemStyles";
import styled from "styled-components";

// Styled button for correct answer
const CorrectAnswerButton = styled.button`
  color: #505050;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #00aced;
  }
`;

// Styled text for showing the correct answer
const CorrectAnswerText = styled.p`
  color: #4caf50;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  background-color: #e8f5e914;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 89px;
  flex-direction: row;
  justify-content: space-between;
`;

// Container for showing quiz points (gems)
const QuizPoints = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  color: #36a8e5;
  margin-bottom: 10px;
`;

function EcosystemPage() {
  const { points, setPoints, userID } = usePoints();
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [loading, setLoading] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false); // Flag to disable button
  const [submitting, setSubmitting] = useState(false); // Flag to track submission status
  const [correctOption, setCorrectOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [noMoreQuizzes, setNoMoreQuizzes] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOptionSelect = (index) => {
    if (!disableSubmit) {
      setSelectedOption(index);
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/category/categories`
        );
        setCategories([{ name: "Random", _id: "random" }, ...response.data]);
      } catch (error) {
        showToast("Error fetching categories", "error");
      }
    };

    fetchCategories();
  }, []);

  // Fetch remaining quizzes
  useEffect(() => {
    const fetchRemainingQuizzes = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;

        if (selectedCategory === "Random") {
          url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
        } else {
          url += `?category=${selectedCategory}`;
        }

        const response = await axios.get(url);

        if (
          !response.data ||
          response.data.message === "No remaining quizzes found"
        ) {
          setCurrentQuiz(null);
          setNoMoreQuizzes(true);
        } else {
          setCurrentQuiz(response.data[0]);
          setNoMoreQuizzes(false);
        }

        setLoading(false);
        setSelectedOption(null);
        setDisableSubmit(false);
        setCorrectOption(null);
        setShowFeedback(false);
        setShowCorrectAnswer(false);
      } catch (error) {
        showToast("Error fetching quizzes", "error");
      }
    };

    fetchRemainingQuizzes();
  }, [userID, selectedCategory]);

  // Handle submitting the selected answer
  const handleSubmit = async () => {
    if (selectedOption === null || submitting) return; // Prevent further clicks if already submitting

    setSubmitting(true); // Set submitting flag to true

    const isCorrect = currentQuiz.options[selectedOption].isCorrect;
    const pointsEarned = isCorrect ? currentQuiz.points : 0;

    try {
      // Always submit the quiz as completed, even if the answer is wrong
      await axios.post(
        `${process.env.REACT_APP_API_URL}/user-info/submit-quiz`,
        {
          userID,
          quizId: currentQuiz._id,
          pointsEarned,
        }
      );

      // If correct, award points and show confetti
      if (isCorrect) {
        setPoints((prevPoints) => {
          const updatedPoints = prevPoints + pointsEarned;
          localStorage.setItem(`points_${userID}`, updatedPoints);
          return updatedPoints;
        });

        setDisableSubmit(true);
        setCorrectOption(selectedOption);
        setShowFeedback(true);
        setShowConfetti(true);
        audioRef.current.play(); // Play the celebration sound

        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);

        showToast(
          `Correct answer! 🎉! ${pointsEarned} $GEMS added.`,
          "success"
        );
      } else {
        // Play the wrong answer sound
        const wrongAnswerAudio = new Audio(wrongAnswerSound);
        wrongAnswerAudio.play();

        // Deduct 50% of points if incorrect
        const pointsToDeduct = currentQuiz.points * 0.5;

        // Deduct the points from the backend
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user-info/deduct-points`,
          {
            userID: userID,
            pointsToDeduct,
          }
        );

        // Update points in context and local storage
        const updatedPoints = response.data.points;
        setPoints(updatedPoints);
        localStorage.setItem(`points_${userID}`, updatedPoints);

        setDisableSubmit(true);
        setCorrectOption(
          currentQuiz.options.findIndex((option) => option.isCorrect)
        );
        setShowFeedback(true);
        showToast(
          `Wrong answer 😒! ${pointsToDeduct} points deducted.`,
          "error"
        );
      }
    } catch (error) {
      showToast("Error submitting answer", "error");
    } finally {
      setSubmitting(false); // Reset submitting flag once done
    }
  };

  // Show the correct answer modal
  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswerModal(true);
  };

  // Handle deduction of points to show correct answer
  const handleGoAhead = async () => {
    if (points < 50 || submitting) {
      showToast("Not enough points to show the correct answer!", "error");
      return;
    }

    setSubmitting(true); // Set submitting flag

    try {
      // Deduct 50 points from the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user-info/deduct-points`,
        {
          userID: userID,
          pointsToDeduct: 50,
        }
      );

      const updatedPoints = response.data.points;

      // Update points in context and local storage
      setPoints(updatedPoints);
      localStorage.setItem(`points_${userID}`, updatedPoints);

      // Show the correct answer after deduction
      setShowCorrectAnswer(true);
      setShowCorrectAnswerModal(false); // Close the modal
      showToast("50 GEMS deducted to show the correct answer", "success");
    } catch (error) {
      console.error("Error deducting points:", error);
      showToast("Error deducting points!", "error");
    } finally {
      setSubmitting(false); // Reset submitting flag
    }
  };

  // Handle loading the next quiz
  const handleNextQuiz = async () => {
    setSelectedOption(null);
    setDisableSubmit(false);
    setCorrectOption(null);
    setShowFeedback(false);
    setShowCorrectAnswer(false);
    setLoading(true);

    try {
      let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;

      if (selectedCategory === "Random") {
        url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
      } else {
        url += `?category=${selectedCategory}`;
      }

      const response = await axios.get(url);

      if (
        !response.data ||
        response.data.message === "No remaining quizzes found"
      ) {
        setCurrentQuiz(null);
        setNoMoreQuizzes(true);
      } else {
        setCurrentQuiz(response.data[0]);
        setSelectedOption(null);
        setDisableSubmit(false);
        setCorrectOption(null);
        setShowFeedback(false);
        setShowCorrectAnswer(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching next quiz:", error);
      setLoading(false);
      setCurrentQuiz(null);
      setNoMoreQuizzes(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={celebrationSound} />
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <ToastNotification />

      <QuizContainer>
        <UserInfo />

        <HeaderText>Answer and Earn</HeaderText>

        <CategoryContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category._id}
              selected={category.name === selectedCategory}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryContainer>

        <ScrollableContent>
          {loading ? (
            // Render the Skeleton Loader when loading
            <SkeletonLoaderEcosystemPage />
          ) : noMoreQuizzes ? (
            <CompletionContainer>
              <CompletionImage
                src="https://www.greatperthbookkeeping.com.au/wp-content/uploads/2014/06/done.png"
                alt="All done"
              />
              <p>You have completed all the quizzes! Great job!</p>
            </CompletionContainer>
          ) : currentQuiz ? (
            <>
              <QuizBox>
                <QuizPoints>
                  <FaRegGem style={{ marginRight: "5px", color: "#36a8e5" }} />
                  {currentQuiz.points} $GEMS
                </QuizPoints>
                <QuestionText>{currentQuiz.questionText}</QuestionText>
                {currentQuiz.options.map((option, index) => (
                  <Option
                    key={index}
                    $selected={selectedOption === index}
                    $correct={showFeedback && index === correctOption}
                    $wrong={
                      showFeedback &&
                      index === selectedOption &&
                      !option.isCorrect
                    }
                    $isDisabled={disableSubmit}
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option.text}
                  </Option>
                ))}
                <SubmitButton
                  onClick={handleSubmit}
                  disabled={submitting || selectedOption === null || disableSubmit} // Disable button during submission
                >
                  {submitting ? "Submitting..." : "Submit"} {/* Show submitting text */}
                </SubmitButton>
              </QuizBox>
            </>
          ) : (
            <NoQuestionsMessage>
              No quiz available at the moment.
            </NoQuestionsMessage>
          )}

          {/* Show the correct answer button if the answer is wrong and enough points */}
          {showFeedback &&
            selectedOption !== correctOption &&
            !showCorrectAnswer &&
            points >= 50 && (
              <CorrectAnswerButton onClick={handleShowCorrectAnswer}>
                Show Correct Answer
              </CorrectAnswerButton>
            )}

          {/* Display the correct answer */}
          {showCorrectAnswer && (
            <CorrectAnswerText>
              Correct Answer: {currentQuiz.options[correctOption].text}
            </CorrectAnswerText>
          )}
        </ScrollableContent>

        {!noMoreQuizzes && !loading && (
          <NextButton
            onClick={handleNextQuiz}
            disabled={loading || noMoreQuizzes}
          >
            Next
          </NextButton>
        )}

        {showCorrectAnswerModal && (
          <Modal
            onGoAhead={handleGoAhead}
            onClose={() => setShowCorrectAnswerModal(false)}
          />
        )}
      </QuizContainer>
    </>
  );
}

export default EcosystemPage;
