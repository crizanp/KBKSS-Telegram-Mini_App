import React, { useState, useEffect } from "react";
import { TonConnect } from "@tonconnect/sdk";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import { showToast } from "./ToastNotification";

const ConnectWallet = ({ onConnectionSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { userID, setPoints } = usePoints();
  const [tonConnect, setTonConnect] = useState(null);

  useEffect(() => {
    // Initialize TonConnect SDK
    const tonConnectInstance = new TonConnect({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
    });
    setTonConnect(tonConnectInstance);
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      if (!tonConnect) {
        showToast("TON Wallet SDK not initialized", "error");
        setIsConnecting(false);
        return;
      }

      // Use TonConnect's connect method with options to ensure modal appearance
      const walletConnection = await tonConnect.connect({
        showQR: true, // Ensures a modal/overlay instead of a new page
      });

      if (walletConnection) {
        showToast("Wallet connected successfully!", "success");

        // Award 5000 gems upon successful connection
        const rewardPoints = 5000;
        await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`, {
          pointsToAdd: rewardPoints,
        });

        // Update points in context
        setPoints((prevPoints) => prevPoints + rewardPoints);
        onConnectionSuccess(); // Notify parent component of success
      } else {
        showToast("Wallet connection failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error connecting TON wallet:", error);
      showToast("Error connecting wallet. Please try again later.", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect TON Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;
