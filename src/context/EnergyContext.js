import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserID } from '../utils/getUserID'; 
import axios from 'axios';

const EnergyContext = createContext();

export const useEnergy = () => useContext(EnergyContext);

export const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(0); // Initial energy
  const [maxEnergy, setMaxEnergy] = useState(1000); // Default max energy
  const [USER_ID, setUSER_ID] = useState(null); // User ID state

  const ENERGY_REGEN_RATE = 1; // 1 energy point per interval
  const ENERGY_REGEN_INTERVAL = 1000; // Regenerate every 1 second

  // Fetch user ID dynamically
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const id = await getUserID();
        setUSER_ID(id); // Set the user ID
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserID();
  }, []);

  // Fetch dynamic max energy based on user level or API call
  const fetchMaxEnergy = async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
      const dynamicMaxEnergy = response.data.maxEnergy || 1000;
      setMaxEnergy(dynamicMaxEnergy); // Set the fetched max energy
    } catch (error) {
      console.error('Error fetching max energy:', error);
      setMaxEnergy(1000); // Default to 1000 on error
    }
  };

  // Regenerate energy based on elapsed time since the last update
  const regenerateEnergy = (savedEnergy, lastUpdate, maxEnergy) => {
    const timeElapsed = (Date.now() - lastUpdate) / ENERGY_REGEN_INTERVAL;
    return Math.min(maxEnergy, savedEnergy + timeElapsed * ENERGY_REGEN_RATE);
  };

  useEffect(() => {
    if (USER_ID) {
      // Fetch the dynamic max energy once USER_ID is available
      fetchMaxEnergy(USER_ID);

      // Retrieve stored energy and calculate regenerated energy
      const savedEnergy = parseFloat(localStorage.getItem(`energy_${USER_ID}`)) || 0;
      const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();

      const initialEnergy = regenerateEnergy(savedEnergy, lastUpdate, maxEnergy);
      setEnergy(initialEnergy); // Update the energy state

      // Save the updated energy and last update time
      localStorage.setItem(`energy_${USER_ID}`, initialEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
    }
  }, [USER_ID, maxEnergy]); // Recalculate energy when USER_ID or maxEnergy changes

  // Regenerate energy every second (without relying on user action)
  useEffect(() => {
    const regenInterval = setInterval(() => {
      if (USER_ID && maxEnergy !== null) {
        setEnergy((prevEnergy) => {
          const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();
          const regeneratedEnergy = regenerateEnergy(prevEnergy, lastUpdate, maxEnergy);

          // Save the regenerated energy and update the time
          localStorage.setItem(`energy_${USER_ID}`, regeneratedEnergy.toFixed(2));
          localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

          return regeneratedEnergy; // Update state with regenerated energy
        });
      }
    }, ENERGY_REGEN_INTERVAL); // Regenerate energy every second

    return () => clearInterval(regenInterval); // Clean up on component unmount
  }, [USER_ID, maxEnergy]); // Only run when USER_ID and maxEnergy are available

  // Function to decrease energy (called from other parts of the app)
  const decreaseEnergy = (amount) => {
    if (!USER_ID) return; // Ensure USER_ID is available

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - amount, 0); // Ensure energy doesn't go below 0
      localStorage.setItem(`energy_${USER_ID}`, newEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
      return newEnergy; // Update state with new energy
    });
  };

  return (
    <EnergyContext.Provider value={{ energy, maxEnergy, decreaseEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
};
