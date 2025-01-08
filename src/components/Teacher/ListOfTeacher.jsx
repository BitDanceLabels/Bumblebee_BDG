import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import TeacherTable from './TeacherTable'
import Loading from '../General/Loading'
import RejectTeacherModal from '~/components/modal/RejectTeacherModal.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const Container = styled.div`
    background: #f7f7ff;
    font-size: 20px;
    padding: 0 10px;
`

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #ddd;
`

const Tab = styled.button`
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background: ${(props) => (props.active ? '#007bff' : '#f7f7ff')};
    color: ${(props) => (props.active ? '#fff' : '#000')};
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    margin-right: 5px;

    &:focus {
        outline: none;
    }
`

const ListOfTeacher = () => {
    const {t,} = useTranslation();
    const [activeTab, setActiveTab] = useState('Working')
    const [teachers, setTeachers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [actionType, setActionType] = useState('')

    const apiUrl = import.meta.env.VITE_URL_CREAT_TEACHER
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    const handleGetAll = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setTeachers(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    const navigate = useNavigate()
    const handleTeacherClick = (teacher) => {
        navigate('/teacher-profile', {state: {teacher}})
    }

    const handleActionClick = (teacher, action) => {
        setSelectedTeacher(teacher)
        setActionType(action)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedTeacher(null)
        setActionType('')
    }

    const handleModalConfirm = async () => {
        if (!selectedTeacher) return

        const newStatus = actionType === 'Deactivate' ? 'Reject' : 'Approve'

        try {
            setIsLoading(true)
            const response = await axios.put(
                `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api/teachers/${selectedTeacher.idx_teacher}`,
                {offer_status: newStatus},
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
                handleGetAll()
            }
        } catch (error) {
            console.error('Error:', error)
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
            }, 2000)
        } finally {
            setIsLoading(false)
            handleModalClose()
        }
    }

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!statusAPI}
                onClose={() => setStatusAPI(null)}
                message={message}
                status={statusAPI}
            />
            <Container>
                <TabContainer>
                    <Tab
                        active={activeTab === 'Working'}
                        onClick={() => setActiveTab('Working')}
                    >
                        {t('working')}
                    </Tab>
                    <Tab
                        active={activeTab === 'Stopped'}
                        onClick={() => setActiveTab('Stopped')}
                    >
                        {t('stopped')}
                    </Tab>
                </TabContainer>

                {activeTab === 'Working' && (
                    <TeacherTable
                        data={teachers.filter(teacher => teacher.offer_status === 'Approved')}
                        handleTeacherClick={handleTeacherClick}
                        handleActionClick={(teacher) => handleActionClick(teacher, 'Deactivate')}
                        actionType="Deactivate"
                    />
                )}

                {activeTab === 'Stopped' && (
                    <TeacherTable
                        data={teachers.filter(teacher => teacher.offer_status === 'Reject')}
                        handleTeacherClick={handleTeacherClick}
                        handleActionClick={(teacher) => handleActionClick(teacher, 'Activate')}
                        actionType="Activate"
                    />
                )}

                <RejectTeacherModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                    action={actionType}
                    selectedTeacher={selectedTeacher}
                    token={fullData?.access_token}
                />
            </Container>
        </>
    )
}

export default ListOfTeacher
