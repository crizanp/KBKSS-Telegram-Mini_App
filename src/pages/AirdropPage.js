import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import AirdropSkeletonLoadingPage from "../components/skeleton/AirdropSkeletonLoadingPage"; // Import SkeletonLoadingPage
import { Link } from "react-router-dom";

const AirdropContainer = styled.div`
  color: white;
  padding: 20px;
  padding-bottom: 100px;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
    padding-bottom: 100px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-bottom: 100px;
  }
`;

const AirdropTitle = styled.h2`
  color: #cac9c9;
  margin-bottom: 30px;
  margin-top: 30px;
  margin-left: 10px;
  text-align: left;
  font-size: 20px;
`;

const AirdropDescription = styled.p`
  color: #aaaaaa;
  margin-bottom: 20px;
  margin-left: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
`;

const Logo = styled.img`
  width: 160px;
  height: 130px;
  margin-bottom: 10px;
  margin-top: 20px;
`;

const DescriptionText = styled.p`
  color: #ffffff;
  font-size: 20px;
  max-width: 600px;
  line-height: 1.5;
`;

const AirdropList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NoAirdropMessage = styled.p`
  color: #aaaaaa;
  text-align: center;
  margin: 20px 0;
`;

const AirdropCard = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    ${({ clickable }) =>
      clickable &&
      `
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
    `}
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const NameLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AirdropLogo = styled.img`
  width: 50px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 18%;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
`;

const AirdropName = styled.h3`
  color: #ffffff;
  font-size: 18px;
  margin-left: 10px;
  flex: 0 0 75%;
`;

const AirdropDesc = styled.p`
  font-size: 14px;
  color: #ffffff;
  margin: 0;
`;

const AirdropReward = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #4caf50;
  margin-top: 5px;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #252525;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  color: white;

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const CountdownTimer = styled.div`
  font-size: 14px;
  color: ${({ active }) => (active ? '#ffffff' : '#ffffff')};
`;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const TickingClock = styled.div`
  font-size: 20px;
  color: #ffffff;
  animation: ${blinkAnimation} 1s linear infinite;
`;

const Spacer = styled.div`
  height: 50px;
`;

