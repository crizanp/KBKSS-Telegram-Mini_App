import React from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
  color: white;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.isCancel ? '#555' : '#36a8e5')};
  color: white;
`;

const AvatarSelectionModal = ({ message, title, onConfirm, onCancel, iconUrl }) => {
  return (
    <ModalContainer>
      <ModalContent>
        <img src={iconUrl} alt="modal-icon" style={{ width: '50px', marginBottom: '10px' }} />
        <h2>{title}</h2>
        <ModalMessage>{message}</ModalMessage>
        <ModalActions>
          <Button isCancel onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalActions>
      </ModalContent>
    </ModalContainer>
  );
};

export default AvatarSelectionModal;
