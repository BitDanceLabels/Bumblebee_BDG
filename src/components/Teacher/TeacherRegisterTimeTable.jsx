import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {timeslots, days} from '../../shared/data'
import {TeacherSelect} from './TimeTableStyle'
import Loading from '~/components/General/Loading.jsx'
import {FaStar} from 'react-icons/fa'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const WrapperAll = styled.div`
    width: 100%;
`

const BodyWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 3rem;
`

const LegendContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 3rem;
    margin-top: 1rem;
`

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

const ColorBox = styled.div`
    width: 50px;
    height: 50px;
    background-color: ${(props) => props.color};
    border: 1px solid #ddd;
`

const SpanCustom = styled.span`
    font-weight: bold;
    font-size: 1.5rem;
`

const TableContainer = styled.div`
    width: auto;
    max-width: 100vw;
    height: 80vh;
    overflow-x: auto;
    overflow-y: auto;
    border: 1px solid #ddd;
    position: relative;
    font-size: 14px;
    margin-top: 1.5rem;
`

const Table = styled.table`
    width: max-content;
    border-collapse: collapse;
`

const TableCell = styled.td`
    height: 70px;
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    white-space: nowrap;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? '#D8F5EE' : '#FFF')};
    width: 50px;
`

const StickyTableCell = styled.td`
    position: sticky;
    left: 0;
    background: ${(props) => {
        if (props.shift === 'Morning' || props.shift === 'Sáng') return '#fffacd'
        if (props.shift === 'Afternoon' || props.shift === 'Chiều') return '#ffcc99'
        if (props.shift === 'Evening' || props.shift === 'Tối') return '#d1c4e9'
        return 'white'
    }};
    z-index: 2;
    border: 1px solid #ddd;
    white-space: nowrap;
    text-align: center;
    height: auto;
    min-width: 100px;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    vertical-align: middle;
    font-weight: bold;
`

const StickyTableCellTimeFrame = styled.td`
    position: sticky;
    left: 0;
    background: white;
    z-index: 2;
    border: 1px solid #ddd;
    white-space: nowrap;
    text-align: center;
    height: auto;
    min-width: 128px;
    vertical-align: middle;
`

const StickyTableCellAll = styled.td`
    position: sticky;
    left: 0;
    background: white;
    z-index: 2;
    border: 1px solid #ddd;
    white-space: nowrap;
    text-align: center;
    height: auto;
    min-width: 100px;
    vertical-align: middle;
    cursor: pointer;
`

const TableHeader = styled.th`
    height: 50px;
    background: #f4f4f4;
    padding: 10px;
    border: 1px solid #ddd;
    white-space: nowrap;
    text-align: center;
    z-index: 3;
    width: 80px;
    position: sticky;
    top: 0;
    vertical-align: middle;
`

const ButtonContainer = styled.div`

`

const Button = styled.button`
    background-color: ${(props) => (props.reset ? '#f44336' : '#4caf50')};
    color: white;
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
`

const HeaderTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`

const api_getAllTeachers = import.meta.env.VITE_URL_GET_ALL_TEACHER_ROLE_TEACHER
const api_getTimezoneData = import.meta.env.VITE_GET_TEACHER_TIME_TABLE
const apiTeacherTimeTable = import.meta.env.VITE_URL_TEACHER_TIME_TABLE
const getTeacherCourseSchedule = import.meta.env.VITE_URL_GET_TEACHER_COURSE_SCHEDULE


const fullData = JSON.parse(localStorage.getItem('fullData'))
let token = ''
let teacher_id = 23
let user_id = ''
let role = ''
if (fullData) {
    role = fullData.role_group.toLowerCase()
    user_id = fullData.user_id
    token = fullData.access_token
}

const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

const isTimeInRange = (time, startTime, endTime) => {
    const timeMinutes = convertTimeToMinutes(time)
    const startMinutes = convertTimeToMinutes(startTime)
    const endMinutes = convertTimeToMinutes(endTime)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
}

const TeacherRegisterTimeTable = () => {
    const {t,} = useTranslation();
    const [teachers, setTeachers] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [selectedCells, setSelectedCells] = useState({})
    const [initialSelectedCells, setInitialSelectedCells] = useState({})
    const [scheduleCells, setScheduleCells] = useState({}) // New state for schedule cells
    const [teacherRegisterNew, setTeacherRegisterNew] = useState({})
    const [initialTeacherRegister, setInitialTeacherRegister] = useState({})
    const [isChanged, setIsChanged] = useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [status, setStatus] = React.useState(null)
    const [message, setMessage] = React.useState('')

    const processScheduleData = (dataScheduleCourse) => {
        let scheduleData = {}
        Object.keys(dataScheduleCourse.schedule).forEach((day) => {
            dataScheduleCourse.schedule[day].forEach(({start_time, end_time}) => {
                timeslots.forEach((time) => {
                    if (isTimeInRange(time, start_time, end_time)) {
                        scheduleData[`${day}-${time}`] = true
                    }
                })
            })
        })
        setScheduleCells(scheduleData)
    }

    const getShift = (index) => {
        if (index < 12) {
            return t('morning')
        } else if (index < 24) {
            return t('afternoon')
        } else {
            return t('evening')
        }
    }

    const isPeakTimeFrame = (startTime, endTime) => {
        const peakMorningStart = convertTimeToMinutes('07:00')
        const peakMorningEnd = convertTimeToMinutes('11:00')
        const peakEveningStart = convertTimeToMinutes('18:00')
        const peakEveningEnd = convertTimeToMinutes('21:00')

        const startMinutes = convertTimeToMinutes(startTime)
        convertTimeToMinutes(endTime)
        return (
            (startMinutes >= peakMorningStart && startMinutes < peakMorningEnd) ||
            (startMinutes >= peakEveningStart && startMinutes < peakEveningEnd)
        )
    }

    const handleTeacherChange = (event) => {
        const selectedTeacherId = event.target.value
        setSelectedTeacher(selectedTeacherId)
        teacher_id = selectedTeacherId

        // Fetch the data for the selected teacher
        fetchTimezoneData(teacher_id)
    }

    const fetchTimezoneData = async (teacherId) => {
        try {
            setIsLoading(true)

            const {data: timezoneData} = await axios.get(api_getTimezoneData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data: scheduleCourseData} = await axios.get(`${getTeacherCourseSchedule}${Number(teacherId)}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('dataScheduleCourse', scheduleCourseData)

            processScheduleData(scheduleCourseData)

            const teacherData = timezoneData.find(
                (item) => item.teacher_id === Number(teacherId) && item.json_time_zone
            )

            const initialRegisterData = teacherData ? JSON.parse(teacherData.json_time_zone) : {}
            setTeacherRegisterNew(initialRegisterData)
            setInitialTeacherRegister(initialRegisterData)
            console.log('initialRegisterData', initialRegisterData)

            const newSelectedCells = {}
            days.forEach((day) => {
                const dayRegistrations = initialRegisterData[day] || []
                dayRegistrations.forEach(({start_time, end_time}) => {
                    timeslots.forEach((time) => {
                        if (isTimeInRange(time, start_time, end_time)) {
                            newSelectedCells[`${day}-${time}`] = true
                        }
                    })
                })
            })

            setSelectedCells(newSelectedCells)
            setInitialSelectedCells(newSelectedCells)
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu timezone:', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true)

                const {data} = await axios.get(api_getAllTeachers, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setTeachers(data)

                let teacherId

                if (role === 'teacher') {
                    teacherId = user_id
                    await fetchTimezoneData(teacherId)
                } else if (data.length > 0) {
                    setSelectedTeacher(data[0].teacher_id)
                    teacherId = data[0].teacher_id
                    await fetchTimezoneData(teacherId)
                }
            } catch (error) {
                console.error('Error fetching teachers:', error.response?.data?.message || error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeachers()
    }, [])


    const handleCellClick = (day, time) => {
        if (scheduleCells[`${day}-${time}`]) {
            return
        }
        const isAlreadySelected = !!selectedCells[`${day}-${time}`]
        const newSelectedCells = {...selectedCells}
        const updatedTeacherRegister = {...teacherRegisterNew}

        if (isAlreadySelected) {
            if (updatedTeacherRegister[day]) {
                const indexToModify = updatedTeacherRegister[day].findIndex(({start_time, end_time}) => {
                    const startMinutes = convertTimeToMinutes(start_time)
                    const endMinutes = convertTimeToMinutes(end_time)
                    const clickedTimeMinutes = convertTimeToMinutes(time)
                    return clickedTimeMinutes >= startMinutes && clickedTimeMinutes < endMinutes
                })

                if (indexToModify !== -1) {
                    const {start_time, end_time} = updatedTeacherRegister[day][indexToModify]
                    const clickedTimeMinutes = convertTimeToMinutes(time)
                    const startMinutes = convertTimeToMinutes(start_time)
                    const endMinutes = convertTimeToMinutes(end_time)

                    const newTimeSlots = []
                    if (clickedTimeMinutes > startMinutes) {
                        newTimeSlots.push({
                            start_time: start_time,
                            end_time: time
                        })
                    }
                    if (clickedTimeMinutes + 30 < endMinutes) {
                        const nextTimeSlotStart = timeslots[timeslots.indexOf(time) + 1]
                        newTimeSlots.push({
                            start_time: nextTimeSlotStart,
                            end_time: end_time
                        })
                    }

                    updatedTeacherRegister[day].splice(indexToModify, 1, ...newTimeSlots)
                }

                if (updatedTeacherRegister[day].length === 0) {
                    delete updatedTeacherRegister[day]
                }
            }
            delete newSelectedCells[`${day}-${time}`]
        } else {
            const newTimeSlot = {
                start_time: time,
                end_time: timeslots[timeslots.indexOf(time) + 1] || time
            }

            if (!updatedTeacherRegister[day]) {
                updatedTeacherRegister[day] = []
            }
            updatedTeacherRegister[day].push(newTimeSlot)
            newSelectedCells[`${day}-${time}`] = true
        }
        console.log('Updated teacher register:', updatedTeacherRegister)
        setTeacherRegisterNew(updatedTeacherRegister)
        setSelectedCells(newSelectedCells)
        setIsChanged(checkIfChanged(newSelectedCells))
    }

    const handleAllClick = (time) => {
        const allSelected = days.every((day) => selectedCells[`${day}-${time}`])
        const newSelectedCells = {...selectedCells}
        const updatedTeacherRegister = {...teacherRegisterNew}

        days.forEach((day) => {
            const cellKey = `${day}-${time}`

            if (allSelected) {
                delete newSelectedCells[cellKey]

                if (updatedTeacherRegister[day]) {
                    const timeIndex = timeslots.indexOf(time)

                    updatedTeacherRegister[day] = updatedTeacherRegister[day].flatMap((slot) => {
                        if (slot.start_time <= time && slot.end_time >= time) {
                            const newSlots = []

                            if (convertTimeToMinutes(slot.start_time) < convertTimeToMinutes(time)) {
                                newSlots.push({
                                    start_time: slot.start_time,
                                    end_time: time
                                })
                            }

                            if (
                                convertTimeToMinutes(slot.end_time) > convertTimeToMinutes(timeslots[timeIndex + 1])
                            ) {
                                newSlots.push({
                                    start_time: timeslots[timeIndex + 1],
                                    end_time: slot.end_time
                                })
                            }

                            return newSlots
                        }
                        return slot
                    })

                    if (updatedTeacherRegister[day].length === 0) {
                        delete updatedTeacherRegister[day]
                    }
                }
            } else {
                if (!newSelectedCells[cellKey]) {
                    newSelectedCells[cellKey] = true
                    const newTimeSlot = {
                        start_time: time,
                        end_time: timeslots[timeslots.indexOf(time) + 1] || time
                    }

                    if (!updatedTeacherRegister[day]) {
                        updatedTeacherRegister[day] = []
                    }
                    updatedTeacherRegister[day].push(newTimeSlot)
                }
            }
        })

        Object.keys(updatedTeacherRegister).forEach((day) => {
            updatedTeacherRegister[day] = mergeTimeSlots(updatedTeacherRegister[day])
        })

        console.log('Updated teacher register:', updatedTeacherRegister)
        setTeacherRegisterNew(updatedTeacherRegister)
        setSelectedCells(newSelectedCells)
        setIsChanged(checkIfChanged(newSelectedCells))
    }

    const mergeTimeSlots = (timeSlots) => {
        if (timeSlots.length === 0) return []

        timeSlots.sort((a, b) => convertTimeToMinutes(a.start_time) - convertTimeToMinutes(b.start_time))

        const merged = [timeSlots[0]]

        for (let i = 1; i < timeSlots.length; i++) {
            const lastMerged = merged[merged.length - 1]
            const current = timeSlots[i]

            if (lastMerged.end_time === current.start_time) {
                lastMerged.end_time = current.end_time
            } else {
                merged.push(current)
            }
        }

        return merged
    }


    const checkIfChanged = (newSelectedCells) => {
        const currentKeys = Object.keys(newSelectedCells)
        const initialKeys = Object.keys(initialSelectedCells)

        if (currentKeys.length !== initialKeys.length) {
            return true
        }

        for (const key of currentKeys) {
            if (!initialSelectedCells[key]) {
                return true
            }
        }

        return false
    }

    function mergeConsecutiveTimeSlots(timeSlots) {
        // Sort time slots by start_time
        timeSlots.sort((a, b) => a.start_time.localeCompare(b.start_time))

        let mergedSlots = []
        let currentSlot = timeSlots[0]

        for (let i = 1; i < timeSlots.length; i++) {
            let nextSlot = timeSlots[i]

            // Check if the current slot's end_time matches the next slot's start_time
            if (currentSlot.end_time === nextSlot.start_time) {
                // Merge the slots by extending the end_time of the current slot
                currentSlot.end_time = nextSlot.end_time
            } else {
                // Push the current slot to the merged list and move to the next
                mergedSlots.push(currentSlot)
                currentSlot = nextSlot
            }
        }
        // Push the last slot
        mergedSlots.push(currentSlot)

        return mergedSlots
    }

