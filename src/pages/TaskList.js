import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Confetti from "react-confetti";
import { usePoints } from "../context/PointsContext";
import { getUserID } from "../utils/getUserID";
import UserInfo from "../components/UserInfo";
import { FaChevronRight } from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import ToastNotification from "../components/ToastNotification";
import SkeletonLoaderTaskPage from "../components/skeleton/SkeletonLoaderTaskPage";
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
  TaskItemContainer,
  PointsDisplayContainer,
  PointsDisplay,
  GemIconModal,
  TaskDetailsContainer,
  TaskLogo,
  ModalTaskLogo,
  TaskTextContainer,
  TaskTitleRow,
  TaskPointsContainer,
  PerformAgainButton,
  AirdropDescription,
  GemIcon,
} from "../style/TaskList.styles";
import celebrationSound from "../assets/celebration.mp3";

const fetchTasks = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
  return data;
};

const fetchUserInfo = async (userID) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
  return data;
};

const groupTasksByCategory = (tasks) => {
  return tasks.reduce((acc, task) => {
    const category = task.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});
};

const TaskList = () => {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [completedTasks, setCompletedTasks] = useState({});
  const [isCompletedTasksLoading, setIsCompletedTasksLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isClaimable, setIsClaimable] = useState(false);
  const [underModeration, setUnderModeration] = useState(false);
  const [timer, setTimer] = useState(10);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const queryClient = useQueryClient();

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

  const { data: userInfo, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["userInfo", userID],
    queryFn: () => fetchUserInfo(userID),
    enabled: !!userID,
    onSuccess: (data) => {
      setPoints(data.points);
      const completedTasksMap = {};
      data.tasksCompleted.forEach((taskId) => {
        completedTasksMap[taskId] = true;
      });
      setCompletedTasks(completedTasksMap);
      setIsCompletedTasksLoading(false);
    },
    onError: () => {
      showToast("Unexpected error fetching user data", "error");
      setIsCompletedTasksLoading(false);
    },
  });

  const { data: tasksData, isLoading: tasksLoading, isError: tasksError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    onError: () => {
      showToast("Error fetching tasks", "error");
    },
  });

  // Function to verify Telegram tasks
 // Function to verify Telegram tasks
