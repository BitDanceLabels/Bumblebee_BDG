import {useEffect, useRef, useState} from 'react'
import {FaEdit, FaEnvelope, FaSave} from 'react-icons/fa';
import styled from 'styled-components'
import {
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isValid,
    startOfMonth,
    startOfWeek
} from 'date-fns'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Pie} from 'react-chartjs-2';
import {ArcElement, Chart as ChartJS, Legend, Tooltip,} from 'chart.js';
import {useLocation} from "react-router-dom";
import ChangeTeacher from "../modal/ChangeTeacher.jsx";
import Loading from "../General/Loading.jsx";
import axios from "axios";
import {useTranslation} from "react-i18next";
import handleFileUpload from "../../firebase";
import UpdateSchedule from "../modal/UpdateSchedule.jsx";
import ChangeSession from "../modal/ChangeSession.jsx";
import CreateSessionDeferredOrCancel from "../modal/CreateSessionDeferredOrCancel.jsx";

const SessionCard = styled.div`
    background-color: ${({isPast}) => isPast ? '#CCC' : '#ffffff'};
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    margin-top: 10px;
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: ${({isPast}) => (isPast ? 'not-allowed' : 'pointer')};

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .session-info {
        color: #333;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .session-time {
        font-size: 1.2rem;
        color: #555;
    }
`;

const CourseInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-family: Arial, sans-serif;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const CourseTitle = styled.div`
    font-size: 2rem;
    font-weight: bold;
`
const DateInput = styled.input`
    border: 1px solid #ccc;
    padding: 5px;
    margin-left: 20px;
`

const ConsultantInfo = styled.div`
    margin-top: 10px;
    font-size: 1.5rem;
`

const ScheduleContainer = styled.div`
    margin-top: 20px;
    font-size: 1.2rem;
`

const WeekContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`

const DayRow = styled.div`
    display: flex;
    margin-bottom: 10px;
`

const Day = styled.div`
    flex: 1;
    text-align: center;
    padding: 10px;
    background-color: ${({active}) => (active ? '#7d4ab0' : '#ccc')};
    color: white;
`

const ActionButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    button {
        margin-left: 10px;
        padding: 8px 12px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-weight: bold;

        &:hover {
            opacity: 0.8;
        }
    }

    .create-session {
        background-color: #0053f0;
        color: white;
    }

    .add-bonus {
        background-color: #f0a500;
        color: white;
    }

    .update-schedule {
        background-color: #00c4cc;
        color: white;
    }

    .change-teacher {
        background-color: #4caf50;
        color: white;
    }

`

const TabsContainer = styled.div`
    display: flex;
    border-bottom: 2px solid #ddd;
    margin-top: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// TabButton (nút tab)
const TabButton = styled.div`
    padding: 12px 20px;
    cursor: pointer;
    text-align: center;
    flex: 1;
    background-color: ${props => (props.active ? '#f0f0f0' : '#fff')};
    border: 1px solid #ddd;
    border-bottom: none;
    font-weight: ${props => (props.active ? 'bold' : 'normal')};
    font-size: 1.4rem;
    letter-spacing: 1px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #e0e0e0;
        color: #007bff;
    }

    ${props =>
            props.active &&
            `
    background-color: #007bff;
    color: white;
    border-radius: 4px 4px 0 0;
  `}
`;

const TableHeader = styled.th`
    text-align: center;
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f7f7f7;
    font-weight: bold;
    color: #333;
    transition: background-color 0.3s;
`;

const TableCell = styled.td`
    text-align: center;
    border: 1px solid #ddd;
    padding: 10px;
`;

const TabPanel = styled.div`
    display: ${props => (props.active ? 'block' : 'none')};
