import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import Loading from "../General/Loading.jsx";
import dayjs from 'dayjs';
import {addDays, format, parseISO, set} from 'date-fns';
import styled from "styled-components";
import axios from "axios";

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const contentStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "700px",
    maxWidth: "90%",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-out",
};

const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
};

const formStyle = {
    marginTop: '12px',
};
const buttonStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
    marginTop: '15px',
};

const textareaStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0 15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
};

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

const CourseInfoCustom = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`

const TableContainer = styled.div`
    max-height: 220px;
    overflow-y: auto;
`

const TeacherCard = styled.div`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => (props.selected ? '#e0f7fa' : '#fff')};

    &:hover {
        background-color: ${(props) => (props.selected ? '#b2ebf2' : '#f0f0f0')};
    }
`

const TeacherName = styled.p`
    margin: 0;
    font-weight: bold;
`

const Checkmark = styled.span`
    font-size: 18px;
    color: ${(props) => (props.selected ? '#007bff' : 'transparent')};
`

const SearchTeacherWrapper = styled.div`
    margin-top: 15px;
    display: flex;
    align-items: flex-start;
    gap: 30px;
`

const ResetButton = styled.button`
    background-color: #3498db;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease;
`;

const apiGetTeacherMatchingStudent = import.meta.env.VITE_URL_GET_TEACHER_MATCHING_STUDENT
const apiUpdateListClassSessions = import.meta.env.VITE_URL_UPDATE_LIST_CLASS_SESSIONS

// eslint-disable-next-line react/prop-types
const ChangeTeacher = ({data, onClose, onSave, courseInfo}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [originalData,] = useState(data)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen] = useState(true);
    const [selectedData, setSelectedData] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [sortedWeekdays, setSortedWeekdays] = useState([]);
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [teachers, setTeachers] = useState([]);
    const [reason, setReason] = useState('');
    const [dataSession, setDataSession] = useState(data);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    useEffect(() => {
        const weekdays = extractAndSortWeekdays(dataSession);
        setSortedWeekdays(weekdays);
        setSelectedDays(weekdays);
    }, []);

    useEffect(() => {
        const updatedSelectedData = dataSession.filter(session => selectedRows.includes(session.class_session_id));
        setSelectedData(updatedSelectedData);
    }, [selectedRows, dataSession]);

    useEffect(() => {
        if (isModalOpen) {
            const allIds = dataSession.map((session) => session.class_session_id);
            setSelectedRows(allIds);
        }
    }, [isModalOpen]);

    const getWeekdayFromDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {weekday: "long"});
    };

    const extractAndSortWeekdays = (dataSession) => {
        const uniqueDays = Array.from(
            new Set(dataSession.map((item) => getWeekdayFromDate(item.going_date_time)))
        );
        return uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    };

    const handleSelectRow = (classSessionId) => {
        setDataSession(originalData)
        setTeachers([])
        setSelectedDays([]);
        if (selectedRows.includes(classSessionId)) {
            setSelectedRows(selectedRows.filter(id => id !== classSessionId));
        } else {
            setSelectedRows([...selectedRows, classSessionId]);
        }
    };

    const handleSelectDays = (selectedDays) => {
        setDataSession(originalData)
        setTeachers([])
        const dayIds = dataSession
            .filter((session) => selectedDays.includes(getWeekdayFromDate(session.going_date_time)))
            .map((session) => session.class_session_id);

        setSelectedRows(dayIds);
    };

    const handleCheckboxChange = (day, isChecked) => {
        setDataSession(originalData)
        setTeachers([])
        if (day === 'all') {
            if (isChecked) {
                setSelectedDays(sortedWeekdays);
                handleSelectDays(sortedWeekdays);
            } else {
                setSelectedDays([]);
                handleSelectDays([]);
            }
        } else {
            const updatedDays = isChecked
                ? [...selectedDays, day]
                : selectedDays.filter((d) => d !== day);
            setSelectedDays(updatedDays);
            handleSelectDays(updatedDays);
        }
    };


    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const formatSelectedData = (selectedData) => {
        const formattedData = selectedData.map((item) => {
            const goingDate = new Date(item.going_date_time);
            const day = goingDate.toLocaleDateString("en-US", {weekday: "long"});
            const startHour = String(goingDate.getHours()).padStart(2, "0");
            const startMinutes = String(goingDate.getMinutes()).padStart(2, "0");
            const startTime = `${startHour}:${startMinutes}`;

            const endDate = new Date(goingDate);
            endDate.setMinutes(goingDate.getMinutes() + item.duration);
            const endHour = String(endDate.getHours()).padStart(2, "0");
            const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
            const endTime = `${endHour}:${endMinutes}`;

            return {
                day,
                start_time: startTime,
                end_time: endTime,
            };
        });

        return Array.from(
            new Set(formattedData.map((item) => JSON.stringify(item)))
        ).map((item) => JSON.parse(item));
    };

    const handleSearchTeacher = async () => {
        try {
            setIsLoading(true)
            const availableTimes = formatSelectedData(selectedData);
            const queryParam = encodeURIComponent(JSON.stringify(availableTimes))

            const response = await axios.get(`${apiGetTeacherMatchingStudent}?required_times=${queryParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const result = response.data

            if (result && result.data) {
                setTeachers(result.data)
            } else {
                console.error('No matching teachers found or invalid response format')
                setTeachers([])
            }
        } catch (error) {
            console.error('Failed to fetch data:', error.response?.data?.message || error.message)
            setTeachers([])
        } finally {
            setSelectedTeacher(null)
            setIsLoading(false)
        }
    }

    const selectTeacher = (teacher) => {
        let changeData = selectedData.map(item => ({
            ...item,
            teacher_id: teacher.teacher_id,
            teacher_name: teacher.full_name
        }));
        const changeDataMap = new Map(changeData.map(item => [item.class_session_id, item]));
        let newDataSession = dataSession.map(item => {
            const changedItem = changeDataMap.get(item.class_session_id);
            return changedItem ? {...item, ...changedItem} : item;
        });
        setDataSession(newDataSession);
        setSelectedTeacher(teacher)
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        const sortedClassSessionIds = originalData.map(item => item.class_session_id);
        const updateData = dataSession.map((item, index) => ({
            ...item,
            class_session_id: sortedClassSessionIds[index],
        }));

        try {
            const encodedDataUpdate = encodeURIComponent(JSON.stringify(updateData));
            await axios.put(
                `${apiUpdateListClassSessions}?dataUpdate=${encodedDataUpdate}`,
                {
                    dataUpdate: JSON.stringify(updateData),
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            onClose();
            onSave();
            setIsLoading(false);
        } catch (error) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            setIsLoading(false);
        }
    };

    const handleChangeDay = () => {
        const goingDateTime = selectedData[0]?.going_date_time;

        if (goingDateTime) {
            const date = new Date(goingDateTime);
            const dayNames = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
            const dayName = dayNames[date.getUTCDay()];
            const time = goingDateTime.split('T')[1].slice(0, 5);

            setSelectedDay(dayName);
            setSelectedTime(time);
        }

        setShowModal(prev => !prev);
    };

    const changeScheduleByNewDay = async (day, time) => {
        const dayMapping = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 0,
        };

        const duration = originalData[0].duration;
        const [hours, minutes] = time.split(":").map(Number);
        const endMinutes = minutes + duration;
        const endHours = hours + Math.floor(endMinutes / 60);
        const formattedEndMinutes = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${formattedEndMinutes.toString().padStart(2, '0')}`;
        const formattedData = [
            {
                day: day,
                start_time: time,
                end_time: endTime
            }
        ];
        let teacherIdArray = []
        try {
            setIsLoading(true)
            const queryParam = encodeURIComponent(JSON.stringify(formattedData))
            const response = await axios.get(`${apiGetTeacherMatchingStudent}?required_times=${queryParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            const result = response.data
            if (result && result.data) {
                teacherIdArray = result.data.map(teacher => teacher.teacher_id)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error.response?.data?.message || error.message)
            setTeachers([])
        } finally {
            setSelectedTeacher(null)
            setIsLoading(false)
        }

        const targetDay = dayMapping[day];
        const currentTime = new Date();

        const updatedData = selectedData.map((item) => {
            const currentDate = parseISO(item.going_date_time);
            const currentDay = currentDate.getDay();

            const daysToAddForward = (targetDay - currentDay + 7) % 7;
            const forwardDate = addDays(currentDate, daysToAddForward);

            const daysToAddBackward = (currentDay - targetDay + 7) % 7;
            const backwardDate = addDays(currentDate, -daysToAddBackward);

            const forwardDateTime = set(forwardDate, {
                hours: parseInt(time.split(':')[0], 10),
                minutes: parseInt(time.split(':')[1], 10),
                seconds: 0,
                milliseconds: 0,
            });

            const backwardDateTime = set(backwardDate, {
                hours: parseInt(time.split(':')[0], 10),
                minutes: parseInt(time.split(':')[1], 10),
                seconds: 0,
                milliseconds: 0,
            });

            const futureDates = [forwardDateTime, backwardDateTime].filter(date => date > currentTime);
            const closestFutureDate = futureDates.sort((a, b) => a - b)[0];
            const isTeacherIdValid = teacherIdArray.includes(item.teacher_id);

            return {
                ...item,
                going_date_time: format(closestFutureDate, "yyyy-MM-dd'T'HH:mm:ss"),
                teacher_id: isTeacherIdValid ? item.teacher_id : null,
                teacher_name: isTeacherIdValid ? item.teacher_name : null,
            };
        });

        const changeDataMap = new Map(updatedData.map(item => [item.class_session_id, item]));
        const newDataSession = dataSession.map(item => {
            const changedItem = changeDataMap.get(item.class_session_id);
            return changedItem ? {...item, ...changedItem} : item;
        });

        newDataSession.sort((a, b) => new Date(a.going_date_time) - new Date(b.going_date_time));

        setDataSession(newDataSession);
        setShowModal(false);
    };

    const formatDate = (dateString) => {
        const dayOfWeek = dayjs(dateString).format('dddd');
        return `${dayOfWeek}, ${dayjs(dateString).format('HH:mm DD/MM/YYYY')}`;
    };

    return (
        <>
            {isLoading && <Loading/>}
            <div style={overlayStyle} onClick={onClose}>
                <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                    <button style={closeButtonStyle} onClick={onClose}>
                        &times;
                    </button>
                    <h1 style={{
                        marginBottom: '15px',
                        color: '#333',
                        textAlign: 'center',
                        fontSize: '24px'
                    }}>{t('change teacher')}</h1>

                    <HeaderWrapper>
                        <div>
                            {/* eslint-disable-next-line react/prop-types */}
                            <CourseInfoCustom>{courseInfo.program_name} - {courseInfo.level_program} - {courseInfo.teacher_name}</CourseInfoCustom>
                            <CourseInfoCustom>{t('available schedule')}: {
                                // eslint-disable-next-line react/prop-types
                                courseInfo.schedule && Array.isArray(JSON.parse(courseInfo.schedule))
                                    // eslint-disable-next-line react/prop-types
                                    ? JSON.parse(courseInfo.schedule).map((session, index) => (
                                        <span key={index}>
                                {t(session.day.toLowerCase())}, {session.start_time} - {session.end_time}
                                            {/* eslint-disable-next-line react/prop-types */}
                                            {index < JSON.parse(courseInfo.schedule).length - 1 && ' | '}
                            </span>
                                    ))
                                    : 'No schedule available'}
                            </CourseInfoCustom>
                        </div>

                        <div>
                            {JSON.stringify(originalData) !== JSON.stringify(dataSession) && (
                                <ResetButton
                                    onClick={() => {
                                        setDataSession(originalData);
                                        setTeachers([]);
                                    }}
                                >
                                    Reset
                                </ResetButton>
                            )}
                        </div>

                    </HeaderWrapper>

                    <TableContainer>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '10px',
                                    backgroundColor: '#f4f4f4',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>{t('class code')}</th>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '10px',
                                    backgroundColor: '#f4f4f4',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>{t('teacher name')}</th>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '10px',
                                    backgroundColor: '#f4f4f4',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>{t('going date time')}</th>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        padding: '10px',
                                        backgroundColor: '#f4f4f4',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        position: 'relative',
                                    }}
                                >
                                    <div
                                        style={{
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #ccc',
                                            paddingBottom: '5px',
                                        }}
                                        onClick={() => setIsDropdownVisible((prev) => !prev)}
                                    >
                                        {t('Select Weekdays')}
                                    </div>

                                    {isDropdownVisible && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '0',
                                                backgroundColor: '#fff',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                zIndex: 1000,
                                                width: '160px',
                                            }}
                                        >
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDays.length === sortedWeekdays.length}
                                                    onChange={(e) => handleCheckboxChange('all', e.target.checked)}
                                                />
                                                {t('Select All')}
                                            </label>

                                            {sortedWeekdays.map((day, index) => (
                                                <label
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={day}
                                                        checked={selectedDays.includes(day)}
                                                        onChange={(e) => handleCheckboxChange(day, e.target.checked)}
                                                    />
                                                    {t(day.toLowerCase())}
                                                </label>
                                            ))}

                                            <div style={{textAlign: 'right', marginTop: '10px'}}>
                                                <button
                                                    onClick={() => setIsDropdownVisible(false)}
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {t('Done')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {dataSession.map((session, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: selectedRows.includes(session.class_session_id) ? '#F1B6B6' : 'transparent',
                                    }}
                                >
                                    <td style={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}>{session.class_session_id}</td>
                                    <td style={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}>{session.teacher_name}</td>
                                    <td style={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}>{formatDate(session.going_date_time)}</td>
                                    <td style={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        fontSize: '14px',
                                        textAlign: 'center'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(session.class_session_id)}
                                            onChange={() => handleSelectRow(session.class_session_id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </TableContainer>
                    <SearchTeacherWrapper>
                        {(selectedDays.length === 1) && (
                            <>
                                <button
                                    onClick={handleChangeDay}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('change day')}
                                </button>

                                {showModal && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '72%',
                                            left: '30px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '10px',
                                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            zIndex: 10,
                                            marginTop: '8px',
                                        }}
                                    >
                                        <label style={{display: 'block', marginBottom: '8px'}}>
                                            {t('Select Day')}:
                                            <select
                                                value={selectedDay}
                                                onChange={(e) => setSelectedDay(e.target.value)}
                                                style={{marginLeft: '8px', padding: '5px'}}
                                            >
                                                <option value="Monday">{t('Monday')}</option>
                                                <option value="Tuesday">{t('Tuesday')}</option>
                                                <option value="Wednesday">{t('Wednesday')}</option>
                                                <option value="Thursday">{t('Thursday')}</option>
                                                <option value="Friday">{t('Friday')}</option>
                                                <option value="Saturday">{t('Saturday')}</option>
                                                <option value="Sunday">{t('Sunday')}</option>
                                            </select>
                                        </label>
                                        <label style={{display: 'block', marginBottom: '8px'}}>
                                            {t('Select Time')}:
                                            <input
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                style={{marginLeft: '8px'}}
                                            />
                                        </label>
                                        <button
                                            onClick={() => changeScheduleByNewDay(selectedDay, selectedTime)}
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                padding: '5px 10px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                marginTop: '10px',
                                            }}
                                        >
                                            {t('Save')}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            onClick={handleSearchTeacher}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('search teacher')}
                        </button>

                        <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                            {teachers.map((teacher) => (
                                <TeacherCard
                                    key={teacher.teacher_id}
                                    selected={selectedTeacher?.teacher_id === teacher.teacher_id}
                                    onClick={() => selectTeacher(teacher)}
                                >
                                    <TeacherName>{teacher.full_name} - {teacher.level_teacher || 'No Level'}</TeacherName>
                                    <Checkmark
                                        selected={selectedTeacher?.teacher_id === teacher.teacher_id}>✔</Checkmark>
                                </TeacherCard>
                            ))}
                        </div>
                    </SearchTeacherWrapper>
                    <form style={formStyle}>
                        <div>
                            <label htmlFor="reason" style={{marginBottom: '5px', fontSize: '18px'}}>
                                {t('reason')}
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={handleReasonChange}
                                style={textareaStyle}
                                placeholder={t('enter reason')}
                            />
                        </div>
                    </form>
                    {JSON.stringify(originalData) !== JSON.stringify(dataSession) && (
                        <button type="submit" style={buttonStyle} onClick={handleSubmit}>
                            {t('save')}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChangeTeacher;