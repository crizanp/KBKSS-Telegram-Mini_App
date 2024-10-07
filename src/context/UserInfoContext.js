import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';
import { usePoints } from './PointsContext';  // Import the usePoints hook

const UserInfoContext = createContext();

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const UserInfoProvider = ({ children }) => {
  const { points, pointsPerTap, setPointsPerTap, userID, username, setUsername } = usePoints();  // Use points from PointsContext
  const [level, setLevel] = useState(0);
  const [firstName, setFirstName] = useState(null);

  // Fetch user level and first name
  const fetchUserData = useCallback(async () => {
    try {
      // Fetch user level
      const levelResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
      setLevel(levelResponse.data.currentLevel || 0);

      // Set first name from Telegram (if available)
      const firstNameFromTelegram = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name;
      if (firstNameFromTelegram) {
        setFirstName(firstNameFromTelegram.split(/[^\w]+/)[0].slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching user level:', error);
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      fetchUserData();  // Only fetch user data when userID is available
    }
  }, [fetchUserData, userID]);

  return (
    <UserInfoContext.Provider value={{ points, pointsPerTap, username, level, firstName }}>
      {children}
    </UserInfoContext.Provider>
  );
};
