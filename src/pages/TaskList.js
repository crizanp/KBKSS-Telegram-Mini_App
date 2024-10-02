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

// Fetch tasks function
const fetchTasks = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`
  );
  return data;
};

// Fetch user info function
const fetchUserInfo = async (userID) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/user-info/${userID}`
  );
  return data;
};

// Group tasks by category
const groupTasksByCategory = (tasks) => {
  return tasks.reduce((acc, task) => {
    const category = task.category || "Uncategorized"; // Default to 'Uncategorized' if no category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});
};

const TaskList = () => {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();

  // Declare completedTasks state
  const [completedTasks, setCompletedTasks] = useState({});
  const [isCompletedTasksLoading, setIsCompletedTasksLoading] = useState(true); // New loading state

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

  // Fetch User Info and completed tasks
  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["userInfo", userID],
    queryFn: () => fetchUserInfo(userID),
    enabled: !!userID, // Only fetch if userID is available
    onSuccess: (data) => {
      setPoints(data.points);
      const completedTasksMap = {};
      data.tasksCompleted.forEach((taskId) => {
        completedTasksMap[taskId] = true;
      });
      setCompletedTasks(completedTasksMap); // Set the completed tasks
      setIsCompletedTasksLoading(false); // Set loading to false once the tasks are loaded
    },
    onError: () => {
      showToast("Unexpected error fetching user data", "error");
      setIsCompletedTasksLoading(false); // Even on error, stop loading
    },
  });

  // Fetch Tasks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    onError: (error) => {
      showToast("Error fetching tasks", "error");
    },
  });

  // Claim Reward Mutation
  // Claim Reward Mutation
const claimRewardMutation = useMutation(
  async ({ task }) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
      {
        pointsToAdd: task.points,
        username: window.Telegram.WebApp?.initDataUnsafe?.user?.username,
      }
    );

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
      // Invalidate user info query to refetch user points and task data
      queryClient.invalidateQueries(["userInfo", userID]);
      
      // Update points in state
      setPoints((prevPoints) => {
        const updatedPoints = prevPoints + variables.task.points;
        // Store updated points in local storage
        localStorage.setItem(`points_${userID}`, updatedPoints);
        return updatedPoints;
      });

      showToast("Points awarded!", "success");
      setShowConfetti(true);
      audioRef.current.play();
      setTimeout(() => setShowConfetti(false), 5000);
      setSelectedTask(null); // Clear the selected task
    },
    onError: () => {
      showToast("Error claiming the reward.", "error");
    },
    onSettled: () => setUnderModeration(false),
  }
);


  // Start countdown timer
  useEffect(() => {
    let countdown;
    if (selectedTask && timerStarted && !isClaimable && timer > 0) {
      countdown = setInterval(
        () => setTimer((prevTimer) => prevTimer - 1),
        1000
      );
    } else if (timer === 0) {
      setIsClaimable(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [selectedTask, timerStarted, isClaimable, timer]);

  const handleTaskClick = (task) => {
    // Disable clicks when completed tasks are still loading
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

  // Group the tasks by category
  const groupedTasks = groupTasksByCategory(tasksData);

  // Desired category order
  const categoryOrder = ["Special", "Daily", "Lists", "Extra"];

  return (
    <>
      {/* Confetti and Points Display */}
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

      {/* Render grouped tasks in the desired category order */}
      <TaskContainer>
        {categoryOrder.map(
          (category) =>
            groupedTasks[category]?.length > 0 && (
              <TaskCategory key={category}>
                <TaskTitle>{category} Tasks</TaskTitle>

                {groupedTasks[category]
                  .sort((a, b) => (completedTasks[a._id] ? 1 : -1)) // Sort tasks by completion status
                  .map((task) => (
                    <TaskItemContainer
                      key={task._id}
                      $completed={completedTasks[task._id]}
                      onClick={() => handleTaskClick(task)}
                      style={{
                        cursor:
                          isCompletedTasksLoading || completedTasks[task._id]
                            ? "not-allowed"
                            : "pointer", // Make unclickable initially and for completed tasks
                        pointerEvents:
                          isCompletedTasksLoading || completedTasks[task._id]
                            ? "none"
                            : "auto", // Disable interaction initially and for completed tasks
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

      {/* Modal for Task Details */}
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

      {/* Render the ToastContainer globally */}
      <ToastNotification />
    </>
  );
};

export default TaskList;
