import React, { useState } from 'react'
import styled from 'styled-components'
import Loading from '../General/Loading'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import { useTranslation } from "react-i18next";

// Styled components
const FullModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${({ show }) => (show ? 'block' : 'none')};
`

const FullModalWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    z-index: 999;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
`

const SelectClass = styled.select`
    padding: 10px;
    margin-bottom: 20px;
    font-size: 16px;
    border: 1px solid #333;
`

const TextArea = styled.textarea`
    padding: 10px;
    font-size: 16px;
    resize: none;
    height: 100px;
    margin-bottom: 20px;
    border: 1px solid #333;
`
const ModalButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`

const CancelButton = styled.button`
    padding: 16px 10px;
    background-color: red;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        opacity: 0.6;
    }
`

const SubmitButton = styled.button`
    padding: 16px 10px;
    background-color: #53c653;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        opacity: 0.6;
    }
`

const apiCreateTicket = import.meta.env.VITE_URL_CREATE_TICKET

// eslint-disable-next-line react/prop-types
const TicketModal = ({ show, events, onClose, selectedTeacher }) => {
    const { t } = useTranslation();
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('defer')
    const [selectedClass, setSelectedClass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')
    // Debug: In ra selectedTeacher để kiểm tra giá trị
    console.log('Received selectedTeacher:', selectedTeacher);

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    let userId = 0
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        userId = fullData.user_id
        console.log(token)
        console.log(userId)
    }

    const statusTextMap = {
        teachnicalStudent: 'Technical issue (student)',
        teachnicalTeacher: 'Technical issue (teacher)',
        studentNotStudy: 'Student absent',
        emptyDoc: 'Missing lesson materials',
        remindStudent: 'Reminder for student',
        notMatchSkillStudent: 'Student off track',
        errorDoc: 'Material error',
        reponseDoc: 'Feedback on materials',
        errorTimeTable: 'Schedule error',
        salary: 'Payroll query',
        changeTime: 'Lesson time change request'
    }

    const handleSubmit = async () => {
        console.log('HandleSubmit called'); // Thêm dòng này
        console.log('HandleSubmit called');
        console.log('selectedClass:', selectedClass);
        console.log('description:', description);
        console.log('status:', status);
        console.log('selectedTeacher:', selectedTeacher);
        if (!selectedClass || !description || !status || !selectedTeacher) {
            alert(t('please fill in all required fields'))
            return
        }

        const ticketGroup = statusTextMap[status]

        // const data = {
        //     student_name: '',
        //     programmer: selectedClass,
        //     email: '',
        //     phone_number: '',
        //     creator_id: userId,
        //     status: 'In Progress',
        //     description: description,
        //     ticket_group: ticketGroup
        // }
        // Chuẩn bị dữ liệu để gửi
        const data = {
            student_name: selectedClass.split(' - ')[1], // Tên học sinh từ selectedClass (dựa vào cấu trúc "code - student_name")
            programmer: selectedClass, // Thông tin lớp
            email: selectedTeacher.email, // Email của giáo viên
            phone_number: selectedTeacher.phone_number, // Số điện thoại của giáo viên
            creator_id: userId, // ID người tạo
            status: 'In Progress', // Trạng thái
            description: description, // Nội dung mô tả
            ticket_group: ticketGroup, // Nhóm vấn đề
        }
        // In dữ liệu ra console trước khi gửi
        console.log('Data to be sent:', data)

        try {
            setIsLoading(true)

            const response = await axios.post(apiCreateTicket, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                onClose()
                setIsLoading(false)
                setStatusAPI('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatusAPI(null)
                }, 2000)
            }
        } catch (error) {
            console.error(`An error occurred: ${error.message}`)
            setIsLoading(false)
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
            }, 2000)
        }
    }

    // Create a set to hold unique classes based on code
    const uniqueClasses = new Set()

    Object.keys(events).forEach((day) => {
        // eslint-disable-next-line react/prop-types
        events[day].forEach((event) => {
            const classInfo = `${event.code} - ${event.student}`
            uniqueClasses.add(classInfo)
        })
    })

    return (
        <>
            {isLoading && <Loading />}
            <APIStatusNotificationModal
                isOpen={!!statusAPI}
                onClose={() => setStatusAPI(null)}
                message={message}
                status={statusAPI}
            />
            <FullModalOverlay show={show}>
                <FullModalWrapper>
                    <ModalContent>
                        <SelectClass
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="teachnicalStudent">Technical issue (student)</option>
                            <option value="teachnicalTeacher">Technical issue (teacher)</option>
                            <option value="studentNotStudy">Student absent</option>
                            <option value="emptyDoc">Missing lesson materials</option>
                            <option value="remindStudent">Reminder for student</option>
                            <option value="notMatchSkillStudent">Student off track</option>
                            <option value="errorDoc">Material error</option>
                            <option value="reponseDoc">Feedback on materials</option>
                            <option value="errorTimeTable">Schedule error</option>
                            <option value="salary">Payroll query</option>
                            <option value="changeTime">Lesson time change request</option>
                        </SelectClass>

                        <SelectClass
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="" disabled>
                                {t('select a class')}
                            </option>
                            {[...uniqueClasses].map((classInfo, index) => (
                                <option key={index} value={classInfo}>
                                    {classInfo}
                                </option>
                            ))}
                        </SelectClass>

                        <TextArea
                            placeholder={t('enter your issue')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {/* Thêm dòng thông báo */}
                        <p style={{ marginTop: '10px', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
                            {t('Your Ticket will be processed within 24 hours. If urgent, please message or call the hotline in the Zalo group.')}
                        </p>

                        <ModalButtonWrapper>
                            <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
                            <SubmitButton onClick={handleSubmit}>{t('submit')}</SubmitButton>
                        </ModalButtonWrapper>
                    </ModalContent>
                </FullModalWrapper>
            </FullModalOverlay>
        </>
    )
}

export default TicketModal
