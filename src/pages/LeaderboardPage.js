import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaRegGem } from "react-icons/fa"; // Import the gem icon
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
  TableRow,
  TableHeader,
  PointsDisplay,
  Table,
  PointsDisplayContainer,
  LeaderboardContainer,
  avatarImages,
  Tab,
  TabContainer,
  Top30LeaderText  
} from "../style/LeaderboardStyles";

// Styled Components
const StyledLeaderboardPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  width: 100%;
`;

const StyledTableRow = styled(TableRow)`
  background: ${({ rank }) => {
    if (rank === 1 || rank === 3) return "#2c15d354";  // Same bluish background for ranks 1 and 3
    if (rank === 2) return "#1c1c1c"; // Slightly dim background for rank 2
    return rank % 2 === 0 ? "transparent" : "#333333";  // Dark background for odd rows
  }};
  font-weight: ${({ rank }) => (rank <= 3 ? "bold" : "normal")};
  color: ${({ rank }) => (rank <= 3 ? "#fff" : "#000")};
  &:hover {
    background-color: #333333;
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    transform: scale(1.01);
  }
`;

const StyledTop3Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 40px 0;
  position: relative;
  width: 100%;
`;

const Top3Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ rank }) => (rank === 1 ? "#4CAF50" : "#2c15d354")};  // Green for rank 1, bluish for others
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  position: ${({ rank }) => (rank === 1 ? "relative" : "static")};
  order: ${({ rank }) => (rank === 2 ? 1 : rank === 1 ? 2 : 3)}; // Ensure rank 1 is in the center
  ${({ rank }) =>
    rank === 1
      ? `
      width: 120px;
      height: 220px;
      margin-top: -30px;
    `
      : `
      width: 100px;
      height: 180px;
    `}
`;

const AvatarImage = styled.img`
  width: ${({ rank }) => (rank === 1 ? "100px" : "80px")};
  height: ${({ rank }) => (rank === 1 ? "100px" : "80px")};
  border-radius: 50%;
  margin-bottom: 10px;
`;

const FullWidthContainer = styled(LeaderboardContainer)`
  width: 100%;
  max-width: 1200px;
  padding: 0;
  margin: 24px auto;
`;

const DateTabContainer = styled(TabContainer)`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  margin-top: 10px;
  padding-left: 80px;  // Add padding to ensure the leftmost tab is fully visible
  scroll-behavior: smooth;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* Hide scrollbar in IE and Edge */
  scrollbar-width: none;  /* Hide scrollbar in Firefox */
`;


// Utility function to truncate usernames (used only for non-top-3 users)
const truncateUsername = (username) => {
  if (username.length <= 5) return username;
  return `${username.slice(0, 3)}...${username.slice(-2)}`;
};

// Fetching the top 30 users for Lifetime leaderboard
const fetchTopUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
  return response.data.sort((a, b) => b.points - a.points).slice(0, 30); // Fetch top 30 users
};

// Fetching the top 10 users for Weekly leaderboard
const fetchTop10WeeklyUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/leaderboard/weekly`);
  return response.data.filter((user) => user.weeklyPoints > 0).slice(0, 10); // Fetch top 10 weekly users
};

