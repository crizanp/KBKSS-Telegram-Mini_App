import styled, { keyframes } from 'styled-components';
import { FaArrowAltCircleLeft, FaGem, FaTrophy } from 'react-icons/fa';

// Glowing animation for the level circle border
const glowCircle = keyframes`
  0% {
    box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
  }
  50% {
    box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff;
  }
  100% {
    box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
  }
`;

// Glowing animation for text
const glowText = keyframes`
  0% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
  }
  50% {
    text-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff;
  }
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
  }
`;

// Styled Components

export const LevelPageContainer = styled.div`
  background-color: #090c12;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
`;

export const SliderIconContainer = styled.div`
  position: absolute;
  top: 36%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
`;

export const LeftSliderIcon = styled(FaArrowAltCircleLeft)`
  color:#fafafa;
  font-size: 3rem;
`;

export const RightSliderIcon = styled(FaArrowAltCircleLeft)`
  color: #fafafa;
  font-size: 3rem;
  transform: rotate(180deg);
`;

export const LevelContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const LevelCircle = styled.div`
  background-color: ${(props) => props.color || '#36a8e5'};
  border-radius: 50%;
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  color: white;
  animation: ${glowCircle} 2s ease-in-out infinite;
  margin-bottom: 10px;
`;

export const LevelName = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.color || '#36a8e5'};
  text-transform: uppercase;
  margin-bottom: 10px;
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.width || '50%'};
  background-color: ${(props) => props.color || '#36a8e5'};
  border-radius: 10px;
  transition: width 0.4s ease;
`;

export const GemIcon = styled(FaGem)`
  position: absolute;
  top: -2px;
  left: ${(props) => props.position || '0%'};
  transform: translateX(-50%);
  font-size: 1.45rem;
  color: #fff;
`;

export const CriteriaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
  max-width: 600px;
`;

export const CriterionBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 0px;
  border-radius: 10px;
  margin: 10px 0;
  font-size: 1.2rem;
  color: ${(props) => (props.completed ? '#4caf50' : '#e0e0e0')};
`;

export const CriterionText = styled.div`
  flex: 1;
  text-align: left;
  font-size: 1.2rem;
`;

export const CriterionIcon = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

// Congrats Message Styles

export const CongratsContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(90deg, rgba(255,0,150,0.7), rgba(0,204,255,0.7));
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255,0,255,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${glowText} 2s infinite alternate;
`;

export const TrophyIcon = styled(FaTrophy)`
  color: gold;
  margin-right: 10px;
  font-size: 2.5rem;
`;

export const CongratsText = styled.h1`
  font-size: 2.5rem;
  font-family: 'Cursive', sans-serif;
  color: white;
  margin: 0;
  animation: ${glowText} 2s infinite alternate;
`;

