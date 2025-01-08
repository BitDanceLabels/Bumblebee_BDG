import styled from 'styled-components'
import {useEffect, useState} from 'react'
import Loading from '~/components/General/Loading.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";
import {FaMars, FaVenus, FaGenderless, FaCheck} from 'react-icons/fa';
import {format} from 'date-fns';
import {enUS} from 'date-fns/locale';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

const ModalContent = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: auto;
    max-width: 90%;
    display: inline-block;
    transition: all 0.3s ease;
`

const FormRow = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 15px;
`

const Label = styled.label`
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-right: 10px;
`

const Select = styled.select`
    flex: 3;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
`

const Input = styled.input`
    flex: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
`

const DividerSection = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    gap: 20px;
`

const LeftSection = styled.div`
    flex: 1;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    width: 600px;
    max-height: 350px;
    overflow-y: auto;
`

const RightSection = styled.div`
    flex: 1;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    width: 600px;
    max-height: 350px;
    overflow-y: auto;
`

const ScheduleEntry = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    margin: 10px 0;
`

const TitleCustom = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
    margin-top: 20px;
`

const CloseButton = styled.button`
    padding: 10px 20px;
    margin: 0 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        opacity: 0.8;
    }
`

const WarningIcon = styled.span`
    color: red;
    font-weight: bold;
    font-size: 24px;
    animation: blink 1s infinite;

    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #1ea41e;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        opacity: 0.8;
    }
`

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
`

const ItemWrapper = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`
// Styles for the search and dropdown components
const SearchWrapper = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    position: relative;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.th`
    border: 1px solid #ccc;
    padding: 10px;
    background-color: #f4f4f4;
    text-align: left;
`;

const TableCell = styled.td`
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
`;

const RightSectionWrapper = styled.div`
`

const TabHeader = styled.div`
    display: flex;
    gap: 10px;
`;

const TabButton = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: ${(props) => (props.active ? '#007BFF' : '#E0E0E0')};
    color: ${(props) => (props.active ? 'white' : 'black')};
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    &:hover {
        background-color: ${(props) => (props.active ? '#0056b3' : '#c0c0c0')};
    }
`;

const TabContent = styled.div`
    margin-top: 10px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
`;

const TeacherCardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
`;

const TeacherCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid ${(props) =>
            props.gender === "Male"
                    ? "#007BFF"
                    : props.gender === "Female"
                            ? "#FF69B4"
                            : "#ccc"};
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.3s ease, border-color 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const GenderIcon = styled.div`
    position: absolute;
    top: -10px;
    left: -10px;
    background-color: ${(props) =>
            props.gender === "Male"
                    ? "#007BFF"
                    : props.gender === "Female"
                            ? "#FF69B4"
                            : "#ccc"};
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
`;

const TeacherName = styled.h3`
    color: #333;
    font-size: 14px;
    font-weight: bold;
`;

const TeacherDetails = styled.p`
    font-size: 14px;
    color: #666;
    margin-top: 5px;
`;

const SelectedCourse = styled.div`
    padding: 8px 12px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.8px;
    color: #333;
    background-color: #f5f5f5;
    border-radius: 4px;
