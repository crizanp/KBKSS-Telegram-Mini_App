import React, { useState } from "react";
import styled from "styled-components";
import { FaFire, FaGem, FaArrowUp } from "react-icons/fa";
import UserInfo from "../components/UserInfo";
import { showToast } from "../components/ToastNotification";
import ToastNotification from "../components/ToastNotification";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserID } from "../utils/getUserID";
import GameUnlockModal from "../components/GameUnlockModal";
import SkeletonLoader from "../components/skeleton/SkeletonLoader"; // Loader for boosts

const BoostPageContainer = styled.div`
  background-color: #090c12;
  color: white;
  min-height: 100vh;
  padding: 20px;
  font-family: "Orbitron", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: #e1e8eb;
  font-size: 1.8rem;
  margin-bottom: 15px;
`;

const BoostOption = styled.button`
  background-color: ${(props) =>
    props.selected ? "rgb(165 245 165)" : props.eligible ? "#fff" : "#ccc"};
  color: ${(props) => (props.selected ? "#000" : "#000")};
  border: ${(props) => (props.selected ? "none" : "1px solid #ccc")};
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0px;
  width: 100%;
  display: flex;
  cursor: ${(props) => (props.selected ? "not-allowed" : "pointer")};
  position: relative;
  pointer-events: ${(props) => (props.selected ? "none" : "auto")};
  &:hover {
    background-color: ${(props) =>
      props.selected ? "rgb(165 245 165)" : props.eligible ? "#eee" : "#ccc"};
  }
`;

const EligibleTag = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #544e4e;
  color: #fff;
  padding: 3px 8px;
  font-size: 0.7rem;
  border-radius: 4px;
`;

const Spacer = styled.div`
  height: 60px;
