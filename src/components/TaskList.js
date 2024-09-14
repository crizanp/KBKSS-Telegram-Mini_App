import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Confetti from "react-confetti"; // Import react-confetti
import { usePoints } from "../context/PointsContext";
import { getUserID } from "../utils/getUserID";
import UserInfo from "./UserInfo";
import { FaChevronRight } from "react-icons/fa";
import FloatingMessage from "./FloatingMessage";
import { FaRegGem } from "react-icons/fa";
import styled from "styled-components";
import SkeletonLoaderTaskPage from "./SkeletonLoaderTaskPage";
import {
  TaskContainer,
  TaskCategory,
  TaskTitle,
  CoinText,
  PointsDisplayModal,
  TaskIcon,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalContent,
  ModalButton,
  ClaimButton,
  CloseButtonModel,
  ProofInput,
  PointsDisplayContainer,
  PointsDisplay,
  CoinIcon,
} from "./TaskList.styles";
import coinIcon from "../assets/coin-icon.png";
import celebrationSound from "../assets/celebration.mp3"; // Import sound file

// Styled component for the crown icon
export const GemIcon = styled(FaRegGem)`
  color: #ffffff;
  font-size: 1.3rem;
  margin-top: -3px;
`;
const GemIconModal = styled(FaRegGem)`
  color: #36a8e5;  // Similar color to UserInfo component
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.9rem;
`;
const TaskItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.$completed ? "#d4ffc32e" : "#d8d0d02b"};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  min-height: 80px;
  box-sizing: border-box;
`;

const TaskDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
`;

const TaskLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
`;

const ModalTaskLogo = styled(TaskLogo)`
  width: 117px;
  height: 99px;
  margin: 20px auto;
  object-fit: contain;
  display: block;
  border-radius: 8px;
`;

const TaskTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const TaskTitleRow = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const TaskPointsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #fff;
  background-color: #24a1de;
  padding: 5px 10px;
  border-radius: 8px;
  width: fit-content;
  box-sizing: border-box;
`;
const PerformAgainButton = styled(ClaimButton)`
  background-color: #f39c12;
  margin-left: 0px;
  width: 95%;
`;

