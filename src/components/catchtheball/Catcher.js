// components/Catcher.js
import React, { useState } from 'react';
import styled from 'styled-components';

const CatcherWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: ${(props) => (props.side === 'left' ? '25%' : '75%')};
  transform: translateX(-50%) rotate(${(props) => props.rotation}deg);
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease;
`;

const CatcherPart = styled.div`
  width: 100%;
  height: 50%;
  background-color: ${(props) => (props.position === 'top' ? 'red' : 'yellow')};
  border-radius: ${(props) => (props.position === 'top' ? '50% 50% 0 0' : '0 0 50% 50%')};
`;

function Catcher({ side, onCatch }) {
  const [rotation, setRotation] = useState(0);

  const rotateCatcher = () => {
    setRotation((prev) => (prev + 180) % 360);
    onCatch(rotation % 360 === 0 ? 'top' : 'bottom');
  };

  return (
    <CatcherWrapper side={side} rotation={rotation} onClick={rotateCatcher}>
      <CatcherPart position="top" />
      <CatcherPart position="bottom" />
    </CatcherWrapper>
  );
}

export default Catcher;
