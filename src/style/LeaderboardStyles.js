import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const telegramColor = "#36a8e5"; // Telegram blue color

// Dynamically import all avatar images
export const avatarImages = {};
for (let i = 1; i <= 20; i++) {
  avatarImages[i] = require(`../assets/avatar/${i}.png`);
}

// Leaderboard main container
export const LeaderboardContainer = styled.div`
  background: linear-gradient(135deg, #1e1e1e, #343434); // Dark gradient background
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', sans-serif; // Futuristic font
  padding-bottom: 60px;
  padding: 0 20px; // Horizontal padding
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0 10px; // Adjust padding for mobile
  }
`;

// Points display container for the leaderboard image
export const PointsDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// Announcement Box for weekly leaderboard with hover effect
export const AnnouncementBox = styled(Link)`
  background-color: #36a8e5; // Purple background
  color: #ffffff;
  padding: 14px;
  text-align: center;
  margin: 20px auto; // Centered margin
  display: block;
  font-size: 20px; // Large font for announcements
  font-weight: bold;
  width: 90%; // Adjust width for responsiveness
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); // Subtle shadow
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #36a8e5; // Darker shade on hover
    transform: translateY(-3px); // Hover effect with slight movement
  }

  @media (max-width: 768px) {
    width: 100%; // Full width on small screens
  }
`;

// Table for displaying leaderboard
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed; // Consistent column width

  @media (max-width: 768px) {
    overflow-x: auto; // Horizontal scrolling for small screens
    display: block;
    white-space: nowrap; // Prevent wrapping on smaller screens
  }
`;

// Table header styling
export const TableHeader = styled.th`
  background-color: #2a2a2a; // Dark header background
  color: #e8e7e4; // Light text for readability
  padding: 12px;
  border-bottom: 2px solid #e8e7e4;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  width: 33.33%; // Equal width for each column
`;

// Styling for individual table rows with hover effect
export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e; // Alternating row color
  }
  &:hover {
    background-color: #333333;
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    transform: scale(1.01); // Slight scale-up on hover
  }
`;

// Title for "Top 30 Leaders" section
export const Top30LeaderText = styled.h1`
  font-size: 24px;
  color: #e1ecf2;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); // Subtle shadow effect
`;

// Rank cell in the leaderboard table (handles top 3 positions with images)
export const RankCell = styled.td`
  width: 15%; // Adjust based on your preference
  padding: 8px;
  color: #e8e7e4;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  user-select: none;
  pointer-events: none;

  ${({ rank }) =>
    rank <= 3 &&
    css`
      background: none;
      img {
        width: 40px;
        height: 40px;
      }
    `}
`;

// Cell displaying user information (avatar and truncated username)
export const UserCell = styled.td`
  width: 55%; // More space for user details
  display: flex;
  align-items: center;
  padding: 10px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;

  span {
    margin-left: 8px; // Space between avatar and username
  }
`;

// Cell displaying points in the leaderboard
export const PointsCell = styled.td`
  width: 30%; // Adjusted for consistent width
  padding: 12px;
  color: #d5dbd7;
  font-weight: bold;
  font-size: 18px;
  text-align: left;

  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
  }

  svg {
    margin-right: 8px;
    color: #36a8e5; // Blue accent color for points icon
  }
`;

// Avatar image styling in the leaderboard
export const UserAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%; // Round avatars
  margin-right: 8px;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
`;

// Message when no users are found
export const NoUsersMessage = styled.div`
  color: #e8e7e4;
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
`;

// Container for the "Earn More" section
export const EarnMoreContainer = styled.div`
  display: flex;
  justify-content: space-around; // Evenly distribute items
  align-items: center;
  padding: 15px;
  margin-top: 40px; // Space above the container
  background-color: #292929;
  border-radius: 8px;

  
`;

// Earn Box styling (Play Game, Complete Task, Refer Friends)
export const EarnBox = styled(Link)`
  background-color: #1e1e1e;
  border: 2px solid ${telegramColor}; // Telegram color border
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 150px;
  color: #e8e7e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  height: 85px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); // Subtle shadow

  &:hover {
    background-color: ${telegramColor}; // Background changes on hover
    color: white;
    transform: translateY(-2px); // Subtle hover effect
  }

  @media (max-width: 768px) {
    width: 100%; // Full width on mobile
  }
`;

// Icon inside the Earn Box
export const EarnBoxIcon = styled.div`
  font-size: 26px; // Large icon
  margin-bottom: 5px;
  color: white;
`;

// Title inside the Earn Box
export const EarnBoxTitle = styled.h2`
  font-size: 16px; // Slightly larger font for titles
  text-transform: uppercase;
  font-weight: bold;
`;
// Add this to LeaderboardStyles.js
export const PointsDisplay = styled.div`
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
  text-align: center; // Optional, adjust as per your layout
  margin-top: 20px;   // Optional, add margin for spacing if needed
`;
