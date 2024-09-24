import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import {
  FaGamepad,
  FaTasks,
  FaUserFriends,
  FaCoins,
  FaRegGem,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import SkeletonLoader from "./SkeletonLoader"; // Import the SkeletonLoader component

const telegramColor = "#0088cc"; // Telegram color (blue)

// Dynamically import all avatar images
const avatarImages = {};
for (let i = 1; i <= 20; i++) {
  avatarImages[i] = require(`../assets/avatar/${i}.png`);
}

const LeaderboardContainer = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron',sans-serif;
  overflow-x: hidden;
  padding-bottom: 60px;
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PointsDisplay = styled.div`
user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: auto;

  @media (max-width: 768px) {
    display: table;
    overflow-x: auto;
  }
`;

const TableHeader = styled.th`
  background-color: #2a2a2a;
  color: #e8e7e4;
  padding: 12px;
  border-bottom: 2px solid #e8e7e4;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:hover {
    background-color: #333333;
    transition: background-color 0.3s ease-in-out;
  }
`;

// New styled component for "Top 30 Leader" text
const Top30LeaderText = styled.h1`
  font-size: 36px;
  color:#e1ecf2;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
`;

const RankCell = styled.td`
  width: 20%;
  padding: 8px;
  color: #e8e7e4;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  position: relative;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */

  ${({ rank }) =>
    rank === 1 &&
    css`
      background: none; /* Remove the background */
      img {
        width: 40px; /* Adjust size accordingly */
        height: 40px;
      }
    `}

  ${({ rank }) =>
    rank === 2 &&
    css`
      background: none; /* Remove the background */
      img {
        width: 40px; /* Adjust size accordingly */
        height: 40px;
      }
    `}

  ${({ rank }) =>
    rank === 3 &&
    css`
      background: none; /* Remove the background */
      img {
        width: 40px; /* Adjust size accordingly */
        height: 40px;
      }
    `}

  ${({ rank }) =>
    rank > 3 &&
    css`
      color: #e8e7e4;
      font-size: 18px;
      text-align: center;
    `}
`;

const UserCell = styled.td`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;
  flex-direction: row;
  justify-content: left;
`;

const PointsCell = styled.td`
  width: 30%;
  padding: 12px;
  color: #d5dbd7;
  font-weight: bold;
  font-size: 18px;
  text-align: left;

  span {
    display: inline-block;
    vertical-align: middle; /* Align crown and points text to the middle */
    line-height: normal;
  }
`;

const UserAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 8px;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
`;

const NoUsersMessage = styled.div`
  color: #e8e7e4;
  margin-top: 20px;
  font-size: 18px;
`;

const EarnMoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 40px;
  background-color: #292929;
  -webkit-user-select: none; 
  -webkit-touch-callout: none; 
`;

const EarnBox = styled(Link)`
  background-color: #1e1e1e;
  border: 2px solid ${telegramColor}; /* Use Telegram color for border */
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 150px;
  color: #e8e7e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  height: 85px; /* Set a fixed height to ensure all boxes are the same */
  flex-grow: 1;
  text-decoration: none;

  &:hover {
    background-color: #333333;
  }
`;

const EarnBoxIcon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
  color: white;
`;

const EarnBoxTitle = styled.h2`
  font-size: 14px;
  text-transform: uppercase;
`;

function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/fetchdata`
        );
        const sortedUsers = response.data
          .sort((a, b) => b.points - a.points)
          .slice(0, 30); // Top 20 users
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchTopUsers();
  }, []);
// Function to truncate the username
const truncateUsername = (username) => {
  if (username.length <= 5) {
    return username; // No need to truncate if username is too short
  }
  return `${username.slice(0, 3)}...${username.slice(-2)}`;
};
// Utility function to format points with K and M
const formatPoints = (points) => {
  if (points >= 1000000) {
    return (points / 1000000).toFixed(2) + "M";
  } else if (points >= 1000) {
    return (points / 1000).toFixed(2) + "K";
  } else {
    return points.toFixed(0); // Return the full number for points below 1000
  }
};

  return (
    <LeaderboardContainer>
      <EarnMoreContainer>
        <EarnBox to="/home">
          <EarnBoxIcon>
            <FaGamepad />
          </EarnBoxIcon>
          <EarnBoxTitle>Play Game</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/earn">
          <EarnBoxIcon>
            <FaTasks />
          </EarnBoxIcon>
          <EarnBoxTitle>Complete Task</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/friend">
          <EarnBoxIcon>
            <FaUserFriends />
          </EarnBoxIcon>
          <EarnBoxTitle>Refer Friends</EarnBoxTitle>
        </EarnBox>
      </EarnMoreContainer>

      <PointsDisplayContainer id="pointsDisplay">
        <PointsDisplay>
          <img
            src="https://i.ibb.co/pxGzrY8/leaderboard-1.png"
            alt="Leaderboard Logo"
            style={{
              width: "150px",
              height: "150px",
              marginTop: "20px",
            }}
          />
        </PointsDisplay>
         {/* Top 30 Leader text */}
         <Top30LeaderText>Top 30 Leader</Top30LeaderText>
      </PointsDisplayContainer>

      {isLoading ? (
        <SkeletonLoader /> // Show skeleton loader
      ) : users.length === 0 ? (
        <NoUsersMessage>No users found</NoUsersMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader style={{ textAlign: "center" }}>#</TableHeader>
              <TableHeader>Username</TableHeader> {/* Changed from User ID to Username */}
              <TableHeader style={{ textAlign: "center" }}>Total</TableHeader>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <TableRow key={user.userID}>
                <RankCell rank={index + 1}>
                  {index + 1 === 1 && (
                    <img
                      src="https://i.ibb.co/5cZBk7J/3d-5.png"
                      alt="First Place"
                    />
                  )}
                  {index + 1 === 2 && (
                    <img
                      src="https://i.ibb.co/swJQnL0/3d-6.png"
                      alt="Second Place"
                    />
                  )}
                  {index + 1 === 3 && (
                    <img
                      src="https://i.ibb.co/tqBDBFv/3d-7.png"
                      alt="Third Place"
                    />
                  )}
                  {index + 1 > 3 && index + 1} {/* Display rank for other users */}
                </RankCell>
                <UserCell>
                  <UserAvatar
                    src={avatarImages[(user.userID % 20) + 1]} // This can still use userID for avatar, or switch to username logic if needed
                    alt="User Avatar"
                  />
                  <span>{truncateUsername(user.username)}</span>
                  </UserCell>
                <PointsCell>
                  <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                  {formatPoints(user.points)}
                </PointsCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </LeaderboardContainer>
  );
}

export default LeaderboardPage;
