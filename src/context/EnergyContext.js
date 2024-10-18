import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserID } from '../utils/getUserID';
import axios from 'axios';

const EnergyContext = createContext();

export const useEnergy = () => useContext(EnergyContext);

export const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(null);
  const [USER_ID, setUSER_ID] = useState(null);
  const [isEnergyReady, setIsEnergyReady] = useState(false);
  const [isEnergyLoading, setIsEnergyLoading] = useState(true);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

  const INITIAL_ENERGY = 1000;
  const ENERGY_REGEN_RATE = 1;
  const ENERGY_REGEN_INTERVAL = 1000;
  const COOLDOWN_DURATION = 60 * 2 * 1000; // 2-minute cooldown

  // Fetch the user ID when the component mounts
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

  // Fetch max energy based on user ID
  const fetchMaxEnergy = async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
      const dynamicMaxEnergy = response.data.maxEnergy || INITIAL_ENERGY;
      setMaxEnergy(dynamicMaxEnergy);
      setIsEnergyReady(true);
      setIsEnergyLoading(false);
    } catch (error) {
      console.error('Error fetching max energy:', error);
      setMaxEnergy(INITIAL_ENERGY);
      setIsEnergyReady(true);
      setIsEnergyLoading(false);
    }
  };

  // Regenerate energy based on elapsed time since last update
  const regenerateEnergy = (savedEnergy, lastUpdate, maxEnergy) => {
    const timeElapsed = (Date.now() - lastUpdate) / ENERGY_REGEN_INTERVAL;
    return Math.min(maxEnergy, savedEnergy + timeElapsed * ENERGY_REGEN_RATE);
  };

  // Handle cooldown logic: stop regeneration and reset energy to 1 after cooldown ends
  useEffect(() => {
    if (isCooldownActive) {
      const cooldownEnd = parseInt(localStorage.getItem(`cooldownEnd_${USER_ID}`), 10);
      const now = Date.now();

      if (now >= cooldownEnd) {
        // Cooldown is over, reset energy to 1, clear old energy values, and resume regeneration
        setEnergy(1);
        localStorage.setItem(`energy_${USER_ID}`, '1');  // Save energy as 1 in localStorage
        localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());  // Update last update time
        setIsCooldownActive(false);
        localStorage.removeItem(`cooldownEnd_${USER_ID}`); // Remove cooldown from localStorage
        return;
      }

      setCooldownTimeLeft(cooldownEnd - now);

      const cooldownInterval = setInterval(() => {
        const updatedCooldownTime = cooldownEnd - Date.now();
        if (updatedCooldownTime <= 0) {
          clearInterval(cooldownInterval);
          setEnergy(1);  // Reset energy to 1 after cooldown
          localStorage.setItem(`energy_${USER_ID}`, '1');  // Update local storage to 1
          setIsCooldownActive(false);
          setCooldownTimeLeft(0);
          localStorage.removeItem(`cooldownEnd_${USER_ID}`);
        } else {
          setCooldownTimeLeft(updatedCooldownTime);
        }
      }, 1000); // Update every second

      return () => clearInterval(cooldownInterval);
    }
  }, [isCooldownActive, USER_ID]);

  // Fetch max energy after getting the USER_ID
  useEffect(() => {
    if (USER_ID) {
      fetchMaxEnergy(USER_ID);
    }
  }, [USER_ID]);

  // Initialization and energy handling (consider cooldown)
  useEffect(() => {
    if (USER_ID && maxEnergy && isEnergyReady) {
      // Check for active cooldown
      const cooldownEnd = localStorage.getItem(`cooldownEnd_${USER_ID}`);
      if (cooldownEnd && Date.now() < parseInt(cooldownEnd, 10)) {
        setIsCooldownActive(true);
        setCooldownTimeLeft(parseInt(cooldownEnd, 10) - Date.now());
        return;
      }

      // No cooldown - restore energy from localStorage or start with INITIAL_ENERGY
      const savedEnergy = parseFloat(localStorage.getItem(`energy_${USER_ID}`)) || INITIAL_ENERGY;
      const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();

      const initialEnergy = regenerateEnergy(savedEnergy, lastUpdate, maxEnergy);
      setEnergy(initialEnergy);

      localStorage.setItem(`energy_${USER_ID}`, initialEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
    }
  }, [USER_ID, maxEnergy, isEnergyReady]);

  // Regenerate energy every second, but not during cooldown
  useEffect(() => {
    if (!isEnergyReady || isCooldownActive) return;

    const regenInterval = setInterval(() => {
      if (USER_ID && maxEnergy !== null) {
        setEnergy((prevEnergy) => {
          const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10) || Date.now();
          const regeneratedEnergy = regenerateEnergy(prevEnergy, lastUpdate, maxEnergy);

          // Save regenerated energy and update time
          localStorage.setItem(`energy_${USER_ID}`, regeneratedEnergy.toFixed(2));
          localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

          return regeneratedEnergy;
        });
      }
    }, ENERGY_REGEN_INTERVAL);

    return () => clearInterval(regenInterval);
  }, [USER_ID, maxEnergy, isEnergyReady, isCooldownActive]);

  // Decrease energy, start cooldown if energy reaches 0
  const decreaseEnergy = (amount) => {
    if (!USER_ID) return;

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - amount, 0);

      if (newEnergy === 0 && !isCooldownActive) {
        // Start cooldown if energy reaches 0
        const cooldownEnd = Date.now() + COOLDOWN_DURATION;
        localStorage.setItem(`cooldownEnd_${USER_ID}`, cooldownEnd.toString());
        setIsCooldownActive(true);
        setCooldownTimeLeft(COOLDOWN_DURATION);
      }

      localStorage.setItem(`energy_${USER_ID}`, newEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

      return newEnergy;
    });
  };

  return (
    <EnergyContext.Provider value={{
      energy,
      maxEnergy,
      decreaseEnergy,
      isEnergyLoading,
      setMaxEnergy,
      isCooldownActive,
      cooldownTimeLeft,
    }}>
      {children}
    </EnergyContext.Provider>
  );
};
