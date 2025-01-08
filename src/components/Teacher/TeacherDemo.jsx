import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CreateTeacherModal from '../modal/CreateTeacherModal'
import TeacherDemoTable from './TeacherDemoTable'
import Loading from '../General/Loading'
import ApproveTeacherModal from '../modal/ApproveTeacherModal'
import { useTranslation } from "react-i18next";

const Container = styled.div`
    background: #f7f7ff;
    font-size: 20px;
    padding: 0 10px;
`

const CreateButton = styled.button`
    padding: 10px 20px;
    margin-bottom: 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #218838;
    }
`

const TeacherDemo = () => {
    const { t, } = useTranslation();
    const [teachers, setTeachers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const apiUrl = import.meta.env.VITE_URL_CREAT_TEACHER
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    const handleGetAll = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            })

            if (response.ok) {
                const data = await response.json()
                const filteredTeachers = data.filter(
                    (teacher) => teacher.offer_status === 'Pending'
                )
                setTeachers(filteredTeachers)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log('Error fetching teachers:', error)
        }
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
    })

    const navigate = useNavigate()

    const handleCreateTeacher = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleSubmit = () => {
        setIsModalOpen(false)
        handleGetAll()
    }

    const handleTeacherClick = (teacher) => {
        navigate('/teacher-profile', { state: { teacher } })
    }

    const handleMoveClick = (teacher) => {
        setSelectedTeacher(teacher)
        setIsMoveModalOpen(true)
    }

    const handleMoveConfirm = async () => {
        console.log('Hello')
        try {
            setIsLoading(true)
            const response = await fetch(
                `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api/teachers/${selectedTeacher.idx_teacher
                }`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        offer_status: 'Approved'
                    })
                }
            )

            if (response.ok) {
                setIsMoveModalOpen(false)
                handleGetAll()
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setIsLoading(false)
        }

        const api_sendmail_smtp = import.meta.env.VITE_SEND_MAIL_SMTP_PA

        // Hàm gửi email

        const payload = {
            //   subject: 'Thông báo tạo tài khoản giáo viên trên hệ thống',
            //   body: `
            //   Dear Mr./Ms. ${selectedTeacher.full_name},

            //   Tài khoản giáo viên của bạn đã được tạo trên hệ thống. Dưới đây là thông tin đăng nhập tạm thời:

            //   Username: ${selectedTeacher.email}
            //   Password: 123456

            //   Vui lòng đăng nhập và đổi mật khẩu mới để bảo mật tài khoản của bạn.
            //   https://103.130.215.21:3000/login
            //   Click advanced => accept link

            //   Trân trọng,
            //   Đội ngũ hỗ trợ
            // `,
            subject: 'Teacher Account Creation Notification on the System',
            body: `
        Dear Mr./Ms. ${selectedTeacher.full_name},

        Your teacher account has been successfully created on our system. Below are your temporary login details:

        Username: ${selectedTeacher.email}
        Password: 123456

        Please log in and change your password to secure your account.
        Login link: https://powerenglishcenter.vn//login
        Click "Advanced" => then "Proceed" to access the link.

        Best regards,  
        The Support Team
        `,
            to: [selectedTeacher.email],
            cc: ['nhutpham@powerenglishcenter.vn'],
            attachments: []
        }

        console.log('Payload:', payload)
        try {
            const response = await fetch(api_sendmail_smtp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                console.log('Failed to send email:', response)
            }

            const result = await response.json()
            console.log('Email sent successfully:', result)
        } catch (error) {
            console.error('Failed to send email:', error)
        }
    }

    return (
        <>
            {isLoading && <Loading />}

            <Container>
                <CreateButton onClick={handleCreateTeacher}>
                    {t('create teacher')}
                </CreateButton>
                <CreateTeacherModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                />

                <TeacherDemoTable
                    data={teachers}
                    handleTeacherClick={handleTeacherClick}
                    handleMoveClick={handleMoveClick}
                />

                <ApproveTeacherModal
                    isOpen={isMoveModalOpen}
                    onClose={() => setIsMoveModalOpen(false)}
                    onSubmit={handleMoveConfirm}
                    teacher={selectedTeacher}
                    token={fullData?.access_token}
                />
            </Container>
        </>
    )
}

export default TeacherDemo
