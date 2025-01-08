import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import no_avt from '../../assets/no_avt.png'
import ConfirmUpdateStudentProfile from '../modal/ConfirmUpdateStudentProfile'
import AssignStudentModal from '~/components/modal/AssignStudentModal.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'

import {
    FaEdit,
    FaSave,
    FaTelegram,
    FaInstagram,
    FaFacebook
} from 'react-icons/fa'
import {useLocation, useNavigate} from 'react-router-dom'
import Loading from '~/components/General/Loading.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";
import ProcessBar from "./ProcessBar.jsx";
import AddSyllabusToStudentModal from "../modal/AddSyllabusToStudentModal.jsx";

const Container = styled.div`
    background: #f7f7ff;
    padding: 0 10px;
    font-size: 20px;
`

const WrapperAll = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`

const WrapperHeader = styled.div`
    text-align: center;
    margin-bottom: 20px;
`

const Card = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 6px 0 rgba(218, 218, 253, 0.65),
    0 2px 6px 0 rgba(206, 206, 238, 0.54);
`

const CardBody = styled.div`
    padding: 20px;
`

const LeftItem = styled.div`
    flex: 5;
`

const RightItem = styled.div`
    flex: 7;
    margin-left: 40px;
`

const ProfileImage = styled.img`
    width: 110px;
    border-radius: 50%;
    padding: 1px;
    background-color: #ddd;
`

const ProfileInfo = styled.div`
    text-align: center;
    margin-top: 10px;
`

const UserName = styled.h4`
    margin: 10px 0;
`

const JobTitle = styled.p`
    color: #6c757d;
    margin-bottom: 10px;
`

const Location = styled.p`
    color: #adb5bd;
    font-size: 14px;
`

const ListGroup = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`

const ListGroupItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #ddd;
`

const Label = styled.h6`
    font-size: 16px;
`

const Value = styled.span`
    color: #6c757d;
`

const RowWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
`


const InputGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    width: ${(props) => (props.fullWidth ? '100%' : 'calc(50% - 8px)')};
    box-sizing: border-box;
`

const RowWrapperAvailable = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    box-sizing: border-box;
`

const InputGroupAvailable = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: ${(props) => (props.fullWidth ? '100%' : 'calc(50% - 8px)')};
    box-sizing: border-box;
`

const InputLabel = styled.h6`
    margin-bottom: 0;
    flex: 4;
`

const Input = styled.input`
    flex: 8;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-left: 10px;
    ${(props) =>
            props.disabled &&
            `background-color: #e9ecef;`}
`
const EditButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: bold;

    &:hover {
        background-color: #0056b3;
    }

    svg {
        margin-right: 8px;
    }
`

const AssignButton = styled.button`
    background-color: #1ead66;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: bold;

    &:hover {
        opacity: 0.8;
    }

    svg {
        margin-right: 8px;
    }
`

const ResetButton = styled.button`
    background-color: green;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    margin-left: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: bold;

    &:hover {
        opacity: 0.8;
    }

    svg {
        margin-right: 8px;
    }
`

const EditWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TextCustom = styled.text`
    margin-left: 10px;
`

const Select = styled.select`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    flex: 6;
`

const ScheduleEntry = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 8px;
    width: 100%;
    box-sizing: border-box;