const TaskList = () => {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tasks, setTasks] = useState({
    special: [],
    daily: [],
    lists: [],
    extra: [],
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isClaimable, setIsClaimable] = useState(false);
  const [underModeration, setUnderModeration] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [timer, setTimer] = useState(10);
  const [timerStarted, setTimerStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); 
  const audioRef = useRef(null); 
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  }); 

  // Handle window resize to adjust confetti size
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

  useEffect(() => {
    const initializeUserAndFetchTasks = async () => {
      setLoading(true);
      try {
        const userID = await getUserID(setUserID, setUsername);
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/${userID}`
        );
        const userData = userResponse.data;
        setPoints(userData.points);

        const completedTasksMap = {};
        userData.tasksCompleted.forEach((taskId) => {
          completedTasksMap[taskId] = true;
        });
        setCompletedTasks(completedTasksMap);
      } catch (error) {
        console.error("Unexpected error fetching user data:", error);
      }

      try {
        const tasksResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`
        );
        const data = tasksResponse.data;

        const categorizedTasks = {
          special: data.filter((task) => task.category === "Special"),
          daily: data.filter((task) => task.category === "Daily"),
          lists: data.filter((task) => task.category === "Lists"),
          extra: data.filter((task) => task.category === "Extra"),
        };

        setTasks(categorizedTasks);
      } catch (taskFetchError) {
        console.error("Error fetching tasks:", taskFetchError);
      } finally {
        setLoading(false);
      }
    };

    initializeUserAndFetchTasks();
  }, [setPoints, setUserID, setUsername]);

  useEffect(() => {
    let countdown;
    if (selectedTask && timerStarted && !isClaimable && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsClaimable(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [selectedTask, timerStarted, isClaimable, timer]);

  const handleTaskClick = (task) => {
    if (!completedTasks[task._id]) {
      setSelectedTask(task);
      setIsClaimable(false);
      setUnderModeration(false);
      setTimer(10);
      setTimerStarted(false);
    }
  };

  const handleStartTask = () => {
    window.open(selectedTask.link, "_blank");
    setTimerStarted(true);
    setTimer(10);
    setIsClaimable(false);
  };

  const handleClaimReward = async () => {
    setUnderModeration(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
        {
          pointsToAdd: selectedTask.points,
          username: window.Telegram.WebApp?.initDataUnsafe?.user?.username,
        }
      );

      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-info/${userID}`
      );
      setPoints(userResponse.data.points);

      await axios.post(`${process.env.REACT_APP_API_URL}/user-info`, {
        userID,
        tasksCompleted: [selectedTask._id],
        taskHistory: [
          {
            taskId: selectedTask._id,
            pointsEarned: selectedTask.points,
            completedAt: new Date(),
          },
        ],
      });

      setCompletedTasks((prevTasks) => ({
        ...prevTasks,
        [selectedTask._id]: true,
      }));

      setMessage({ text: "Points awarded!", type: "success" });
      setShowConfetti(true);
      audioRef.current.play();

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      setSelectedTask(null);
    } catch (error) {
      console.error("Error claiming reward:", error);
      setMessage({ text: "Error claiming the reward.", type: "error" });
    } finally {
      setUnderModeration(false);
    }
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  return (
    <>
      {message && (
        <FloatingMessage
          message={message.text}
          type={message.type}
          duration={3000}
          onClose={() => setMessage(null)}
        />
      )}

      <audio ref={audioRef} src={celebrationSound} />
      
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <PointsDisplayContainer id="pointsDisplay">
        <UserInfo userID={userID} points={points} />
        <PointsDisplay>
          <img
            src="https://i.postimg.cc/y6Pn7xpB/square-3.png"
            alt="Logo Icon"
            style={{
              width: "100px",
              height: "100px",
              marginBottom: "19px",
              marginTop: "20px",
            }}
          />
        </PointsDisplay>
      </PointsDisplayContainer>

      <CoinText>Earn more tokens by completing tasks</CoinText>

      {loading ? (
        <SkeletonLoaderTaskPage />
      ) : (
        <TaskContainer>
          {Object.keys(tasks).map((category) => (
            <TaskCategory key={category}>
              <TaskTitle>
                {category.charAt(0).toUpperCase() + category.slice(1)} Tasks
              </TaskTitle>
              {tasks[category]
                .sort((a, b) => {
                  const isACompleted = completedTasks[a._id] ? 1 : 0;
                  const isBCompleted = completedTasks[b._id] ? 1 : 0;
                  return isACompleted - isBCompleted;
                })
                .map((task) => (
                  <TaskItemContainer
                    key={task._id}
                    $completed={completedTasks[task._id]}
                    onClick={() => handleTaskClick(task)}
                  >
                    <TaskDetailsContainer>
                      <TaskLogo
                        src={task.logo || "https://via.placeholder.com/50"}
                        alt={`${task.name} logo`}
                      />
                      <TaskTextContainer>
                        <TaskTitleRow>{task.name}</TaskTitleRow>
                        <TaskPointsContainer>
                          <GemIcon />
                          {task.points}
                        </TaskPointsContainer>
                      </TaskTextContainer>
                    </TaskDetailsContainer>

                    <TaskIcon $completed={completedTasks[task._id]}>
                      {completedTasks[task._id] ? "Done" : <FaChevronRight />}
                    </TaskIcon>
                  </TaskItemContainer>
                ))}
            </TaskCategory>
          ))}

          {selectedTask && (
            <ModalOverlay>
              <Modal>
                <CloseButtonModel onClick={handleClose} />
                <ModalTaskLogo
                  src={selectedTask.logo || "https://via.placeholder.com/50"}
                  alt={`${selectedTask.name} logo`}
                />
                <ModalHeader>{selectedTask.name}</ModalHeader>
                <PointsDisplayModal>
                <GemIconModal />+{selectedTask.points} GEMS
                </PointsDisplayModal>
                <ModalContent>{selectedTask.description}</ModalContent>

                {isClaimable && !underModeration ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ClaimButton
                      onClick={handleClaimReward}
                      disabled={underModeration}
                    >
                      {underModeration ? "Claiming..." : "Claim Reward"}
                    </ClaimButton>

                    <PerformAgainButton
                      onClick={handleStartTask}
                      disabled={underModeration}
                    >
                      Perform Again
                    </PerformAgainButton>
                  </div>
                ) : timerStarted && !isClaimable ? (
                  <ModalButton disabled>Processing, please wait...</ModalButton>
                ) : !timerStarted && !isClaimable && !underModeration ? (
                  <ModalButton onClick={handleStartTask}>Start Task</ModalButton>
                ) : null}

                {underModeration && (
                  <ModalContent>Task under moderation...</ModalContent>
                )}
              </Modal>
            </ModalOverlay>
          )}
        </TaskContainer>
      )}
    </>
  );
};

export default TaskList;
