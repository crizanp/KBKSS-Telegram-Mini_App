import React, { useState } from "react";
import styled from "styled-components";
import Avatar1 from "../assets/avatar/1.png";
import Avatar2 from "../assets/avatar/2.png";
import Avatar3 from "../assets/avatar/3.png";
import Avatar4 from "../assets/avatar/4.png";
import Avatar5 from "../assets/avatar/5.png";
import Avatar6 from "../assets/avatar/6.png";
import Avatar7 from "../assets/avatar/7.png";
import Avatar8 from "../assets/avatar/8.png";
import Avatar9 from "../assets/avatar/9.png";
import Avatar10 from "../assets/avatar/10.png";
import UserInfo from "../components/UserInfo";
import { FaRegGem } from 'react-icons/fa';

// Styled Components for the Avatar Selection
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  color: #f0f0f0; /* Light color for text visibility */
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 86px;
  }
`;
// Icon for gems
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 1.2rem;
`;
const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const LeftSection = styled.div`
  width: 25%;
  max-height: 496px;
  overflow-y: auto;
  padding-right: 20px;
  @media (max-width: 768px) {
    width: 30%;
  }
`;

const AvatarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const RightSection = styled.div`
  width: 70%;
  height: 496px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #1c1c1c; /* Dark background to highlight the avatar */
  @media (max-width: 768px) {
    width: 65%;
    height: auto;
  }
`;

const AvatarCard = styled.div`
  border: ${(props) => (props.isLocked ? "2px solid grey" : "2px solid gold")};
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: ${(props) => (props.isLocked ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isLocked ? 0.6 : 1)};
  transition: transform 0.3s ease;
  color: white;

  &:hover {
    transform: ${(props) => (props.isLocked ? "none" : "scale(1.05)")};
  }
`;

const AvatarImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-bottom: 5px;
`;

const CurrentAvatarImage = styled.img`
  width: 100%;
  height: 300px; /* Make the image portrait-shaped */
  object-fit: cover;
  border-radius: 10px; /* Optional border radius for a cleaner look */
  margin-bottom: 10px;
`;

const AvatarInfo = styled.div`
  font-size: 18px;
  color: #d2d2d2;
`;

const Title = styled.h3`
  font-size: 28px; /* Bigger title */
  margin: 10px 0;
  color: #d2d2d2; /* White text for clarity */
`;

const GemsDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #00aaff; /* Blue color for the GEMS icon */
  margin-bottom: 10px;
`;

const GemsIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const LevelDisplay = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #00bfff;
`;

const MoreAvatarsSection = styled.div`
  margin-top: 30px;
`;

const MoreAvatarsTitle = styled.h3`
  text-align: center;
  color: #d2d2d2;
  margin-bottom: 15px;
`;

const MoreAvatarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  overflow-x: scroll;
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Mock data for avatars
const avatars = [
  { id: 1, name: "Eagle Warrior", level: 1, gems: 1000, image: Avatar1 },
  { id: 2, name: "Falcon Knight", level: 2, gems: 5000, image: Avatar2 },
  { id: 3, name: "Phoenix King", level: 5, gems: 10000, image: Avatar3 },
  { id: 4, name: "Dragon Lord", level: 10, gems: 20000, image: Avatar4 },
  { id: 5, name: "Tiger King", level: 3, gems: 3000, image: Avatar5 },
  { id: 6, name: "Lion Heart", level: 4, gems: 6000, image: Avatar6 },
  { id: 7, name: "Bear Guardian", level: 7, gems: 12000, image: Avatar7 },
  { id: 8, name: "Wolf Slayer", level: 6, gems: 8000, image: Avatar8 },
  { id: 9, name: "Panther Shadow", level: 8, gems: 15000, image: Avatar9 },
  { id: 10, name: "Griffin King", level: 9, gems: 18000, image: Avatar10 },
  // Add more avatars as needed
];

const AvatarSelection = () => {
  const [points, setPoints] = useState(15000); // Static points (GEMS) for user
  const [level, setLevel] = useState(5); // Static user level
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]); // Default to the first avatar

  // Function to handle avatar selection
  const handleAvatarSelect = (avatar) => {
    if (points >= avatar.gems && level >= avatar.level) {
      setSelectedAvatar(avatar);
    } else {
      alert("You do not meet the requirements to select this avatar.");
    }
  };

  return (
    <Container>
      <UserInfo />
      {/* Top Section with main showcase */}
      <TopSection>
        {/* Left Section - Avatar List */}
        <LeftSection>
          <AvatarList>
            {avatars.slice(0, 3).map((avatar) => {
              const isLocked = level < avatar.level || points < avatar.gems;
              return (
                <AvatarCard
                  key={avatar.id}
                  isLocked={isLocked}
                  onClick={() => !isLocked && handleAvatarSelect(avatar)}
                >
                  <AvatarImage src={avatar.image} alt={avatar.name} />
                  <div>{avatar.name}</div>
                </AvatarCard>
              );
            })}
          </AvatarList>
        </LeftSection>

        {/* Right Section - Current Avatar */}
        <RightSection>
          <CurrentAvatarImage
            src={selectedAvatar.image}
            alt={selectedAvatar.name}
          />
          <AvatarInfo>
            <Title>{selectedAvatar.name}</Title>
            <GemsDisplay>
            <GemIcon />
              {selectedAvatar.gems}
            </GemsDisplay>
            <LevelDisplay>Level: {selectedAvatar.level}</LevelDisplay>
          </AvatarInfo>
        </RightSection>
      </TopSection>

      {/* More Avatars Section */}
      <MoreAvatarsSection>
        <MoreAvatarsTitle>More Avatars</MoreAvatarsTitle>
        <MoreAvatarsGrid>
          {avatars.map((avatar) => {
            const isLocked = level < avatar.level || points < avatar.gems;
            return (
              <AvatarCard
                key={avatar.id}
                isLocked={isLocked}
                onClick={() => !isLocked && handleAvatarSelect(avatar)}
              >
                <AvatarImage src={avatar.image} alt={avatar.name} />
                <div>{avatar.name}</div>
              </AvatarCard>
            );
          })}
        </MoreAvatarsGrid>
      </MoreAvatarsSection>
    </Container>
  );
};

export default AvatarSelection;
