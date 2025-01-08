import {useEffect, useState} from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../General/Loading.jsx";
import axios from "axios";
import {Title} from "chart.js";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Content = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 750px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-out;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: #000;
    }
`;

const DataRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
`;

const DataItem = styled.div`
    font-size: 16px;
    text-align: center;
    color: #555;
`;

const HeaderRow = styled(DataRow)`
    font-weight: bold;
    border-bottom: 2px solid #ccc;
    background-color: #f9f9f9;
    text-align: left;
`;

const StyledDatePicker = styled(DatePicker)`
    font-size: 16px;
    padding: 10px 8px;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    width: 120px;
    text-align: center;

    &:focus {
        border-color: #45a049;
        box-shadow: 0 0 5px rgba(72, 183, 75, 0.5);
    }
`;

const Select = styled.select`
    font-size: 16px;
    padding: 10px 8px;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    width: 120px;
    text-align: center;

    &:focus {
        border-color: #45a049;
        box-shadow: 0 0 5px rgba(72, 183, 75, 0.5);
    }
`

const StyledButton = styled.button`
    background-color: ${(props) => (props.disabled ? '#ccc' : '#4caf50')};
    color: ${(props) => (props.disabled ? '#666' : 'white')};
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => (props.disabled ? '#ccc' : '#45a049')};
    }

    &:active {
        background-color: ${(props) => (props.disabled ? '#ccc' : '#3e8e41')};
    }
`;

const TitleCustom = styled.h2`
    font-size: 20px;
    margin-bottom: 20px;
`

const apiGetTeacherMatchingStudent = import.meta.env.VITE_URL_GET_TEACHER_MATCHING_STUDENT;
const apiClassSessionUrl = import.meta.env.VITE_URL_CLASS_SESSION;

