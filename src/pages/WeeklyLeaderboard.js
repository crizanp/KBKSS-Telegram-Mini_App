import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaGamepad, FaTasks, FaUserFriends, FaRegGem } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/skeleton/SkeletonLoader"; // Keep using your SkeletonLoader component
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

// Fetching the top users data for the weekly leaderboard
const fetchWeeklyTopUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/leaderboard/weekly`);
  return response.data.slice(0, 30); // Limit to top 30 users
};

// Fetching the historical weekly winners
const fetchWeeklyWinners = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-winner`);
  return response.data; // Return historical winners
};

// Styled component for announcement box
export const AnnouncementBox = styled(Link)`
  background-color: #6023f5;
  color: #ffffff;
  padding: 12px;
  text-align: center;
  margin: 20px 0;
  display: block;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #e59420;
    transform: translateY(-2px);
  }
`;

function WeeklyLeaderboardPage() {
  // Use react-query to fetch weekly leaderboard data
  const { data: users = [], isLoading, isError } = useQuery(
    ["weeklyTopUsers"],
    fetchWeeklyTopUsers,
    {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache data for 30 minutes
      refetchOnWindowFocus: false, // Prevent automatic refetch on window focus
    }
  );

  // Use react-query to fetch historical weekly winners
  const { data: weeklyWinners = [], isLoading: isLoadingWinners, isError: isErrorWinners } = useQuery(
    ["weeklyWinners"],
    fetchWeeklyWinners,
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

  if (isError || isErrorWinners) {
    return <NoUsersMessage>Error fetching leaderboard data. Please try again later.</NoUsersMessage>;
  }

  return (
    <>
      {/* Announcement Box */}
      <AnnouncementBox to="/weekly-leaderboard">
        🎉 Weekly leaderboard is open! Click here 🎉
      </AnnouncementBox>

      {/* Earn More Container */}
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

      {/* Leaderboard Section */}
      <LeaderboardContainer>
        <PointsDisplayContainer>
          <PointsDisplay>
            <img
              src="https://i.ibb.co/pxGzrY8/leaderboard-1.png"
              alt="Leaderboard Logo"
              style={{ width: "150px", height: "150px", marginTop: "20px" }}
            />
          </PointsDisplay>
          <Top30LeaderText>Top 30 Weekly Leaders</Top30LeaderText>
        </PointsDisplayContainer>

        {isLoading ? (
          <SkeletonLoader /> // Show skeleton loader when loading
        ) : users.length === 0 ? (
          <NoUsersMessage>No users found</NoUsersMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Total (Weekly)</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <TableRow key={user.userID}>
                  <RankCell rank={index + 1}>
                    {index + 1 === 1 && (
                      <img src="https://i.ibb.co/5cZBk7J/3d-5.png" alt="First Place" />
                    )}
                    {index + 1 === 2 && (
                      <img src="https://i.ibb.co/swJQnL0/3d-6.png" alt="Second Place" />
                    )}
                    {index + 1 === 3 && (
                      <img src="https://i.ibb.co/tqBDBFv/3d-7.png" alt="Third Place" />
                    )}
                    {index + 1 > 3 && index + 1}
                  </RankCell>
                  <UserCell>
                    <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                    <span>{truncateUsername(user.username)}</span>
                  </UserCell>
                  <PointsCell>
                    <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                    {formatPoints(user.weeklyPoints)} {/* Display weeklyPoints instead of all-time points */}
                  </PointsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </LeaderboardContainer>

      {/* Past Weekly Winners Section */}
      <LeaderboardContainer>
        <PointsDisplayContainer>
          <Top30LeaderText>Past Weekly Winners</Top30LeaderText>
        </PointsDisplayContainer>

        {isLoadingWinners ? (
          <SkeletonLoader />
        ) : weeklyWinners.length === 0 ? (
          <NoUsersMessage>No past weekly winners found.</NoUsersMessage>
        ) : (
          weeklyWinners.map((winner, index) => (
            <div key={index}>
              <h3>Week {index + 1} Winner</h3>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>#</TableHeader>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Total</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {winner.topUsers.map((user, userIndex) => (
                    <TableRow key={user.userID}>
                      <RankCell rank={userIndex + 1}>{userIndex + 1}</RankCell>
                      <UserCell>
                        <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                        <span>{truncateUsername(user.username)}</span>
                      </UserCell>
                      <PointsCell>
                        <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                        {formatPoints(user.weeklyPoints)}
                      </PointsCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
        )}
      </LeaderboardContainer>
    </>
  );
}

export default WeeklyLeaderboardPage;
