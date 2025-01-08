import React, { useState, useRef, useEffect } from 'react'
import { generateCalendar } from './Calender'
import {
    Container,
    Header,
    ButtonWrapper,
    ExcelButton,
    TicketButton,
    InputCustom,
    Month,
    CalendarTable,
    CalendarHeader,
    ViewTicketButton,
    TeacherSelect
} from './TimeTableStyle'
import DetailsSession from '../modal/DetailsSessionModal'
import TicketModal from '../modal/TicketModal'
import ViewTicketModal from '../modal/ViewTicketModal'
import Loading from '~/components/General/Loading.jsx'
import axios from 'axios'
import ClassDiaryModal from '../modal/ClassDiaryModal.jsx';
import { useTranslation } from "react-i18next";
import ChangeStatusClassSessionModal from "../modal/ChangeStatusClassSessionModal.jsx";

const TeacherTimeTable = () => {
    const { t, } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFullModalOpen, setIsFullModalOpen] = useState(false)
    const [currentEvents, setCurrentEvents] = useState([])
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
    const [isViewTicketModalOpen, setIsViewTicketModalOpen] = useState(false)
    const [events, setEvents] = useState({})
    const [teachers, setTeachers] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [classSessionStatus, setClassSessionStatus] = useState('')
    const cellRef = useRef(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let role = ''
    let token = ''
    if (fullData) {
        role = fullData.role_group.toLowerCase()
        token = fullData.access_token
        console.log('Logged in with role:', role)
    }

    const fetchTeachers = async () => {
        try {
            setIsLoading(true)

            const { data } = await axios.get(`${import.meta.env.VITE_URL_GET_ALL_TEACHER}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setTeachers(data)
            console.log('Teachers list:', data)
        } catch (error) {
            console.error('Error fetching teachers:', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch list of teachers if role is admin or sub_admin
    useEffect(() => {
        if (role === 'admin' || role === 'sub_admin') {
            fetchTeachers()
        } else if (role === 'teacher') {
            const userTeacherId = fullData.user_id
            setTeacherAndFetchData(userTeacherId)
        }
    }, [role])

    const getCurrentMonth = () => {
        const year = selectedDate.getFullYear()
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
        return `${year}-${month}`
    }

    const handleMonthChange = (event) => {
        const [year, month] = event.target.value.split('-')
        setSelectedDate(new Date(year, month - 1, 1))
    }

    const handleTeacherChange = (event) => {
        const selectedTeacherId = event.target.value
        setSelectedTeacher(selectedTeacherId)
        console.log('Selected Teacher ID:', selectedTeacherId)
        fetchClassSessions(selectedTeacherId)
    }

    const setTeacherAndFetchData = (teacherId) => {
        setSelectedTeacher(teacherId)
        console.log('Automatically set Teacher ID:', teacherId)
        fetchClassSessions(teacherId)
    }

    const daysOfWeek = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')]

    const fetchStudentName = async (student_id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_URL_GET_STUDENT_ID}${student_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`Student name for ID ${student_id}:`, data.name_student)
            return data.name_student || 'Unknown'
        } catch (error) {
            console.error('Error fetching student name:', error.response?.data?.message || error.message)
            return 'Unknown'
        }
    }

    const fetchClassSessions = async (teacher_id) => {
        try {
            setIsLoading(true)
            setEvents({})
            setErrorMessage('')

            const url = `${import.meta.env.VITE_URL_GET_CLASS_SESSION_MONTHLY_TEACHER_ID}?teacher_id=${teacher_id}&month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const classSessions = response.data

            if (!classSessions || classSessions.length === 0) {
                setErrorMessage('Giáo viên này chưa được phân lớp.')
                setEvents({})
                setIsLoading(false)
                return
            }

            const parsedEvents = {}

            for (const session of classSessions) {
                const vietnamTime = new Date(session.going_date_time)
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
                const localTime = new Date(vietnamTime.toLocaleString('en-US', { timeZone: userTimeZone }))

                const day = localTime.getDate()
                const startTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const endTime = new Date(localTime.getTime() + session.duration * 60000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })

                const studentName = await fetchStudentName(session.student_id)

                if (!parsedEvents[day]) {
                    parsedEvents[day] = []
                }

                parsedEvents[day].push({
                    time: `${startTime} - ${endTime}`,
                    code: session.id_class_session,
                    student: studentName,
                    status: session.session_status,
                    goingDateTime: session.going_date_time,
                    note: session.note,
                    coachPlanNextLesson: session.coach_plan_next_lesson,
                    lessonReport: session.lesson_report,
                })
            }

            setEvents(parsedEvents)
            setErrorMessage('')
        } catch (error) {
            console.error('Error fetching class sessions:', error.response?.data?.message || error.message)
            setEvents({})
            setErrorMessage('Đã xảy ra lỗi khi lấy dữ liệu lớp học.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedTeacher) {
            fetchClassSessions(selectedTeacher)
        }
    }, [selectedTeacher, selectedDate])

    const openModal = (dayEvents, event) => {
        const rect = event.target.getBoundingClientRect()
        setModalPosition({
            top: rect.top + window.scrollY + rect.height,
            left: rect.left + window.scrollX
        })
        setCurrentEvents(dayEvents)
        setIsModalOpen(true)
    }

    const fetchData = () => {
        setTeacherAndFetchData(selectedTeacher)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentEvents([])
        setIsFullModalOpen(false)
        setIsViewTicketModalOpen(false)
        setClassSessionStatus(null)
        setSelectedEvent(null);
    }

    const openFullModal = () => {
        setIsFullModalOpen(true)
    }

    const openViewTicketModal = () => {
        setIsViewTicketModalOpen(true)
    }

    // const handleDayClick = (day, events) => {
    //   navigate('/class-diary', { state: { day, events } });
    // };
    const handleDayClick = (day, event) => {
        setSelectedEvent({ day, ...event });
        console.log(event.status)
        setClassSessionStatus(event.status)
    };

    return (
        <>
            {isLoading && <Loading />}
            <Container>
                <Header>
                    <div>
                        <InputCustom
                            type="month"
                            value={getCurrentMonth()}
                            onChange={handleMonthChange}
                        />

                        {(role === 'admin' || role === 'sub_admin') ? (
                            <TeacherSelect
                                value={selectedTeacher}
                                onChange={handleTeacherChange}
                            >
                                <option value="" disabled>
                                    {t('select a teacher')}
                                </option>
                                {teachers.map((teacher, index) => (
                                    <option key={teacher.teacher_id || index} value={teacher.teacher_id}>
                                        {teacher.full_name}
                                    </option>
                                ))}
                            </TeacherSelect>
                        ) : (
                            <p></p>
                        )}

                    </div>
                    <ButtonWrapper>
                        <ExcelButton>{t('export time table')}</ExcelButton>
                        <TicketButton onClick={openFullModal}>{t('create ticket')}</TicketButton>
                        <ViewTicketButton onClick={openViewTicketModal}>
                            {t('view ticket')}
                        </ViewTicketButton>
                    </ButtonWrapper>
                </Header>

                <Month>
                    {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
                    {selectedDate.getFullYear()}
                </Month>

                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

                <CalendarTable>
                    <thead>
                        <tr>
                            {daysOfWeek.map((day) => (
                                <CalendarHeader key={day}>{day}</CalendarHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(events).length === 0 ? (
                            <tr>
                                <td colSpan={7}
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        fontSize: '1.8rem',
                                        fontWeight: '600',
                                        fontStyle: 'italic',
                                        letterSpacing: '1px',
                                        color: 'red'
                                    }}>
                                    {t('there are no classes for this month')}
                                </td>
                            </tr>
                        ) : (
                            generateCalendar(selectedDate, events, openModal, cellRef, handleDayClick)
                        )}
                    </tbody>
                </CalendarTable>
                {/* Overlay */}
                {classSessionStatus === "finished" && (
                    <div className="overlay" onClick={closeModal}>
                        <div
                            className="overlay-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-button" onClick={closeModal}>
                                &times;
                            </button>

                            <ClassDiaryModal data={selectedEvent} onClose={closeModal}
                                fetchData={fetchData} />
                        </div>
                    </div>
                )}
                {classSessionStatus === "upcoming" && (
                    <div className="overlay" onClick={closeModal}>
                        <div
                            className="overlay-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-button" onClick={closeModal}>
                                &times;
                            </button>

                            <ChangeStatusClassSessionModal data={selectedEvent} onClose={closeModal}
                                fetchData={fetchData} />
                        </div>
                    </div>
                )}
                {isModalOpen && (
                    <DetailsSession
                        position={modalPosition}
                        events={currentEvents}
                        onClose={closeModal}
                    />
                )}

                {/* Full screen modal */}
                <TicketModal
                    show={isFullModalOpen}
                    events={events}
                    onClose={closeModal}
                    selectedTeacher={teachers.find((teacher) => String(teacher.teacher_id) === String(selectedTeacher))} // So sánh ki
                />


                {/* Modal View Ticket */}
                <ViewTicketModal
                    show={isViewTicketModalOpen}
                    events={events}
                    onClose={closeModal}
                />
            </Container>
        </>
    )
}

export default TeacherTimeTable
