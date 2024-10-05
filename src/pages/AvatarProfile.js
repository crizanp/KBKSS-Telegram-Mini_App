import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePoints } from '../context/PointsContext';
import SkeletonLoader from '../components/skeleton/AvatarSkeleton';
import UserInfo from '../components/UserInfo';
import { getUserID } from "../utils/getUserID";
import ToastNotification, { showToast } from '../components/ToastNotification';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import {
  TopRightGems,
  LevelDisplay,
  MoreAvatarsGrid,
  MoreAvatarsTitle,
  MoreAvatarsSection,
  Title,
  GemIcon,
  AvatarInfo,
  CurrentAvatarImage,
  AvatarImage,
  AvatarCard,
  RightSection,
  AvatarList,
  LeftSection,
  TopSection,
  Container,
  ActiveAvatarAnimation  // Import the animation for the right-side active avatar
} from "../style/AvatarProfileStyle";

const AvatarSelection = () => {
  const { points, setPoints } = usePoints(); // Points Context
  const [modalData, setModalData] = useState(null); // Modal data for confirmation
  const [unlockedAvatars, setUnlockedAvatars] = useState([]); // Unlocked avatars
  const [activeAvatar, setActiveAvatar] = useState(null); // Active avatar
  const [fallbackAvatar, setFallbackAvatar] = useState(null); // Fallback avatar
  const [userID, setUserID] = useState(null); // Track userID
  const [processing, setProcessing] = useState(false); // Processing state for modal
  const queryClient = useQueryClient(); // Initialize query client to invalidate queries
  const [isClosing, setIsClosing] = useState(false); // Modal closing animation state

  const handleModalClose = () => {
    if (isClosing) return; // Prevent multiple close events
    setIsClosing(true);
    setTimeout(() => {
      setModalData(null);
      setIsClosing(false); // Reset the state after the modal is closed
    }, 500); // Timeout matches the animation duration
  };

  // Fetch userID
  useEffect(() => {
    const fetchUserID = async () => {
      const id = await getUserID();
      setUserID(id); // Set userID after fetching
    };
    fetchUserID();
  }, []);

  // Fetch fallback avatar if active avatar is not available
  const fetchFallbackAvatar = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fallback-avatar`);
      const defaultAvatar = data.length > 0 ? data[0] : null;
      setFallbackAvatar(defaultAvatar);
    } catch (error) {
      console.error('Error fetching fallback avatar:', error);
    }
  };

  // Fetch user details (avatars, points, level)
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
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: avatars, isLoading: avatarsLoading, isError: avatarsError } = useQuery({
    queryKey: ['avatars'],
    queryFn: fetchAvatars,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: unlockedAvatarData, isLoading: unlockedAvatarsLoading } = useQuery({
    queryKey: ['unlockedAvatars', userID],
    queryFn: () => fetchUnlockedAvatars(userID),
    enabled: !!userID,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: activeAvatarData, isLoading: activeAvatarLoading } = useQuery({
    queryKey: ['activeAvatar', userID],
    queryFn: () => fetchActiveAvatar(userID),
    enabled: !!userID,
    staleTime: Infinity,
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
    return <SkeletonLoader />; // Loading state until the userID is available
  }

  // Handle avatar unlocking
  const handleUnlockAvatar = async (avatar) => {
    if (modalData) return; // Prevent multiple modals

    if (points >= avatar.gemsRequired && userDetails.level >= avatar.levelRequired) {
      setModalData({
        avatar,
        message: `Are you sure you want to unlock the avatar ${avatar.name} and deduct ${avatar.gemsRequired} gems?`,
        gemsRequired: avatar.gemsRequired,
        actionType: 'unlock',
        newAvatarName: avatar.name,
      });
    } else {
      showToast('You are not eligible to unlock this avatar. Please level up.', 'error');
    }
  };

  // Handle setting active avatar (Switching avatars)
  const handleSwitchAvatar = async (avatar) => {
    if (modalData) return; // Prevent multiple modals

    setModalData({
      actionType: 'switch',
      currentAvatarName: activeAvatar?.name || "your current avatar",
      newAvatarName: avatar.name,
      avatar,
    });
  };

  const handleConfirmAction = async () => {
    if (!modalData?.avatar) return;

    setProcessing(true); // Start processing
    try {
      const avatarId = modalData.avatar._id;

      if (modalData.actionType === 'unlock') {
        // Unlock the avatar and deduct points
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/unlock-avatar/${avatarId}`);
        const updatedPoints = response.data.updatedPoints;

        // Deduct points and store in both context and localStorage
        const newPoints = points - modalData.gemsRequired;
        setPoints(newPoints); 
        localStorage.setItem(`points_${userID}`, newPoints);

        setUnlockedAvatars((prev) => [...prev, modalData.avatar]);
        setActiveAvatar(modalData.avatar); // Set the unlocked avatar as active by default
        localStorage.setItem(`activeAvatar_${userID}`, JSON.stringify(modalData.avatar)); // Update active avatar in localStorage

        showToast(`Avatar ${modalData.avatar.name} has been unlocked and set as active!`, 'success');
        
        // Set the avatar as active via API
        await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatarId}`);
      } else if (modalData.actionType === 'switch') {
        await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatarId}`);
        setActiveAvatar(modalData.avatar);
        localStorage.setItem(`activeAvatar_${userID}`, JSON.stringify(modalData.avatar)); // Update active avatar in localStorage
        showToast(`Avatar has been switched to ${modalData.avatar.name}!`, 'success');
      }

      queryClient.invalidateQueries(['activeAvatar', userID]);
      queryClient.invalidateQueries(['unlockedAvatars', userID]);
      setModalData(null); // Close modal after confirmation
    } catch (error) {
      showToast('Failed to complete the action. Please try again.', 'error');
    } finally {
      setProcessing(false); // End processing
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
      <UserInfo />
      <TopSection>
        <LeftSection>
          <AvatarList>
            {unlockedAvatars.length > 0 ? (
              unlockedAvatars.map((avatar) => (
                <AvatarCard
                  key={avatar._id}
                  isLocked={false}
                  onClick={() => handleSwitchAvatar(avatar)} // Switch avatars
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

        <RightSection>
          {activeAvatar ? (
            <>
            <ActiveAvatarAnimation>  {/* Wrap active avatar image with animation */}
              <CurrentAvatarImage src={activeAvatar.image} alt={activeAvatar.name} />
              
            </ActiveAvatarAnimation>
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
                <LevelDisplay>Lvl {avatar.levelRequired}</LevelDisplay> {/* New level display */}
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

      <ToastNotification />

      {modalData && (
        <AvatarSelectionModal
          actionType={modalData.actionType}
          currentAvatarName={modalData.currentAvatarName}
          newAvatarName={modalData.newAvatarName}
          gemsRequired={modalData.gemsRequired}
          onGoAhead={handleConfirmAction}
          onClose={handleModalClose}
          isClosing={isClosing}
          processing={processing} // Pass the processing state here
        />
      )}
    </Container>
  );
};

export default AvatarSelection;
