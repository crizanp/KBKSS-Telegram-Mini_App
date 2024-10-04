import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegGem } from 'react-icons/fa';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Added useQueryClient
import { usePoints } from '../context/PointsContext';
import SkeletonLoader from '../components/skeleton/AvatarSkeleton'; // Placeholder for loading state
import UserInfo from '../components/UserInfo'; // User Info Component
import { getUserID } from "../utils/getUserID";
import ToastNotification, { showToast } from '../components/ToastNotification'; // Toast Notification
import AvatarSelectionModal from '../components/AvatarSelectionModal'; // Modal for confirmation

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  color: #f0f0f0;
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 86px;
  }
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
  overflow-y: auto; /* Enable scrolling for the avatar list */
  padding-right: 20px;
  @media (max-width: 768px) {
    width: 30%;
  }
`;

const AvatarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  background-color: #1c1c1c;
  text-align: center;
  @media (max-width: 768px) {
    width: 65%;
    height: auto;
  }
`;

const AvatarCard = styled.div`
  position: relative;
  border: ${(props) => (props.isLocked ? '2px solid grey' : '2px solid gold')};
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: ${(props) => (props.isLocked ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.isLocked ? 0.6 : 1)};
  transition: transform 0.3s ease;
  color: white;
  &:hover {
    transform: ${(props) => (props.isLocked ? 'none' : 'scale(1.05)')};
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
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const AvatarInfo = styled.div`
  font-size: 18px;
  color: #d2d2d2;
`;

const Title = styled.h3`
  font-size: 28px;
  margin: 10px 0;
  color: #d2d2d2;
`;

const GemsDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #00aaff;
  margin-bottom: 10px;
`;

const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 0.8rem;
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

