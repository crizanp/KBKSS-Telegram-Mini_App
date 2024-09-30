// src/context/PointsContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState(''); 

  useEffect(() => {
    const fetchPoints = async () => {
      const tgUserID = await getUserID(setUserID, setUsername);

      try {
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
        setPoints(Math.round(response.data.points));  

        if (response.data.username) {
          setUsername(response.data.username);  
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          
          try {
            const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
              userID: tgUserID,
              username: username || 'default_username',
              points: 0,
              tasksCompleted: [],
              taskHistory: [],
            });
            setPoints(Math.round(newUserResponse.data.points)); 
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
    <PointsContext.Provider value={{ points, setPoints, userID, username, setUserID }}>
      {children}
    </PointsContext.Provider>
  );
};