// Iterate over the json_time_zone object to merge consecutive time slots for each day
    function mergeTimeSlotsInJsonTimeZone(jsonTimeZone) {
        for (let day in jsonTimeZone) {
            if (Object.prototype.hasOwnProperty.call(jsonTimeZone, day)) {
                jsonTimeZone[day] = mergeConsecutiveTimeSlots(jsonTimeZone[day])
            }
        }
        return jsonTimeZone
    }

    const handleReset = () => {
        setSelectedCells(initialSelectedCells)
        console.log('initialTeacherRegister', initialTeacherRegister)
        setTeacherRegisterNew(initialTeacherRegister)
        setIsChanged(false)
    }


    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const requestData = {
                teacher_id: Number(teacher_id),
                timezone_country: 'Australia',
                json_time_zone: mergeTimeSlotsInJsonTimeZone(teacherRegisterNew)
            }

            console.log('requestData: ', requestData)

            const response = await axios.post(apiTeacherTimeTable, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                setStatus('success')
                setMessage('Register successfully!')
                setTimeout(() => {
                    setStatus(null)
                }, 2000)
            }

            setIsChanged(false)
        } catch (error) {
            console.error('Error submitting data:', error)
            setStatus('error')
            setMessage(error.response?.data?.message || error.message || 'Failed to register.')
            setTimeout(() => {
                setStatus(null)
            }, 2000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!status}
                onClose={() => setStatus(null)}
                message={message}
                status={status}
            />
            <WrapperAll>
                <HeaderTitleWrapper>
                    {role !== 'teacher' && (
                        <TeacherSelect value={selectedTeacher} onChange={handleTeacherChange}>
                            <option value="" disabled>
                                Select a teacher
                            </option>
                            {teachers.map((teacher) => (
                                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                    {teacher.full_name || teacher.name}
                                </option>
                            ))}
                        </TeacherSelect>
                    )}
                    {isChanged && (
                        <ButtonContainer>
                            <Button reset onClick={handleReset}>{t('reset')}</Button>
                            <Button onClick={handleSubmit}>{t('submit')}</Button>
                        </ButtonContainer>
                    )}
                </HeaderTitleWrapper>

                <BodyWrapper>
                    <TableContainer>
                        <Table>
                            <thead>
                            <tr>
                                <TableHeader rowSpan={3}>{t('shift')}</TableHeader>
                                <TableHeader rowSpan={3}>{t('time frame')}</TableHeader>
                                <TableHeader rowSpan={3}>{t('all')}</TableHeader>
                                {days.map((day) => (
                                    <TableHeader key={day}>{t(day.toLowerCase())}</TableHeader>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {timeslots.slice(0, -1).map((time, index) => {
                                const shift = getShift(index)
                                const nextTime = timeslots[index + 1] || time
                                const showStarIcon = isPeakTimeFrame(time, nextTime)

                                return (
                                    <tr key={time}>
                                        {index % 12 === 0 && (
                                            <StickyTableCell rowSpan={12} shift={shift}>
                                                {shift}
                                            </StickyTableCell>
                                        )}
                                        <StickyTableCellTimeFrame>
                                            {time} - {nextTime} {showStarIcon && <FaStar color="gold"/>}
                                        </StickyTableCellTimeFrame>
                                        <StickyTableCellAll onClick={() => handleAllClick(time)}>
                                            {t('choose all')}
                                        </StickyTableCellAll>
                                        {days.map((day) => {
                                            const isScheduled = !!scheduleCells[`${day}-${time}`]
                                            const isSelected = !!selectedCells[`${day}-${time}`]
                                            return (
                                                <TableCell
                                                    key={day}
                                                    selected={isSelected}
                                                    style={{
                                                        backgroundColor: isScheduled ? '#a0c3ee' : isSelected ? '#D8F5EE' : '#FFF',
                                                        pointerEvents: isScheduled ? 'none' : 'auto'
                                                    }}
                                                    onClick={() => handleCellClick(day, time)}
                                                >
                                                    {isSelected && !isScheduled ? '' : ''}
                                                </TableCell>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </TableContainer>

                    <LegendContainer>
                        <LegendItem>
                            <ColorBox color="#FFF"/>
                            <SpanCustom>{t('empty')}</SpanCustom>
                        </LegendItem>
                        <LegendItem>
                            <ColorBox color="#D8F5EE"/>
                            <SpanCustom>{t('registered')}</SpanCustom>
                        </LegendItem>
                        <LegendItem>
                            <ColorBox color="#a0c3ee"/>
                            <SpanCustom>{t('scheduled')}</SpanCustom>
                        </LegendItem>
                    </LegendContainer>
                </BodyWrapper>
            </WrapperAll>
        </>
    )
}

export default TeacherRegisterTimeTable