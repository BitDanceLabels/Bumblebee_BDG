import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import dayjs from 'dayjs';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import {FaTrashAlt} from "react-icons/fa";

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
    background: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '600px',
    maxWidth: '90%',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out',
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

const CourseInfoCustom = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`

const TableContainer = styled.div`
    max-height: 220px;
    overflow-y: auto;
`

const EditScheduleWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 15px;
`

const LeftWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 160px;
    overflow-y: auto;
`

const Select = styled.select`
    padding: 4px 2px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    width: 80px;
    transition: border-color 0.3s ease, background-color 0.3s ease;

    &:hover {
        border-color: #007bff;
        background-color: #f0f8ff;
    }

    &:focus {
        outline: none;
        border-color: #0056b3;
        background-color: #e6f7ff;
    }

    option {
        padding: 8px;
        background-color: #fff;
        color: #333;
    }
`;

export const CustomDatePickerWrapper = styled.div`
    .react-datepicker__input-container input {
        width: 100px;
        text-align: center;
        padding: 8px 2px;
        font-size: 14px;
        border: 2px solid #3498db;
        border-radius: 8px;
        background-color: #f9f9f9;
        color: #333;
        transition: all 0.3s ease;
    }

    .react-datepicker__input-container input:focus {
        outline: none;
        border-color: #2980b9;
        background-color: #fff;
    }

    .react-datepicker__input-container input:hover {
        border-color: #2980b9;
        cursor: pointer;
    }

    .react-datepicker__input-container input {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`

// eslint-disable-next-line react/prop-types
const UpdateSchedule = ({data, onClose, courseInfo}) => {
    const {t} = useTranslation();
    const [, setSelectedRows] = useState([]);
    const [isModalOpen] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [schedule, setSchedule] = useState(() => {
        try {
            // eslint-disable-next-line react/prop-types
            return Array.isArray(courseInfo.schedule) ? courseInfo.schedule : JSON.parse(courseInfo.schedule) || [];
        } catch (error) {
            console.error('Error parsing schedule:', error);
            return [];
        }
    });

    const handleSelectChange = (index, field, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[index][field] = value;
        setSchedule(updatedSchedule);
    };

    const handleAddRow = () => {
        setSchedule([...schedule, {day: 'Monday', start_time: '00:00', end_time: '01:00'}]);
    };

    const handleDeleteRow = (index) => {
        const updatedSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(updatedSchedule);
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = Array.from({length: 24 * 60}, (_, i) => {
        const hours = String(Math.floor(i / 60)).padStart(2, '0');
        const minutes = String(i % 60).padStart(2, '0');
        return `${hours}:${minutes}`;
    });

    if (!data) {
        return <p>No event selected.</p>;
    }

    const formatDate = (dateString) => {
        return dayjs(dateString).format('ddd HH:mm DD/MM/YYYY');
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isModalOpen) {
            // eslint-disable-next-line react/prop-types
            const allIds = data.map((session) => session.class_session_id);
            setSelectedRows(allIds);
        }
    }, [isModalOpen, data]);

    return (
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
                }}>{t('update schedule')}</h1>
                {/* eslint-disable-next-line react/prop-types */}
                <CourseInfoCustom>{courseInfo.program_name} - {courseInfo.level_program} - {courseInfo.teacher_name}</CourseInfoCustom>
                <CourseInfoCustom>{t('available schedule')}:</CourseInfoCustom>
                <EditScheduleWrapper>
                    <LeftWrapper>
                        {schedule.length > 0 ? (
                            schedule.map((session, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    marginBottom: '10px',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {/* Select cho day */}
                                    <Select
                                        value={session.day}
                                        onChange={(e) => handleSelectChange(index, 'day', e.target.value)}
                                        style={{marginRight: '8px'}}
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day} value={day}>{t(day.toLowerCase())}</option>
                                        ))}
                                    </Select>

                                    {/* Select cho start_time */}
                                    <Select
                                        value={session.start_time}
                                        onChange={(e) => handleSelectChange(index, 'start_time', e.target.value)}
                                        style={{marginRight: '8px'}}
                                    >
                                        {times.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Select>

                                    {/* Select cho end_time */}
                                    <Select
                                        value={session.end_time}
                                        onChange={(e) => handleSelectChange(index, 'end_time', e.target.value)}
                                        style={{marginRight: '8px'}}
                                    >
                                        {times.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Select>

                                    <FaTrashAlt
                                        onClick={() => handleDeleteRow(index)}
                                        style={{
                                            color: 'red',
                                            cursor: 'pointer',
                                            fontSize: '20px ',
                                            marginRight: '8px'
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>{t('no schedule available')}</p>
                        )}
                        <div style={{textAlign: 'center'}}>
                            <button
                                onClick={handleAddRow}
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    padding: '10px 20px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {t('add schedule')}
                            </button>
                        </div>
                    </LeftWrapper>

                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <label htmlFor="start-date"
                                   style={{marginRight: '8px', fontSize: '16px'}}>{t('start date')}:</label>
                            <CustomDatePickerWrapper>
                                <DatePicker
                                    id="start-date"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    showMonthYearDropdown
                                />
                            </CustomDatePickerWrapper>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <label htmlFor="end-date"
                                   style={{marginRight: '8px', fontSize: '16px'}}>{t('end date')}:</label>
                            <CustomDatePickerWrapper>
                                <DatePicker
                                    id="end-date"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={startDate}
                                    showMonthYearDropdown
                                />
                            </CustomDatePickerWrapper>
                        </div>
                    </div>
                </EditScheduleWrapper>

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
                        </tr>
                        </thead>
                        <tbody>
                        {/* eslint-disable-next-line react/prop-types */}
                        {data.map((session, index) => (
                            <tr key={index}>
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </TableContainer>
                <button type="submit" style={buttonStyle}>
                    {t('save')}
                </button>
            </div>
        </div>
    );
};

export default UpdateSchedule;