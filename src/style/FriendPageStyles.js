import styled from "styled-components";
import { FaCopy, FaRegGem } from "react-icons/fa";

// Color Palette
const mainBackground = "#1f1f1f"; 
const dimmedBackground = "rgba(255, 255, 255, 0.1)"; // Dimmed background for cards/sections
// const boxShadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow for containers
const telegramBlue = "#0088cc"; // Main Telegram blue
const telegramLightBlue = "#36A8E5"; // Light blue for highlights
const white = "#ffffff"; // White for main text/icons

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${mainBackground};
  padding: 30px 20px;
  color: ${white};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

// User Info Section
export const UserInfoContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

// Points Display section
export const PointsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

export const InviteIcon3D = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  filter: drop-shadow(0px 0px 8px ${telegramLightBlue});
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
`;

export const InviteText = styled.p`
  font-size: 20px;
  text-align: center;
  color: ${white};
  margin-bottom: 40px;
`;

// Referral section
export const ReferralContainer = styled.div`
  background: ${dimmedBackground};
  padding: 25px;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  margin-top: 30px;
`;

export const BonusBox = styled.div`
  background: ${dimmedBackground};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const BonusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const BonusIcon = styled.img`
  width: 50px;
  height: 50px;
  user-select: none;      /* Disable text/image selection */
  pointer-events: none;   /* Disable all pointer events */
  -webkit-user-drag: none; /* Disable drag on image in Webkit-based browsers */
`;

export const BonusText = styled.div`
  font-size: 18px;
  color: ${white};
  display: flex;
  flex-direction: column;
`;

export const CrownText = styled.span`
  font-size: 16px;
  color: #f3e9e9;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const BonusArrow = styled.div`
  font-size: 20px;
  color: ${white};
`;

// Referral Button and Copy Button
export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

export const ReferralButton = styled.button`
  background-color: ${telegramBlue}; 
  color: white;
  padding: 12px 50px;
  border-radius: 8px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  border: none; 
  outline: none; 

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${telegramLightBlue};
  }
`;

export const CopyIcon = styled(FaCopy)`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8); 
  font-size: 32px;
  transition: color 0.3s;

  &:hover {
    color: ${white}; 
  }
`;

// Copy Success Message
export const CopySuccessMessage = styled.p`
  color: ${telegramLightBlue};
  font-size: 16px;
  text-align: center;
  margin-top: 15px;
`;

export const ReferralStatsContainer = styled(ReferralContainer)`
  margin-top: 40px;
`;

export const ReferralStatsHeading = styled.h3`
  font-size: 20px;
  color: ${white};
  margin-bottom: 10px;
`;

export const NoReferralsMessage = styled.p`
  font-size: 16px;
  color: ${white};
  text-align: center;
  margin-top: 20px;
`;

export const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.08); 
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); 
`;

export const ReferralUsername = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${white};
`;

export const ReferralPoints = styled.div`
  display: flex;
  align-items: center; // Aligns crown and points vertically
  font-size: 16px;
  color: ${white};
  gap: 8px; // Adds spacing between crown and points
`;

export const PointText = styled.span`
  margin-top: 0;
  font-size: 16px;
`;

export const GemIcon = styled(FaRegGem)`
  color: #f3e9e9;
  font-size: 1.3rem;
`;
