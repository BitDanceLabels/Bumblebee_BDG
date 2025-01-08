import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CreateStudentModal from '../modal/CreateStudentModal'
import Loading from '~/components/General/Loading.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import { useTranslation } from "react-i18next";

const ListOfStudent = () => {
    const { t, } = useTranslation();
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [newStudent, setNewStudent] = useState({
        name: '',
        phoneNumber: '',
        id: '',
        email: '',
        course: '',
        status: 'Pending'
    })

    const apiUrl = import.meta.env.VITE_URL_CREAT_STUDENT
    const token = JSON.parse(localStorage.getItem('fullData'))?.access_token || ''

    const fetchStudents = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setStudents(response.data)
            } else {
                console.log('Failed to fetch students:', response.statusText)
            }
        } catch (error) {
            console.error('Error fetching students:', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleStatusChange = async (student, newStatus) => {
        try {
            setIsLoading(true)

            const response = await axios.put(
                `${apiUrl}${student.student_id}`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setStatusAPI('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatusAPI(null)
                }, 2000)
                await fetchStudents()
            }
        } catch (error) {
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
            }, 2000)
        } finally {
            setIsLoading(false)
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
            <WrapperAll>
                <Button onClick={() => setCreateModalOpen(true)}>{t('create student')}</Button>
                <TableWrapper>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('full name')}</th>
                                <th>{t('phone number')}</th>
                                <th>{t('email')}</th>
                                <th>{t('learner’s level')}</th>
                                <th>{t('birthday')}</th>

                                <th>{t('address')}</th>
                                <th>{t('learning goal')}</th>
                                <th>{t('occupation')}</th>
                                <th>{t('status')}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td onClick={() => navigate('/student-profile', { state: { student } })}
                                        style={{ cursor: 'pointer' }}>
                                        {student.name_student}
                                    </td>
                                    <td>{student.phone_number}</td>
                                    <td>{student.email}</td>
                                    <td>{student.english_level}</td>
                                    <td>{student.birthday}</td>

                                    <td>{student.address}</td>
                                    <td>{student.learning_goal}</td>
                                    <td>{student.occupation}</td>

                                    <td>
                                        <StatusCard>
                                            <StatusSelect
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student, e.target.value)}
                                            >
                                                <option value="Ended">Ended</option>
                                                <option value="Pending">Pending</option>
                                                <option value="In progress">In progress</option>
                                            </StatusSelect>
                                        </StatusCard>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableWrapper>

                <CreateStudentModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={() => {
                        setCreateModalOpen(false)
                        fetchStudents()
                    }}
                    formData={newStudent}
                    setFormData={setNewStudent}
                />
            </WrapperAll>
        </>
    )
}

const WrapperAll = styled.div`
    padding: 0 10px;
`

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;

    &:hover {
        background-color: #0056b3;
    }
`

const TableWrapper = styled.div`
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    margin-top: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }

    th, td {
        padding: 14px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #0056b3;
        color: white;
        font-weight: 600;
        letter-spacing: 0.05em;
        position: sticky;
        top: 0;
        z-index: 1;
        text-transform: uppercase;
    }

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

const StatusCard = styled.div`
    background-color: #f0f0f0;
    padding: 5px;
    border-radius: 5px;
    display: inline-block;
`

const StatusSelect = styled.select`
    padding: 8px 10px;
    border: none;
    font-weight: bold;
    background-color: ${({ value }) =>
        value === 'Ended' ? '#F44336' : value === 'Pending' ? '#FFC107' : '#4CAF50'};
    color: white;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
`

export default ListOfStudent
