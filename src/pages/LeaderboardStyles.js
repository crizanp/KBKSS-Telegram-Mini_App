import styled, { keyframes } from "styled-components";

// Basic container styling
export const LeaderboardContainer = styled.div`
  width: 100%;
  margin: 20px auto;
`;

export const PointsDisplayContainer = styled.div`
  text-align: center;
  margin: 20px 0;
`;

export const PointsDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 3rem;
    color: #007bff;
  }

  div {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
      padding: 10px 20px;
      margin: 0 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1.2rem;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
`;

export const TableHeader = styled.th`
  font-size: 1.2rem;
  color: #007bff;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const RankCell = styled.td`
  font-weight: bold;
`;

export const UserCell = styled.td``;

export const PointsCell = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Design for the top 3 winners
export const TopThreeWinners = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
`;

export const WinnerCrown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${(props) => (props.rank === 1 ? "2rem" : "1.5rem")};
  color: ${(props) => (props.rank === 1 ? "#FFD700" : props.rank === 2 ? "#C0C0C0" : "#cd7f32")};

  img {
    width: ${(props) => (props.rank === 1 ? "150px" : "100px")};
    height: ${(props) => (props.rank === 1 ? "150px" : "100px")};
    border-radius: 50%;
    border: 5px solid ${(props) => (props.rank === 1 ? "#FFD700" : props.rank === 2 ? "#C0C0C0" : "#cd7f32")};
  }

  h2 {
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 1.5rem;
  }
`;
export const NoUsersMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #ff0000; // You can style it as needed (e.g., a red color for an error message).
  margin-top: 20px;
`;
// Avatar Images Placeholder
export const avatarImages = [...Array(21).keys()].map((i) => `https://example.com/avatar/${i}.png`);