`;

const BoostsPage = () => {
  const [modalData, setModalData] = useState(null); // Modal for unlock confirmations

  // Fetch user boosts and level data using React Query
  const { data: userBoosts, isLoading: isBoostLoading } = useQuery(
    ["userBoosts"],
    async () => {
      const userID = await getUserID();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-info/${userID}`
      );
      return response.data;
    }
  );

  const { data: userLevelData, isLoading: isLevelLoading } = useQuery(
    ["userLevel"],
    async () => {
      const userID = await getUserID();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`
      );
      return response.data;
    }
  );

  const claimBoostMutation = useMutation(
    async ({ boostType, boostValue }) => {
      const userID = await getUserID();
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/update-boost/${userID}`,
        { boostType, boostValue }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(data.message, "success");
      },
      onError: () => {
        showToast("Error claiming boost", "error");
      },
    }
  );

  const handleClaimBoost = (boostType, boostValue) => {
    claimBoostMutation.mutate({ boostType, boostValue });
  };

  const handleOptionClick = (boostType, boostValue, requiredLevel, toastMessage) => {
    if (userLevelData?.currentLevel >= requiredLevel) {
      setModalData({
        boostType,
        boostValue,
        requiredLevel,
        message: toastMessage,
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
    }
    setModalData(null);
  };

  // Determine available boosts based on user level
  const getMaxAvailableTapBoost = () => {
    if (userLevelData?.currentLevel >= 5) return 5;
    if (userLevelData?.currentLevel >= 4) return 3;
    if (userLevelData?.currentLevel >= 3) return 2;
    return 1;
  };

  const getMaxAvailableEnergyBoost = () => {
    if (userLevelData?.currentLevel >= 5) return 7000;
    if (userLevelData?.currentLevel >= 4) return 4000;
    if (userLevelData?.currentLevel >= 3) return 2500;
    if (userLevelData?.currentLevel >= 2) return 1500;
    return 1000;
  };

  const maxTapBoost = getMaxAvailableTapBoost();
  const maxEnergyBoost = getMaxAvailableEnergyBoost();

  if (isBoostLoading || isLevelLoading) {
    return <SkeletonLoader />; // Unified loading state
  }

  return (
    <BoostPageContainer>
      <UserInfo />
      <Spacer />

      {/* Increase Max Energy Section */}
      <Section>
        <SectionTitle>Increase Max Energy</SectionTitle>
        <BoostOption
          selected={userBoosts.maxEnergy === 1000}
          eligible={userLevelData.currentLevel >= 0 && userBoosts.maxEnergy < 1000}
          onClick={() =>
            handleOptionClick(
              "maxEnergy",
              1000,
              0,
              "Are you sure you want to keep Max Energy at 1000?"
            )
          }
        >
          Max 1000 Energy (Level 0 or 1)
          {userBoosts.maxEnergy < 1000 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={userBoosts.maxEnergy === 1500}
          eligible={userLevelData.currentLevel >= 2 && userBoosts.maxEnergy < 1500}
          onClick={() =>
            handleOptionClick(
              "maxEnergy",
              1500,
              2,
              "Are you sure you want to increase Max Energy to 1500?"
            )
          }
        >
          Max 1500 Energy (Level 2)
          {userLevelData.currentLevel >= 2 && userBoosts.maxEnergy < 1500 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
        <BoostOption
          selected={userBoosts.maxEnergy === 2500}
          eligible={userLevelData.currentLevel >= 3 && userBoosts.maxEnergy < 2500}
          onClick={() =>
            handleOptionClick(
              "maxEnergy",
              2500,
              3,
              "Are you sure you want to increase Max Energy to 2500?"
            )
          }
        >
          Max 2500 Energy (Level 3)
          {userLevelData.currentLevel >= 3 && userBoosts.maxEnergy < 2500 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
        <BoostOption
          selected={userBoosts.maxEnergy === 4000}
          eligible={userLevelData.currentLevel >= 4 && userBoosts.maxEnergy < 4000}
          onClick={() =>
            handleOptionClick(
              "maxEnergy",
              4000,
              4,
              "Are you sure you want to increase Max Energy to 4000?"
            )
          }
        >
          Max 4000 Energy (Level 4)
          {userLevelData.currentLevel >= 4 && userBoosts.maxEnergy < 4000 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
        <BoostOption
          selected={userBoosts.maxEnergy === 7000}
          eligible={userLevelData.currentLevel >= 5 && userBoosts.maxEnergy < 7000}
          onClick={() =>
            handleOptionClick(
              "maxEnergy",
              7000,
              5,
              "Are you sure you want to increase Max Energy to 7000?"
            )
          }
        >
          Max 7000 Energy (Level 5)
          {userLevelData.currentLevel >= 5 && userBoosts.maxEnergy < 7000 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
      </Section>

      {/* Increase Points Per Tap Section */}
      <Section>
        <SectionTitle>Increase Points Per Tap</SectionTitle>
        <BoostOption
          selected={userBoosts.pointsPerTap === 1}
          eligible={userLevelData.currentLevel >= 0 && userBoosts.pointsPerTap < 1}
          onClick={() =>
            handleOptionClick(
              "pointsPerTap",
              1,
              0,
              "Are you sure you want to keep Points Per Tap at 1?"
            )
          }
        >
          1 Point Per Tap (Level 0-1-2)
          {userBoosts.pointsPerTap < 1 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={userBoosts.pointsPerTap === 2}
          eligible={userLevelData.currentLevel >= 3 && userBoosts.pointsPerTap < 2}
          onClick={() =>
            handleOptionClick(
              "pointsPerTap",
              2,
              3,
              "Are you sure you want to increase Points Per Tap to 2?"
            )
          }
        >
          2 Points Per Tap (Level 3)
          {userLevelData.currentLevel >= 3 && userBoosts.pointsPerTap < 2 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
        <BoostOption
          selected={userBoosts.pointsPerTap === 3}
          eligible={userLevelData.currentLevel >= 4 && userBoosts.pointsPerTap < 3}
          onClick={() =>
            handleOptionClick(
              "pointsPerTap",
              3,
              4,
              "Are you sure you want to increase Points Per Tap to 3?"
            )
          }
        >
          3 Points Per Tap (Level 4)
          {userLevelData.currentLevel >= 4 && userBoosts.pointsPerTap < 3 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
        <BoostOption
          selected={userBoosts.pointsPerTap === 5}
          eligible={userLevelData.currentLevel >= 5 && userBoosts.pointsPerTap < 5}
          onClick={() =>
            handleOptionClick(
              "pointsPerTap",
              5,
              5,
              "Are you sure you want to increase Points Per Tap to 5?"
            )
          }
        >
          5 Points Per Tap (Level 5)
          {userLevelData.currentLevel >= 5 && userBoosts.pointsPerTap < 5 && (
            <EligibleTag>Eligible</EligibleTag>
          )}
        </BoostOption>
      </Section>

      <ToastNotification />

      {modalData && (
        <GameUnlockModal
          message={modalData.message}
          title="Please Confirm"
          onConfirm={handleConfirmBoost}
          onCancel={() => setModalData(null)}
          loading={claimBoostMutation.isLoading}
          iconUrl="https://cdn-icons-png.flaticon.com/512/6106/6106288.png"
        />
      )}
    </BoostPageContainer>
  );
};

export default BoostsPage;
