import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useTranslation} from "react-i18next";
import Loading from "../General/Loading.jsx";
import axios from "axios";

const TableWrapper = styled.div`
    z-index: 0;
    overflow-x: auto;
    overflow-y: auto;
    height: 80vh;
    position: relative;
    margin-top: 20px;
`;

const Table = styled.table`
    width: ${({columnsCount}) => columnsCount * 150}px;
    border-collapse: collapse;
    table-layout: fixed;
`;

const Th = styled.th`
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ddd;
`;

const Td = styled.td`
    padding: 10px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ddd;
    height: 100px;
    background-color: ${({isShift, shift}) =>
            isShift && (shift === 'Morning' || shift === 'Sáng') ? '#fffacd' :
                    isShift && (shift === 'Afternoon' || shift === 'Chiều') ? '#ffcc99' :
                            isShift && (shift === 'Evening' || shift === 'Tối') ? '#d1c4e9' :
                                    '#f9f9f9'};
    width: 150px;
`;

const HeaderRow = styled.tr`
    background-color: #f4f4f4;
`;

const TimeSelectWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const TimeSelectLabel = styled.label`
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
`;

const StyledDatePicker = styled(DatePicker)`
    font-size: 16px;
    padding: 10px 15px;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
    width: 260px;

    &:focus {
        border-color: #45a049;
        box-shadow: 0 0 5px rgba(72, 183, 75, 0.5);
    }
`;

const Card = styled.div`
    position: absolute;
    width: 130px;
    background-color: #91d4f4;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 0;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;


const CardTitle = styled.h4`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const CardText = styled.p`
    font-size: 14px;
    color: #777;
    margin: 5px 0 0;
    text-align: center;
`;

const accountTimeTableUrl = import.meta.env.VITE_URL_ACCOUNT_TIME_TABLE;

