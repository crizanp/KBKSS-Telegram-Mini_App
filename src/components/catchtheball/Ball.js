// components/Ball.js
import React from 'react';
import styled from 'styled-components';

const BallWrapper = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  left: ${(props) => (props.side === 'left' ? '25%' : '75%')};
`;

function Ball({ color, side }) {
  return <BallWrapper color={color} side={side} />;
}

export default Ball;
