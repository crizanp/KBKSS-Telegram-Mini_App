import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FaTasks, FaGamepad, FaUserFriends, FaEdit } from 'react-icons/fa';
import { useUserInfo } from '../context/UserInfoContext'; // To fetch user data
import { getUserID } from '../utils/getUserID'; // To fetch Telegram user ID

// Skeleton animation
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Styled components for skeleton
const Skeleton = styled.div`
  background: #ddd;
  background-image: linear-gradient(90deg, #ddd 25%, #e1e1e1 50%, #ddd 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonProfileImage = styled(Skeleton)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  position: absolute;
  bottom: -60px;
`;

const SkeletonText = styled(Skeleton)`
  height: 20px;
  width: 120px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const SkeletonStatBox = styled(Skeleton)`
  width: 60px;
  height: 30px;
  border-radius: 5px;
`;

const ProfilePageContainer = styled.div`
  background-color: #f0f4f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Orbitron', sans-serif;
`;

const TopSection = styled.div`
  background-color: #36a8e5;
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 20px 20px;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  position: absolute;
  bottom: -60px;
`;

const InfoSection = styled.div`
  margin-top: 80px;
  width: 90%;
  max-width: 500px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const UsernameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const UsernameText = styled.h2`
  font-size: 22px;
  margin-right: 10px;
  color: #333;
`;

const EditIcon = styled(FaEdit)`
  color: #36a8e5;
  cursor: pointer;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  width: 30%;
`;

const StatNumber = styled.h3`
  font-size: 22px;
  margin: 5px 0;
  color: #ffac00;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #555;
`;

const UpdateButton = styled.button`
  background-color: #36a8e5;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2d94cf;
  }
`;

const ProfilePage = () => {
  const { firstName, username } = useUserInfo(); // Fetch user info from context
  const [tgUserID, setTgUserID] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [userLevelData, setUserLevelData] = useState(null); // To store user level data
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [showEdit, setShowEdit] = useState(false); // Toggle for username editing

  // Default image URL when no profile image is available
  const fallbackImageUrl = "https://i.postimg.cc/Y0gbLtnc/5.png";

  // Fetch Telegram user ID, profile photo, and user level data
  useEffect(() => {
    const fetchTelegramUserInfo = async () => {
      setIsLoading(true); // Start loading
      const userID = await getUserID(setTgUserID);
      setTgUserID(userID);

      // Fetch Telegram profile photo via backend API
      if (userID) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/telegram-verify/getProfilePhoto`,
            { userID },
            {
              responseType: 'blob', // Ensure the response is handled as a binary blob
            }
          );

          if (response.data.size > 0) {
            // Create a URL for the blob object to display it in the img tag
            const imageUrl = URL.createObjectURL(response.data);
            setProfileImageUrl(imageUrl);
          } else {
            // Use fallback image if no profile image is available
            setProfileImageUrl(fallbackImageUrl);
          }
        } catch (error) {
          // Handle errors gracefully
          console.error('Error fetching profile photo:', error);
          setProfileImageUrl(fallbackImageUrl); // Use fallback image on error
        }
      }

      setIsLoading(false); // End loading
    };

    const fetchUserLevelData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${tgUserID}`);
        setUserLevelData(response.data); // Store the user level data
      } catch (error) {
        console.error('Error fetching user level data:', error);
      }
    };

    fetchTelegramUserInfo();

    if (tgUserID) {
      fetchUserLevelData();
    }
  }, [tgUserID]);

  // Handle username update from Telegram API
  const handleUsernameUpdate = async () => {
    try {
      // Check if Telegram Web App provides the user data
      const isTelegramAvailable = window.Telegram?.WebApp?.initDataUnsafe?.user;

      // Extract the username or first name from Telegram Web App
      let newUsername = isTelegramAvailable ? window.Telegram.WebApp.initDataUnsafe.user.username : null;
      let newFirstName = isTelegramAvailable ? window.Telegram.WebApp.initDataUnsafe.user.first_name : null;

      // Fallback to existing first name if username is not available
      newUsername = newUsername || newFirstName || firstName;

      // Make a PUT request to update the username in your backend
      await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-username/${tgUserID}`, {
        username: newUsername, // Update with Telegram username or first name
      });

      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username. Please try again.');
    }
  };

  return (
    <ProfilePageContainer>
      {/* Top Section with Profile Image */}
      <TopSection>
        {isLoading ? (
          <SkeletonProfileImage /> // Skeleton loader for profile image
        ) : (
          <ProfileImage src={profileImageUrl || fallbackImageUrl} alt="User profile" />
        )}
      </TopSection>

      {/* Info Section */}
      <InfoSection>
        {/* Username and Edit */}
        {isLoading ? (
          <SkeletonText />
        ) : (
          <UsernameContainer>
            <UsernameText>{username || firstName || 'User'}</UsernameText>
            <EditIcon onClick={() => setShowEdit(!showEdit)} />
          </UsernameContainer>
        )}

        {/* Display user stats */}
        <StatsContainer>
          {isLoading ? (
            <>
              <SkeletonStatBox />
              <SkeletonStatBox />
              <SkeletonStatBox />
            </>
          ) : (
            <>
              <StatBox>
                <StatNumber>{userLevelData?.actualTasksCompleted || 0}</StatNumber>
                <StatLabel>Tasks</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{userLevelData?.actualGamesUnlocked || 0}</StatNumber>
                <StatLabel>Games</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{userLevelData?.actualInvites || 0}</StatNumber>
                <StatLabel>Invites</StatLabel>
              </StatBox>
            </>
          )}
        </StatsContainer>

        {/* Current level display */}
        {isLoading ? <SkeletonText /> : <h3>Current Level: {userLevelData?.currentLevel || 1}</h3>}

        {/* Show update button if user clicked to edit */}
        {showEdit && (
          <UpdateButton onClick={handleUsernameUpdate}>
          Refresh with your latest Telegram username
          </UpdateButton>
        )}
      </InfoSection>
    </ProfilePageContainer>
  );
};

export default ProfilePage;