// Fetching all the weekly data at once
const fetchAllWeeklyData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-winner/`);
  return response.data; // Assuming this returns all weeks data with top 3 users for each week
};

function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("lifetime"); // Manage active tab state
  const [selectedWeek, setSelectedWeek] = useState(null); // State for selected week
  const [weeklyData, setWeeklyData] = useState([]); // Store all weekly data
  const [weeklyTopUsers, setWeeklyTopUsers] = useState([]); // Top 3 users for a week
  const [weeks, setWeeks] = useState([]); // Available weeks

  // Fetch Lifetime leaderboard data (Top 30 users)
  const { data: users = [], isLoading: isUsersLoading, isError: isUsersError } = useQuery(
    ["topUsers"],
    fetchTopUsers,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch Weekly Top 10 leaderboard data
  const { data: top10WeeklyUsers = [], isLoading: isWeeklyLoading, isError: isWeeklyError } = useQuery(
    ["top10WeeklyUsers"],
    fetchTop10WeeklyUsers,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch all weekly data at once when component mounts
  useEffect(() => {
    const fetchWeeksData = async () => {
      try {
        const data = await fetchAllWeeklyData();
        setWeeklyData(data); // Store all the weeks data
        setWeeks(data.map((week) => week.weekStartDate)); // Extract weeks and set them
        if (data.length > 0) {
          setSelectedWeek(data[0].weekStartDate); // Set initial selected week
          setWeeklyTopUsers(data[0].topUsers); // Set initial top users for the selected week
        }
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      }
    };

    fetchWeeksData();
  }, []);

  // Update top users when selected week changes
  useEffect(() => {
    if (selectedWeek && weeklyData.length > 0) {
      const selectedWeekData = weeklyData.find(week => week.weekStartDate === selectedWeek);
      if (selectedWeekData) {
        setWeeklyTopUsers(selectedWeekData.topUsers);
      }
    }
  }, [selectedWeek, weeklyData]);

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

  // Handle rendering the Lifetime Top 30 leaderboard, with icons for ranks 1, 2, and 3
  const renderLifetimeLeaderboard = () => {
    if (isUsersLoading) {
      return <SkeletonLoader />;
    }

    if (users.length === 0) {
      return <NoUsersMessage>No users found</NoUsersMessage>;
    }

    return (
      <Table>
        <thead>
          <tr>
            <TableHeader>#</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Total $GEMS</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <StyledTableRow key={user.userID} rank={index + 1}>
              <RankCell rank={index + 1}>
                {index + 1 === 1 && <img src="https://i.ibb.co/5cZBk7J/3d-5.png" alt="First Place" />}
                {index + 1 === 2 && <img src="https://i.ibb.co/swJQnL0/3d-6.png" alt="Second Place" />}
                {index + 1 === 3 && <img src="https://i.ibb.co/tqBDBFv/3d-7.png" alt="Third Place" />}
                {index + 1 > 3 && index + 1}
              </RankCell>
              <UserCell>
                <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                <span>{truncateUsername(user.username)}</span> {/* Truncate usernames here */}
              </UserCell>
              <PointsCell>
                <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                {formatPoints(user.points)}
              </PointsCell>
            </StyledTableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  // Handle rendering the Weekly Top 10 leaderboard
  const renderWeeklyTop10Leaderboard = () => {
    if (isWeeklyLoading) {
      return <SkeletonLoader />;
    }

    if (top10WeeklyUsers.length === 0) {
      return <NoUsersMessage>No users found</NoUsersMessage>;
    }

    return (
      <Table>
        <thead>
          <tr>
            <TableHeader>#</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Weekly $GEMS</TableHeader>
          </tr>
        </thead>
        <tbody>
          {top10WeeklyUsers.map((user, index) => (
            <StyledTableRow key={user.userID} rank={index + 1}>
              <RankCell rank={index + 1}>
                {index + 1 === 1 && <img src="https://i.ibb.co/5cZBk7J/3d-5.png" alt="First Place" />}
                {index + 1 === 2 && <img src="https://i.ibb.co/swJQnL0/3d-6.png" alt="Second Place" />}
                {index + 1 === 3 && <img src="https://i.ibb.co/tqBDBFv/3d-7.png" alt="Third Place" />}
                {index + 1 > 3 && index + 1}
              </RankCell>
              <UserCell>
                <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                <span>{truncateUsername(user.username)}</span> {/* Truncate usernames here */}
              </UserCell>
              <PointsCell>
                <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                {formatPoints(user.weeklyPoints)}
              </PointsCell>
            </StyledTableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  // Handle rendering the Weekly Top 3 leaderboard for a selected week (no truncation)
  const renderWeeklyTop3Leaderboard = () => {
    if (weeklyTopUsers.length === 0) {
      return <NoUsersMessage>No users found for this week</NoUsersMessage>;
    }

    return (
      <StyledTop3Container>
        {weeklyTopUsers.map((user, index) => (
          <Top3Card key={user.userID} rank={index + 1}>
            <AvatarImage src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" rank={index + 1} />
            <span>{user.username}</span> {/* No truncation for top 3 users */}
            <PointsCell>
              <FaRegGem style={{ marginRight: "8px", color: "#fff" }} />
              {formatPoints(user.weeklyPoints)} {/* Gems and points aligned */}
            </PointsCell>
          </Top3Card>
        ))}
      </StyledTop3Container>
    );
  };

  return (
    <StyledLeaderboardPage>
      {/* Tab Navigation */}
      <TabContainer>
        <Tab active={activeTab === "lifetime"} onClick={() => setActiveTab("lifetime")}>
          Lifetime Leaderboard
        </Tab>
        <Tab active={activeTab === "weekly"} onClick={() => setActiveTab("weekly")}>
          Weekly Leaderboard
        </Tab>
      </TabContainer>

      {activeTab === "lifetime" ? (
        <FullWidthContainer>
          <PointsDisplayContainer>
            <Top30LeaderText>Top 30 Lifetime Leaders</Top30LeaderText>
          </PointsDisplayContainer>
          {isUsersError ? (
            <NoUsersMessage>Error fetching leaderboard data. Please try again later.</NoUsersMessage>
          ) : (
            renderLifetimeLeaderboard()
          )}
        </FullWidthContainer>
      ) : (
        <>
          <FullWidthContainer>
            <PointsDisplayContainer>
              <Top30LeaderText>Top 10 Weekly Leaders</Top30LeaderText>
            </PointsDisplayContainer>
            {isWeeklyError ? (
              <NoUsersMessage>Error fetching leaderboard data. Please try again later.</NoUsersMessage>
            ) : (
              renderWeeklyTop10Leaderboard()
            )}
          </FullWidthContainer>

          <FullWidthContainer>
            <PointsDisplayContainer>
              <Top30LeaderText>Top 3 Weekly Leaders</Top30LeaderText>
            </PointsDisplayContainer>
<DateTabContainer>
              {weeks.map((week) => (
                <Tab
                  key={week}
                  active={selectedWeek === week}
                  onClick={() => setSelectedWeek(week)}
                >
                  {new Date(week).toLocaleDateString()}
                </Tab>
              ))}
            </DateTabContainer>
            {renderWeeklyTop3Leaderboard()}

            
          </FullWidthContainer>
        </>
      )}
    </StyledLeaderboardPage>
  );
}

export default LeaderboardPage;
