import {useEffect, useState} from "react";
import {addDays, addMinutes, format, parseISO, set} from "date-fns";
import Loading from "../General/Loading.jsx";
import {t} from "i18next";
import axios from "axios";

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: 'rgba(0, 0, 0, 0.5)',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const contentStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-out",
};

const closeButtonStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    cursor: "pointer",
    transition: "color 0.2s ease",
};

const apiGetTeacherMatchingStudent = import.meta.env.VITE_URL_GET_TEACHER_MATCHING_STUDENT;
const apiClassSessionUrl = import.meta.env.VITE_URL_CLASS_SESSION;
const apiUpdateListClassSessions = import.meta.env.VITE_URL_UPDATE_LIST_CLASS_SESSIONS;

// eslint-disable-next-line react/prop-types
const ChangeSession = ({session, onClose, onSave, data}) => {
    // eslint-disable-next-line react/prop-types
    const [selectedDate, setSelectedDate] = useState(session.going_date_time.split("T")[0]);
    // eslint-disable-next-line react/prop-types
    const [selectedTime, setSelectedTime] = useState(session.going_date_time.split("T")[1].slice(0, 5));
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    // eslint-disable-next-line react/prop-types
    const [currentTeacherId] = useState(session.teacher_id);
    const [updateData, setUpdateData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Lấy token từ localStorage
    const fullData = JSON.parse(localStorage.getItem("fullData"));
    const token = fullData?.access_token || "";

    const findNextSession = (currentSessionDateTime) => {
        const currentDate = new Date(currentSessionDateTime);
        const nextSession = data
            // eslint-disable-next-line react/prop-types
            .filter(session => new Date(session.going_date_time) > currentDate)
            .sort((a, b) => new Date(a.going_date_time) - new Date(b.going_date_time))
            .shift();

        return nextSession.going_date_time || null;
    };

    const findPreviousSession = (currentSessionDateTime) => {
        const currentDate = new Date(currentSessionDateTime);
        const previousSession = data
            // eslint-disable-next-line react/prop-types
            .filter(session => new Date(session.going_date_time) < currentDate)
            .sort((a, b) => new Date(b.going_date_time) - new Date(a.going_date_time))
            .shift();

        return previousSession?.going_date_time || null;
    };

    // eslint-disable-next-line react/prop-types
    const next_going_date_time = findNextSession(session.going_date_time);
    // eslint-disable-next-line react/prop-types
    const previous_going_date_time = findPreviousSession(session.going_date_time);

    const formatSession = (goingDateTime, durationMinutes, selectTime) => {
        let dateObject = parseISO(goingDateTime);
        const [hours, minutes] = selectTime.split(":").map(Number);
        dateObject = set(dateObject, {hours, minutes, seconds: 0, milliseconds: 0});
        const day = format(dateObject, "EEEE");
        const startTime = format(dateObject, "HH:mm");
        const endTime = format(addMinutes(dateObject, durationMinutes), "HH:mm");

        return [
            {
                day,
                start_time: startTime,
                end_time: endTime,
            },
        ];
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);

            if (new Date(selectedDateTime) > new Date(next_going_date_time) || new Date(selectedDateTime) < new Date(previous_going_date_time)) {
                // eslint-disable-next-line react/prop-types
                const filteredData = data.filter((sessionData) =>
                    // eslint-disable-next-line react/prop-types
                    new Date(sessionData.going_date_time).toISOString() >= new Date(session.going_date_time).toISOString()
                );
                updateSchedule(filteredData);
            } else {
                setUpdateData([]);
            }
            // eslint-disable-next-line react/prop-types
            const formattedSession = formatSession(selectedDate, session.duration, selectedTime);
            try {
                const queryParam = encodeURIComponent(JSON.stringify(formattedSession));
                const response = await axios.get(`${apiGetTeacherMatchingStudent}?required_times=${queryParam}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setTeachers(response.data.data);
                const matchingTeacher = response.data.data.find(
                    (teacher) => teacher.teacher_id === currentTeacherId
                );
                if (matchingTeacher) {
                    setSelectedTeacherId(currentTeacherId);
                } else {
                    setSelectedTeacherId(null);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error.response?.data?.message || error.message);
                setSelectedTeacherId(null)
                setTeachers([]);
            }
        };
        fetchTeachers();
        // eslint-disable-next-line react/prop-types
    }, [selectedDate, selectedTime, session.duration, token]);

    const updateSchedule = (dataInput) => {
        const updatedDataJson = JSON.parse(JSON.stringify(dataInput));
        let currentDate = parseISO(selectedDate);
        updatedDataJson.forEach((session, index) => {
            // eslint-disable-next-line react/prop-types
            const originalTime = new Date(session.going_date_time);

            if (index === 0) {
                const updatedDate = format(currentDate, "yyyy-MM-dd");
                const timePart = format(selectedTime, "HH:mm:ss.SSSSSS");
                session.going_date_time = `${updatedDate} ${timePart}`;
            } else {
                const sessionDay = originalTime.getDay();
                do {
                    currentDate = addDays(currentDate, 1);
                } while (currentDate.getDay() !== sessionDay);
                const updatedDate = format(currentDate, "yyyy-MM-dd");
                const timePart = format(originalTime, "HH:mm:ss.SSSSSS");
                session.going_date_time = `${updatedDate} ${timePart}`;
            }
        });

        setUpdateData(updatedDataJson);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (updateData.length > 0) {
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
            } else {
                await axios.put(
                    // eslint-disable-next-line react/prop-types
                    `${apiClassSessionUrl}${session.class_session_id}`,
                    {
                        teacher_id: selectedTeacherId,
                        going_date_time: `${selectedDate} ${selectedTime}:00.000000`
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            onClose();
            onSave();
        } catch (error) {
            console.error("Error updating session:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading/>}
            <div style={overlayStyle} onClick={onClose}>
                <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                    <button style={closeButtonStyle} onClick={onClose}>
                        &times;
                    </button>
                    <h1
                        style={{
                            marginBottom: "15px",
                            color: "#333",
                            textAlign: "center",
                            fontSize: "24px",
                        }}
                    >
                        {t("change teacher")}
                    </h1>
                    <div style={{marginBottom: "15px"}}>
                        <label htmlFor="date" style={{display: "block", marginBottom: "5px"}}>
                            Select Date:
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{width: "100%", padding: "10px", fontSize: "14px"}}
                        />
                    </div>
                    <div style={{marginBottom: "15px"}}>
                        <label htmlFor="time" style={{display: "block", marginBottom: "5px"}}>
                            Select Time:
                        </label>
                        <input
                            id="time"
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            style={{width: "100%", padding: "10px", fontSize: "14px"}}
                        />
                    </div>
                    <div style={{marginBottom: "15px"}}>
                        <label htmlFor="teacher" style={{display: "block", marginBottom: "5px"}}>
                            Select Teacher:
                        </label>
                        <select
                            id="teacher"
                            value={selectedTeacherId ? selectedTeacherId : ""}
                            onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                            style={{width: "100%", padding: "10px", fontSize: "14px"}}
                        >
                            {!teachers.some((teacher) => teacher.teacher_id === currentTeacherId) && (
                                <option value="" disabled>
                                    -- Select a Teacher --
                                </option>
                            )}
                            {teachers.map((teacher) => (
                                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                    {teacher.full_name} ({teacher.gender})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#f44336",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#4CAF50",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangeSession;