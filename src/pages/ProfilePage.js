import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaTasks, FaGamepad, FaUserFriends, FaEdit } from 'react-icons/fa';
import { useUserInfo } from '../context/UserInfoContext'; // To fetch user data
import { getUserID } from '../utils/getUserID'; // To fetch Telegram user ID

// Styled components for Profile Page
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
  const [showEdit, setShowEdit] = useState(false); // Toggle for username editing

  // Fetch Telegram user ID, profile photo, and user level data
  useEffect(() => {
    const fetchTelegramUserInfo = async () => {
      const userID = await getUserID(setTgUserID);
      setTgUserID(userID);

      // Fetch Telegram profile photo
      if (userID) {
        try {
          const response = await axios.post(
            `https://api.telegram.org/bot7524880035:AAEx907UVgKlICcSV0412IRYCmJVQmHiIig/getUserProfilePhotos`,
            `user_id=${userID}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );

          if (response.data.ok && response.data.result.total_count > 0) {
            const fileId = response.data.result.photos[0][2].file_id; // Assuming the largest photo is at index [0][2]

            const fileResponse = await axios.post(
              `https://api.telegram.org/bot7524880035:AAEx907UVgKlICcSV0412IRYCmJVQmHiIig/getFile`,
              `file_id=${fileId}`,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );

            const filePath = fileResponse.data.result.file_path;
            setProfileImageUrl(`https://api.telegram.org/file/bot7524880035:AAEx907UVgKlICcSV0412IRYCmJVQmHiIig/${filePath}`);
          }
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      }
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
        {profileImageUrl ? (
          <ProfileImage src={profileImageUrl} alt="User profile" />
        ) : (
          <p>Loading profile picture...</p>
        )}
      </TopSection>

      {/* Info Section */}
      <InfoSection>
        {/* Username and Edit */}
        <UsernameContainer>
          <UsernameText>{username || firstName || 'User'}</UsernameText>
          <EditIcon onClick={() => setShowEdit(!showEdit)} />
        </UsernameContainer>

        {/* Display user stats */}
        <StatsContainer>
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
        </StatsContainer>

        {/* Current level display */}
        <h3>Current Level: {userLevelData?.currentLevel || 1}</h3>

        {/* Show update button if user clicked to edit */}
        {showEdit && (
          <UpdateButton onClick={handleUsernameUpdate}>
            Update Username to Telegram Username
          </UpdateButton>
        )}
      </InfoSection>
    </ProfilePageContainer>
  );
};

export default ProfilePage;