const AccountClassin = () => {
    const {t,} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }
    const daysOfWeek = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')]
    const times = [];
    const [accountTimeTable, setAccountTimeTable] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(accountTimeTableUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const parsedData = JSON.parse(response.data.data);
                setAccountTimeTable(parsedData);

                const availableShifts = parsedData.reduce((acc, day) => {
                    Object.keys(day).forEach((shift) => {
                        if (!acc.includes(shift)) acc.push(shift);
                    });
                    return acc;
                }, []);
                setShiftColumns(availableShifts);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching account time table data:", error);
                setIsLoading(false);
            }
        };

        const currentDate = new Date();
        setSelectedDate(currentDate);
        calculateWeek(currentDate);
        fetchData();
    }, []);


    for (let hour = 6; hour < 23; hour++) {
        times.push(`${hour}:00-${hour}:30`, `${hour}:30-${hour + 1}:00`);
    }

    const [selectedDate, setSelectedDate] = useState(null);
    const [weekRange, setWeekRange] = useState("");
    const [weekDaysFormatted, setWeekDaysFormatted] = useState([]);
    const [shiftColumns, setShiftColumns] = useState([]);

    const calculateWeek = (date) => {
        if (!date) return;

        const startDate = new Date(date);
        const endDate = new Date(date);

        const dayOfWeek = startDate.getDay();
        const diffStart = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const diffEnd = dayOfWeek === 0 ? 0 : 6 - dayOfWeek;

        startDate.setDate(startDate.getDate() + diffStart);
        endDate.setDate(endDate.getDate() + diffEnd);

        const formattedDays = daysOfWeek.map((day, index) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            return `${day} ${formatDate(dayDate)}`;
        });

        setWeekDaysFormatted(formattedDays);
        setWeekRange(`${formattedDays[0]} - ${formattedDays[6]}`);
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getShift = (time) => {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 6 && hour < 12) {
            return t('morning');
        } else if (hour >= 12 && hour < 18) {
            return t('afternoon');
        } else {
            return t('evening');
        }
    };

    useEffect(() => {
        const currentDate = new Date();
        setSelectedDate(currentDate);
        calculateWeek(currentDate);

        const availableShifts = accountTimeTable.reduce((acc, day) => {
            Object.keys(day).forEach((shift) => {
                if (!acc.includes(shift)) acc.push(shift);
            });
            return acc;
        }, []);
        setShiftColumns(availableShifts);
    }, []);

    const groupedTimes = times.reduce((acc, time) => {
        const shift = getShift(time.split('-')[0]);
        if (!acc[shift]) acc[shift] = [];
        acc[shift].push(time);
        return acc;
    }, {});

    const getClassForTimeSlot = (shift, time, day) => {
        const shiftData = accountTimeTable.find(item => item[shift]);
        if (!shiftData) return null;
        const [startTime, endTime] = time.split('-');
        const matchedClass = shiftData[shift].find(classItem => {
            const classTime = classItem.going_date_time.slice(11, 16);
            const classDay = classItem.going_date_time.slice(0, 10);
            return isTimeInRange(classTime, startTime, endTime, classDay, day);
        });
        if (!matchedClass) return null;

        const classTime = matchedClass.going_date_time.slice(11, 16);
        const [classHour, classMinute] = classTime.split(':').map(Number);
        const totalMinutes = classHour * 60 + classMinute;
        const referenceMinutes = 6 * 60;
        const kc = totalMinutes - referenceMinutes;

        return {...matchedClass, kc};
    };


    const isTimeInRange = (classTime, startTime, endTime, classDay, day) => {
        let datePart = day.substring(3);
        let formattedDate = datePart.replace(/\//g, '-');
        let finalFormattedDate = formattedDate.split('-').reverse().join('-');

        const timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const classTimeInMinutes = timeToMinutes(classTime);
        const startTimeInMinutes = timeToMinutes(startTime);
        const endTimeInMinutes = timeToMinutes(endTime);

        return classDay === finalFormattedDate && classTimeInMinutes >= startTimeInMinutes && classTimeInMinutes < endTimeInMinutes;
    };

    const totalColumns = weekDaysFormatted.length * shiftColumns.length + 2;

    return (
        <>
            {isLoading && <Loading/>}
            <div>
                <TimeSelectWrapper>
                    <TimeSelectLabel>{t('select day')}: </TimeSelectLabel>
                    <StyledDatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            calculateWeek(date);
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Chọn ngày"
                        value={weekRange}
                        showMonthYearDropdown
                    />
                </TimeSelectWrapper>
                <TableWrapper>
                    <Table columnsCount={totalColumns}>
                        <thead style={{position: 'sticky', top: '0', zIndex: '2'}}>
                        <HeaderRow>
                            <Th rowSpan={2} style={{
                                position: 'sticky',
                                left: '0',
                                backgroundColor: '#eb8d8d'
                            }}>{t('shift')}</Th>
                            <Th rowSpan={2} style={{
                                position: 'sticky',
                                left: '150px',
                                backgroundColor: '#4ca7af',
                                height: '80px'
                            }}>{t('time')}</Th>
                            {weekDaysFormatted.map(day => (
                                <Th key={day} colSpan={shiftColumns.length}
                                    style={{backgroundColor: '#7474dd'}}>{day}</Th>
                            ))}
                        </HeaderRow>
                        <HeaderRow>
                            {weekDaysFormatted.map(day => (
                                <React.Fragment key={day}>
                                    {shiftColumns.map(shift => (
                                        <Th key={`${day}-${shift}`}>{shift}</Th>
                                    ))}
                                </React.Fragment>
                            ))}
                        </HeaderRow>
                        </thead>
                        <tbody>
                        {Object.entries(groupedTimes).map(([shift, shiftTimes]) => (
                            shiftTimes.map((time, index) => (
                                <tr key={time}>
                                    {index === 0 && (
                                        <Td
                                            rowSpan={shiftTimes.length}
                                            isShift={true}
                                            shift={shift}
                                            style={{
                                                writingMode: 'vertical-lr',
                                                textAlign: 'center',
                                                transform: 'rotate(180deg)',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                position: 'sticky',
                                                left: '0'
                                            }}
                                        >
                                            {shift}
                                        </Td>
                                    )}
                                    <Td style={{
                                        position: 'sticky',
                                        left: '150px',
                                        fontWeight: 'bold'
                                    }}>{time.replace(':00', ':00').replace(':30', ':30')}</Td>
                                    {weekDaysFormatted.map(day => (
                                        <React.Fragment key={`${day}-${time}`}>
                                            {shiftColumns.map(shift => {
                                                const classItem = getClassForTimeSlot(shift, time, day);
                                                return (
                                                    <Td key={`${day}-${shift}-${time}`}>
                                                        {classItem && (
                                                            <Card style={{
                                                                top: `${80 + classItem.kc * 10 / 3}px`,
                                                                height: `${classItem.duration * 10 / 3}px`
                                                            }}>
                                                                <CardTitle>{classItem.class_session_name}</CardTitle>
                                                                <CardText>{classItem.teacher_name}</CardText>
                                                            </Card>
                                                        )}
                                                    </Td>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))
                        ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            </div>
        </>
    );
};

export default AccountClassin;