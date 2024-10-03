import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const telegramColor = "#0088cc";

// Dynamically import all avatar images
export const avatarImages = {};
for (let i = 1; i <= 20; i++) {
  avatarImages[i] = require(`../assets/avatar/${i}.png`);
}

// Styled components
export const LeaderboardContainer = styled.div`
  background: linear-gradient(135deg, #1e1e1e, #343434);
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', sans-serif;
  padding-bottom: 60px;
  ${'' /* padding: 0 10px; */}
  overflow-x: hidden;
`;

export const PointsDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const PointsDisplay = styled.div`
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: auto;

  @media (max-width: 768px) {
    overflow-x: auto;
    display: block;
    white-space: nowrap;
  }
`;

export const TableHeader = styled.th`
  background-color: #2a2a2a;
  color: #e8e7e4;
  padding: 12px;
  border-bottom: 2px solid #e8e7e4;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:hover {
    background-color: #333333;
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    transform: scale(1.01);
  }
`;

export const Top30LeaderText = styled.h1`
  font-size: 2rem;
  color: #e1ecf2;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
`;

export const RankCell = styled.td`
  width: 20%;
  padding: 8px;
  color: #e8e7e4;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  position: relative;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;

  ${({ rank }) =>
    rank <= 3 &&
    css`
      background: none;
      img {
        width: 40px;
        height: 40px;
      }
    `}
`;

export const UserCell = styled.td`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;
  flex-direction: row;
  justify-content: left;
`;

export const PointsCell = styled.td`
  width: 30%;
  padding: 12px;
  color: #d5dbd7;
  font-weight: bold;
  font-size: 18px;
  text-align: left;

  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
  }
`;

export const UserAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 8px;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
`;

export const NoUsersMessage = styled.div`
  color: #e8e7e4;
  margin-top: 20px;
  font-size: 18px;
`;

export const EarnMoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 40px;
  background-color: #292929;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

export const EarnBox = styled(Link)`
  background-color: #1e1e1e;
  border: 2px solid ${telegramColor};
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 150px;
  color: #e8e7e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  height: 85px;
  flex-grow: 1;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${telegramColor};
    color: white;
    transform: translateY(-2px);
  }
`;

export const EarnBoxIcon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
  color: white;
`;

export const EarnBoxTitle = styled.h2`
  font-size: 14px;
  text-transform: uppercase;
`;
