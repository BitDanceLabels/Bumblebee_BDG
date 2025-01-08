import React, { useState } from 'react'
import styled from 'styled-components'
import { FaTrashAlt } from 'react-icons/fa'

// Styled components
const FullModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const FullModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  z-index: 999;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`

const TicketList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`

const TicketItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`

const TicketText = styled.span`
  flex-grow: 1;
  font-size: 16px;
`

const DeleteIcon = styled(FaTrashAlt)`
  color: red;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`

const CancelButton = styled.button`
  padding: 10px;
  background-color: red;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
  }
`

const TicketModal = ({ show, onClose }) => {
  // Sample ticket data
  const [tickets, setTickets] = useState([
    { id: 1, name: 'Ticket 1 - Event A10965' },
    { id: 2, name: 'Ticket 2 - Event B77095' },
    { id: 3, name: 'Ticket 3 - Event A17779' }
  ])

  // Delete ticket function
  const deleteTicket = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id))
  }

  return (
    <FullModalOverlay show={show}>
      <FullModalWrapper>
        <ModalContent>
          <h3>Tickets</h3>
          <TicketList>
            {tickets.map((ticket) => (
              <TicketItem key={ticket.id}>
                <TicketText>{ticket.name}</TicketText>
                <DeleteIcon onClick={() => deleteTicket(ticket.id)} />
              </TicketItem>
            ))}
          </TicketList>

          <ModalButtonWrapper>
            <CancelButton onClick={onClose}>Close</CancelButton>
          </ModalButtonWrapper>
        </ModalContent>
      </FullModalWrapper>
    </FullModalOverlay>
  )
}

export default TicketModal
