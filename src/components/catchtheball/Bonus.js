// components/Bonus.js
import React from 'react';
import styled from 'styled-components';

const BonusWrapper = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => (props.type === 'life' ? 'green' : 'purple')};
  left: ${(props) => (props.side === 'left' ? '25%' : '75%')};
  cursor: pointer;
`;

function Bonus({ type, side }) {
  return <BonusWrapper type={type} side={side} />;
}

export default Bonus;
