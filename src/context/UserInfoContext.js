import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';

const UserInfoContext = createContext();

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const UserInfoProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [pointsPerTap, setPointsPerTap] = useState(1); // Dynamic points per tap
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [level, setLevel] = useState(0);
  const [firstName, setFirstName] = useState(null);

  // Fetch user data, points, and level
  const fetchUserData = useCallback(async () => {
    const tgUserID = await getUserID();
    setUserID(tgUserID);

    try {
      // Fetch points and user details
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      setPoints(Math.round(response.data.points));
      setPointsPerTap(response.data.pointsPerTap || 1);
      setUsername(response.data.username || 'User');

      // Fetch user level
      const levelResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${tgUserID}`);
      setLevel(levelResponse.data.currentLevel || 0);

      // Set first name from Telegram (if available)
      const firstNameFromTelegram = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name;
      if (firstNameFromTelegram) {
        setFirstName(firstNameFromTelegram.split(/[^\w]+/)[0].slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserInfoContext.Provider value={{ points, pointsPerTap, username, level, firstName, fetchUserData }}>
      {children}
    </UserInfoContext.Provider>
  );
};
