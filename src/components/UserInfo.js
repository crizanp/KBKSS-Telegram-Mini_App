import React from 'react';
import styled from 'styled-components';
import { FaRegGem, FaBell, FaLevelUpAlt } from 'react-icons/fa'; // Import necessary icons
import { usePoints } from '../context/PointsContext';
import { Link } from 'react-router-dom';

// Main container with dark theme and compact mobile-first size
const UserInfoContainer = styled.div`
  color: white;
  background-color: #000000;  // Dark background
  padding: 10px 10px;
  border-radius: 20px;
  border: #867c7c 1px solid;
  top: 2%;
  width: 85%;  
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  font-family: 'Orbitron', sans-serif;
  animation: fadeIn 0.6s ease-in-out;  /* Wake-up animation */
`;

// Username and Level container
const UserLevelContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Username display with mobile-optimized size
const Username = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 8px;  // Space between username and level
`;

// Icon for gems
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 1.2rem;
`;

// Points container with compact styling for mobile
const PointsContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 17px;
  display: flex;
  align-items: center;
  color: white;
`;

// Level container styled next to username
const LevelContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #222;
  text-decoration: none;
  border-radius: 10px;
  padding: 6px 10px;
  margin-right: 5px;
  font-size: 13px;
  color: #ffac00;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);  // Add shadow for depth
`;

// Level icon styled for mobile
const LevelIcon = styled(FaLevelUpAlt)`
  color: #ffac00;
  font-size: 1rem;
  margin-right: 4px;
`;

// Bell icon styled smaller for mobile notification
const BellIcon = styled(FaBell)`
  color: #ffac00;
  font-size: 1.2rem;
  margin-left: 6px;
`;

// Styled Link to remove underline
const StyledLink = styled(Link)`
  text-decoration: none;  // Remove the underline
`;

// Function to calculate user level based on points
const calculateLevel = (points) => {
  return Math.floor(points / 10000) + 1;  // Level-up every 10000 points
};

const UserInfo = () => {
  const { points } = usePoints();
  
  // Get the first name from Telegram WebApp or fallback to 'User'
  let firstName = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name || 'User';
  
  // Trim the first name to the first 10 alphanumeric characters
  firstName = firstName.split(/[^\w]+/)[0].slice(0, 10);

  // Calculate the user's current level
  const userLevel = calculateLevel(points);

  return (
    <UserInfoContainer>
      {/* Display the username and level together */}
      <UserLevelContainer>
        <Username>Hi {firstName}</Username>
        {/* Apply the styled Link here */}
        <StyledLink to="/levelpage">
          <LevelContainer>
            <LevelIcon /> Lvl {userLevel}
          </LevelContainer>
        </StyledLink>
      </UserLevelContainer>

      {/* Display points and bell icon */}
      <PointsContainer>
        <GemIcon /> {Math.floor(points)} GEMS
        {/* Link to Telegram for notifications */}
        <a href="https://t.me/gemhuntersclub" target="_blank" rel="noopener noreferrer">
          <BellIcon />
        </a>
      </PointsContainer>
    </UserInfoContainer>
  );
};

export default UserInfo;
