import React, { createContext, useContext, useState, useEffect } from 'react';

const EnergyContext = createContext();

export const useEnergy = () => {
  return useContext(EnergyContext);
};

export const EnergyProvider = ({ children }) => {
  const [energy, setEnergy] = useState(1000);

  const MAX_ENERGY = 1000;
  const ENERGY_REGEN_RATE = 1; // 1 energy per second
  const USER_ID = 'some_user_id'; // Replace this with actual user ID logic

  useEffect(() => {
    const savedEnergy = localStorage.getItem(`energy_${USER_ID}`);
    const lastUpdate = localStorage.getItem(`lastUpdate_${USER_ID}`);

    let initialEnergy = MAX_ENERGY;

    if (savedEnergy !== null && lastUpdate !== null) {
      const savedEnergyFloat = parseFloat(savedEnergy);
      const lastUpdateInt = parseInt(lastUpdate, 10);

      if (!isNaN(savedEnergyFloat) && !isNaN(lastUpdateInt)) {
        const timeElapsed = (Date.now() - lastUpdateInt) / 1000;
        const regeneratedEnergy = Math.min(MAX_ENERGY, savedEnergyFloat + timeElapsed * ENERGY_REGEN_RATE);
        initialEnergy = regeneratedEnergy;
      }
    }

    setEnergy(initialEnergy);
    localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
    localStorage.setItem(`energy_${USER_ID}`, initialEnergy.toFixed(2));
  }, []);

  useEffect(() => {
    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${USER_ID}`), 10);
        const timeElapsed = (Date.now() - lastUpdate) / 1000;
        const regeneratedEnergy = Math.min(MAX_ENERGY, prevEnergy + timeElapsed * ENERGY_REGEN_RATE);

        localStorage.setItem(`energy_${USER_ID}`, regeneratedEnergy.toFixed(2));
        localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());

        return regeneratedEnergy;
      });
    }, 1000);

    return () => clearInterval(regenInterval);
  }, []);

  const decreaseEnergy = (amount) => {
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - amount, 0);
      localStorage.setItem(`energy_${USER_ID}`, newEnergy.toFixed(2));
      localStorage.setItem(`lastUpdate_${USER_ID}`, Date.now().toString());
      return newEnergy;
    });
  };

  return (
    <EnergyContext.Provider value={{ energy, decreaseEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
};