`;

const apiGetTeacherMatchingStudent = import.meta.env.VITE_URL_GET_TEACHER_MATCHING_STUDENT
const apiStudentCircleUrl = import.meta.env.VITE_URL_STUDENT_CIRCLE
const apiUrlProgram = import.meta.env.VITE_API_PROGRAM;
const apiUrlSyllabus = import.meta.env.VITE_API_SULLYBUS;
const apiUrlGetStudentCircleByStudentId = import.meta.env.VITE_URL_GET_STUDENT_CIRCLE_BY_STUDENT_ID;

// eslint-disable-next-line react/prop-types
const AssignStudentModal = ({isOpen, onClose, student, onSubmit}) => {
    const {t,} = useTranslation();
    const [, setFilteredCourses] = useState();
    const [, setDataSyllabus] = useState([]);
    const [selectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('Full Day');
    const [availableTimes, setAvailableTimes] = useState([
        {day: '', start_time: '', end_time: ''}
    ])
    const [program, setProgram] = useState('')
    const [, setPrograms] = useState([])
    const [level,] = useState('')
    const [, setSelectedTeacher] = useState(null)
    // eslint-disable-next-line react/prop-types
    const [startDate,] = useState(student.course_start_date || '')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [status] = useState(null)
    const [apiDone] = useState(false)
    const [message] = useState('')
    const [sessions, setSessions] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [selectedCards, setSelectedCards] = useState({});
    const [syllabusInfo, setSyllabusInfo] = useState([]);
    const [syllabusName, setSyllabusName] = useState('');
    const [requestCreateCourse, setRequestCreateCourse] = useState(null);

    const handleCardClick = (teacher, tab) => {
        if (selectedCards["Full Day"]) {
            sessions.forEach((session) => {
                session.teacher_name = null;
                session.teacher_id = null;
            });
            setSessions([...sessions]);
        }

        setSelectedCards((prevState) => {
            const newState = {...prevState};
            if (tab === "Full Day") {
                newState["Full Day"] = teacher;
                availableTimes.forEach((time) => {
                    delete newState[time.day];
                });
            } else {
                newState[tab] = teacher;
                delete newState["Full Day"];
            }
            return newState;
        });
        console.log("card: ", selectedCards)
        handleSelectTeacher(teacher, tab);
    };

    const searchTeacher = async (inputData) => {
        try {
            setIsLoading(true)
            const queryParam = encodeURIComponent(JSON.stringify(inputData))
            const response = await axios.get(`${apiGetTeacherMatchingStudent}?required_times=${queryParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Failed to fetch data:', error.response?.data?.message || error.message)
        } finally {
            setSelectedTeacher(null)
            setIsLoading(false)
        }
    }

    function calculateSessions(availableTimes, startDate, duration) {
        const result = [];
        const start = new Date(startDate);
        while (result.length < duration) {
            for (const time of availableTimes) {
                const targetDay = daysOfWeek.indexOf(time.day);
                const currentDay = start.getDay();
                const daysUntilTarget = (targetDay - currentDay + 7) % 7;
                const nextDate = new Date(start);
                nextDate.setDate(start.getDate() + daysUntilTarget);
                const goingDateTime = `${nextDate.toISOString().split("T")[0]} ${time.start_time}`;
                result.push({
                    going_date_time: goingDateTime,
                    teacher_name: ""
                });
                if (result.length >= duration) break;
            }
            start.setDate(start.getDate() + 7);
        }
        return result;
    }

    useEffect(() => {
        let filteredData;
        const fetchSyllabusInfo = async () => {
            try {
                const response = await axios.get(
                    apiUrlGetStudentCircleByStudentId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            // eslint-disable-next-line react/prop-types
                            studentId: student.student_id,
                        },
                    }
                );
                const syllabusData = JSON.parse(response.data.data);
                filteredData = syllabusData.find(item => item.is_tr_done === false);
                setSyllabusInfo(filteredData);
                setRequestCreateCourse(filteredData.request_create_course);
                setSyllabusName(filteredData.syllabus_name);
            } catch (error) {
                console.error('Error fetching syllabus info:', error);
            }
            // eslint-disable-next-line react/prop-types
            const data = calculateSessions(availableTimes, startDate, student.registered_course);
            setSessions(data.sort((a, b) => new Date(a.going_date_time) - new Date(b.going_date_time)));
            console.log("session: ", data)
            console.log('Request:', filteredData.request_create_course);
            console.log("teacherData: ", teacherData)
        };
        fetchSyllabusInfo()
    }, [availableTimes, startDate]);

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get(apiUrlProgram, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setPrograms(response.data)

                if (response.data.length > 0) {
                    setProgram(response.data[0].program_id)
                }
            } catch (error) {
                console.error('Error fetching programs:', error)
            }
        }
        fetchPrograms()
    }, [])

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchTeacherData = async () => {
            let filteredTimes = [];
            if (activeTab === 'Full Day') {
                filteredTimes = availableTimes;
            } else {
                filteredTimes = availableTimes.filter(time => time.day === activeTab);
            }

            if (filteredTimes.length > 0) {
                const inputData = filteredTimes.map(time => ({
                    day: time.day,
                    start_time: time.start_time,
                    end_time: time.end_time,
                }));

                try {
                    const teacherData = await searchTeacher(inputData);
                    if (teacherData) {
                        setTeacherData(teacherData.data);
                    } else {
                        setTeacherData([]);
                    }
                } catch (error) {
                    console.error('Error fetching teacher data:', error);
                    setTeacherData([]);
                }
            }
        };

        fetchTeacherData();
    }, [activeTab, availableTimes]);

    const fetchSyllabusData = async () => {
        try {
            const response = await axios.get(apiUrlSyllabus, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const syllabusData = response.data.map((item) => ({
                syllabus_id: item.syllabus_id,
                syllabus_name: item.syllabus_name,
            }));

            setDataSyllabus(syllabusData);
            setFilteredCourses(syllabusData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching syllabus data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSyllabusData();
    }, []);

    const handleSelectTeacher = (teacher, day) => {
        if (day === 'Full Day') {
            sessions.forEach((session) => {
                session.teacher_name = teacher.full_name;
                session.teacher_id = teacher.teacher_id;
            });
        } else {
            sessions.forEach((session) => {
                const sessionDay = new Date(session.going_date_time).toLocaleString('en-US', {weekday: 'long'});
                if (sessionDay === day) {
                    session.teacher_name = teacher.full_name;
                    session.teacher_id = teacher.teacher_id;
                }
            });
        }
        setSessions([...sessions]);
    }
    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (student && student.available_schedule) {
            try {
                // eslint-disable-next-line react/prop-types
                const parsedSchedule = JSON.parse(student.available_schedule)
                if (Array.isArray(parsedSchedule)) {
                    const formattedTimes = parsedSchedule.map((time) => ({
                        day: time.day,
                        start_time: time.start_time,
                        end_time: time.end_time
                    }))
                    const sortedTimes = formattedTimes.sort((a, b) => {
                        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                    });
                    setAvailableTimes(sortedTimes)
                } else {
                    console.error('Parsed schedule is not an array')
                    setAvailableTimes([])
                }
            } catch (error) {
                console.error('Error parsing available_schedule:', error)
                setAvailableTimes([])
            }
        }
    }, [student])

    const getMostFrequentTeacherId = (sessions) => {
        const teacherCounts = sessions.reduce((acc, session) => {
            acc[session.teacher_id] = (acc[session.teacher_id] || 0) + 1;
            return acc;
        }, {});

        const maxCount = Math.max(...Object.values(teacherCounts));
        const mostFrequentTeachers = Object.keys(teacherCounts).filter(
            (teacherId) => teacherCounts[teacherId] === maxCount
        );

        return mostFrequentTeachers.length > 1
            ? mostFrequentTeachers[0]
            : mostFrequentTeachers[0];
    };

    const handleSubmit = async () => {
        const allSessionsHaveTeacher = sessions.every((session) => session.teacher_id);

        if (!allSessionsHaveTeacher) {
            setErrorMessage('Vui lòng chọn đủ giáo viên cho tất cả các buổi học.');
            return;
        }

        let teacherId = getMostFrequentTeacherId(sessions);

        setIsLoading(true);

        const payload = {
            teacher_id: teacherId,
            program_id: Number(program),
            level_program: level,
            status_course: "active",
            // eslint-disable-next-line react/prop-types
            student_id: student?.student_id,
            end_date: null,
            start_date: `${startDate}`,
            available_schedule: JSON.stringify(
                availableTimes.reduce((acc, {day, start_time, end_time}) => {
                    if (!acc[day]) acc[day] = [];
                    acc[day].push({start_time, end_time});
                    return acc;
                }, {})
            ),
            class_sessions: sessions.map((session) => ({
                going_date_time: session.going_date_time,
                teacher_id: session.teacher_id,
            })),
        };

        try {
            const response = await fetch(`${apiStudentCircleUrl}/${syllabusInfo.student_circle_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_create_course: JSON.stringify(payload),
                    is_tr_done: allSessionsHaveTeacher,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('API response:', responseData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
            onClose();
            onSubmit();
        }
    };

    const handleAvailableChange = (index, field, value) => {
        const updatedTimes = [...availableTimes]
        updatedTimes[index][field] = value
        setSelectedCards({})
        setAvailableTimes(updatedTimes)
        setSelectedTeacher(null)
    }

    if (!isOpen) return null
    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!status}
                message={message}
                status={status}
            />
            <ModalOverlay onClick={onClose} style={{display: apiDone ? 'none' : 'flex'}}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <>
                        <TitleCustom>{t('assign student')}</TitleCustom>
                        <FormRow>
                            <ItemWrapper>
                                <Label>{t('program')}:</Label>
                                <SearchWrapper>
                                    {/* eslint-disable-next-line react/prop-types */}
                                    <SelectedCourse>{student.program}</SelectedCourse>
                                </SearchWrapper>
                            </ItemWrapper>

                            {/*<ItemWrapper>*/}
                            {/*    <Label>{t('level')}:</Label>*/}
                            {/*    <Select*/}
                            {/*        value={level}*/}
                            {/*        onChange={(e) => {*/}
                            {/*            setLevel(e.target.value)*/}
                            {/*            setShowTeacherList(false)*/}
                            {/*            setSelectedTeacher(null)*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <option value="">Select Level</option>*/}
                            {/*        <option value="beginner">Beginner</option>*/}
                            {/*        <option value="intermediate">Intermediate</option>*/}
                            {/*        <option value="advanced">Advanced</option>*/}
                            {/*    </Select>*/}
                            {/*</ItemWrapper>*/}

                            <ItemWrapper>
                                <Label>{t('start date')}:</Label>
                                <SearchWrapper>
                                    <SelectedCourse>{format(new Date(startDate), 'dd/MM/yyyy')}</SelectedCourse>
                                </SearchWrapper>
                            </ItemWrapper>

                            <ItemWrapper>
                                <Label>{t('syllabus name')}:</Label>
                                <SearchWrapper>
                                    <SelectedCourse>{syllabusName}</SelectedCourse>
                                </SearchWrapper>
                            </ItemWrapper>

                        </FormRow>
                        {selectedCourse && (
                            <p>
                                Selected Course: <strong>{selectedCourse.syllabus_name}</strong>
                            </p>
                        )}

                        <DividerSection>
                            <RightSectionWrapper>
                                <LeftSection>
                                    <Label>{t('available')}</Label>
                                    {availableTimes.length > 0 ? (
                                        availableTimes.map((time, index) => (
                                            <ScheduleEntry key={index}>
                                                <Select
                                                    value={time.day}
                                                    onChange={(e) => handleAvailableChange(index, 'day', e.target.value)}
                                                >
                                                    <option value="">Select Day</option>
                                                    <option value="Monday">Monday</option>
                                                    <option value="Tuesday">Tuesday</option>
                                                    <option value="Wednesday">Wednesday</option>
                                                    <option value="Thursday">Thursday</option>
                                                    <option value="Friday">Friday</option>
                                                    <option value="Saturday">Saturday</option>
                                                    <option value="Sunday">Sunday</option>
                                                </Select>
                                                <Input
                                                    type="time"
                                                    placeholder="Start Time"
                                                    value={time.start_time}
                                                    onChange={(e) => handleAvailableChange(index, 'start_time', e.target.value)}
                                                />
                                                <Input
                                                    type="time"
                                                    placeholder="End Time"
                                                    value={time.end_time}
                                                    onChange={(e) => handleAvailableChange(index, 'end_time', e.target.value)}
                                                />
                                            </ScheduleEntry>
                                        ))
                                    ) : (
                                        <p>No available schedule</p>
                                    )}
                                </LeftSection>

                                <LeftSection style={{marginTop: '20px'}}>
                                    <TabHeader>
                                        <TabButton
                                            onClick={() => handleTabClick("Full Day")}
                                            active={activeTab === "Full Day"}
                                        >
                                            Full Day
                                        </TabButton>
                                        {availableTimes.map((time, index) => (
                                            <TabButton
                                                key={index}
                                                onClick={() => handleTabClick(time.day)}
                                                active={activeTab === time.day}
                                            >
                                                {time.day}
                                            </TabButton>
                                        ))}
                                    </TabHeader>

                                    {/* Tab Content */}
                                    <TabContent>
                                        <TeacherCardContainer>
                                            {teacherData.map((teacher, index) => (
                                                <TeacherCard
                                                    key={index}
                                                    gender={teacher.gender}
                                                    onClick={() => handleCardClick(teacher, activeTab)}
                                                >
                                                    <GenderIcon gender={teacher.gender}>
                                                        {teacher.gender === "Male" && <FaMars/>}
                                                        {teacher.gender === "Female" && <FaVenus/>}
                                                        {!teacher.gender && <FaGenderless/>}
                                                    </GenderIcon>
                                                    <TeacherName>{teacher.full_name}</TeacherName>
                                                    <TeacherDetails>
                                                        Phone: {teacher.phone_number || "N/A"}
                                                    </TeacherDetails>
                                                    <TeacherDetails>
                                                        Teaching Certificate: {teacher.teaching_certificate || "N/A"}
                                                    </TeacherDetails>
                                                    {selectedCards[activeTab]?.teacher_id === teacher.teacher_id && (
                                                        <div
                                                            style={{
                                                                color: "green",
                                                                position: "absolute",
                                                                top: 10,
                                                                right: 10,
                                                            }}
                                                        >
                                                            <FaCheck/>
                                                        </div>
                                                    )}
                                                </TeacherCard>
                                            ))}
                                        </TeacherCardContainer>
                                    </TabContent>

                                </LeftSection>
                            </RightSectionWrapper>

                            <RightSection>
                                <Table>
                                    <thead>
                                    <tr>
                                        <TableHeader>STT</TableHeader>
                                        <TableHeader>Going Date Time</TableHeader>
                                        <TableHeader>Teacher Name</TableHeader>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sessions.map((session, index) => (
                                        <tr key={index + 1}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{format(new Date(session.going_date_time), "EEEE, dd/MM/yyyy HH:mm", {locale: enUS})}</TableCell>
                                            <TableCell>
                                                {session.teacher_name ? (
                                                    session.teacher_name
                                                ) : (
                                                    <WarningIcon>!</WarningIcon>
                                                )}
                                            </TableCell>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </RightSection>
                        </DividerSection>

                        <ButtonWrapper>
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                            <CloseButton onClick={onClose}>{t('close')}</CloseButton>
                            <SubmitButton onClick={handleSubmit}>{t('submit')}</SubmitButton>
                        </ButtonWrapper>
                    </>
                </ModalContent>
            </ModalOverlay>
        </>
    )
}

export default AssignStudentModal