const formatTime = (milliseconds) => {
  if (milliseconds > 86400000) {
    return `${Math.floor(milliseconds / 86400000)} day${Math.floor(milliseconds / 86400000) > 1 ? 's' : ''} left`;
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function AirdropPage() {
  const [airdrops, setAirdrops] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/airdrops`);
        setAirdrops(response.data);
      } catch (error) {
        console.error('Error fetching airdrop data:', error);
      } finally {
        setLoadingActive(false);
        setLoadingUpcoming(false);
        setLoadingCompleted(false);
      }
    };

    fetchAirdrops();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAirdrops((prevAirdrops) =>
        prevAirdrops.map((airdrop) => {
          const now = Date.now();
          let status = 'upcoming';
          let timeLeft = new Date(airdrop.startDate) - now;

          if (now >= new Date(airdrop.startDate) && now <= new Date(airdrop.endDate)) {
            status = 'active';
            timeLeft = new Date(airdrop.endDate) - now;
          } else if (now > new Date(airdrop.endDate)) {
            status = 'completed';
            timeLeft = 0;
          }

          return { ...airdrop, status, timeLeft };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeAirdrops = airdrops.filter(airdrop => airdrop.status === 'active');
  const upcomingAirdrops = airdrops.filter(airdrop => airdrop.status === 'upcoming');
  const completedAirdrops = airdrops.filter(airdrop => airdrop.status === 'completed');

  return (
    <AirdropContainer>
      {/* Top section with logo and description */}
      <TopSection>
        <Logo src="https://i.ibb.co/ykCTY86/airdrop.png" alt="Earn Logo" />
        <DescriptionText>
          Earn tokens by participating in exciting airdrop campaigns
        </DescriptionText>
      </TopSection>

      <AirdropDescription>
        Note: These are the campaigns run within the IGH ecosystem, distributed according to the allocated amount. Please note that these campaigns are not managed within this <Link to="/leaderboard" style={{ textDecoration: "none", color:"#aaaaaa" }}>mini app</Link>.
      </AirdropDescription>

      {/* Active Airdrops */}
      <AirdropTitle>Active Airdrops Lists</AirdropTitle>
      {loadingActive ? (
        <AirdropSkeletonLoadingPage /> // Show skeleton loader if loading
      ) : activeAirdrops.length > 0 ? (
        <AirdropList>
          {activeAirdrops.map((airdrop) => (
            <AirdropCard
              key={airdrop._id}
              clickable={true}
              onClick={() => window.open(airdrop.airdropLink, '_blank')} // Use specific link from airdrop data
            >
              <NameLogoContainer>
                <AirdropLogo src={airdrop.logo} alt={`${airdrop.name} logo`} />
                <AirdropName>{airdrop.name}</AirdropName>
              </NameLogoContainer>
              <AirdropDesc>{airdrop.description}</AirdropDesc>
              <AirdropReward>Reward: {airdrop.reward}</AirdropReward>
              <CountdownContainer>
                <CountdownTimer active={true}>
                  Ends in: {formatTime(airdrop.timeLeft)}
                </CountdownTimer>
                <TickingClock>⏳</TickingClock>
              </CountdownContainer>
            </AirdropCard>
          ))}
        </AirdropList>
      ) : (
        <NoAirdropMessage>No airdrops available for this category.</NoAirdropMessage>
      )}

      {/* Upcoming Airdrops */}
      <AirdropTitle>Upcoming Airdrops Lists</AirdropTitle>
      {loadingUpcoming ? (
        <AirdropSkeletonLoadingPage /> // Show skeleton loader if loading
      ) : upcomingAirdrops.length > 0 ? (
        <AirdropList>
          {upcomingAirdrops.map((airdrop) => (
            <AirdropCard
              key={airdrop._id}
              clickable={false}
            >
              <NameLogoContainer>
                <AirdropLogo src={airdrop.logo} alt={`${airdrop.name} logo`} />
                <AirdropName>{airdrop.name}</AirdropName>
              </NameLogoContainer>
              <AirdropDesc>{airdrop.description}</AirdropDesc>
              <AirdropReward>Reward: {airdrop.reward}</AirdropReward>
              <CountdownContainer>
                <CountdownTimer active={false}>
                  Starts in: {formatTime(airdrop.timeLeft)}
                </CountdownTimer>
                <TickingClock>⏳</TickingClock>
              </CountdownContainer>
            </AirdropCard>
          ))}
        </AirdropList>
      ) : (
        <NoAirdropMessage>No upcoming airdrops available.</NoAirdropMessage>
      )}

      {/* Completed Airdrops */}
      <AirdropTitle>Completed Airdrops Lists</AirdropTitle>
      {loadingCompleted ? (
        <AirdropSkeletonLoadingPage /> // Show skeleton loader if loading
      ) : completedAirdrops.length > 0 ? (
        <AirdropList>
          {completedAirdrops.map((airdrop) => (
            <AirdropCard key={airdrop._id} clickable={false}>
              <NameLogoContainer>
                <AirdropLogo src={airdrop.logo} alt={`${airdrop.name} logo`} />
                <AirdropName>{airdrop.name}</AirdropName>
              </NameLogoContainer>
              <AirdropDesc>{airdrop.description}</AirdropDesc>
              <AirdropReward>Reward: {airdrop.reward}</AirdropReward>
              <CountdownContainer>
                <CountdownTimer active={false}>Completed</CountdownTimer>
              </CountdownContainer>
            </AirdropCard>
          ))}
        </AirdropList>
      ) : (
        <NoAirdropMessage>No completed airdrops available.</NoAirdropMessage>
      )}

      <Spacer />
    </AirdropContainer>
  );
}

export default AirdropPage;
