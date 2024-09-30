import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaFire, FaGem, FaArrowUp } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { showToast } from "./ToastNotification";
import ToastNotification from "./ToastNotification"; // Import ToastNotification
import axios from "axios";
import { getUserID } from "../utils/getUserID";
import GameUnlockModal from "./GameUnlockModal"; // Import GameUnlockModal

// Main container for the page
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

// Section container for each boost type
const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  text-align: center;
`;

// Title of each section
const SectionTitle = styled.h2`
  color: #e1e8eb;
  font-size: 1.8rem;
  margin-bottom: 15px;
`;

// Button styles for boost actions
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
    background-color: rgb(5 255 5 / 28%);
    cursor: not-allowed;
    color: white;
  }
`;

// Icons and points display
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

// Boost option style, where selected option has greenish dim background if it's the highest available
const BoostOption = styled.button`
  background-color: ${(props) => (props.isAvailable ? "rgba(0, 128, 0, 0.5)" : "#fff")};
  color: ${(props) => (props.isAvailable ? "#fff" : "#000")};
  border: ${(props) => (props.isAvailable ? "none" : "1px solid #ccc")};
  border-radius: 8px;
  padding: 10px;
  margin: 5px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isAvailable ? "rgba(0, 128, 0, 0.5)" : "#eee")};
  }

  &:disabled {
    background-color: rgb(5 255 5 / 28%);
    cursor: not-allowed;
    color: white;
  }
`;

// Spacer and settings icon
const Spacer = styled.div`
  height: 60px;
`;

// const SettingsIcon = styled(FaCog)`
//   position: absolute;
//   bottom: 20px;
//   right: 20px;
//   font-size: 2.5rem;
//   color: #fff;
//   cursor: pointer;
// `;

