import {useState, useEffect, useRef} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FaCalendarAlt} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {
    WrapperAll,
    TableContainer,
    RedLine,
    Table,
    StickyTableHeader,
    StickyTableCell,
    TableCell,
    ClassInfo,
    StatusLabel,
    HeaderWrapper,
    CustomDatePickerWrapper,
    ViewButton, AvailableTimeSlot
} from './ScheduleStyle'
import DetailClassInfo from '../modal/DetailClassInfo'
import {
    generateTimeslots,
    calculateCurrentTimePosition
} from '../../shared/functions'

import {
    fetchClassSessions,
    fetchTeachers,
    fetchAvailableTimes,
    fetchStudents,
    mapDataToJson
} from './ScheduleComponentData.jsx'
import ClassBookingModal from '~/components/modal/ClassBookingModal.jsx'
import Loading from '~/components/General/Loading.jsx'
import {useTranslation} from "react-i18next";

const ScheduleComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalSessions, setTotalSessions] = useState(0)
    const [redLinePosition, setRedLinePosition] = useState(null)
    const [tableHeight, setTableHeight] = useState(0)
    const [searchTermTeacher, setSearchTermTeacher] = useState('')
    const [searchTermStudent, setSearchTermStudent] = useState('')
    const [searchTermClass, setSearchTermClass] = useState('')
    const [teachersData, setTeachersData] = useState([])
    // const [searchTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [suggestionsVisibleTeacher, setSuggestionsVisibleTeacher] =
        useState(false)
    const [suggestionsVisibleStudent, setSuggestionsVisibleStudent] =
        useState(false)
    const [suggestionsVisibleClass, setSuggestionsVisibleClass] = useState(false)
    const [firstScroll, setFirstScroll] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedClassInfo, setSelectedClassInfo] = useState(null)

    const tableContainerRef = useRef(null)
    const navigate = useNavigate()

    const [isClassBookingModalOpen, setIsClassBookingModalOpen] = useState(false)
    const [selectedClasses, setSelectedClasses] = useState([])
    const [selectedAvailableTimes, setSelectedAvailableTimes] = useState([])
    const [selectedTime, setSelectedTime] = useState('')
    const [goingDateTime, setGoingDateTime] = useState(new Date())
    const [teachers, setTeachers] = useState([]) // State for teachers
    const [students, setStudents] = useState([])
    const [teacherId, setTeacherId] = useState('')

    const timeslots = generateTimeslots(6, 23, 30)
    const {t} = useTranslation();


    const fetchData = async () => {
        setIsLoading(true)
        try {
            const selectedDateFormatted = selectedDate.toISOString().split('T')[0]

            const [classSessions, teachers, availableTimes, students] = await Promise.all([
                fetchClassSessions(selectedDateFormatted),
                fetchTeachers(),
                fetchAvailableTimes(),
                fetchStudents()
            ])

            const mappedData = mapDataToJson(teachers, availableTimes, classSessions, students)
            console.log('----------------------------------------------------------')
            console.log('Teachers: ', teachers)
            console.log('Available times: ', availableTimes)
            console.log('Classes: ', classSessions)
            console.log('Students: ', students)
            console.log('----------------------------------------------------------')

            console.log('Map: ', mappedData)
            setTeachersData(mappedData)
            setStudents(students)
            setTeachers(teachers)
        } catch (error) {
            console.error('Error fetching data:', error)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedDate])

    const handleViewClassesClick = () => {
        navigate('/teacher-timetable')
    }

    useEffect(() => {
        const updateTableHeight = () => {
            if (tableContainerRef.current) {
                setTableHeight(tableContainerRef.current.scrollHeight)
            }
        }

        updateTableHeight()

        window.addEventListener('resize', updateTableHeight)

        return () => {
            window.removeEventListener('resize', updateTableHeight)
        }
    }, [])

    useEffect(() => {
        const updateRedLinePosition = () => {
            const positionPercent = calculateCurrentTimePosition()
            if (positionPercent !== null) {
                const redLinePosition = positionPercent
                setRedLinePosition(redLinePosition)

                if (firstScroll) {
                    tableContainerRef.current.scrollLeft =
                        redLinePosition - tableContainerRef.current.clientWidth / 2
                    setFirstScroll(false)
                }
            }
        }

        updateRedLinePosition()
        const intervalId = setInterval(updateRedLinePosition, 1000)

        return () => clearInterval(intervalId)
    }, [selectedDate, firstScroll])

    useEffect(() => {
        const calculateTotalSessions = () => {
            let count = 0
            teachersData.forEach((teacher) => {
                count += teacher.schedule.length
            })
            setTotalSessions(count)
        }

        calculateTotalSessions()
    }, [selectedDate])

    const filteredTeachers = teachersData.filter((teacher) => {
        return (
            teacher.name.toLowerCase().includes(searchTermTeacher.toLowerCase())
        )
    })

    const handleClassInfoClick = (classInfo) => {
        setSelectedClassInfo(classInfo)
        setIsModalOpen(true)
    }

    const handleSearchChangeTeacher = (e) => {
        setSearchTermTeacher(e.target.value)
        setSuggestionsVisibleTeacher(true)
    }

    const handleSearchChangeStudent = (e) => {
        setSearchTermStudent(e.target.value)
        setSuggestionsVisibleStudent(true)
    }

    const handleSearchChangeClass = (e) => {
        setSearchTermClass(e.target.value)
        setSuggestionsVisibleClass(true)
    }

    const handleSuggestionClickTeacher = (teacherName) => {
        setSearchTermTeacher(teacherName)
        setSuggestionsVisibleTeacher(false)
    }

    const handleSuggestionClickStudent = (studentName) => {
        setSearchTermStudent(studentName)
        setSuggestionsVisibleStudent(false)
    }

    const handleSuggestionClickClass = (className) => {
        setSearchTermClass(className)
        setSuggestionsVisibleClass(false)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setSuggestionsVisibleTeacher(false)
            setSuggestionsVisibleStudent(false)
            setSuggestionsVisibleClass(false)
        }, 200)
    }

    const getFilteredSuggestions = (term, key) => {
        const suggestions = []
        teachersData.forEach((teacher) => {
            teacher.schedule.forEach((classInfo) => {
                const value = classInfo[key]
                if (typeof value === 'string' && value.toLowerCase().includes(term.toLowerCase())) {
                    suggestions.push(value)
                }
            })
        })
        return [...new Set(suggestions)]
    }

    const studentSuggestions = getFilteredSuggestions(
        searchTermStudent,
        'teacher'
    )
    const classSuggestions = getFilteredSuggestions(searchTermClass, 'code')

    const handleAvailableTimeSlotClick = (e, range, matchingClasses, teacherId) => {
        const clickPositionX = e.nativeEvent.offsetX
        // const elementWidth = e.target.offsetWidth

        const percentageFromLeft = Math.floor(clickPositionX / 135.11)
        const [start] = range.split('-')
        const [startHours, startMinutes] = start.split(':').map(Number)

        const additionalMinutes = percentageFromLeft * 30
        const totalMinutes = startHours * 60 + startMinutes + additionalMinutes

        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        // Combine selectedDate and the calculated time
        const selectedDateTime = new Date(selectedDate)
        selectedDateTime.setHours(hours)
        selectedDateTime.setMinutes(minutes)
        selectedDateTime.setSeconds(0)
        selectedDateTime.setMilliseconds(0)

        const currentTime = new Date()

        if (selectedDateTime > currentTime) {
            setSelectedTime(time)
            setIsClassBookingModalOpen(true)
            setSelectedAvailableTimes([range])
            setSelectedClasses(matchingClasses)
            setTeacherId(teacherId)
        } else {
            alert('You cannot book a class in the past.')
        }
    }


    // const renderAvailableTimes = (availableTimes, teacherSchedule, teacherId) => {
    //   return availableTimes.map((range, rangeIndex) => {

    //     const [start, end] = range.split('-')
    //     console.log('range: ', range)
    //     console.log('rangeIndex: ', rangeIndex)


    //     const [startHours, startMinutes] = start.split(':').map(Number)
    //     const [endHours, endMinutes] = end.split(':').map(Number)

    //     const startTimeInMinutes = startHours * 60 + startMinutes
    //     const endTimeInMinutes = endHours * 60 + endMinutes

    //     const left = 135.11 * ((startTimeInMinutes - 360) / 30 + 1)
    //     const width = (endTimeInMinutes - startTimeInMinutes) / 30 * 135.11

    //     const matchingClasses = teacherSchedule.filter((classInfo) => {
    //       const [classStartHours, classStartMinutes] = classInfo.time.split(':').map(Number)
    //       const classStartTimeInMinutes = classStartHours * 60 + classStartMinutes
    //       return classStartTimeInMinutes >= startTimeInMinutes && classStartTimeInMinutes < endTimeInMinutes
    //     })

    //     return (
    //       <AvailableTimeSlot
    //         key={`${0}-${rangeIndex}`}
    //         left={`${left}px`}
    //         width={`${width}px`}
    //         onClick={(e) => handleAvailableTimeSlotClick(e, range, matchingClasses, teacherId)}
    //       >
    //       </AvailableTimeSlot>
    //     )
    //   })
    // }
    const renderAvailableTimes = (availableTimes, teacherSchedule, teacherId) => {
        const dayName = selectedDate.toLocaleDateString('en-US', {weekday: 'long'})

        const filteredTimes = availableTimes
            .filter((range) => range.startsWith(dayName))
            .map((range) => range.replace(`${dayName}: `, ''))

        // Render các khoảng thời gian đã lọc
        return filteredTimes.map((range, rangeIndex) => {
            const [start, end] = range.split('-')
            console.log('range:', range) // Kiểm tra khoảng thời gian sau khi lọc
            console.log('rangeIndex:', rangeIndex)

            const [startHours, startMinutes] = start.split(':').map(Number)
            const [endHours, endMinutes] = end.split(':').map(Number)

            const startTimeInMinutes = startHours * 60 + startMinutes
            const endTimeInMinutes = endHours * 60 + endMinutes

            const left = 135.11 * ((startTimeInMinutes - 360) / 30 + 1)
            const width = (endTimeInMinutes - startTimeInMinutes) / 30 * 135.11

            const matchingClasses = teacherSchedule.filter((classInfo) => {
                const [classStartHours, classStartMinutes] = classInfo.time.split(':').map(Number)
                const classStartTimeInMinutes = classStartHours * 60 + classStartMinutes
                return classStartTimeInMinutes >= startTimeInMinutes && classStartTimeInMinutes < endTimeInMinutes
            })

            return (
                <AvailableTimeSlot
                    key={`${teacherId}-${rangeIndex}`}
                    left={`${left}px`}
                    width={`${width}px`}
                    onClick={(e) => handleAvailableTimeSlotClick(e, range, matchingClasses, teacherId)}
                />
            )
        })
    }

    return (
        <>
            {isLoading && <Loading/>}

            <WrapperAll>
                <HeaderWrapper>
                    <CustomDatePickerWrapper
                        style={{display: 'flex', alignItems: 'center'}}
                    >
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date)
                                setGoingDateTime(date)
                            }}
                            dateFormat="EEEE, dd/MM/yyyy"
                            className="date-picker"
                            showMonthYearDropdown
                        />

                        <ViewButton onClick={handleViewClassesClick}>
                            {t('view classes monthly')}
                        </ViewButton>
                    </CustomDatePickerWrapper>

                    <div>
                        <StatusLabel color="#6b8e23">{t('trial')}</StatusLabel>
                        <StatusLabel color="#1e90ff">{t('regular')}</StatusLabel>
                        <StatusLabel color="#ffd700">{t('bonus')}</StatusLabel>
                        <StatusLabel color="#ff4500">{t('deferred')}</StatusLabel>
                        <StatusLabel color="#dc143c">{t('cancelled')}</StatusLabel>
                    </div>
                </HeaderWrapper>

                <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                    {/* Teacher Search */}
                    <div style={{position: 'relative'}}>
                        <input
                            type="text"
                            placeholder={t('search teacher')}
                            value={searchTermTeacher}
                            onChange={handleSearchChangeTeacher}
                            onBlur={handleBlur}
                            style={{
                                padding: '10px',
                                width: '200px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                        />

                        {/* Teacher Suggestions */}
                        {suggestionsVisibleTeacher && searchTermTeacher && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '0',
                                    width: '200px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    zIndex: 10,
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px'
                                }}
                            >
                                {filteredTeachers.slice(0, 5).map((teacher) => (
                                    <div
                                        key={teacher.name}
                                        onClick={() => handleSuggestionClickTeacher(teacher.name)}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #ddd'
                                        }}
                                    >
                                        {teacher.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Student Search */}
                    <div style={{position: 'relative'}}>
                        <input
                            type="text"
                            placeholder={t('search student')}
                            value={searchTermStudent}
                            onChange={handleSearchChangeStudent}
                            onBlur={handleBlur}
                            style={{
                                padding: '10px',
                                width: '200px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                        />

                        {/* Student Suggestions */}
                        {suggestionsVisibleStudent && searchTermStudent && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '0',
                                    width: '200px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    zIndex: 10,
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px'
                                }}
                            >
                                {studentSuggestions.slice(0, 5).map((student) => (
                                    <div
                                        key={student}
                                        onClick={() => handleSuggestionClickStudent(student)}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #ddd'
                                        }}
                                    >
                                        {student}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Class Search */}
                    <div style={{position: 'relative'}}>
                        <input
                            type="text"
                            placeholder={t('search class')}
                            value={searchTermClass}
                            onChange={handleSearchChangeClass}
                            onBlur={handleBlur}
                            style={{
                                padding: '10px',
                                width: '200px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                        />

                        {/* Class Suggestions */}
                        {suggestionsVisibleClass && searchTermClass && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '0',
                                    width: '200px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    zIndex: 10,
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px'
                                }}
                            >
                                {classSuggestions.slice(0, 5).map((classCode) => (
                                    <div
                                        key={classCode}
                                        onClick={() => handleSuggestionClickClass(classCode)}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #ddd'
                                        }}
                                    >
                                        {classCode}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '20px'
                    }}
                >
                    <FaCalendarAlt/>{' '}
                    {/* <span style={{ color: 'red' }}>Total Sessions: {totalSessions}</span> */}
                </div>

                <TableContainer ref={tableContainerRef}>
                    {redLinePosition !== null && (
                        <RedLine
                            style={{left: `${redLinePosition}px`, height: `${tableHeight}px`}}
                        />
                    )}
                    <Table>
                        <thead>
                        <tr>
                            <StickyTableHeader>Teacher</StickyTableHeader>
                            {timeslots.map((time) => (
                                <StickyTableHeader key={time}>{time}</StickyTableHeader>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTeachers.map((teacher) => (
                            <tr key={teacher.name} style={{border: '1px solid #ddd'}}>
                                <StickyTableCell>{teacher.name}</StickyTableCell>
                                {renderAvailableTimes(teacher.availableTimes, teacher.schedule, teacher.teacher_id)}
                                {timeslots.map((time, index) => {
                                    const [hours, minutes] = time.split(':').map(Number)
                                    const slotTimeInMinutes = hours * 60 + minutes

                                    const matchingClass = teacher.schedule.find((classInfo) => {
                                        const [classHours, classMinutes] = classInfo.time
                                            .split(':')
                                            .map(Number)
                                        const classTimeInMinutes = classHours * 60 + classMinutes

                                        return (
                                            Math.abs(classTimeInMinutes - slotTimeInMinutes) <= 29
                                        )
                                    })

                                    if (matchingClass) {
                                        const {
                                            time: classTime,
                                            duration,
                                            type,
                                            code,
                                            studentName
                                        } = matchingClass
                                        const [hours, minutes] = classTime.split(':').map(Number)
                                        const totalMinutes = hours * 60 + minutes
                                        const minutesSinceStart = totalMinutes - 360
                                        const left = (minutesSinceStart / 30) * 100 - (index + 1) * 100

                                        return (
                                            <td key={index}>
                                                <ClassInfo
                                                    color={
                                                        type === 1
                                                            ? 'blue'
                                                            : type === 2
                                                                ? 'green'
                                                                : type === 3
                                                                    ? 'orange'
                                                                    : 'red'
                                                    }
                                                    width={`${(duration / 30) * 135.11}px`}
                                                    left={`${left}%`}
                                                    onClick={() => handleClassInfoClick(matchingClass)}
                                                >
                                                    <div>{code}</div>
                                                    <div>{studentName}</div>
                                                    <div>{classTime}</div>
                                                </ClassInfo>
                                            </td>
                                        )
                                    } else {
                                        return (
                                            <TableCell
                                                key={index}
                                                style={{border: '1px solid #ccc'}}
                                            />
                                        )
                                    }
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TableContainer>

                <ClassBookingModal
                    show={isClassBookingModalOpen}
                    onClose={(shouldFetchData) => {
                        setIsClassBookingModalOpen(false)
                        if (shouldFetchData) {
                            fetchData()
                        }
                    }}
                    classes={selectedClasses}
                    students={students}
                    availableTimes={selectedAvailableTimes}
                    selectedTime={selectedTime}
                    goingDateTime={goingDateTime}
                    teacherId={teacherId}
                />


                <DetailClassInfo
                    isOpen={isModalOpen}
                    onClose={(shouldFetchData) => {
                        setIsModalOpen(false)
                        if (shouldFetchData) {
                            fetchData()
                        }
                    }}
                    classInfo={selectedClassInfo}
                    teachers={teachers}
                    students={students}
                    goingDateTime={goingDateTime}
                />
            </WrapperAll>
        </>
    )
}

export default ScheduleComponent