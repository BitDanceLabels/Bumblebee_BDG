import React from 'react'
import styled from 'styled-components'
import { BsDot } from 'react-icons/bs'

// Styled components
const MiniModalWrapper = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px 16px;
  z-index: 10;
  width: 200px;
  top: ${({ position }) => position.top}px;
  left: ${({ position }) => position.left}px;
`

const CloseButton = styled.button`
  padding: 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
  margin-top: 10px;

  &:hover {
    background-color: #46b346;
  }
`

const DetailsSession = ({ position, events, onClose }) => (
  <MiniModalWrapper position={position}>
    {events.map((event, index) => (
      <div key={index}>
        <BsDot fontSize={16} color="blue" />
        {event}
      </div>
    ))}
    <CloseButton onClick={onClose}>Close</CloseButton>
  </MiniModalWrapper>
)

export default DetailsSession
