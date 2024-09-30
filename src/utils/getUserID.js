import axios from "axios";

export const getUserID = async () => {
  const isLocalhost = window.location.hostname === "localhost";

  // Check if the app is running inside Telegram
  const isTelegramAvailable = window.Telegram?.WebApp;

  // Initialize Telegram WebApp if available
  if (isTelegramAvailable) {
    try {
      window.Telegram.WebApp.ready();  // Ensure the Telegram WebApp is initialized
    } catch (error) {
      console.error("Error initializing Telegram WebApp:", error);
    }
  }

  // If Telegram Web App is available, get the user ID, username, and first name
  let tgUserID = isTelegramAvailable?.initDataUnsafe?.user?.id || null;
  let tgUsername = isTelegramAvailable?.initDataUnsafe?.user?.username || null;
  let tgFirstName = isTelegramAvailable?.initDataUnsafe?.user?.first_name || null;

  // For localhost testing
  if (isLocalhost) {
    tgUserID = "mockUserID123";
    tgUsername = "mockUsername"; // Mock username for testing
    tgFirstName = "MockFirstName"; // Mock first name for testing
    console.warn(
      "Running on localhost: Mock Telegram user ID, username, and first name assigned."
    );
  }

  // If Telegram user ID is available
  if (tgUserID) {
    tgUserID = tgUserID.toString();

    try {
      // Check if the user already exists in the database
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);

      // Return the user ID
      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist, create the user
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || tgFirstName || "Unknown", // Use username or fallback to first name
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });

          return tgUserID;
        } catch (postError) {
          console.error("Error creating new user:", postError);
          throw postError;
        }
      } else {
        console.error("Error fetching user data:", error);
        throw error;
      }
    }
  } else {
    console.error(
      "User ID not available from Telegram. Make sure to access the app from Telegram."
    );
    throw new Error("User ID not available from Telegram.");
  }
};
