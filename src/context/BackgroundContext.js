import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Create a context for the background
const BackgroundContext = createContext();

// Background provider component
export const BackgroundProvider = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  // Function to fetch the active background
  const fetchActiveBackground = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/background/active`);
      if (response.data && response.data.url) {
        setBackgroundImage(response.data.url);
      }
      setIsBackgroundLoaded(true); // Mark background as loaded after fetch
    } catch (error) {
      console.error("Error fetching active background:", error);
    }
  }, []);

  // Fetch the background when the provider mounts
  useEffect(() => {
    fetchActiveBackground(); // Fetch the background once when the app starts
  }, [fetchActiveBackground]);

  // Periodically refetch the background every 2 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchActiveBackground(); // Refetch the background every 2 minutes
    }, 120000); // 120,000 milliseconds = 2 minutes

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [fetchActiveBackground]);

  return (
    <BackgroundContext.Provider value={{ backgroundImage, isBackgroundLoaded }}>
      {children}
    </BackgroundContext.Provider>
  );
};

// Custom hook to use the background context
export const useBackground = () => {
  return useContext(BackgroundContext);
};