// Function to verify Telegram tasks
const verifyTelegramTask = async (task) => {
  try {
    const userID = await getUserID(); // Await the Promise to get the resolved user ID

    // Log userID for debugging
    console.log("Verifying Telegram task for userID:", userID);

    // Validate userID
    if (!userID || (typeof userID !== "string" && typeof userID !== "number")) {
      console.error("Invalid userID:", userID);
      throw new Error("User ID is required and should be a valid string or number.");
    }

    // Make the API call to verify the Telegram task
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/telegram-verify/verify-telegram-task`, {
      userID,
      chatIds: [task.chatId], // Ensure chatIds is passed as an array
      actionType: task.telegramAction,
    });

    return response.data.success;
  } catch (error) {
    console.error("Error verifying Telegram task:", error);
    return false;
  }
};

  const claimRewardMutation = useMutation(
    async ({ task }) => {
      if (task.taskType === "telegram") {
        // Verify the Telegram task first
        const isVerified = await verifyTelegramTask(task);
        if (!isVerified) {
          throw new Error("Telegram task verification failed.");
        }
      }

      await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`, {
        pointsToAdd: task.points,
        username: window.Telegram.WebApp?.initDataUnsafe?.user?.username,
      });

      await axios.post(`${process.env.REACT_APP_API_URL}/user-info`, {
        userID,
        tasksCompleted: [task._id],
        taskHistory: [
          {
            taskId: task._id,
            pointsEarned: task.points,
            completedAt: new Date(),
          },
        ],
      });
    },
    {
      onSuccess: async (data, variables) => {
        queryClient.invalidateQueries(["userInfo", userID]);
        setPoints((prevPoints) => {
          const updatedPoints = prevPoints + variables.task.points;
          localStorage.setItem(`points_${userID}`, updatedPoints);
          return updatedPoints;
        });
        showToast("Points awarded!", "success");
        setShowConfetti(true);
        audioRef.current.play();
        setTimeout(() => setShowConfetti(false), 5000);
        setSelectedTask(null);
      },
      onError: (error) => {
        showToast(`Error claiming the reward: ${error.message}`, "error");
      },
      onSettled: () => setUnderModeration(false),
    }
  );

  useEffect(() => {
    let countdown;
    if (selectedTask && timerStarted && !isClaimable && timer > 0) {
      countdown = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
    } else if (timer === 0) {
      setIsClaimable(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [selectedTask, timerStarted, isClaimable, timer]);

  const handleTaskClick = (task) => {
    if (isCompletedTasksLoading || completedTasks[task._id]) return;

    setSelectedTask(task);
    setIsClaimable(false);
    setUnderModeration(false);
    setTimer(10);
    setTimerStarted(false);
  };

  const handleStartTask = () => {
    window.open(selectedTask.link, "_blank");
    setTimerStarted(true);
    setTimer(10);
    setIsClaimable(false);
  };

  const handleClaimReward = () => {
    setUnderModeration(true);
    claimRewardMutation.mutate({ task: selectedTask });
  };

  const handleClose = () => setSelectedTask(null);

  if (userLoading || tasksLoading) {
    return (
      <>
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
                userSelect: "none",
                pointerEvents: "none",
                WebkitUserDrag: "none",
              }}
            />
          </PointsDisplay>
        </PointsDisplayContainer>

        <CoinText>Earn more tokens by completing tasks</CoinText>
        <AirdropDescription>
          <b>Note:</b> In the final phase, we will review all tasks. If any task
          is completed but not properly recorded from a specific user, the user
          will be disqualified. Do not attempt to mislead the system. Please be
          respectful and ensure all tasks are completed correctly.
        </AirdropDescription>
        <SkeletonLoaderTaskPage />
      </>
    );
  }

  if (userError || tasksError) {
    return <div>Error loading data.</div>;
  }

  const groupedTasks = groupTasksByCategory(tasksData);
  const categoryOrder = ["Special", "Daily", "Lists", "Extra"];

  return (
    <>
      <audio ref={audioRef} src={celebrationSound} />
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

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
              userSelect: "none",
              pointerEvents: "none",
              WebkitUserDrag: "none",
            }}
          />
        </PointsDisplay>
      </PointsDisplayContainer>

      <CoinText>Earn more tokens by completing tasks</CoinText>
      <AirdropDescription>
        <b>Note:</b> In the final phase, we will review all tasks. If any task
        is completed but not properly recorded from a specific user, the user
        will be disqualified. Do not attempt to mislead the system. Please be
        respectful and ensure all tasks are completed correctly.
      </AirdropDescription>

      <TaskContainer>
        {categoryOrder.map(
          (category) =>
            groupedTasks[category]?.length > 0 && (
              <TaskCategory key={category}>
                <TaskTitle>{category} Tasks</TaskTitle>

                {groupedTasks[category]
                  .sort((a, b) => (completedTasks[a._id] ? 1 : -1))
                  .map((task) => (
                    <TaskItemContainer
                      key={task._id}
                      $completed={completedTasks[task._id]}
                      onClick={() => handleTaskClick(task)}
                      style={{
                        cursor: isCompletedTasksLoading || completedTasks[task._id] ? "not-allowed" : "pointer",
                        pointerEvents: isCompletedTasksLoading || completedTasks[task._id] ? "none" : "auto",
                      }}
                    >
                      <TaskDetailsContainer>
                        <TaskLogo
                          src={task.logo || "https://via.placeholder.com/50"}
                          alt={`${task.name} logo`}
                        />
                        <TaskTextContainer>
                          <TaskTitleRow>{task.name}</TaskTitleRow>
                          <TaskPointsContainer>
                            <GemIcon /> {task.points}
                          </TaskPointsContainer>
                        </TaskTextContainer>
                      </TaskDetailsContainer>
                      <TaskIcon $completed={completedTasks[task._id]}>
                        {completedTasks[task._id] ? "Done" : <FaChevronRight />}
                      </TaskIcon>
                    </TaskItemContainer>
                  ))}
              </TaskCategory>
            )
        )}
      </TaskContainer>

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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <ClaimButton onClick={handleClaimReward} disabled={underModeration}>
                  {underModeration ? "Claiming..." : "Claim Reward"}
                </ClaimButton>
                <PerformAgainButton onClick={handleStartTask} disabled={underModeration}>
                  Perform Again
                </PerformAgainButton>
              </div>
            ) : timerStarted && !isClaimable ? (
              <ModalButton disabled>Processing, please wait...</ModalButton>
            ) : !timerStarted && !isClaimable && !underModeration ? (
              <ModalButton onClick={handleStartTask}>Start Task</ModalButton>
            ) : null}

            {underModeration && <ModalContent>Task under moderation...</ModalContent>}
          </Modal>
        </ModalOverlay>
      )}

      <ToastNotification />
    </>
  );
};

export default TaskList;
