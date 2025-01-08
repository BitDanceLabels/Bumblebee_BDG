import React from 'react'
import styled from 'styled-components'

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.div`
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`

const DetailClassInfo = ({ isOpen, onClose, classInfo }) => {
  if (!isOpen) return null

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Class Info</h2>
        <p>
          <strong>Code:</strong> {classInfo.code}
        </p>
        <p>
          <strong>Teacher:</strong> {classInfo.teacher}
        </p>
        <p>
          <strong>Time:</strong> {classInfo.time}
        </p>
        <p>
          <strong>Type:</strong> {classInfo.type}
        </p>
      </ModalContainer>
    </ModalBackground>
  )
}

export default DetailClassInfo
