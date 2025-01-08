import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Loading from "../General/Loading.jsx";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div``;

const DropdownContainer = styled.div`
    margin-bottom: 20px;
`;

const Select = styled.select`
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const TableContainer = styled.div`
    overflow-x: auto;
    overflow-y: auto;
    max-height: 400px;
    border: 1px solid #ccc;
    border-radius: 8px;
    position: relative;
`;

const StyledTable = styled.table`
    border-collapse: collapse;
    width: max-content;
    table-layout: fixed;
    font-size: 16px;

    th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        position: relative;
        width: 80px;
        background-color: #4CAF50;
        color: #333;
        font-weight: bold;
    }

    td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: center;
        position: relative;
        background-color: #ffffff;
        color: #333;
        font-size: 15px;
    }

    tr:hover {
        background-color: #f1f1f1;
    }

    th:first-child {
        position: sticky;
        left: 0;
        background-color: #4CAF50;
        z-index: 10;
        width: 80px;
        height: 40px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    td:first-child {
        position: sticky;
        left: 0;
        background-color: #f4f4f4;
        z-index: 10;
        width: 150px;
        height: 40px;
        font-weight: bold;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
`;

const LabelCustom = styled.label`
    font-size: 16px;
    font-weight: bold;
`;

const Card = styled.div`
    position: absolute;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    padding: 4px;
    font-size: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const getTeacherScheduleUrl = import.meta.env.VITE_URL_GET_TEACHER_SCHEDULE

const TeacherSchedule = () => {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState("Monday");

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const timeSlots = Array.from({length: 23 - 6 + 1}, (_, i) => i + 6).flatMap((hour) => [
        `${hour}:00`,
        `${hour}:30`,
    ]);
    const [teacherSchedule, setTeacherSchedule] = useState([]);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const morningSlots = timeSlots.filter((time) => parseInt(time) >= 6 && parseInt(time) < 12).length;
    const afternoonSlots = timeSlots.filter((time) => parseInt(time) >= 12 && parseInt(time) < 18).length;
    const eveningSlots = timeSlots.filter((time) => parseInt(time) >= 18).length;
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    useEffect(() => {
        const fetchTeacherSchedule = async () => {
            setLoading(true);
            try {
                const response = await axios.get(getTeacherScheduleUrl, {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    console.error("Error fetching teacher schedule:", response.statusText);
                    return;
                }

                const teacherSchedule = processTeacherSchedule(JSON.parse(response.data.data));
                setTeacherSchedule(teacherSchedule);
            } catch (error) {
                console.error("Error fetching teacher schedule:", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherSchedule();
    }, []);

    useEffect(() => {
        const filterScheduleByDay = () => {
            const filtered = teacherSchedule.map((teacher) => {
                const schedule = teacher.json_schedule || {};
                const timeZone = teacher.json_time_zone ? JSON.parse(teacher.json_time_zone) : {};

                const dayScheduleFromSchedule = schedule[selectedDay] || [];
                const dayScheduleFromTimeZone = timeZone[selectedDay] || [];

                const updatedSchedule = dayScheduleFromSchedule.length > 0 ? {[selectedDay]: dayScheduleFromSchedule} : {};
                const updatedTimeZone = dayScheduleFromTimeZone.length > 0 ? {[selectedDay]: dayScheduleFromTimeZone} : {};

                return {
                    ...teacher,
                    json_schedule: updatedSchedule,
                    json_time_zone: JSON.stringify(updatedTimeZone),
                };
            });

            setFilteredSchedule(filtered);
        };

        filterScheduleByDay();
    }, [selectedDay, teacherSchedule]);


    const mergeTimeRanges = (schedule) => {
        const mergedSchedule = {};

        for (const day in schedule) {
            const timeRanges = schedule[day];
            timeRanges.sort((a, b) => a.start_time.localeCompare(b.start_time));
            const mergedRanges = [];
            let currentRange = timeRanges[0];
            for (let i = 1; i < timeRanges.length; i++) {
                const nextRange = timeRanges[i];

                if (currentRange.end_time >= nextRange.start_time) {
                    currentRange.end_time = nextRange.end_time > currentRange.end_time ? nextRange.end_time : currentRange.end_time;
                } else {
                    mergedRanges.push(currentRange);
                    currentRange = nextRange;
                }
            }
            mergedRanges.push(currentRange);
            mergedSchedule[day] = mergedRanges;
        }

        return mergedSchedule;
    };

    const processTeacherSchedule = (teacherSchedule) => {
        return teacherSchedule.map((teacher) => {
            const schedule = teacher.json_schedule ? JSON.parse(teacher.json_schedule) : null;

            if (schedule) {
                teacher.json_schedule = mergeTimeRanges(schedule);
            }

            return teacher;
        });
    };

    const renderCards = (jsonSchedule, jsonTimeZone, teacherId, teacherList) => {
        const schedule = typeof jsonSchedule === "string" ? JSON.parse(jsonSchedule) : jsonSchedule || {};
        const timeZone = typeof jsonTimeZone === "string" ? JSON.parse(jsonTimeZone) : jsonTimeZone || {};
        const cards = [];

        const teacherIndex = teacherList.findIndex((teacher) => teacher.teacher_id === teacherId);

        const generateCards = (source, color, zIndex) => {
            Object.entries(source).forEach(([day, slots]) => {
                slots.forEach(({start_time, end_time}, slotIndex) => {
                    const startMinutes = calculateMinutesFromStartTime(start_time);
                    const endMinutes = calculateMinutesFromStartTime(end_time);
                    const width = (endMinutes - startMinutes) * 8 / 3;

                    cards.push(
                        <Card
                            key={`${teacherId}-${day}-${slotIndex}-${color}`}
                            style={{
                                top: `${80 + teacherIndex * 40}px`,
                                height: "40px",
                                left: `${150 + startMinutes * 8 / 3}px`,
                                width: `${width}px`,
                                backgroundColor: color,
                                zIndex: zIndex,
                            }}
                        >
                        </Card>
                    );
                });
            });
        };
        generateCards(schedule, "#a0c3ee", 2);
        generateCards(timeZone, "#D8F5EE", 1);
        return cards;
    };

    const calculateMinutesFromStartTime = (startTime, baseTime = "06:00") => {
        const [baseHour, baseMinute] = baseTime.split(":").map(Number);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        return (startHour * 60 + startMinute) - (baseHour * 60 + baseMinute);
    };

    return (
        <>
            {loading && <Loading/>}
            <Container>
                <DropdownContainer>
                    <LabelCustom htmlFor="day-select">{t("Select Day")}: </LabelCustom>
                    <Select id="day-select" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                                {t(day)}
                            </option>
                        ))}
                    </Select>
                </DropdownContainer>

                <TableContainer>
                    <StyledTable>
                        <thead>
                        <tr style={{height: '40px'}}>
                            <th rowSpan="2" style={{zIndex: '12'}}>{t("Teacher Name")}</th>
                            <th style={{backgroundColor: '#fffacd'}} colSpan={morningSlots}>{t("Morning")}</th>
                            <th style={{backgroundColor: '#ffcc99'}} colSpan={afternoonSlots}>{t("Afternoon")}</th>
                            <th style={{backgroundColor: '#d1c4e9'}} colSpan={eveningSlots}>{t("Evening")}</th>
                        </tr>
                        <tr>
                            {timeSlots.map((slot) => (
                                <th key={slot}>{slot}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredSchedule.map((teacher) => (
                            <tr key={teacher.teacher_id}>
                                <td>{teacher.full_name}</td>
                                {timeSlots.map((slot) => (
                                    <td key={`${teacher.teacher_id}-${slot}`}></td>
                                ))}
                                {renderCards(teacher.json_schedule, teacher.json_time_zone, teacher.teacher_id, filteredSchedule)}
                            </tr>
                        ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
            </Container>
        </>
    );
};

export default TeacherSchedule;