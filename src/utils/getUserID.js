import axios from "axios";

export const getUserID = async (setUserID = () => {}, setUsername = () => {}) => {
  const isLocalhost = window.location.hostname === "localhost";

  // Check if the app is running inside Telegram
  const isTelegramAvailable = window.Telegram?.WebApp?.initDataUnsafe?.user;

  // If Telegram Web App is available, get the user ID, username, and first name
  let tgUserID = isTelegramAvailable
    ? window.Telegram.WebApp.initDataUnsafe.user.id
    : null;
  let tgUsername = isTelegramAvailable
    ? window.Telegram.WebApp.initDataUnsafe.user.username
    : null;
  let tgFirstName = isTelegramAvailable
    ? window.Telegram.WebApp.initDataUnsafe.user.first_name
    : null;

  // For localhost testing
  if (isLocalhost) {
    tgUserID = "mockUserID123";
    tgUsername = "mockUsername"; // Mock username for testing
    tgFirstName = "MockFirstName"; // Mock first name for testing
    console.warn(
      "Running on localhost: Mock Telegram user ID, username, and first name assigned."
    );
  }

  // Function to clean the first name and limit it to 8 characters
  const cleanFirstName = (firstName) => {
    if (!firstName) return "Unknown"; // Fallback if no first name is available
    // Remove special characters and emojis, keep only letters and numbers, limit to 8 characters
    return firstName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8) || "Unknown";
  };

  // Function to check if referral status should be updated for the current session
  const shouldCheckReferralStatus = () => {
    return !sessionStorage.getItem(`referralChecked_${tgUserID}`);
  };

  // If Telegram user ID is available
  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID); // Ensure this line doesn't break if no setUserID function is passed

    // If username is available, set it; otherwise, fallback to a clean first name
    if (tgUsername) {
      setUsername(tgUsername);
    } else {
      const cleanedFirstName = cleanFirstName(tgFirstName);
      setUsername(cleanedFirstName); // Use the cleaned first name
    }

    try {
      // Check if the user already exists in the database
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);

      // Only check the referral status once per session
      if (shouldCheckReferralStatus()) {
        await checkAndCompleteReferral(tgUserID);
        sessionStorage.setItem(`referralChecked_${tgUserID}`, "true"); // Mark referral check as done for the session
      }

      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist, create the user
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || cleanFirstName(tgFirstName), // Pass the correct username or cleaned first name
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });

          // After registering the user, check if they are a referred user
          await checkAndCompleteReferral(tgUserID);
          sessionStorage.setItem(`referralChecked_${tgUserID}`, "true"); // Mark referral check as done for the session

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

// Function to check referral and update status to complete if the user is referred
const checkAndCompleteReferral = async (tgUserID) => {
  try {
    // Make a request to check if this user is in the referral system
    const referralResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/referrals/check/${tgUserID}`
    );

    // If referral exists and is incomplete, update it to complete
    if (
      referralResponse.data &&
      referralResponse.data.status === "incomplete"
    ) {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/referrals/complete/${tgUserID}`
      );
      console.log(`Referral for user ${tgUserID} marked as complete.`);
    }
  } catch (error) {
    // Suppress 404 errors (user not in referral system), but log other errors
    if (error.response && error.response.status === 404) {
      console.log(`No referral found for user ${tgUserID}.`);
    } else {
      console.error("Error checking or completing referral:", error);
    }
  }
};
