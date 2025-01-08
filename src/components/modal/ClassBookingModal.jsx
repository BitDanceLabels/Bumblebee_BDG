import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {format} from 'date-fns'
import Loading from '~/components/General/Loading.jsx'
import axios from 'axios'

const Modal = styled.div`
    display: ${(props) => (props.show ? 'block' : 'none')};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid #ddd;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    width: 400px;
`

const ModalTitle = styled.h3`
    margin-bottom: 20px;
    font-size: 18px;
    text-align: center;
    color: #333;
`

const ComboBox = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
`

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`

const ModalButton = styled.button`
    background-color: ${(props) => (props.primary ? '#4CAF50' : '#f44336')};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: ${(props) => (props.primary ? '#45a049' : '#d32f2f')};
    }
`

const WarningText = styled.p`
    color: red;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-style: italic;
`

// eslint-disable-next-line react/prop-types
const ClassBookingModal = ({
                               show,
                               onClose,
                               students = [],
                               availableTimes = [],
                               selectedTime,
                               goingDateTime,
                               teacherId
                           }) => {
    const [duration, setDuration] = useState('')
    const [endTime, setEndTime] = useState('')
    const [isOutsideAvailableTimes, setIsOutsideAvailableTimes] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const formattedDate = goingDateTime ? format(goingDateTime, 'dd/MM/yyyy') : ''
    const apiUrl = import.meta.env.VITE_URL_CLASS_SESSION
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    useEffect(() => {
        if (duration) {
            // eslint-disable-next-line react/prop-types
            const [hours, minutes] = selectedTime.split(':').map(Number)
            const totalMinutes = hours * 60 + minutes + parseInt(duration, 10)
            const endHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0')
            const endMinutes = (totalMinutes % 60).toString().padStart(2, '0')
            const calculatedEndTime = `${endHours}:${endMinutes}`
            setEndTime(calculatedEndTime)

            const [startAvailable, endAvailable] = availableTimes[0].split('-')
            setIsOutsideAvailableTimes(
                calculatedEndTime < startAvailable || calculatedEndTime > endAvailable
            )
        } else {
            setEndTime('')
            setIsOutsideAvailableTimes(false)
        }
    }, [duration, selectedTime])

    const formatDateTime = (date, time) => {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}T${time}:00`
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const formattedDateTime = formatDateTime(formattedDate, selectedTime)
            await axios.post(
                apiUrl,
                {
                    teacher_id: teacherId,
                    student_id: selectedStudent,
                    going_date_time: formattedDateTime,
                    duration: parseInt(duration, 10),
                    session_status: 'regular'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setIsLoading(false)
            onClose(true)
        } catch (error) {
            console.error('Error creating class session:', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && <Loading/>}
            <Modal show={show}>
                <ModalTitle>Chọn học viên</ModalTitle>
                <Input
                    type="text"
                    value={formattedDate}
                    readOnly
                    placeholder="Start Time"
                />
                <ComboBox onChange={(e) => setSelectedStudent(e.target.value)}>
                    <option value="" disabled selected>
                        Select a student
                    </option>
                    {students.map((student, index) => (
                        <option key={index} value={student.student_id}>
                            {student.name_student} - {student.english_level} - {student.learning_goal}
                        </option>
                    ))}
                </ComboBox>

                <Input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => selectedTime(e.target.value)}
                    placeholder="Start Time"
                />
                <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration (minutes)"
                />
                <div>
                    <Input
                        type="text"
                        value={endTime}
                        readOnly
                        placeholder="End Time"
                        style={{
                            color: isOutsideAvailableTimes ? 'red' : 'black'
                        }}
                    />
                    {isOutsideAvailableTimes && (
                        <WarningText>* Duration này vượt ngoài lịch rảnh của giáo viên.</WarningText>
                    )}
                </div>

                <ButtonContainer>
                    <ModalButton onClick={() => onClose(false)}>Cancel</ModalButton>
                    <ModalButton primary onClick={handleSubmit}>
                        Submit
                    </ModalButton>
                </ButtonContainer>
            </Modal>
        </>
    )
}

export default ClassBookingModal
