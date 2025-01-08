import React, { useState } from 'react'
import styled from 'styled-components'
import ApproveTeacherModal from '../modal/ApproveTeacherModal'
import Loading from '~/components/General/Loading.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import { useTranslation } from "react-i18next";

const TableContainer = styled.div`
    max-height: 80vh;
    overflow-y: auto;
    margin-top: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #333;

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f0f8ff;
        color: #007bff;
        cursor: pointer;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
`

const Th = styled.th`
    padding: 14px;
    border: 1px solid #ddd;
    text-align: left;
    background-color: #0056b3;
    color: white;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
`

const Td = styled.td`
    padding: 14px;
    border: 1px solid #ddd;
    text-align: left;
`

const Button = styled.button`
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    background-color: #ffc107;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: #e0a800;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`

const apiUpdateStatusTicket = import.meta.env.VITE_URL_CREATE_TICKET

// eslint-disable-next-line react/prop-types
const ListTicketReviewed = ({ tickets, refreshTickets }) => {
    const { t, } = useTranslation();
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    const handleRevertClick = (ticket) => {
        setSelectedTicket(ticket)
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setSelectedTicket(null)
    }

    const handleModalSubmit = async () => {
        if (!selectedTicket) return

        const apiUrl = `${apiUpdateStatusTicket}${selectedTicket.ticket_id}`

        try {
            setIsLoading(true)
            const response = await axios.put(
                apiUrl,
                {
                    status: 'In Progress',
                    result: 'Reverted to In Progress'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setIsLoading(false)
                setStatusAPI('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatusAPI(null)
                }, 2000)
                handleModalClose()
                refreshTickets()
            }
        } catch (error) {
            setIsLoading(false)
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
            }, 2000)
        }
    }

    return (
        <>
            {isLoading && <Loading />}
            <APIStatusNotificationModal
                isOpen={!!statusAPI}
                onClose={() => setStatusAPI(null)}
                message={message}
                status={statusAPI}
            />
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>{t('id')}</Th>
                            <Th>{t('student name')}</Th>
                            <Th>{t('teacher name')}</Th>
                            <Th>{t('description')}</Th>
                            <Th>{t('ticket name')}</Th>
                            <Th>{t('going date time')}</Th>
                            <Th>{t('result')}</Th>
                            {/* <Th>{t('status')}</Th> */}
                            <Th>{t('actions')}</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* eslint-disable-next-line react/prop-types */}
                        {tickets.map((ticket, index) => (
                            <tr key={ticket.ticket_id}>
                                <Td isEven={index % 2 === 0}>{ticket.ticket_id}</Td>
                                <Td isEven={index % 2 === 0}>{ticket.student_name || 'N/A'}</Td>
                                <Td isEven={index % 2 === 0}>{ticket.programmer || 'N/A'}</Td>
                                <Td isEven={index % 2 === 0}>{ticket.description}</Td>
                                <Td isEven={index % 2 === 0}>{ticket.ticket_group || 'N/A'}</Td>
                                <Td isEven={index % 2 === 0}>{new Date(ticket.created_at).toLocaleString()}</Td>
                                {/* <Td isEven={index % 2 === 0}>{ticket.result || 'N/A'}</Td> */}
                                <Td isEven={index % 2 === 0}>{ticket.status}</Td>
                                <Td isEven={index % 2 === 0}>
                                    <Button onClick={() => handleRevertClick(ticket)}>{t('revert')}</Button>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
            <ApproveTeacherModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </>
    )
}

export default ListTicketReviewed