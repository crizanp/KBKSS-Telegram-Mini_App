import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import { showToast } from "../components/ToastNotification";
import ToastNotification from "../components/ToastNotification";
import { usePoints } from "../context/PointsContext";
import { useEnergy } from "../context/EnergyContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getUserID } from "../utils/getUserID";
import GameUnlockModal from "../components/GameUnlockModal";
import {
  BoostPageContainer,
  Section,
  SectionTitle,
  BoostOption,
  EligibleTag,
  Spacer,
  MaxEnergyIcon,
  TapIcon,
} from "../style/LevelPageStyle";

// Styled components for loading
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
`;

const LoadingStepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const DoneIcon = styled.span`
  color: green;
  font-size: 1.5rem;
  margin-left: 10px;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 10px;
  background-color: #ddd;
  margin-left: 10px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  &::after {
    content: "";
    position: absolute;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background-color: #0088cc;
    transition: width 0.5s ease;
  }
`;

// React Query function to fetch user data and level data
const fetchUserData = async () => {
  const userID = await getUserID();  // Await the result of getUserID()
  
  const [userResponse, levelResponse] = await Promise.all([
    axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`),
    axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`)
  ]);

  return {
    userData: userResponse.data,
    levelData: levelResponse.data,
  };
};

const LoadingStep = ({ label, isDone, progress }) => (
  <LoadingStepContainer>
    {label}
    {isDone ? (
      <DoneIcon>✔</DoneIcon>
    ) : (
      <ProgressBar progress={progress} />
    )}
  </LoadingStepContainer>
);

const BoostsPage = () => {
  const { pointsPerTap, setPointsPerTap } = usePoints();
  const { maxEnergy, setMaxEnergy } = useEnergy();
  const [selectedTapBoost, setSelectedTapBoost] = useState(pointsPerTap);
  const [selectedEnergyBoost, setSelectedEnergyBoost] = useState(maxEnergy);
  const [modalData, setModalData] = useState(null);

  // Loading step states
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAllLoaded, setIsAllLoaded] = useState(false);

  // Use React Query to fetch user data and level data
  const { data, isLoading, isError } = useQuery(
    ["userData"], // Query key
    fetchUserData,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes cache
      refetchOnWindowFocus: false, // No refetch on window focus
      onSuccess: (data) => {
        setSelectedEnergyBoost(data.userData.maxEnergy);
        setSelectedTapBoost(data.userData.pointsPerTap);
      },
    }
  );

  // Simulate loading steps with timing
  useEffect(() => {
    if (isLoading) {
      const loadSteps = () => {
        if (loadingStep === 0) {
          setTimeout(() => {
            setLoadingStep(1); // Done with checking level
          }, 1000);
        } else if (loadingStep === 1) {
          setTimeout(() => {
            setLoadingStep(2); // Done with checking max energy
          }, 1000);
        } else if (loadingStep === 2) {
          setTimeout(() => {
            setLoadingStep(3); // Done with checking points per tap
            setIsAllLoaded(true);
          }, 1000);
        }
      };

      // Progress bar simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 20 : 100));
      }, 300);

      loadSteps();
      return () => clearInterval(progressInterval);
    }
  }, [isLoading, loadingStep]);

  const handleClaimBoost = async (boostType, boostValue) => {
    try {
      const userID = await getUserID();  // Make sure you await the result of getUserID here as well

      await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/update-boost/${userID}`,
        { boostType, boostValue }
      );
      showToast("Boost applied successfully!", "success");

      if (boostType === "maxEnergy") {
        setSelectedEnergyBoost(boostValue);
        setMaxEnergy(boostValue); // Update in EnergyContext
      } else if (boostType === "pointsPerTap") {
        setSelectedTapBoost(boostValue);
        setPointsPerTap(boostValue); // Update in PointsContext
      }
    } catch (error) {
      showToast("Error claiming boost", "error");
      console.error("Error claiming boost:", error);
    }
  };

  const handleOptionClick = (boostType, boostValue, requiredLevel) => {
    const userLevel = data?.levelData.currentLevel ?? 0;

    if (userLevel >= requiredLevel) {
      setModalData({
        boostType,
        boostValue,
        message: `Are you sure you want to claim this boost?`,
      });
    } else {
      showToast(
        `You need to be level ${requiredLevel} to unlock this!`,
        "error"
      );
    }
  };

  const handleConfirmBoost = () => {
    if (modalData) {
      handleClaimBoost(modalData.boostType, modalData.boostValue);
      setModalData(null); // Close modal after confirmation
    }
  };

  if (isLoading && !isAllLoaded) {
    return (
      <LoadingContainer>
        <LoadingStep
          label="Checking level..."
          isDone={loadingStep >= 1}
          progress={loadingStep === 0 ? progress : 100}
        />
        <LoadingStep
          label="Checking energy..."
          isDone={loadingStep >= 2}
          progress={loadingStep === 1 ? progress : 100}
        />
        <LoadingStep
          label="Checking $GEMS per tap..."
          isDone={loadingStep >= 3}
          progress={loadingStep === 2 ? progress : 100}
        />
      </LoadingContainer>
    );
  }

  if (isError) {
    return <div>Error loading data, please try again later.</div>;
  }

  const userLevel = data?.levelData.currentLevel ?? 0;

  return (
    <BoostPageContainer>
      <UserInfo />
      <Spacer />

      {/* Increase Max Energy Section */}
      <Section>
        <SectionTitle>Increase Max Energy</SectionTitle>
        <MaxEnergyIcon />
        <BoostOption
          selected={selectedEnergyBoost === 1000}
          onClick={() =>
            handleOptionClick("maxEnergy", 1000, 0)
          }
        >
          Max 1000 Energy (Level 0 or 1)
          <EligibleTag>Eligible</EligibleTag>
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 1500}
          disabled={selectedEnergyBoost === 1500}
          onClick={() =>
            handleOptionClick("maxEnergy", 1500, 2)
          }
        >
          Max 1500 Energy (Level 2)
          {userLevel >= 2 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 2500}
          disabled={selectedEnergyBoost === 2500}
          onClick={() =>
            handleOptionClick("maxEnergy", 2500, 3)
          }
        >
          Max 2500 Energy (Level 3)
          {userLevel >= 3 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 4000}
          disabled={selectedEnergyBoost === 4000}
          onClick={() =>
            handleOptionClick("maxEnergy", 4000, 4)
          }
        >
          Max 4000 Energy (Level 4)
          {userLevel >= 4 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 7000}
          disabled={selectedEnergyBoost === 7000}
          onClick={() =>
            handleOptionClick("maxEnergy", 7000, 5)
          }
        >
          Max 7000 Energy (Level 5)
          {userLevel >= 5 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
      </Section>

      {/* Increase Points Per Tap Section */}
      <Section>
        <SectionTitle>Increase Points Per Tap</SectionTitle>
        <TapIcon />
        <BoostOption
          selected={selectedTapBoost === 1}
          onClick={() =>
            handleOptionClick("pointsPerTap", 1, 0)
          }
        >
          1 Point Per Tap (Level 0-1-2)
          <EligibleTag>Eligible</EligibleTag>
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 2}
          disabled={selectedTapBoost === 2}
          onClick={() =>
            handleOptionClick("pointsPerTap", 2, 3)
          }
        >
          2 Points Per Tap (Level 3)
          {userLevel >= 3 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 3}
          disabled={selectedTapBoost === 3}
          onClick={() =>
            handleOptionClick("pointsPerTap", 3, 4)
          }
        >
          3 Points Per Tap (Level 4)
          {userLevel >= 4 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 5}
          disabled={selectedTapBoost === 5}
          onClick={() =>
            handleOptionClick("pointsPerTap", 5, 5)
          }
        >
          5 Points Per Tap (Level 5)
          {userLevel >= 5 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
      </Section>

      <ToastNotification />

      {modalData && (
        <GameUnlockModal
          message={modalData.message}
          title="Please Confirm"
          onConfirm={handleConfirmBoost}
          onCancel={() => setModalData(null)}
          iconUrl="https://cdn-icons-png.flaticon.com/512/6106/6106288.png"
        />
      )}
    </BoostPageContainer>
  );
};

export default BoostsPage;
