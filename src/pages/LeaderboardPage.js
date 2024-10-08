import React, { useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import { FaGamepad, FaTasks, FaUserFriends, FaRegGem } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/skeleton/SkeletonLoader";
import {
  EarnBoxTitle,
  EarnBoxIcon,
  EarnBox,
  EarnMoreContainer,
  NoUsersMessage,
  UserAvatar,
  PointsCell,
  UserCell,
  RankCell,
  Top30LeaderText,
  TableRow,
  TableHeader,
  PointsDisplay,
  Table,
  PointsDisplayContainer,
  LeaderboardContainer,
  avatarImages,
} from "../style/LeaderboardStyles";

// Styled component for Tabs container
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

// Styled component for each Tab
const Tab = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  background-color: ${(props) => (props.active ? "#36a8e5" : "#f1f1f1")};
  color: ${(props) => (props.active ? "#ffffff" : "#000000")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#36a8e5" : "#d9d9d9")};
  }
`;

// Fetching the top users data for Lifetime leaderboard
const fetchTopUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
  return response.data.sort((a, b) => b.points - a.points).slice(0, 30);
};

// Fetching the top users data for Weekly leaderboard
const fetchWeeklyTopUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/leaderboard/weekly`);
  return response.data.filter((user) => user.weeklyPoints > 0).slice(0, 10); // Filter out users with 0 points
};

function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("lifetime");

  // Fetch Lifetime leaderboard data
  const { data: users = [], isLoading, isError } = useQuery(["topUsers"], fetchTopUsers, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  // Fetch Weekly leaderboard data
  const { data: weeklyUsers = [], isLoading: isWeeklyLoading, isError: isWeeklyError } = useQuery(
    ["weeklyTopUsers"],
    fetchWeeklyTopUsers,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    }
  );

  // Function to truncate the username if too long
  const truncateUsername = (username) => {
    if (username.length <= 5) return username;
    return `${username.slice(0, 3)}...${username.slice(-2)}`;
  };

  // Utility function to format points with K and M for large numbers
  const formatPoints = (points) => {
    if (points >= 1000000) {
      return (points / 1000000).toFixed(2) + "M";
    } else if (points >= 1000) {
      return (points / 1000).toFixed(2) + "K";
    } else {
      return points.toFixed(0);
    }
  };

  // Handle tab switching
  const renderLeaderboard = () => {
    if (isLoading || isWeeklyLoading) {
      return <SkeletonLoader />;
    }

    if ((activeTab === "lifetime" && users.length === 0) || (activeTab === "weekly" && weeklyUsers.length === 0)) {
      return <NoUsersMessage>No users found</NoUsersMessage>;
    }

    const leaderboardData = activeTab === "lifetime" ? users : weeklyUsers;
    return (
      <Table>
        <thead>
          <tr>
            <TableHeader>#</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>{activeTab === "lifetime" ? "Total" : "Weekly"} $GEMS</TableHeader>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <TableRow key={user.userID}>
              <RankCell rank={index + 1}>
                {index + 1 === 1 && <img src="https://i.ibb.co/5cZBk7J/3d-5.png" alt="First Place" />}
                {index + 1 === 2 && <img src="https://i.ibb.co/swJQnL0/3d-6.png" alt="Second Place" />}
                {index + 1 === 3 && <img src="https://i.ibb.co/tqBDBFv/3d-7.png" alt="Third Place" />}
                {index + 1 > 3 && index + 1}
              </RankCell>
              <UserCell>
                <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                <span>{truncateUsername(user.username)}</span>
              </UserCell>
              <PointsCell>
                <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                {formatPoints(activeTab === "lifetime" ? user.points : user.weeklyPoints)}
              </PointsCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      {/* Tab Navigation */}
      <TabContainer>
        <Tab active={activeTab === "lifetime"} onClick={() => setActiveTab("lifetime")}>
          Lifetime Leaderboard
        </Tab>
        <Tab active={activeTab === "weekly"} onClick={() => setActiveTab("weekly")}>
          Weekly Leaderboard
        </Tab>
      </TabContainer>

      {/* Leaderboard Content */}
      <LeaderboardContainer>
        <PointsDisplayContainer>
          <PointsDisplay>
            <img
              src="https://i.ibb.co/pxGzrY8/leaderboard-1.png"
              alt="Leaderboard Logo"
              style={{ width: "150px", height: "150px", marginTop: "20px" }}
            />
          </PointsDisplay>
          <Top30LeaderText>Top {activeTab === "lifetime" ? "30 Lifetime" : "10 Weekly"} Leaders</Top30LeaderText>
        </PointsDisplayContainer>
        {isError || isWeeklyError ? (
          <NoUsersMessage>Error fetching leaderboard data. Please try again later.</NoUsersMessage>
        ) : (
          renderLeaderboard()
        )}
      </LeaderboardContainer>
      
    </>
  );
}

export default LeaderboardPage;
