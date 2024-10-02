import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [pointsPerTap, setPointsPerTap] = useState(1); // New state for points per tap
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState(''); 

  useEffect(() => {
    const fetchPoints = async () => {
      const tgUserID = await getUserID(setUserID, setUsername);

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
        setPoints(Math.round(response.data.points));  
        
        if (response.data.pointsPerTap) {
          setPointsPerTap(response.data.pointsPerTap); // Fetch dynamic points per tap from user data
        }

        if (response.data.username) {
          setUsername(response.data.username);  
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, pointsPerTap, setPointsPerTap, userID, username }}>
      {children}
    </PointsContext.Provider>
  );
};
