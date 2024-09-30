import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserID } from '../utils/getUserID'; // Import your getUserID function

const EnergyContext = createContext();

export const useEnergy = () => {
  return useContext(EnergyContext);
};

export const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(3000); // Updated max energy to 3000
  const [USER_ID, setUSER_ID] = useState(null); // State for dynamic USER_ID

 
  const MAX_ENERGY = 1000; // Updated max energy to 3000
  const ENERGY_REGEN_RATE = 1; // 1 energy point
  const ENERGY_REGEN_INTERVAL = 1000; // Energy increases by 1 point every 1 seconds (1000ms)

  useEffect(() => {
    // Fetch the user ID dynamically when the component mounts
    const fetchUserID = async () => {
      try {
        const id = await getUserID((userID) => setUSER_ID(userID));
        setUSER_ID(id); // Set the user ID after fetching it
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    if (!USER_ID) return; // Wait until USER_ID is available

    const savedEnergy = localStorage.getItem(`energy_${USER_ID}`);
    const lastUpdate = localStorage.getItem(`lastUpdate_${USER_ID}`);

    let initialEnergy = MAX_ENERGY;

    if (savedEnergy !== null && lastUpdate !== null) {
      const savedEnergyFloat = parseFloat(savedEnergy);
      const lastUpdateInt = parseInt(lastUpdate, 10);

      if (!isNaN(savedEnergyFloat) && !isNaN(lastUpdateInt)) {
        const timeElapsed = (Date.now() - lastUpdateInt) / ENERGY_REGEN_INTERVAL;
        const regeneratedEnergy = Math.min(MAX_ENERGY, savedEnergyFloat + timeElapsed * ENERGY_REGEN_RATE);
        initialEnergy = regeneratedEnergy;
      }
    }

    setEnergy(initialEnergy);
    localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
    localStorage.setItem(`energy_${USER_ID}`, initialEnergy.toFixed(2));
  }, [USER_ID]);

  useEffect(() => {
    if (!USER_ID) return; // Wait until USER_ID is available

    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10);
        const timeElapsed = (Date.now() - lastUpdate) / ENERGY_REGEN_INTERVAL;
        const regeneratedEnergy = Math.min(MAX_ENERGY, prevEnergy + timeElapsed * ENERGY_REGEN_RATE);

        localStorage.setItem(`energy_${USER_ID}`, regeneratedEnergy.toFixed(2));
        localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

        return regeneratedEnergy;
      });
    }, ENERGY_REGEN_INTERVAL); // Energy regenerates every second

    return () => clearInterval(regenInterval);
  }, [USER_ID]);

  const decreaseEnergy = (amount) => {
    if (!USER_ID) return; // Make sure USER_ID is available

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - amount, 0); // Decrease energy by a specified amount
      localStorage.setItem(`energy_${USER_ID}`, newEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
      return newEnergy;
    });
  };

  if (!USER_ID) {
    return <div>Loading...</div>; // Show loading until the USER_ID is available
  }

  return (
    <EnergyContext.Provider value={{ energy, decreaseEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
};
