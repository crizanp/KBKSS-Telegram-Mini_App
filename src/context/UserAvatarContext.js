import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Create the context for the avatar
const UserAvatarContext = createContext();

// Hook to access the avatar context
export const useUserAvatar = () => {
  return useContext(UserAvatarContext);
};

// Avatar Provider to manage the avatar globally
export const UserAvatarProvider = ({ children }) => {
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [fallbackAvatar, setFallbackAvatar] = useState(null);

  // Fetch fallback avatar if the active avatar is unavailable
  const fetchFallbackAvatar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/fallback-avatar`);
      if (data && data.length > 0) {
        setFallbackAvatar(data[0].fallbackAvatarUrl);
      }
    } catch (error) {
      console.error('Error fetching fallback avatar:', error);
    }
  }, []);

  // Fetch active avatar using userID
  const fetchActiveAvatar = useCallback(async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-avatar/${userID}/active-avatar`);
      if (response.data && response.data.image) {
        setActiveAvatar(response.data.image);
      } else {
        fetchFallbackAvatar(); // Use fallback if no active avatar is available
      }
    } catch (error) {
      console.error('Error fetching active avatar:', error);
      fetchFallbackAvatar();
    }
  }, [fetchFallbackAvatar]);

  return (
    <UserAvatarContext.Provider
      value={{
        activeAvatar,
        fallbackAvatar,
        setActiveAvatar,
        setFallbackAvatar,
        fetchActiveAvatar,
      }}
    >
      {children}
    </UserAvatarContext.Provider>
  );
};