`;

const Table = styled.table`
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
    font-size: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    th, td {
        border: 1px solid #ddd;
        padding: 12px 15px;
        text-align: center;
        vertical-align: middle;
        font-size: 1.4rem;
    }

    th {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
    }

    td {
        background-color: #f9f9f9;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }
`;

const NoteInputWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const NoteInput = styled.input`
    border: 1px solid #ccc;
    padding: 5px;
    margin-left: 10px;
    width: 80%;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #4CAF50;
    font-size: 1.2rem;

    &:hover {
        color: #388e3c;
    }
`;

const FileUploadContainer = styled.div`
    position: relative;
`;

const FileInput = styled.input`
    display: none;
`;

const CustomFileUpload = styled.div`
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const monthColors = {
    '01': '#e3f2fd', // January
    '02': '#f8bbd0', // February
    '03': '#ffeb3b', // March
    '04': '#c8e6c9', // April
    '05': '#ffe0b2', // May
    '06': '#c5cae9', // June
    '07': '#ffccbc', // July
    '08': '#d1c4e9', // August
    '09': '#ffecb3', // September
    '10': '#e1bee7', // October
    '11': '#b2dfdb', // November
    '12': '#c8e6c9', // December
};

const apiGetListClassSessionUrl = import.meta.env.VITE_API_GET_LIST_CLASS_SESSION_BY_COURSE_ID
const apiClassSession = import.meta.env.VITE_URL_CLASS_SESSION
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CourseInfo = () => {
    const {t,} = useTranslation();
    const chartRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState('2024-10');
    const [totalSessionDeferredOrCancelled, setTotalSessionDeferredOrCancelled] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [sessionsByDay, setSessionsByDay] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [courseInfo, setCourseInfo] = useState({});
    const [notes, setNotes] = useState({});
    const location = useLocation();
    const [isEditingNote, setIsEditingNote] = useState({});
    const [selectedTab, setSelectedTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isChangeTeacher, setIsChangeTeacher] = useState(false);
    const [isCreateSessionDeferredOrCancelled, setIsCreateSessionDeferredOrCancelled] = useState(false);
    const [isChangeSchedule, setIsChangeSchedule] = useState(false);
    const [weekNumbers, setWeekNumbers] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const fullData = JSON.parse(localStorage.getItem('fullData'));
    let token = '';
    if (!fullData) {
        console.log('Empty');
    } else {
        token = fullData.access_token;
    }
    const courseId = queryParams.get('courseId');

    const openModal = (session) => {
        console.log('Opening modal for session: ', session);
        setSelectedSession({...session});
        setIsModalOpen(true);
    };

    const fetchData = async () => {
        if (!courseId) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`${apiGetListClassSessionUrl}?courseId=${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const sessionData = JSON.parse(response.data.data);

            setTotalSessionDeferredOrCancelled(sessionData.classes.filter(session => session.going_date_time === '1970-01-01T00:00:00').length);

            if (Array.isArray(sessionData.classes)) {
                setSessions(sessionData.classes);

                if (sessionData.classes.length > 0) {
                    setCourseInfo({
                        program_name: sessionData.program_name,
                        level_program: sessionData.level_program,
                        teacher_name: sessionData.teacher_name,
                        schedule: sessionData.schedule,
                        status: sessionData.session_status,
                    });
                }

                const groupedSessions = sessionData.classes.reduce((acc, session) => {
                    const sessionDate = new Date(session.going_date_time);
                    const day = format(sessionDate, 'yyyy-MM-dd');
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(session);
                    return acc;
                }, {});
                setSessionsByDay(groupedSessions);

                const futureSessions = sessionData.classes.filter(
                    (session) => new Date(session.going_date_time) > new Date()
                );

                if (futureSessions.length > 0) {
                    const closestSession = futureSessions.reduce((closest, current) => {
                        return new Date(current.going_date_time) < new Date(closest.going_date_time) ? current : closest;
                    });
                    const closestMonth = format(new Date(closestSession.going_date_time), 'yyyy-MM');
                    setSelectedMonth(closestMonth);
                }
            } else {
                console.error("Data is not an array", sessionData);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const weeks = eachWeekOfInterval({
        start: startOfMonth(new Date(selectedMonth)),
        end: endOfMonth(new Date(selectedMonth))
    });

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const generateDaysForWeek = (weekStart) => {
        return eachDayOfInterval({
            start: startOfWeek(weekStart),
            end: endOfWeek(weekStart)
        });
    };

    const isSessionOnDay = (day) => {
        const dayString = format(day, 'yyyy-MM-dd');
        return sessionsByDay[dayString] || [];
    };

    const isDayInSelectedMonth = (day) => {
        const dayMonth = format(day, 'yyyy-MM');
        return dayMonth === selectedMonth;
    };

    const isSessionPast = (session) => {
        return new Date(session.going_date_time) < new Date();
    };

    const handleNoteChange = (sessionId, value) => {
        setSessions(prevSessions => prevSessions.map(session =>
            session.class_session_id === sessionId
                ? {...session, note: value}
                : session
        ));
        setNotes(prevNotes => ({
            ...prevNotes,
            [sessionId]: value,
        }));
    };

    const handleSaveNote = (sessionId) => {
        const note = notes[sessionId];
        console.log(`Saving note for session ${sessionId}: ${note}`);
        setIsLoading(true)
        axios.put(`${apiClassSession}${sessionId}`,
            {
                note: note
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setIsEditingNote(prevState => ({
                    ...prevState,
                    [sessionId]: false,
                }));
            })
            .catch(error => {
                console.error('Error saving note', error);
                setIsLoading(false)
            });
        setIsEditingNote(prevState => ({
            ...prevState,
            [sessionId]: false,
        }));
        setIsLoading(false)
    };

    const handleEditNote = (sessionId) => {
        setIsEditingNote(prevState => ({
            ...prevState,
            [sessionId]: true,
        }));
    };

    const handleSendEmail = (sessionId) => {
        console.log(`Sending email for session ${sessionId}`);
    }

    const calculateSessionStatistics = () => {
        return {
            total: sessions.length,
            finished: sessions.filter(session => session.status === 'finished').length,
            upcoming: sessions.filter(session => session.status === 'upcoming').length,
            deferred: sessions.filter(session => session.status === 'deferred').length,
            cancelled: sessions.filter(session => session.status === 'cancelled').length,
            makeup: sessions.filter(session => session.status === 'makeup').length,
            bonus: sessions.filter(session => session.status === 'bonus').length,
        };
    };

    const solveChangeTeacher = () => {
        setIsChangeTeacher(true);
    }

    const solveCreateSessionDeferredOrCancel = () => {
        setIsCreateSessionDeferredOrCancelled(true);
    }

    const closeModal = () => {
        setIsChangeTeacher(false);
        setIsCreateSessionDeferredOrCancelled(false)
        setIsChangeSchedule(false)
        setSelectedSession(null);
        setIsModalOpen(false);
    }

    const statistics = calculateSessionStatistics();

    const pieData = {
        labels: [t('finished'), t('upcoming'), t('deferred'), t('cancelled'), t('makeup'), t('bonus')],
        datasets: [
            {
                data: [
                    statistics.finished,
                    statistics.upcoming,
                    statistics.deferred,
                    statistics.cancelled,
                    statistics.makeup,
                    statistics.bonus,
                ],
                backgroundColor: ['#9e9e9e', '#2196f3', '#ff9800', '#f44336', '#4caf50', '#673ab7'],
                hoverBackgroundColor: ['#757575', '#1976d2', '#fb8c00', '#e53935', '#45a049', '#512da8'],
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        weight: 'bold',
                        size: 12,
                    }
                }
            },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return percentage > 0 ? `${percentage}%` : '';
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
        },
        animation: {
            duration: 600,
            easing: 'easeInOutSine',
            animateRotate: true,
            animateScale: true,
        },
        maintainAspectRatio: false,
    };

    useEffect(() => {
        const getWeekNumber = (date) => {
            const d = new Date(date);
            const startDate = new Date(d.getFullYear(), 0, 1);
            const diff = d - startDate;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / (7 * oneDay)) + 1;
        };

        let currentWeekNumber = 0;
        let lastWeek = null;
        const newWeekNumbers = sessions.map(session => {
            const week = session.going_date_time ? getWeekNumber(session.going_date_time) : null;
            if (week !== lastWeek) {
                currentWeekNumber++;
            }
            lastWeek = week;
            return currentWeekNumber;
        });

        setWeekNumbers(newWeekNumbers);
    }, [sessions]);

    useEffect(() => {
        if (selectedTab === 2 && chartRef.current) {
            const chartInstance = chartRef.current;
            chartInstance.update();
        }
    }, [selectedTab]);

    return (
        <>
            {isLoading && <Loading/>}
            <CourseInfoContainer>
                <Header>
                    <CourseTitle>
                        {courseInfo.program_name} - {courseInfo.level_program} - {courseInfo.teacher_name}
                    </CourseTitle>
                    <DateInput
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    />
                </Header>

                <ActionButtonGroup>
                    {/*<button className="create-session">{t('create session')}</button>*/}
                    <button className="add-bonus"
                            onClick={solveCreateSessionDeferredOrCancel}
                            style={{position: 'relative'}}>
                        {t('add bonus') + (totalSessionDeferredOrCancelled !== 0 ? ` (${totalSessionDeferredOrCancelled})` : '')}
                        {totalSessionDeferredOrCancelled > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: 'red',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                borderRadius: '50%',
                                width: '15px',
                                height: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>!</span>
                        )}
                    </button>

                    {/*<button className="update-schedule" onClick={solveChangeSchedule}>{t('update schedule')}</button>*/}
                    <button className="change-teacher" onClick={solveChangeTeacher}>{t('change teacher')}</button>
                </ActionButtonGroup>

                <ConsultantInfo>
                    {t('available schedule')}: {
                    courseInfo.schedule && Array.isArray(JSON.parse(courseInfo.schedule))
                        ? JSON.parse(courseInfo.schedule).map((session, index) => (
                            <span key={index}>
                                {t(session.day.toLowerCase())}, {session.start_time} - {session.end_time}
                                {index < JSON.parse(courseInfo.schedule).length - 1 && ' | '}
                            </span>
                        ))
                        : 'No schedule available'}
                </ConsultantInfo>

                <ConsultantInfo>
                    Consultant: Hưng | Q.C: Hưng | C.M: Hưng
                </ConsultantInfo>

                <ScheduleContainer>
                    {weeks.map((weekStart, index) => (
                        <WeekContainer key={index}>
                            <DayRow>
                                {generateDaysForWeek(weekStart).map((day, dayIndex) => {
                                    const sessionsForDay = isSessionOnDay(day);
                                    const active = isDayInSelectedMonth(day);
                                    return (
                                        <Day key={dayIndex} active={active}
                                             isPast={sessionsForDay.some(session => isSessionPast(session))}>
                                            {format(day, 'E dd-MM-yyyy')}
                                            {sessionsForDay.length > 0 && (
                                                <div style={{marginTop: '5px', fontSize: '0.9rem'}}>
                                                    {sessionsForDay.map((session) => (
                                                        <SessionCard
                                                            key={session.class_session_id}
                                                            isPast={isSessionPast(session)}
                                                            onClick={() =>
                                                                session.status === 'upcoming' && !isSessionPast(session) && openModal(session)
                                                            }
                                                            style={{
                                                                cursor: session.status === 'upcoming' && !isSessionPast(session) ? 'pointer' : 'not-allowed',
                                                                opacity: isSessionPast(session) ? 0.8 : 1,
                                                                backgroundColor:
                                                                    session.status === 'deferred'
                                                                        ? '#f6b585'
                                                                        : session.status === 'cancelled'
                                                                            ? '#f27c7c'
                                                                            : session.status === 'finished'
                                                                                ? '#CCC'
                                                                                : session.status === 'upcoming'
                                                                                    ? '#8afc8a'
                                                                                    : 'white',
                                                            }}
                                                        >
                                                            <div className="session-info">
                                                                {session.student_name} - {session.teacher_name}
                                                            </div>
                                                            <div className="session-time">
                                                                {format(new Date(session.going_date_time), 'HH:mm')}
                                                            </div>
                                                        </SessionCard>
                                                    ))}
                                                </div>
                                            )}
                                        </Day>
                                    );
                                })}
                            </DayRow>
                        </WeekContainer>
                    ))}
                </ScheduleContainer>

                <hr style={{border: '1px solid #ccc', margin: '10px 0'}}/>

                <div>
                    {/* Tabs */}
                    <TabsContainer>
                        <TabButton active={selectedTab === 0} onClick={() => setSelectedTab(0)}>
                            {t('session list')}
                        </TabButton>
                        <TabButton active={selectedTab === 1} onClick={() => setSelectedTab(1)}>
                            {t('class diary')}
                        </TabButton>
                        <TabButton active={selectedTab === 2} onClick={() => setSelectedTab(2)}>
                            {t('statistical')}
                        </TabButton>
                    </TabsContainer>

                    {/* Tab Panel 1: Session List */}
                    <TabPanel active={selectedTab === 0}>
                        <Table>
                            <thead>
                            <tr>
                                <TableHeader>STT</TableHeader>
                                <TableHeader>{t('month')}</TableHeader>
                                <TableHeader>{t('date of week')}</TableHeader>
                                <TableHeader>{t('date')}</TableHeader>
                                <TableHeader>{t('status')}</TableHeader>
                                <TableHeader>{t('note (attendance, feedback, test, ...)')}</TableHeader>
                                <TableHeader>{t('upload file')}</TableHeader>
                                <TableHeader>{t('action')}</TableHeader>
                            </tr>
                            </thead>
                            <tbody>
                            {sessions
                                .filter(session => session.going_date_time !== '1970-01-01T00:00:00')
                                .sort((a, b) => {
                                    const dateA = new Date(a.going_date_time);
                                    const dateB = new Date(b.going_date_time);
                                    return dateA - dateB;
                                })
                                .reduce((acc, session) => {
                                    const goingDate = new Date(session.going_date_time);
                                    const validGoingDate = isValid(goingDate);
                                    const sessionMonth = validGoingDate ? format(goingDate, 'MM') : 'Invalid date';

                                    const lastItem = acc[acc.length - 1];
                                    if (lastItem && lastItem.month === sessionMonth) {
                                        lastItem.sessions.push(session);
                                    } else {
                                        acc.push({
                                            month: sessionMonth,
                                            sessions: [session]
                                        });
                                    }

                                    return acc;
                                }, [])
                                .map((group, groupIndex) => {
                                    return group.sessions.map((session, sessionIndex) => {
                                        const goingDate = new Date(session.going_date_time);
                                        const validGoingDate = isValid(goingDate);
                                        const dayOfWeek = validGoingDate ? format(goingDate, 'E') : 'Invalid day';
                                        const formattedDate = validGoingDate ? format(goingDate, 'dd/MM/yyyy') : 'Invalid date';
                                        return (
                                            <tr key={session.class_session_id}>
                                                <TableCell>{groupIndex * group.sessions.length + sessionIndex + 1}</TableCell>

                                                {sessionIndex === 0 && (
                                                    <TableCell
                                                        rowSpan={group.sessions.length}
                                                        style={{
                                                            backgroundColor: monthColors[group.month] || '#fff',
                                                        }}
                                                    >
                                                        {group.month}
                                                    </TableCell>
                                                )}

                                                <TableCell>{dayOfWeek}</TableCell>
                                                <TableCell>{formattedDate}</TableCell>
                                                <TableCell>{session.status}</TableCell>
                                                <TableCell>
                                                    <NoteInputWrapper>
                                                        {isEditingNote[session.class_session_id] ? (
                                                            <>
                                                                <NoteInput
                                                                    type="text"
                                                                    value={session.note || ''}
                                                                    onChange={(e) =>
                                                                        handleNoteChange(session.class_session_id, e.target.value)
                                                                    }
                                                                />
                                                                <IconButton
                                                                    onClick={() => handleSaveNote(session.class_session_id)}>
                                                                    <FaSave fontSize={18}/>
                                                                </IconButton>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {session.note || 'No notes'}
                                                                <IconButton
                                                                    onClick={() => handleEditNote(session.class_session_id)}>
                                                                    <FaEdit fontSize={18}/>
                                                                </IconButton>
                                                            </>
                                                        )}
                                                    </NoteInputWrapper>
                                                </TableCell>

                                                <TableCell>
                                                    <FileUploadContainer>
                                                        <FileInput
                                                            type="file"
                                                            accept=".doc,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    handleFileUpload(session.class_session_id, file);
                                                                }
                                                            }}
                                                        />
                                                        <CustomFileUpload
                                                            onClick={() => document.querySelector('input[type="file"]').click()}>
                                                            Chọn Tệp
                                                        </CustomFileUpload>
                                                    </FileUploadContainer>
                                                </TableCell>

                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => handleSendEmail(session.class_session_id)}>
                                                        <FaEnvelope fontSize={18}/>
                                                    </IconButton>
                                                </TableCell>
                                            </tr>
                                        );
                                    });
                                })}
                            </tbody>
                        </Table>
                    </TabPanel>

                    <TabPanel active={selectedTab === 1}>
                        <Table>
                            <thead>
                            <tr>
                                <TableHeader>{t('week')}</TableHeader>
                                <TableHeader>{t('session')}</TableHeader>
                                <TableHeader>{t('unit')}</TableHeader>
                                <TableHeader>{t('content/speaking goal')}</TableHeader>
                                <TableHeader>{t('instructor')}</TableHeader>
                                <TableHeader>{t('date')} (dd,mm,yyyy)</TableHeader>
                                <TableHeader>{t('time')}</TableHeader>
                                <TableHeader>{t('hour')}</TableHeader>
                                <TableHeader>{t('status')}</TableHeader>
                                <TableHeader>{t('lesson report')}</TableHeader>
                                <TableHeader>{t('plan for next lesson')}</TableHeader>
                            </tr>
                            </thead>
                            <tbody>
                            {sessions.map((session, index) => (
                                <tr key={index}>
                                    <TableCell>{weekNumbers[index]}</TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{session.unit || '-'}</TableCell>
                                    <TableCell>{session.content_speaking_goal || '-'}</TableCell>
                                    <TableCell>{session.pic || '-'}</TableCell>
                                    <TableCell>{session.going_date_time ? new Date(session.going_date_time).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>{session.duration ? `${session.duration} min` : '-'}</TableCell>
                                    <TableCell>{session.going_date_time ? new Date(session.going_date_time).toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '-'}</TableCell>
                                    <TableCell>{session.status || '-'}</TableCell>
                                    <TableCell>{session.lesson_report || '-'}</TableCell>
                                    <TableCell>{session.coach_plan_next_lesson || '-'}</TableCell>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </TabPanel>

                    <TabPanel active={selectedTab === 2}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '20px',
                            marginTop: '20px',
                            flexWrap: 'wrap',
                        }}>
                            <Table style={{flex: '1'}}>
                                <thead>
                                <tr>
                                    <TableHeader>{t('statistics')}</TableHeader>
                                    <TableHeader>{t('value')}</TableHeader>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <TableCell>{t('finished')}</TableCell>
                                    <TableCell>{statistics.finished}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('upcoming')}</TableCell>
                                    <TableCell>{statistics.upcoming}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('deferred')}</TableCell>
                                    <TableCell>{statistics.deferred}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('cancelled')}</TableCell>
                                    <TableCell>{statistics.cancelled}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('makeup')}</TableCell>
                                    <TableCell>{statistics.makeup}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('bonus')}</TableCell>
                                    <TableCell>{statistics.bonus}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell style={{fontWeight: 'bold'}}>{t('total sessions')}</TableCell>
                                    <TableCell
                                        style={{fontWeight: 'bold', color: 'red'}}>{statistics.total}</TableCell>
                                </tr>
                                </tbody>
                            </Table>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', flex: '1'}}>
                                <div style={{width: '100%', height: '350px', position: 'relative'}}>
                                    <Pie
                                        key={selectedTab}
                                        data={pieData}
                                        options={pieOptions}
                                    />
                                </div>
                            </div>

                            <Table style={{flex: '1', width: '100%'}}>
                                <thead>
                                <tr>
                                    <TableHeader>{t('category')}</TableHeader>
                                    <TableHeader>{t('description')}</TableHeader>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <TableCell>{t('completed')}</TableCell>
                                    <TableCell>{t('sessions that have been successfully finished')}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('canceled')}</TableCell>
                                    <TableCell>{t('sessions that were canceled and will not occur')}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('postponed')}</TableCell>
                                    <TableCell>{t('sessions that were delayed to a future date')}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>{t('makeup')}</TableCell>
                                    <TableCell>{t('sessions added to compensate for missed ones')}</TableCell>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </TabPanel>
                </div>
            </CourseInfoContainer>
            {isCreateSessionDeferredOrCancelled &&
                <CreateSessionDeferredOrCancel
                    data={sessions
                        .filter(session => session.status === 'upcoming' && session.going_date_time === '1970-01-01T00:00:00')
                        .sort((a, b) => a.class_session_id - b.class_session_id)}
                    onClose={closeModal}
                    onSave={fetchData}
                />
            }
            {isChangeTeacher &&
                <ChangeTeacher
                    data={sessions.filter(session => session.status === 'upcoming' && session.going_date_time !== '1970-01-01T00:00:00')
                        .sort((a, b) => new Date(a.going_date_time) - new Date(b.going_date_time))}
                    courseInfo={courseInfo}
                    onClose={closeModal}
                    onSave={fetchData}
                />
            }
            {isChangeSchedule &&
                <UpdateSchedule
                    data={sessions.filter(session => session.status === 'upcoming' && session.going_date_time !== '1970-01-01T00:00:00')}
                    courseInfo={courseInfo}
                    onClose={closeModal}
                />
            }
            {isModalOpen && (
                <ChangeSession
                    onSave={fetchData}
                    onClose={closeModal}
                    session={selectedSession}
                    data={sessions
                        .sort((a, b) => new Date(a.going_date_time) - new Date(b.going_date_time))}
                />
            )}
        </>
    );
};

export default CourseInfo;