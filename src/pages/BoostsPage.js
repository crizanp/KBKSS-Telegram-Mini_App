import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaFire, FaGem, FaArrowUp } from "react-icons/fa";
import UserInfo from "../components/UserInfo";
import { showToast } from "../components/ToastNotification";
import ToastNotification from "../components/ToastNotification";
import axios from "axios";
import { getUserID } from "../utils/getUserID";
import GameUnlockModal from "../components/GameUnlockModal";

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

const BoostButton = styled.button`
  background-color: #36a8e5;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #298dc8;
  }

  &:disabled {
    background-color: rgb(165 245 165);
    cursor: not-allowed;
    color: white;
  }
`;

const EnergyIcon = styled(FaFire)`
  color: #f39c12;
  font-size: 2rem;
`;

const TapIcon = styled(FaGem)`
  color: #36a8e5;
  font-size: 2rem;
`;

const MaxEnergyIcon = styled(FaArrowUp)`
  color: #e67e22;
  font-size: 2rem;
`;

const BoostOption = styled.button`
  background-color: ${(props) => (props.selected ? "rgb(165 245 165)" : props.loading ? "#ccc" : "#fff")};
  color: ${(props) => (props.selected ? "#000" : "#000")};
  border: ${(props) => (props.selected ? "none" : "1px solid #ccc")};
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0px;
  width: 100%;
  display: flex;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: ${(props) => (props.selected ? "rgb(165 245 165)" : "#eee")};
  }
  &:disabled {
    background-color: rgb(165 245 165);
    cursor: not-allowed;
    color: #000000;
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
  const [selectedTapBoost, setSelectedTapBoost] = useState(1);
  const [selectedEnergyBoost, setSelectedEnergyBoost] = useState(1000);
  const [userLevel, setUserLevel] = useState(0);
  const [userBoosts, setUserBoosts] = useState({ maxEnergy: 1000, pointsPerTap: 1 });
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserLevelAndBoosts = async () => {
      try {
        const userID = await getUserID();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        const userData = response.data;
        const Levelresponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
        const data = Levelresponse.data;

        // Set the user's level and first name, default to 0 if level is missing
        setUserLevel(data.currentLevel ?? 0);

        setUserBoosts({
          maxEnergy: userData.maxEnergy,
          pointsPerTap: userData.pointsPerTap,
        });
        setSelectedEnergyBoost(userData.maxEnergy);
        setSelectedTapBoost(userData.pointsPerTap);
        setLoading(false); // Disable loading after data fetch
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Disable loading in case of error
      }
    };

    fetchUserLevelAndBoosts();
  }, []);

  const handleClaimBoost = async (boostType, boostValue) => {
    try {
      const userID = await getUserID();
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-boost/${userID}`, {
        boostType,
        boostValue,
      });
      showToast(response.data.message, "success");

      if (boostType === "maxEnergy") {
        setSelectedEnergyBoost(boostValue);
        setUserBoosts((prev) => ({ ...prev, maxEnergy: boostValue }));
      } else if (boostType === "pointsPerTap") {
        setSelectedTapBoost(boostValue);
        setUserBoosts((prev) => ({ ...prev, pointsPerTap: boostValue }));
      }
    } catch (error) {
      showToast("Error claiming boost", "error");
      console.error("Error claiming boost:", error);
    }
  };

  const handleOptionClick = (boostType, boostValue, requiredLevel, toastMessage) => {
    if (userLevel >= requiredLevel) {
      setModalData({
        boostType,
        boostValue,
        requiredLevel,
        message: toastMessage,
      });
    } else {
      showToast(`You need to be level ${requiredLevel} to unlock this!`, "error");
    }
  };

  const handleConfirmBoost = () => {
    if (modalData) {
      handleClaimBoost(modalData.boostType, modalData.boostValue);
    }
    setModalData(null);
  };

  const getMaxAvailableTapBoost = () => {
    if (userLevel >= 5) return 5;
    if (userLevel >= 4) return 3;
    if (userLevel >= 3) return 2;
    return 1;
  };

  const getMaxAvailableEnergyBoost = () => {
    if (userLevel >= 5) return 7000;
    if (userLevel >= 4) return 4000;
    if (userLevel >= 3) return 2500;
    if (userLevel >= 2) return 1500;
    return 1000;
  };

  const maxTapBoost = getMaxAvailableTapBoost();
  const maxEnergyBoost = getMaxAvailableEnergyBoost();

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
          loading={loading}
          onClick={() => handleOptionClick("maxEnergy", 1000, 0, "Are you sure you want to keep Max Energy at 1000?")}
        >
          Max 1000 Energy (Level 0 or 1)
          <EligibleTag>Eligible</EligibleTag>
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 1500}
          loading={loading}
          disabled={selectedEnergyBoost === 1500}
          onClick={() => handleOptionClick("maxEnergy", 1500, 2, "Are you sure you want to increase Max Energy to 1500?")}
        >
          Max 1500 Energy (Level 2)
          {userLevel >= 2 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 2500}
          loading={loading}
          disabled={selectedEnergyBoost === 2500}
          onClick={() => handleOptionClick("maxEnergy", 2500, 3, "Are you sure you want to increase Max Energy to 2500?")}
        >
          Max 2500 Energy (Level 3)
          {userLevel >= 3 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 4000}
          loading={loading}
          disabled={selectedEnergyBoost === 4000}
          onClick={() => handleOptionClick("maxEnergy", 4000, 4, "Are you sure you want to increase Max Energy to 4000?")}
        >
          Max 4000 Energy (Level 4)
          {userLevel >= 4 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedEnergyBoost === 7000}
          loading={loading}
          disabled={selectedEnergyBoost === 7000}
          onClick={() => handleOptionClick("maxEnergy", 7000, 5, "Are you sure you want to increase Max Energy to 7000?")}
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
          loading={loading}
          onClick={() => handleOptionClick("pointsPerTap", 1, 0, "Are you sure you want to keep Points Per Tap at 1?")}
        >
          1 Point Per Tap (Level 0-1-2)
          <EligibleTag>Eligible</EligibleTag>
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 2}
          loading={loading}
          disabled={selectedTapBoost === 2}
          onClick={() => handleOptionClick("pointsPerTap", 2, 3, "Are you sure you want to increase Points Per Tap to 2?")}
        >
          2 Points Per Tap (Level 3)
          {userLevel >= 3 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 3}
          loading={loading}
          disabled={selectedTapBoost === 3}
          onClick={() => handleOptionClick("pointsPerTap", 3, 4, "Are you sure you want to increase Points Per Tap to 3?")}
        >
          3 Points Per Tap (Level 4)
          {userLevel >= 4 && <EligibleTag>Eligible</EligibleTag>}
        </BoostOption>
        <BoostOption
          selected={selectedTapBoost === 5}
          loading={loading}
          disabled={selectedTapBoost === 5}
          onClick={() => handleOptionClick("pointsPerTap", 5, 5, "Are you sure you want to increase Points Per Tap to 5?")}
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
          loading={loading}
          iconUrl="https://cdn-icons-png.flaticon.com/512/6106/6106288.png"
        />
      )}
    </BoostPageContainer>
  );
};

export default BoostsPage;
