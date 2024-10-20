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
  ActiveAvatarAnimation,
  MenuItem,
  MenuOptions,
  CongratsMessage,
  BuyAvatarMessage,
  SuccessIcon,
  GreenSign
} from "../style/AvatarProfileStyle";

const AvatarSelection = () => {
  const { points, setPoints } = usePoints();
  const [modalData, setModalData] = useState(null);
  const [unlockedAvatars, setUnlockedAvatars] = useState([]);
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [fallbackAvatar, setFallbackAvatar] = useState(null);
  const [userID, setUserID] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filterType, setFilterType] = useState('unlocked'); // Default to unlocked avatars
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);

  const handleModalClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setModalData(null);
      setIsClosing(false);
    }, 500);
  };

  useEffect(() => {
    const fetchUserID = async () => {
      const id = await getUserID();
      setUserID(id);
    };
    fetchUserID();
  }, []);

  const fetchFallbackAvatar = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fallback-avatar`);
      setFallbackAvatar(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching fallback avatar:', error);
    }
  };

  const fetchUserDetails = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}`);
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const fetchActiveAvatar = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/active-avatar`);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        fetchFallbackAvatar();
        return null;
      } else {
        showToast('Error fetching active avatar.', 'error');
        throw error;
      }
    }
  };

  const fetchUnlockedAvatars = async (userID) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/unlocked-avatars`);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        showToast('No unlocked avatars found.', 'info');
        return [];
      } else {
        showToast('Error fetching unlocked avatars.', 'error');
        throw error;
      }
    }
  };

  const fetchAvatars = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/avatar`);
      return data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const { data: userDetails, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['userDetails', userID],
    queryFn: () => fetchUserDetails(userID),
    enabled: !!userID,
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

  useEffect(() => {
    if (unlockedAvatarData) {
      setUnlockedAvatars(unlockedAvatarData);
    }
    if (activeAvatarData) {
      setActiveAvatar(activeAvatarData);
    }
  }, [unlockedAvatarData, activeAvatarData]);

  if (!userID) {
    return <SkeletonLoader />;
  }

  const handleUnlockAvatar = async (avatar) => {
    if (modalData) return;
  
    const isAlreadyUnlocked = unlockedAvatars.some((unlockedAvatar) => unlockedAvatar._id === avatar._id);
  
    if (isAlreadyUnlocked) {
      handleSwitchAvatar(avatar);
    } else if (points >= avatar.gemsRequired && userDetails.level >= avatar.levelRequired) {
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

  const handleSwitchAvatar = async (avatar) => {
    if (modalData) return;
  
    if (activeAvatar && activeAvatar._id === avatar._id) {
      showToast('This avatar is already active.', 'info');
      return;
    }
    setModalData({
      actionType: 'switch',
      currentAvatarName: activeAvatar?.name || 'your current avatar',
      newAvatarName: avatar.name,
      avatar,
    });
  };

  const handleConfirmAction = async () => {
    if (!modalData?.avatar) return;

    setProcessing(true);
    try {
      const avatarId = modalData.avatar._id;

      if (modalData.actionType === 'unlock') {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/unlock-avatar/${avatarId}`);
        const updatedPoints = response.data.updatedPoints;

        const newPoints = points - modalData.gemsRequired;
        setPoints(newPoints);
        localStorage.setItem(`points_${userID}`, newPoints);

        setUnlockedAvatars((prev) => [...prev, modalData.avatar]);
        setActiveAvatar(modalData.avatar); 
        localStorage.setItem(`activeAvatar_${userID}`, JSON.stringify(modalData.avatar));

        showToast(`Avatar ${modalData.avatar.name} has been unlocked and set as active!`, 'success');

        await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatarId}`);
      } else if (modalData.actionType === 'switch') {
        await axios.put(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/set-active-avatar/${avatarId}`);

        setActiveAvatar(modalData.avatar);
        localStorage.setItem(`activeAvatar_${userID}`, JSON.stringify(modalData.avatar));
        showToast(`Avatar has been switched to ${modalData.avatar.name}!`, 'success');
      }

      queryClient.invalidateQueries(['activeAvatar', userID]);
      queryClient.invalidateQueries(['unlockedAvatars', userID]);
      setModalData(null);
    } catch (error) {
      showToast('Failed to complete the action. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const lockedAvatars = avatars?.filter((avatar) => !unlockedAvatars.some((uAvatar) => uAvatar._id === avatar._id));

  const filteredAvatars = filterType === 'unlocked' ? unlockedAvatars : lockedAvatars;

  if (userLoading || avatarsLoading || activeAvatarLoading || unlockedAvatarsLoading) return <SkeletonLoader />;

  if (userError || avatarsError) {
    return <div>Error loading avatars or user data</div>;
  }

  return (
    <Container>
      <UserInfo />
      <TopSection>
        <RightSection>
          {activeAvatar ? (
            <>
              <ActiveAvatarAnimation>
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
        <MoreAvatarsTitle>Collect Avatars to Level Up</MoreAvatarsTitle>

        <MenuOptions>
          <MenuItem
            active={filterType === 'unlocked'}
            onClick={() => setFilterType('unlocked')}
          >
            Unlocked Avatars
          </MenuItem>
          <MenuItem
            active={filterType === 'locked'}
            onClick={() => setFilterType('locked')}
          >
            Locked Avatars
          </MenuItem>
        </MenuOptions>

        {filteredAvatars.length === 0 && filterType === 'locked' ? (
          <CongratsMessage>
            <SuccessIcon /> Congrats, you have unlocked all avatars!
            <GreenSign />
          </CongratsMessage>
        ) : filterType === 'unlocked' && filteredAvatars.length === 0 ? (
          <BuyAvatarMessage>
            Buy an avatar to level up!
          </BuyAvatarMessage>
        ) : (
          <MoreAvatarsGrid>
            {filteredAvatars?.map((avatar) => {
              const isLocked = userDetails.level < avatar.levelRequired || points < avatar.gemsRequired;
              return (
                <AvatarCard
                  key={avatar._id}
                  isLocked={isLocked}
                  onClick={() => !isLocked && handleUnlockAvatar(avatar)}
                >
                  <LevelDisplay>Lvl {avatar.levelRequired}</LevelDisplay>
                  <TopRightGems>
                    <GemIcon /> {avatar.gemsRequired}
                  </TopRightGems>
                  <AvatarImage src={avatar.image} alt={avatar.name} />
                  <div>{avatar.name}</div>
                </AvatarCard>
              );
            })}
          </MoreAvatarsGrid>
        )}
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
          processing={processing}
        />
      )}
    </Container>
  );
};

export default AvatarSelection;