// eslint-disable-next-line react/prop-types
const CreateSessionDeferredOrCancel = ({onClose, data, onSave}) => {
    const fullData = JSON.parse(localStorage.getItem("fullData"));
    const token = fullData?.access_token || "";
    const [, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState(
        // eslint-disable-next-line react/prop-types
        data.map(item => ({
            ...item,
            list_teachers: [],
        }))
    );
    const [selectedDates] = useState(
        // eslint-disable-next-line react/prop-types
        data.reduce((acc, item) => {
            acc[item.class_session_id] = item.going_date_time
                ? new Date(item.going_date_time)
                : null;
            return acc;
        }, {})
    );

    const [selectedTimes] = useState(
        // eslint-disable-next-line react/prop-types
        data.reduce((acc, item) => {
            const date = new Date(item.going_date_time);
            acc[item.class_session_id] = {
                hour: isNaN(date.getHours()) ? "" : date.getHours(),
                minute: isNaN(date.getMinutes()) ? "" : date.getMinutes(),
            };
            return acc;
        }, {})
    );

    const fetchTeachersBasedOnSchedule = async (date, time, duration) => {
        const formatInput = formatSchedule(date, time, duration);

        try {
            const queryParam = encodeURIComponent(JSON.stringify(formatInput));
            const response = await axios.get(`${apiGetTeacherMatchingStudent}?required_times=${queryParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch data:", error.response?.data?.message || error.message);
            return [];
        }
    };


    useEffect(() => {
        const updateTeachers = async () => {
            const updatedTeachers = await fetchTeachersBasedOnSchedule(
                selectedDates,
                selectedTimes
            );
            setTeachers(updatedTeachers);
        };

        updateTeachers();
    }, [selectedDates, selectedTimes]);

    const handleTimeChange = async (class_session_id, time) => {
        const [hour, minute] = time.split(":").map(Number);
        const updatedSessionData = [...sessionData];
        const sessionIndex = updatedSessionData.findIndex(
            session => session.class_session_id === class_session_id
        );

        if (sessionIndex !== -1) {
            const currentDate = updatedSessionData[sessionIndex].going_date_time
                ? new Date(updatedSessionData[sessionIndex].going_date_time)
                : new Date();
            currentDate.setHours(hour, minute);
            updatedSessionData[sessionIndex].going_date_time = currentDate;
            updatedSessionData[sessionIndex].teacher_id = null;
            const duration = updatedSessionData[sessionIndex].duration;
            updatedSessionData[sessionIndex].list_teachers = await fetchTeachersBasedOnSchedule(
                currentDate,
                time,
                duration
            );
            setSessionData(updatedSessionData);
        }
    };

    const handleCreateSession = async (item) => {
        setLoading(true);
        const apiUrl = `${apiClassSessionUrl}${item.class_session_id}`;
        const requestData = {
            teacher_id: item.teacher_id,
            going_date_time: formatDateTime(item.going_date_time),
        };

        try {
            await axios.put(apiUrl, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSessionData((prevSessionData) =>
                prevSessionData.filter(
                    (session) => session.class_session_id !== item.class_session_id
                )
            );
            onSave();
            setLoading(false);
        } catch (error) {
            console.error(
                "Failed to update session:",
                error.response?.data?.message || error.message
            );
            setLoading(false);
        }
    };


    const formatDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = "00.000000";
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleDateChange = async (class_session_id, date) => {
        const updatedSessionData = [...sessionData];
        const sessionIndex = updatedSessionData.findIndex(
            session => session.class_session_id === class_session_id
        );

        if (sessionIndex !== -1) {
            updatedSessionData[sessionIndex].going_date_time = date;
            updatedSessionData[sessionIndex].teacher_id = null;
            const duration = updatedSessionData[sessionIndex].duration;
            updatedSessionData[sessionIndex].list_teachers = await fetchTeachersBasedOnSchedule(
                date,
                `${date.getHours()}:${date.getMinutes()}`,
                duration
            );
            setSessionData(updatedSessionData);
        }
    };

    const handleTeacherChange = (class_session_id, teacher_id) => {
        const updatedSessionData = [...sessionData];
        const sessionIndex = updatedSessionData.findIndex(
            session => session.class_session_id === class_session_id
        );

        if (sessionIndex !== -1) {
            const selectedTeacher = updatedSessionData[sessionIndex].list_teachers.find(
                teacher => teacher.teacher_id === teacher_id
            );

            updatedSessionData[sessionIndex].teacher_id = teacher_id;
            updatedSessionData[sessionIndex].teacher_name = selectedTeacher ? selectedTeacher.full_name : "";
            setSessionData(updatedSessionData);
        }
    };


    function formatSchedule(date, time, duration) {
        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        const [hour, minute] = time.split(":").map(Number);
        const startDate = new Date(date);
        startDate.setHours(hour, minute);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        const day = daysOfWeek[startDate.getDay()];
        const start_time = `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
        const end_time = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
        return [
            {
                day,
                start_time,
                end_time
            }
        ];
    }

    return (
        <>
            {loading && <Loading/>}
            <Overlay onClick={onClose}>
                <Content onClick={(e) => e.stopPropagation()}>
                    <CloseButton onClick={onClose}>x</CloseButton>
                    <TitleCustom style={{textAlign: "center"}}>Session Deferred And Cancelled</TitleCustom>
                    <HeaderRow>
                        <DataItem>ID</DataItem>
                        <DataItem>Going Date</DataItem>
                        <DataItem>Going Time</DataItem>
                        <DataItem>Teacher Name</DataItem>
                        <DataItem>Actions</DataItem>
                    </HeaderRow>
                    {sessionData.map(item => (
                        <DataRow key={item.class_session_id}>
                            <DataItem>{item.class_session_id}</DataItem>
                            <DataItem>
                                <StyledDatePicker
                                    selected={new Date(item.going_date_time)}
                                    onChange={date =>
                                        handleDateChange(item.class_session_id, date)
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select Date"
                                    showMonthYearDropdown
                                    openToDate={new Date()}
                                />
                            </DataItem>
                            <DataItem>
                                <Select
                                    value={
                                        item.going_date_time
                                            ? `${String(new Date(item.going_date_time).getHours()).padStart(2, "0")}:${String(
                                                new Date(item.going_date_time).getMinutes()
                                            ).padStart(2, "0")}`
                                            : ""
                                    }
                                    onChange={e =>
                                        handleTimeChange(item.class_session_id, e.target.value)
                                    }
                                >
                                    <option value="">Select Time</option>
                                    {Array.from({length: 24}, (_, hour) =>
                                        Array.from({length: 60}, (_, minute) => {
                                            const timeValue = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
                                                2,
                                                "0"
                                            )}`;
                                            return (
                                                <option key={`${hour}-${minute}`} value={timeValue}>
                                                    {timeValue}
                                                </option>
                                            );
                                        })
                                    )}
                                </Select>
                            </DataItem>
                            <DataItem>
                                <Select style={{width: "150px"}}
                                        value={item.teacher_id || ""}
                                        onChange={e =>
                                            handleTeacherChange(item.class_session_id, Number(e.target.value))
                                        }
                                >
                                    <option value="">Select Teacher</option>
                                    {item.list_teachers.map(teacher => (
                                        <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                            {teacher.full_name}
                                        </option>
                                    ))}
                                </Select>
                            </DataItem>

                            <DataItem>
                                <StyledButton
                                    onClick={() => handleCreateSession(item)}
                                    disabled={!item.teacher_id}
                                >
                                    Create
                                </StyledButton>
                            </DataItem>
                        </DataRow>
                    ))}
                </Content>
            </Overlay>
        </>
    );
};

export default CreateSessionDeferredOrCancel;