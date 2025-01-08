import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrashAlt } from 'react-icons/fa'
import Loading from '~/components/General/Loading.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import ApproveTeacherModal from './ApproveTeacherModal.jsx'
import axios from 'axios'
import { useTranslation } from "react-i18next";

// Styled components
const FullModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${({ show }) => (show ? 'block' : 'none')};
    z-index: 1000;
`

const FullModalWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    z-index: 9999;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
`

const TicketList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
`

const TicketItem = styled.li`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 10px;
    border-bottom: 1px solid #ccc;
`

const TicketHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const TicketText = styled.span`
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 1.4rem;
`

const Subtitle = styled.span`
    font-size: 1.5rem;
    color: #666;
`

const Description = styled.p`
    margin: 10px 0;
    font-size: 14px;
`

const TicketFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.8rem;
    font-size: 1.2rem;
`

const Priority = styled.span`
    font-weight: bold;
    color: ${({ priority }) => (priority === 'urgent' ? 'red' : 'green')};
`

const DeleteIcon = styled(FaTrashAlt)`
    color: red;
    cursor: pointer;
    font-size: 16px;

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

const TitleCustom = styled.h3`
    font-size: 20px;
    text-align: center;
`

const urlAPI = import.meta.env.VITE_URL_CREATE_TICKET

// eslint-disable-next-line react/prop-types
const ViewTicketModal = ({ show, onClose, user_id }) => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let token = ''
  //let userId = 0
  if (fullData) {
    token = fullData.access_token
    //userId = fullData.user_id
  }

  useEffect(() => {
    if (show) {
      const fetchTickets = async () => {
        try {
          setIsLoading(true)
          const response = await axios.get(urlAPI, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })

          const filteredTickets = response.data.tickets.filter(
            (ticket) => ticket.creator_id === user_id && ticket.status !== 'Cancelled'
          )

          setTickets(filteredTickets)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching tickets:', error)
          setIsLoading(false)
        }
      }

      fetchTickets()
    }
  }, [show, user_id])

  // Open confirmation modal
  const confirmDelete = (id) => {
    setSelectedTicketId(id)
    setConfirmModalVisible(true)
  }

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModalVisible(false)
    setSelectedTicketId(null)
  }

  const deleteTicket = async () => {
    try {
      setIsLoading(true)
      await axios.put(
        `${urlAPI}${selectedTicketId}`,
        {
          status: 'Completed',
          result: 'Issue resolved'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.ticket_id !== selectedTicketId))
      closeConfirmModal()
      setStatus('success')
      setMessage('Successfully!')
      setTimeout(() => {
        setStatus(null)
      }, 2000)
    } catch (error) {
      console.error('Error updating ticket:', error.response?.data?.message || error.message)
      setStatus('error')
      setMessage(error.response?.data?.message || error.message || 'Failed')
      setTimeout(() => {
        setStatus(null)
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <APIStatusNotificationModal
        isOpen={!!status}
        onClose={() => setStatus(null)}
        message={message}
        status={status}
      />
      <FullModalOverlay show={show}>
        <FullModalWrapper>
          <ModalContent>
            <TitleCustom>{t('tickets')}</TitleCustom>
            <TicketList>
              {tickets.map((ticket) => (
                <TicketItem key={ticket.ticket_id}>
                  <TicketHeader>
                    <TicketText>{ticket.programmer}</TicketText>
                    <DeleteIcon onClick={() => confirmDelete(ticket.ticket_id)} />
                  </TicketHeader>
                  <Subtitle>{t('ticket group')}{': ' + ticket.ticket_group}</Subtitle>
                  <Description>{t('description')}{': ' + ticket.description}</Description>
                  <TicketFooter>
                    <span>Ticket will be processed within 3 days</span>
                    <Priority priority={ticket.priority ? ticket.priority.toLowerCase() : ''}>
                      {ticket.priority || ''}
                    </Priority>
                  </TicketFooter>
                </TicketItem>
              ))}
            </TicketList>
            <ModalButtonWrapper>
              <CancelButton onClick={onClose}>{t('close')}</CancelButton>
            </ModalButtonWrapper>
          </ModalContent>
        </FullModalWrapper>
      </FullModalOverlay>

      <ApproveTeacherModal
        isOpen={confirmModalVisible}
        onClose={closeConfirmModal}
        onSubmit={deleteTicket}
      />
    </>
  )
}

export default ViewTicketModal
