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
        if (error.response && error.response.status === 404) {
          try {
            // Create new user if not found
            const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
              userID: tgUserID,
              username: username || 'default_username',
              points: 0,
              tasksCompleted: [],
              taskHistory: [],
              pointsPerTap: 1 // Default value for new users
            });
            setPoints(Math.round(newUserResponse.data.points)); 
            setPointsPerTap(newUserResponse.data.pointsPerTap || 1); // Set default points per tap
          } catch (postError) {
            console.error('Error creating new user:', postError);
          }
        } else {
          console.error('Error fetching user points:', error);
        }
      }
    };

    fetchPoints();
  }, [setUserID, setPoints, setUsername]);

  return (
    <PointsContext.Provider value={{ points, setPoints, pointsPerTap, setPointsPerTap, userID, username, setUserID }}>
      {children}
    </PointsContext.Provider>
  );
};