`

const ButtonAdd = styled.button`
    padding: 8px 16px;
    background-color: ${({disabled}) => (disabled ? '#a0a0a0' : 'blue')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
    font-size: 16px;
    opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
    font-weight: bold;

    &:hover {
        background-color: ${({disabled}) => (disabled ? '#a0a0a0' : '#0056b3')};
    }
`

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow-y: auto;
`;

const CardItem = styled.div`
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardHeader = styled.h3`
    margin: 0;
    font-size: 18px;
    color: #333;
`;

const CardDetails = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

const LevelProgram = styled.span`
    font-weight: bold;
    color: #007bff;
`;

const StatusCourse = styled.span`
    font-size: 16px;
    color: ${(props) => (props.status === 'active' ? 'green' : 'red')};
    border: 1px solid ${(props) => (props.status === 'active' ? 'green' : 'red')};
    border-radius: 12px;
    padding: 4px 8px;
    display: inline-block;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ButtonRemove = styled.button`
    padding: 8px 16px;
    background-color: ${({disabled}) => (disabled ? '#a0a0a0' : 'red')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
    font-size: 16px;
    opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
    font-weight: bold;

    &:hover {
        background-color: ${({disabled}) => (disabled ? '#a0a0a0' : '#c92a2a')};
    }
`

const TitleCustom = styled.h3`
    margin-bottom: 20px;
`

const LeftHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
`

const RightHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 70%;
    margin-bottom: 10px;
`

const apiUrl = import.meta.env.VITE_URL_CREAT_STUDENT
const apiCourse = import.meta.env.VITE_API_COURSE
const apiProgram = import.meta.env.VITE_API_PROGRAM
const apiTeacher = import.meta.env.VITE_URL_GET_ALL_TEACHER_ROLE_TEACHER
const apiStudentCircleUrl = import.meta.env.VITE_URL_STUDENT_CIRCLE

const StudentProfile = () => {
    const {t,} = useTranslation();
    const navigate = useNavigate()
    const location = useLocation()
    const student = location.state?.student || {}

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    const [isEditing, setIsEditing] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [isAssignSyllabusModalOpen, setIsAssignSyllabusModalOpen] = useState(false)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [listCourse, setListCourse] = useState([])
    const [currentStep, setCurrentStep] = useState(2);
    const [studentCircle, setStudentCircle] = useState([]);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const responseCourse = await axios.get(apiCourse, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const responseProgram = await axios.get(apiProgram, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const responseTeacher = await axios.get(apiTeacher, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            if (!responseCourse.status === 200 || !responseProgram.status === 200 || !responseTeacher.status === 200) {
                console.error('Failed to fetch courses, programs or teachers');
                return;
            }
            const dataCourse = responseCourse.data;
            const dataProgram = responseProgram.data;
            const dataTeacher = responseTeacher.data;
            const coursesWithProgramAndTeacher = dataCourse
                .filter(course => course.student_id === student.student_id)
                .map(course => {
                    const program = dataProgram.find(p => p.program_id === course.program_id);
                    const teacher = dataTeacher.find(t => t.teacher_id === course.teacher_id);
                    return {
                        ...course,
                        program_name: program ? program.program_name : 'Unknown Program',
                        teacher_name: teacher ? teacher.full_name : 'Unknown Teacher'
                    };
                });
            console.log("Filtered and mapped courses: ", coursesWithProgramAndTeacher);

            setListCourse(coursesWithProgramAndTeacher);
        } catch (err) {
            console.error('Error fetching courses, programs, or teachers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [student.student_id, apiCourse, apiProgram, apiTeacher, token]);

    const fetchProcess = async () => {
        try {
            setIsLoading(true);
            const responseProcess = await axios.get(`${apiStudentCircleUrl}/${student.student_id}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            setCurrentStep(responseProcess.data[0].process_id - 1);
            setStudentCircle(responseProcess.data.filter(item => item.is_qc_done === false)
                .sort((a, b) => new Date(a.created_by_date) - new Date(b.created_by_date)));
            await fetchCourses()
        } catch (err) {
            console.error('Error fetching courses, programs, or teachers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProcess();
    }, []);

    let initialFormData = {
        studentId: student.student_id,
        nameStudent: student.name_student,
        program: student.program,
        englishLevel: student.english_level,
        learningGoal: student.learning_goal,
        availableSchedule: student.available_schedule,
        isActive: student.is_active,
        birthDay: student.birthday,
        phoneNumber: student.phone_number,
        email: student.email,
        address: student.address,
        occupation: student.occupation,
        learningMode: student.learning_mode,
        otherAvailableTimes: student.other_available_schedule,
        courseStartDate: student.course_start_date,
        additionalRequirements: student.additional_requirements,
        courseStatus: student.course_status,
        parentNotes: student.parent_notes,
        learningOutcomes: student.learning_outcomes,
        registeredCourse: student.registered_course,
        teacherRatio: student.teacher_ratio,
        courseMaterials: student.course_materials
    }

    const [formData, setFormData] = useState(initialFormData)
    const [originalData, setOriginalData] = useState(initialFormData)
    const parsedAvailableSchedule = (() => {
        try {
            return initialFormData.availableSchedule
                ? JSON.parse(initialFormData.availableSchedule)
                : []
        } catch (error) {
            console.error('Error parsing availableSchedule:', error)
            return []
        }
    })()
    const parsedOtherAvailableTimes = (() => {
        try {
            return initialFormData.otherAvailableTimes
                ? JSON.parse(initialFormData.otherAvailableTimes)
                : []
        } catch (error) {
            console.error('Error parsing otherAvailableTimes:', error)
            return []
        }
    })()
    const initialAvailableTimes = Array.isArray(parsedAvailableSchedule)
        ? parsedAvailableSchedule.map(time => ({
            day: time.day,
            start_time: time.start_time,
            end_time: time.end_time
        }))
        : []

    const initialOtherAvailableTimes = Array.isArray(parsedOtherAvailableTimes)
        ? parsedOtherAvailableTimes.map(time => ({
            day: time.day,
            start_time: time.start_time,
            end_time: time.end_time
        }))
        : []

    const [availableTimes, setAvailableTimes] = useState(initialAvailableTimes)
    const [otherAvailableTimes, setOtherAvailableTimes] = useState(initialOtherAvailableTimes)

    const handleCardClick = (courseId) => {
        console.log('Course ID: ', courseId);
        navigate(`/course-info?courseId=${courseId}`);
    };

    const toggleEdit = () => {
        if (isEditing) {
            setIsModalOpen(true)
        } else {
            setIsEditing(true)
        }
    }

    const handleAvailableChange = (index, field, value) => {
        const updatedTimes = [...availableTimes]
        updatedTimes[index] = {
            ...updatedTimes[index],
            [field]: value
        }
        setAvailableTimes(updatedTimes)
        setFormData({...formData, availableSchedule: updatedTimes})
    }

    const handleAddAvailable = () => {
        setAvailableTimes([...availableTimes, {day: '', start_time: '', end_time: ''}])
    }

    const handleAddOtherAvailable = () => {
        setOtherAvailableTimes([...otherAvailableTimes, {day: '', start_time: '', end_time: ''}])
    }

    const handleRemoveAvailable = (index) => {
        const updatedTimes = [...availableTimes]
        updatedTimes.splice(index, 1)
        setAvailableTimes(updatedTimes)
        setFormData({...formData, availableSchedule: updatedTimes})
    }

    const handleRemoveOtherAvailable = (index) => {
        const updatedTimes = [...otherAvailableTimes]
        updatedTimes.splice(index, 1)
        setOtherAvailableTimes(updatedTimes)
        setFormData({...formData, otherAvailableTimes: updatedTimes})
    }

    const handleOtherAvailableChange = (index, field, value) => {
        const updatedTimes = [...otherAvailableTimes]
        updatedTimes[index] = {
            ...updatedTimes[index],
            [field]: value
        }
        setOtherAvailableTimes(updatedTimes)
        setFormData({...formData, otherAvailableTimes: updatedTimes})
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value})
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const formatSchedule = (schedule) => {
                if (typeof schedule === 'string') {
                    try {
                        return JSON.stringify(JSON.parse(schedule))
                    } catch (error) {
                        console.error('Error parsing schedule:', error)
                        return JSON.stringify([])
                    }
                }
                return JSON.stringify(schedule)
            }

            const requestData = {
                name_student: formData.nameStudent,
                program: formData.program,
                birthday: formData.birthDay,
                phone_number: formData.phoneNumber,
                email: formData.email,
                address: formData.address,
                occupation: formData.occupation,
                parent_notes: formData.parentNotes,
                available_schedule: formatSchedule(formData.availableSchedule),
                english_level: formData.englishLevel,
                learning_goal: formData.learningGoal,
                learning_outcomes: formData.learningOutcomes,
                learning_mode: formData.learningMode,
                course_materials: formData.courseMaterials,
                additional_requirements: formData.additionalRequirements,
                registered_course: formData.registeredCourse,
                course_start_date: formData.courseStartDate,
                teacher_ratio: formData.teacherRatio,
                other_available_schedule: formatSchedule(formData.otherAvailableTimes),
                preferred_address: formData.address
            }

            console.log('requestData: ', requestData)

            const response = await axios.put(
                `${apiUrl}${student.student_id}`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setFormData(requestData)
                setOriginalData(requestData)
                initialFormData = requestData
                setIsModalOpen(false)
                setIsEditing(false)
                navigate(location.pathname, {
                    state: {
                        student: {
                            ...requestData,
                            student_id: student.student_id
                        }
                    }
                })
                setStatusAPI('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatusAPI(null)
                }, 2000)
            }
        } catch (error) {
            console.error('Error:', error)
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
            }, 2000)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setFormData(originalData)
        setIsEditing(false)
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!statusAPI}
                onClose={() => setStatusAPI(null)}
                message={message}
                status={statusAPI}
            />
            <Container>
                <div className="row">
                    <EditWrapper>
                        <LeftHeaderWrapper>
                            <EditButton onClick={toggleEdit}>
                                {isEditing ? <FaSave/> : <FaEdit/>}
                                {isEditing ? t('save') : t('edit')}
                            </EditButton>
                            {isEditing && hasChanges && (
                                <ResetButton onClick={handleReset}>Reset</ResetButton>
                            )}
                            {studentCircle.some(
                                item => item.is_sale_done === true && item.is_pd_done === false
                            ) && (
                                <AssignButton
                                    onClick={() => {
                                        setIsAssignSyllabusModalOpen(true);
                                    }}
                                >
                                    {t('add syllabus')}
                                </AssignButton>
                            )}

                            {studentCircle.some(
                                item => item.is_sale_done === true && item.is_tr_done === false
                            ) && (
                                <AssignButton
                                    onClick={() => {
                                        const availableSchedule = formData?.availableSchedule?.trim?.();

                                        if (!availableSchedule || availableSchedule === '[]') {
                                            alert('No available schedule found. Please add a schedule first.');
                                        } else {
                                            console.log('Hello:', formData.availableSchedule);
                                            setIsAssignModalOpen(true);
                                        }
                                    }}
                                >
                                    {t('assign')}
                                </AssignButton>
                            )}
                        </LeftHeaderWrapper>

                        <RightHeaderWrapper>
                            <ProcessBar data={studentCircle}/>
                        </RightHeaderWrapper>

                    </EditWrapper>

                    <WrapperAll>
                        <LeftItem>
                            <div className="col-lg-4">
                                <Card>
                                    <CardBody>
                                        <div className="d-flex flex-column align-items-center text-center">
                                            <WrapperHeader>
                                                <ProfileImage src={formData.avatar || no_avt} alt="Profile"/>
                                                <ProfileInfo>
                                                    <UserName>{formData.nameStudent}</UserName>
                                                    <JobTitle>{formData.occupation}</JobTitle>
                                                    <Location>{formData.address}</Location>
                                                </ProfileInfo>
                                            </WrapperHeader>
                                        </div>
                                        <hr/>
                                        <ListGroup>
                                            <ListGroupItem>
                                                <Label>
                                                    <RowWrapper>
                                                        <FaTelegram fontSize={32}/>
                                                        <TextCustom>Telegram</TextCustom>
                                                    </RowWrapper>
                                                </Label>
                                                <Value>{formData.phoneNumber || '0376762125'}</Value>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Label>
                                                    <RowWrapper>
                                                        <FaInstagram fontSize={32}/>
                                                        <TextCustom>Instagram</TextCustom>
                                                    </RowWrapper>
                                                </Label>
                                                <Value>{student.instagram}</Value>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Label>
                                                    <RowWrapper>
                                                        <FaFacebook fontSize={32}/>
                                                        <TextCustom>Facebook</TextCustom>
                                                    </RowWrapper>
                                                </Label>
                                                <Value>{student.facebook}</Value>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-lg-4">
                                <Card>
                                    <CardBody>
                                        <TitleCustom>{t('list courses')}</TitleCustom>
                                        <CardContainer>
                                            {listCourse.map(course => (
                                                <CardItem key={course.course_id}
                                                          onClick={() => handleCardClick(course.course_id)}>
                                                    <CardHeader>
                                                        {course.program_name} - {course.level_program}
                                                    </CardHeader>
                                                    <CardDetails>
                                                        <LevelProgram>Teacher: {course.teacher_name}</LevelProgram>
                                                        <StatusCourse status={course.status_course}>
                                                            {course.status_course}
                                                        </StatusCourse>
                                                    </CardDetails>
                                                </CardItem>
                                            ))}
                                        </CardContainer>
                                    </CardBody>
                                </Card>
                            </div>
                        </LeftItem>

                        <RightItem>
                            <div className="col-lg-8">
                                <Card>
                                    <CardBody>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('full name')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="nameStudent"
                                                    value={formData.nameStudent}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            {/* <InputGroup>
                                                <InputLabel>{t('program')}</InputLabel>
                                                <Select
                                                    id="program"
                                                    name="program"
                                                    value={formData.program}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="TADN">TADN</option>
                                                    <option value="IELTS">IELTS</option>
                                                    <option value="KIDS/TEENS">KIDS/TEENS</option>
                                                    <option value="Other">Other</option>
                                                </Select>
                                            </InputGroup> */}
                                            {/* </RowWrapper> */}
                                            {/* <RowWrapper> */}
                                            <InputGroup>
                                                <InputLabel>{t('birthday')}</InputLabel>
                                                <Input
                                                    type="date"
                                                    name="birthDay"
                                                    value={formData.birthDay}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('phone number')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            {/* </RowWrapper> */}
                                            {/* <RowWrapper> */}
                                            <InputGroup>
                                                <InputLabel>{t('email')}</InputLabel>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('address')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>

                                            <InputGroup>
                                                <InputLabel>{t('occupation')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="occupation"
                                                    value={formData.occupation}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('parent note')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="parentNotes"
                                                    value={formData.parentNotes}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        {/* <RowWrapper> */}
                                    </CardBody>
                                </Card>
                            </div>

                            <div className="col-lg-8">
                                <Card>
                                    <CardBody>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('program')}</InputLabel>
                                                <Select
                                                    id="program"
                                                    name="program"
                                                    value={formData.program}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="TADN">TADN</option>
                                                    <option value="IELTS">IELTS</option>
                                                    <option value="KIDS/TEENS">KIDS/TEENS</option>
                                                    <option value="Other">Other</option>
                                                </Select>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('learner’s level')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="englishLevel"
                                                    value={formData.englishLevel}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('learning goal')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="learningGoal"
                                                    value={formData.learningGoal}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>

                                            {/* </RowWrapper> */}
                                            {/* <RowWrapper> */}
                                            <InputGroup>
                                                <InputLabel>{t('learning outcomes')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="learningOutcomes"
                                                    value={formData.learningOutcomes}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('learning mode')}</InputLabel>
                                                <Select
                                                    name="learningMode"
                                                    value={formData.learningMode}
                                                    onChange={(e) => {
                                                        const newMode = e.target.value
                                                        setFormData({
                                                            ...formData,
                                                            learningMode: newMode,
                                                            ...(newMode === 'online' && {preferredAddress: ''})
                                                        })
                                                    }}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="online">Online</option>
                                                    <option value="offline">Offline</option>
                                                </Select>
                                            </InputGroup>
                                            {/* </RowWrapper> */}
                                            {/* <RowWrapper> */}
                                            <InputGroup>
                                                <InputLabel>{t('course materials')}</InputLabel>
                                                <Input
                                                    name="courseMaterials"
                                                    value={formData.courseMaterials}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            {formData.learningMode === 'offline' && (
                                                <InputGroup>
                                                    <InputLabel>{t('preferred address')}</InputLabel>
                                                    <Input
                                                        type="text"
                                                        name="preferredAddress"
                                                        value={formData.preferredAddress || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                    />
                                                </InputGroup>
                                            )}
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('additional requirements')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="additionalRequirements"
                                                    value={formData.additionalRequirements}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('registered course')}</InputLabel>
                                                <Input
                                                    type="number"
                                                    name="registeredCourse"
                                                    value={formData.registeredCourse}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('course start date')}</InputLabel>
                                                <Input
                                                    type="date"
                                                    name="courseStartDate"
                                                    value={formData.courseStartDate}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('teacher ratio (foreign) %')}</InputLabel>
                                                <Input
                                                    type="number"
                                                    name="teacherRatio"
                                                    value={formData.teacherRatio}
                                                    onChange={(e) => {
                                                        const value = Math.max(0, Math.min(100, Number(e.target.value)));
                                                        handleInputChange({target: {name: e.target.name, value}});
                                                    }}
                                                    disabled={!isEditing}
                                                    min={0}
                                                    max={100}
                                                />
                                            </InputGroup>

                                        </RowWrapper>
                                    </CardBody>
                                </Card>
                            </div>

                            <div className="col-lg-8">
                                <Card>
                                    <CardBody>
                                        <RowWrapperAvailable>
                                            <InputGroup>
                                                <InputLabel>{t('available schedule')}</InputLabel>
                                                <ButtonAdd type="button" onClick={handleAddAvailable}
                                                           disabled={!isEditing}>
                                                    + {t('add available time')}
                                                </ButtonAdd>
                                            </InputGroup>
                                            <InputGroupAvailable>
                                                {availableTimes.map((time, index) => (
                                                    <ScheduleEntry key={index}>
                                                        <Select
                                                            value={time.day}
                                                            onChange={(e) => handleAvailableChange(index, 'day', e.target.value)}
                                                            disabled={!isEditing}
                                                        >
                                                            <option value="">Select Day</option>
                                                            <option value="Monday">Monday</option>
                                                            <option value="Tuesday">Tuesday</option>
                                                            <option value="Wednesday">Wednesday</option>
                                                            <option value="Thursday">Thursday</option>
                                                            <option value="Friday">Friday</option>
                                                            <option value="Saturday">Saturday</option>
                                                            <option value="Sunday">Sunday</option>
                                                        </Select>
                                                        <Input
                                                            type="time"
                                                            placeholder="Start Time"
                                                            value={time.start_time}
                                                            onChange={(e) => handleAvailableChange(index, 'start_time', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                        <Input
                                                            type="time"
                                                            placeholder="End Time"
                                                            value={time.end_time}
                                                            onChange={(e) => handleAvailableChange(index, 'end_time', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                        <ButtonRemove type="button"
                                                                      onClick={() => handleRemoveAvailable(index)}
                                                                      disabled={!isEditing}>
                                                            {t('remove')}
                                                        </ButtonRemove>
                                                    </ScheduleEntry>
                                                ))}
                                            </InputGroupAvailable>
                                        </RowWrapperAvailable>

                                        <RowWrapperAvailable>
                                            <InputGroup>
                                                <InputLabel>{t('other availability')}</InputLabel>
                                                <ButtonAdd type="button" onClick={handleAddOtherAvailable}
                                                           disabled={!isEditing}>
                                                    + {t('add other available time')}
                                                </ButtonAdd>
                                            </InputGroup>
                                            <InputGroupAvailable>
                                                {otherAvailableTimes.map((time, index) => (
                                                    <ScheduleEntry key={index}>
                                                        <Select
                                                            value={time.day}
                                                            onChange={(e) => handleOtherAvailableChange(index, 'day', e.target.value)}
                                                            disabled={!isEditing}
                                                        >
                                                            <option value="">Select Day</option>
                                                            <option value="Monday">Monday</option>
                                                            <option value="Tuesday">Tuesday</option>
                                                            <option value="Wednesday">Wednesday</option>
                                                            <option value="Thursday">Thursday</option>
                                                            <option value="Friday">Friday</option>
                                                            <option value="Saturday">Saturday</option>
                                                            <option value="Sunday">Sunday</option>
                                                        </Select>
                                                        <Input
                                                            type="time"
                                                            placeholder="Start Time"
                                                            value={time.start_time}
                                                            onChange={(e) => handleOtherAvailableChange(index, 'start_time', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                        <Input
                                                            type="time"
                                                            placeholder="End Time"
                                                            value={time.end_time}
                                                            onChange={(e) => handleOtherAvailableChange(index, 'end_time', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                        <ButtonRemove type="button"
                                                                      onClick={() => handleRemoveOtherAvailable(index)}
                                                                      disabled={!isEditing}>
                                                            {t('remove')}
                                                        </ButtonRemove>
                                                    </ScheduleEntry>
                                                ))}
                                            </InputGroupAvailable>
                                        </RowWrapperAvailable>
                                    </CardBody>
                                </Card>
                            </div>

                        </RightItem>
                    </WrapperAll>
                </div>
                <ConfirmUpdateStudentProfile
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleSubmit}
                    action="save the changes"
                />

                <AssignStudentModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    student={student}
                    onSubmit={fetchProcess}
                />

                <AddSyllabusToStudentModal
                    isOpen={isAssignSyllabusModalOpen}
                    onClose={() => setIsAssignSyllabusModalOpen(false)}
                    onSubmit={fetchProcess}
                    student={student}
                />
            </Container>
        </>
    )
}

export default StudentProfile