const TopRightGems = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: white;
`;



const AvatarSelection = () => {
  const { points, setPoints } = usePoints();
  const [modalData, setModalData] = useState(null); // Modal data for confirmation
  const [unlockedAvatars, setUnlockedAvatars] = useState([]); // Unlocked avatars
  const [activeAvatar, setActiveAvatar] = useState(null); // Active avatar
  const [fallbackAvatar, setFallbackAvatar] = useState(null); // Fallback avatar
  const [userID, setUserID] = useState(null); // Track userID
  const queryClient = useQueryClient(); // Initialize query client to invalidate queries
  const [isClosing, setIsClosing] = useState(false);
  const handleModalClose = () => {
    setIsClosing(true);
    setTimeout(() => setModalData(null), 500);  // Timeout matches the animation duration
  };
  // Fetch userID
  useEffect(() => {
    const fetchUserID = async () => {
      const id = await getUserID();
      setUserID(id); // Set userID after fetching
      console.log("UserID fetched:", id);
    };
    fetchUserID();
  }, []); // Run this once when the component mounts

  // Fetch fallback avatar
  const fetchFallbackAvatar = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fallback-avatar`);
      const defaultAvatar = data.length > 0 ? data[0] : null;
      setFallbackAvatar(defaultAvatar);
    } catch (error) {
      console.error('Error fetching fallback avatar:', error);
    }
  };

  // Fetch user details
  const fetchUserDetails = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}`);
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  // Fetch active avatar
  const fetchActiveAvatar = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/active-avatar`);
      return data; // Return the active avatar if found
    } catch (error) {
      if (error.response && error.response.status === 404) {
        fetchFallbackAvatar(); // If no active avatar, fetch fallback
        return null; // Return null if no active avatar found
      } else {
        showToast('Error fetching active avatar.', 'error');
        console.error('Error fetching active avatar:', error);
        throw error; // Re-throw other errors
      }
    }
  };

  // Fetch unlocked avatars
  const fetchUnlockedAvatars = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/unlocked-avatars`);
      return data; // Return the unlocked avatars if found
    } catch (error) {
      if (error.response && error.response.status === 404) {
        showToast('No unlocked avatars found.', 'info');
        return []; // Return empty array if no unlocked avatars found
      } else {
        showToast('Error fetching unlocked avatars.', 'error');
        console.error('Error fetching unlocked avatars:', error);
        throw error; // Re-throw other errors
      }
    }
  };

  // Fetch all avatars
  const fetchAvatars = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/avatar`);
      return data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  // Use React Query to fetch userDetails, avatars, unlockedAvatars, and activeAvatar
  const { data: userDetails, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['userDetails', userID],
    queryFn: () => fetchUserDetails(userID),
    enabled: !!userID, // Ensure this query runs only when userID is available
    staleTime: Infinity, // Prevents the query from refetching after the first successful call
    cacheTime: Infinity, // Keep the data in cache indefinitely (until page refresh)
    refetchOnWindowFocus: false, // Prevent refetching when the window gains focus
  });

  const { data: avatars, isLoading: avatarsLoading, isError: avatarsError } = useQuery({
    queryKey: ['avatars'],
    queryFn: fetchAvatars,
    staleTime: Infinity, // Fetch only once, then cache the data
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: unlockedAvatarData, isLoading: unlockedAvatarsLoading } = useQuery({
    queryKey: ['unlockedAvatars', userID],
    queryFn: () => fetchUnlockedAvatars(userID),
    enabled: !!userID, // Ensure this query runs only when userID is available
    staleTime: Infinity, // Prevent refetching after the first successful call
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: activeAvatarData, isLoading: activeAvatarLoading } = useQuery({
    queryKey: ['activeAvatar', userID],
    queryFn: () => fetchActiveAvatar(userID),
    enabled: !!userID, // Ensure this query runs only when userID is available
    staleTime: Infinity, // Fetch only once and use cached data
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Set unlocked and active avatars after fetching
  useEffect(() => {
    if (unlockedAvatarData) {
      setUnlockedAvatars(unlockedAvatarData);
    }
    if (activeAvatarData) {
      setActiveAvatar(activeAvatarData);
    }
  }, [unlockedAvatarData, activeAvatarData]);

  if (!userID) {
    // Show a loading state until the userID is available
    return <SkeletonLoader />;
  }

  // Handle avatar unlocking
  const handleUnlockAvatar = async (avatar) => {
    if (points >= avatar.gemsRequired && userDetails.level >= avatar.levelRequired) {
      setModalData({
        avatar,
        message: `Are you sure you want to unlock the avatar ${avatar.name} and deduct ${avatar.gemsRequired} gems?`,
        gemsRequired: avatar.gemsRequired, // Pass the required gems to modal
        action: 'unlock', // Unlock action
      });
    } else {
      showToast('You do not meet the requirements to unlock this avatar.', 'error');
    }
  };

  // Handle setting active avatar
  const handleSetActiveAvatar = async (avatar) => {
    try {
      // Optimistically update the active avatar in local state
      setActiveAvatar(avatar);

      await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatar._id}`);

      showToast(`Avatar ${avatar.name} is now set as your active avatar!`, 'success');

      // Invalidate the queries to refetch the active avatar and unlocked avatars
      queryClient.invalidateQueries(['activeAvatar', userID]);
      queryClient.invalidateQueries(['unlockedAvatars', userID]);
    } catch (error) {
      showToast('Failed to set active avatar. Please try again.', 'error');
    }
  };

  // Modify your handleConfirmAction function

  const handleConfirmAction = async () => {
    if (!modalData?.avatar) return;
  
    try {
      const avatarId = modalData.avatar._id;
  
      if (modalData.action === 'unlock') {
        // Unlock the avatar and automatically set it as active
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/unlock-avatar/${avatarId}`);
        
        // Assuming the backend returns updated points, use this if available
        const updatedPoints = response.data.updatedPoints;
  
        if (updatedPoints !== undefined) {
          // If API returns updated points, update them in state and local storage
          setPoints(updatedPoints); // Update points in PointsContext
          localStorage.setItem(`points_${userID}`, updatedPoints);
        } else {
          // Manual deduction of gems if the API doesn't return updated points
          const newPoints = points - modalData.gemsRequired;
  
          // Ensure points don't go negative (extra safety check)
          if (newPoints >= 0) {
            setPoints(newPoints); // Update points in PointsContext
            localStorage.setItem(`points_${userID}`, newPoints); // Update points in local storage
          } else {
            showToast('Not enough points to unlock this avatar!', 'error');
            return; // Abort further actions if points are insufficient
          }
        }
  
        // Automatically set the avatar as active
        await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatarId}`);
  
        // Optimistically update the unlocked avatars in local state
        setUnlockedAvatars((prev) => [...prev, modalData.avatar]);
        setActiveAvatar(modalData.avatar);
  
        showToast(`Avatar ${modalData.avatar.name} has been unlocked and set as active!`, 'success');
  
        // Invalidate the queries to refetch the active avatar and unlocked avatars
        queryClient.invalidateQueries(['activeAvatar', userID]);
        queryClient.invalidateQueries(['unlockedAvatars', userID]);
      }
  
      setModalData(null); // Close modal after confirmation
    } catch (error) {
      showToast('Failed to complete the action. Please try again.', 'error');
    }
  };
  
  
  // Filter out avatars that are already unlocked for the locked avatars section
  const lockedAvatars = avatars?.filter((avatar) => !unlockedAvatars.some((uAvatar) => uAvatar._id === avatar._id));

  if (userLoading || avatarsLoading || activeAvatarLoading || unlockedAvatarsLoading) return <SkeletonLoader />; // Loading state

  if (userError || avatarsError) {
    return <div>Error loading avatars or user data</div>; // Error handling
  }

  return (
    <Container>
      {/* User Info */}
      <UserInfo />

      {/* Top Section */}
      <TopSection>
        <LeftSection>
          <AvatarList>
            {unlockedAvatars.length > 0 ? (
              unlockedAvatars.map((avatar) => (
                <AvatarCard
                  key={avatar._id}
                  isLocked={false}
                  onClick={() => handleSetActiveAvatar(avatar)} // Updated to handle set active avatar
                >
                  <AvatarImage src={avatar.image} alt={avatar.name} />
                  <div>{avatar.name}</div>
                </AvatarCard>
              ))
            ) : (
              <p>No avatars unlocked yet.</p>
            )}
          </AvatarList>
        </LeftSection>

        {/* Right Section - Current Active Avatar */}
        <RightSection>
          {activeAvatar ? (
            <>
              <CurrentAvatarImage src={activeAvatar.image} alt={activeAvatar.name} />
              <AvatarInfo>
                <Title>{activeAvatar.name}</Title>
              </AvatarInfo>
            </>
          ) : fallbackAvatar ? (
            <>
              <CurrentAvatarImage src={fallbackAvatar.fallbackAvatarUrl} alt="Fallback Avatar" />
              <AvatarInfo>
                <Title>Default Avatar</Title>
              </AvatarInfo>
            </>
          ) : (
            <p>No Active Avatar. Please select one.</p>
          )}
        </RightSection>
      </TopSection>

      {/* More Avatars Section */}
      <MoreAvatarsSection>
        <MoreAvatarsTitle>More Avatars to Unlock</MoreAvatarsTitle>
        <MoreAvatarsGrid>
          {lockedAvatars?.map((avatar) => {
            const isLocked = userDetails.level < avatar.levelRequired || points < avatar.gemsRequired;
            return (
              <AvatarCard
                key={avatar._id}
                isLocked={isLocked}
                onClick={() => !isLocked && handleUnlockAvatar(avatar)}
              >
                <TopRightGems>
                  <GemIcon /> {avatar.gemsRequired}
                </TopRightGems>
                <AvatarImage src={avatar.image} alt={avatar.name} />
                <div>{avatar.name}</div>
              </AvatarCard>
            );
          })}
        </MoreAvatarsGrid>
      </MoreAvatarsSection>

      {/* Toast Notification */}
      <ToastNotification />

      {/* Confirmation Modal */}
      {modalData && (
  <AvatarSelectionModal
    gemsRequired={modalData.gemsRequired}
    onGoAhead={handleConfirmAction}
    onClose={() => setModalData(null)}
    isClosing={false}
    points={points} // Pass the points prop here
  />
)}
    </Container>
  );
};

export default AvatarSelection;