import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserID } from '../utils/getUserID'; 
import axios from 'axios';

const EnergyContext = createContext();

export const useEnergy = () => useContext(EnergyContext);

export const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(null);
  const [USER_ID, setUSER_ID] = useState(null);
  const [isEnergyReady, setIsEnergyReady] = useState(false); // Track when energy is ready
  const [isEnergyLoading, setIsEnergyLoading] = useState(true); // Track energy loading state

  const INITIAL_ENERGY = 1000; // Default initial energy for new users
  const ENERGY_REGEN_RATE = 1; // Energy regenerated per interval
  const ENERGY_REGEN_INTERVAL = 1000; // Interval for energy regeneration (1 second)

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const id = await getUserID();
        setUSER_ID(id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserID();
  }, []);

  // Function to fetch max energy and set it
  const fetchMaxEnergy = async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
      const dynamicMaxEnergy = response.data.maxEnergy || INITIAL_ENERGY; // Default to INITIAL_ENERGY if not set
      setMaxEnergy(dynamicMaxEnergy);
      setIsEnergyReady(true); // Energy is ready to regenerate
      setIsEnergyLoading(false); // Stop loading once max energy is fetched
    } catch (error) {
      console.error('Error fetching max energy:', error);
      setMaxEnergy(INITIAL_ENERGY); // Default to 1000 on error
      setIsEnergyReady(true); // Allow energy regeneration even if there's an error
      setIsEnergyLoading(false); // Stop loading even in case of an error
    }
  };

  // Regenerate energy based on the time elapsed since last update
  const regenerateEnergy = (savedEnergy, lastUpdate, maxEnergy) => {
    const timeElapsed = (Date.now() - lastUpdate) / ENERGY_REGEN_INTERVAL;
    return Math.min(maxEnergy, savedEnergy + timeElapsed * ENERGY_REGEN_RATE);
  };

  useEffect(() => {
    if (USER_ID) {
      fetchMaxEnergy(USER_ID); // Fetch max energy after we have the user ID
    }
  }, [USER_ID]);

  useEffect(() => {
    if (USER_ID && maxEnergy && isEnergyReady) {
      // Check if energy exists in localStorage, if not, set initial energy for new users
      const savedEnergy = parseFloat(localStorage.getItem(`energy_${USER_ID}`)) || INITIAL_ENERGY;
      const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();

      const initialEnergy = regenerateEnergy(savedEnergy, lastUpdate, maxEnergy);
      setEnergy(initialEnergy); // Set the initial energy state

      // Save updated energy and last update time in localStorage
      localStorage.setItem(`energy_${USER_ID}`, initialEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
    }
  }, [USER_ID, maxEnergy, isEnergyReady]);

  // Regenerate energy every second without user action
  useEffect(() => {
    if (!isEnergyReady) return; // Ensure energy is ready before regenerating

    const regenInterval = setInterval(() => {
      if (USER_ID && maxEnergy !== null) {
        setEnergy((prevEnergy) => {
          const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();
          const regeneratedEnergy = regenerateEnergy(prevEnergy, lastUpdate, maxEnergy);

          // Save regenerated energy and update time
          localStorage.setItem(`energy_${USER_ID}`, regeneratedEnergy.toFixed(2));
          localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

          return regeneratedEnergy; // Update state with the regenerated energy
        });
      }
    }, ENERGY_REGEN_INTERVAL); // Regenerate energy every second

    return () => clearInterval(regenInterval); // Clean up interval on component unmount
  }, [USER_ID, maxEnergy, isEnergyReady]);

  // Decrease energy function (can be used from other parts of the app)
  const decreaseEnergy = (amount) => {
    if (!USER_ID) return;

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - amount, 0); // Prevent energy from going below 0
      localStorage.setItem(`energy_${USER_ID}`, newEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
      return newEnergy;
    });
  };

  return (
    <EnergyContext.Provider value={{ energy, maxEnergy, decreaseEnergy, isEnergyLoading, setMaxEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
};