const BoostsPage = () => {
  const [selectedTapBoost, setSelectedTapBoost] = useState(1); // Tap boost selection
  const [selectedEnergyBoost, setSelectedEnergyBoost] = useState(1000); // Max energy level selection
  const [userLevel, setUserLevel] = useState(5); // User's current level (set to 5 for testing)
  const [modalData, setModalData] = useState(null); // To manage modal data
  const [loading, setLoading] = useState(false); // Loading state for modal button

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const userID = await getUserID(() => {}, () => {});
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
        const data = response.data;

        // Set the user's level, default to 0 if level is missing
        setUserLevel(data);
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    fetchUserLevel();
  }, []);

  // Get the highest available energy and tap boost based on the user's level
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

  // Highest available boost for the current user
  const maxTapBoost = getMaxAvailableTapBoost();
  const maxEnergyBoost = getMaxAvailableEnergyBoost();

  // Handle Modal Confirmation
  const handleConfirm = () => {
    setLoading(true);

    setTimeout(() => {
      if (modalData) {
        const { action, value, requiredLevel, toastMessage } = modalData;
        if (userLevel >= requiredLevel) {
          action(value); // Apply the action (e.g., set selected energy boost or tap boost)
          showToast(toastMessage, "success");
        } else {
          showToast(`You need to be level ${requiredLevel} to unlock this!`, "error");
        }
      }
      setLoading(false);
      setModalData(null); // Close modal
    }, 1000);
  };

  // Open modal for "Boost Energy Now" button
  const handleBoostEnergyClick = () => {
    openModal(setSelectedEnergyBoost, 1000, 0, "Boost your energy now?", "Energy Boost successful!");
  };

  // Open modal only for eligible boosts, show toast for others
  const handleOptionClick = (action, value, requiredLevel, message, toastMessage) => {
    if (userLevel >= requiredLevel) {
      // Show modal for eligible option
      openModal(action, value, requiredLevel, message, toastMessage);
    } else {
      // Show toast message for ineligible options
      showToast(`You need to be level ${requiredLevel} to unlock this!`, "error");
    }
  };

  // Show modal to confirm action (only for eligible boosts)
  const openModal = (action, value, requiredLevel, message, toastMessage) => {
    setModalData({
      action,
      value,
      requiredLevel,
      message,
      toastMessage,
    });
  };

  return (
    <BoostPageContainer>
      <UserInfo />
      <Spacer />

      {/* Boost Energy Section */}
      <Section>
        <SectionTitle>Boost Energy</SectionTitle>
        <EnergyIcon />
        {/* Always show modal for boosting energy */}
        <BoostButton onClick={handleBoostEnergyClick}>Boost Energy Now</BoostButton>
      </Section>

      {/* Increase Max Energy Section */}
      <Section>
        <SectionTitle>Increase Max Energy</SectionTitle>
        <MaxEnergyIcon />
        {/* Non-clickable default 1000 energy option */}
        <BoostOption disabled={selectedEnergyBoost === 1000}>
          Max 1000 Energy (Level 0 or 1)
        </BoostOption>
        <BoostOption
          isAvailable={maxEnergyBoost === 1500}
          disabled={selectedEnergyBoost === 1500}
          onClick={() => handleOptionClick(setSelectedEnergyBoost, 1500, 2, "Are You Sure Want To Increase Max Energy to 1500?", "Max Energy increased to 1500!")}
        >
          Max 1500 Energy (Level 2)
        </BoostOption>
        <BoostOption
          isAvailable={maxEnergyBoost === 2500}
          disabled={selectedEnergyBoost === 2500}
          onClick={() => handleOptionClick(setSelectedEnergyBoost, 2500, 3, "Are You Sure Want To Increase Max Energy to 2500?", "Max Energy increased to 2500!")}
        >
          Max 2500 Energy (Level 3)
        </BoostOption>
        <BoostOption
          isAvailable={maxEnergyBoost === 4000}
          disabled={selectedEnergyBoost === 4000}
          onClick={() => handleOptionClick(setSelectedEnergyBoost, 4000, 4, "Are You Sure Want To Increase Max Energy to 4000?", "Max Energy increased to 4000!")}
        >
          Max 4000 Energy (Level 4)
        </BoostOption>
        <BoostOption
          isAvailable={maxEnergyBoost === 7000}
          disabled={selectedEnergyBoost === 7000}
          onClick={() => handleOptionClick(setSelectedEnergyBoost, 7000, 5, "Are You Sure Want To Increase Max Energy to 7000?", "Max Energy increased to 7000!")}
        >
          Max 7000 Energy (Level 5)
        </BoostOption>
      </Section>

      {/* Increase Points Per Tap Section */}
      <Section>
        <SectionTitle>Increase Points Per Tap</SectionTitle>
        <TapIcon />
        {/* Non-clickable default 1 Point Per Tap option */}
        <BoostOption disabled={selectedTapBoost === 1}>
          1 Point Per Tap (Level 0-1-2)
        </BoostOption>
        <BoostOption
          isAvailable={maxTapBoost === 2}
          disabled={selectedTapBoost === 2}
          onClick={() => handleOptionClick(setSelectedTapBoost, 2, 3, "Are You Sure Want To Increase Points Per Tap to 2?", "2 Points Per Tap unlocked!")}
        >
          2 Points Per Tap (Level 3)
        </BoostOption>
        <BoostOption
          isAvailable={maxTapBoost === 3}
          disabled={selectedTapBoost === 3}
          onClick={() => handleOptionClick(setSelectedTapBoost, 3, 4, "Are You Sure Want To Increase Points Per Tap to 3?", "3 Points Per Tap unlocked!")}
        >
          3 Points Per Tap (Level 4)
        </BoostOption>
        <BoostOption
          isAvailable={maxTapBoost === 5}
          disabled={selectedTapBoost === 5}
          onClick={() => handleOptionClick(setSelectedTapBoost, 5, 5, "Are You Sure Want To Increase Points Per Tap to 5?", "5 Points Per Tap unlocked!")}
        >
          5 Points Per Tap (Level 5)
        </BoostOption>
      </Section>

      {/* <SettingsIcon /> */}
      <ToastNotification /> {/* Ensure that toast notifications are shown */}

      {/* GameUnlockModal, shown if modalData is not null */}
      {modalData && (
        <GameUnlockModal
          message={modalData.message}
          title="Please Confirm"
          onConfirm={handleConfirm}
          onCancel={() => setModalData(null)}
          loading={loading}
          iconUrl="https://cdn-icons-png.flaticon.com/512/6106/6106288.png" // Replace with actual icon path
        />
      )}
    </BoostPageContainer>
  );
};

export default BoostsPage;
