import {useState} from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import Loading from '../General/Loading'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    width: ${(props) => (props.fullwidth ? '100%' : 'calc(50% - 8px)')};
    box-sizing: border-box;
`

const Label = styled.label`
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 1.5rem;
`

const Input = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`

const Select = styled.select`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`

const ButtonWrapper = styled.div`
    text-align: right;
`

const ButtonAdd = styled.button`
    padding: 8px 16px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;

    &:hover {
        background-color: #0056b3;
    }
`

const ButtonRemove = styled.button`
    padding: 8px 16px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-left: 8px;
    margin-top: 8px;

    &:hover {
        background-color: #c92a2a;
    }
`
const ButtonCancel = styled.button`
    padding: 10px 20px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #c92a2a;
    }
`

const ButtonSubmit = styled.button`
    padding: 10px 20px;
    margin-left: 20px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #218838;
    }
`

const HeaderLabel = styled.h2`
    font-size: 2rem;
    text-align: center;
    margin-bottom: 30px;
`

const GroupWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    width: 100%;
`

const SubTitleCustom = styled.h3`
    font-size: 2rem;
`

const ScheduleEntry = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 8px;
    width: 100%;
    box-sizing: border-box;
`

const apiStudentCircleUrl = import.meta.env.VITE_URL_STUDENT_CIRCLE

// eslint-disable-next-line react/prop-types
const CreateStudentModal = ({isOpen, onClose, onSubmit, formData, setFormData}) => {
    const {t,} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [availableTimes, setAvailableTimes] = useState([])
    const [otherAvailableTimes, setOtherAvailableTimes] = useState([])
    const [status, setStatus] = useState(null)
    const [message, setMessage] = useState('')

    const apiUrl = import.meta.env.VITE_URL_CREAT_STUDENT
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
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

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const payload = {
                // eslint-disable-next-line react/prop-types
                name_student: formData.full_name,
                // eslint-disable-next-line react/prop-types
                program: formData.program,
                // eslint-disable-next-line react/prop-types
                available_schedule: JSON.stringify(formData.availableSchedule),
                // eslint-disable-next-line react/prop-types
                birthday: formData.birthday,
                // eslint-disable-next-line react/prop-types
                phone_number: formData.phoneNumber,
                // eslint-disable-next-line react/prop-types
                email: formData.email,
                // eslint-disable-next-line react/prop-types
                address: formData.address,
                // eslint-disable-next-line react/prop-types
                occupation: formData.occupation,
                // eslint-disable-next-line react/prop-types
                parent_notes: formData.parentNotes,
                // eslint-disable-next-line react/prop-types
                english_level: formData.englishLevel,
                // eslint-disable-next-line react/prop-types
                learning_goal: formData.learningGoal,
                // eslint-disable-next-line react/prop-types
                learning_mode: formData.learningMode,
                // eslint-disable-next-line react/prop-types
                learning_outcomes: formData.learningOutcomes,
                // eslint-disable-next-line react/prop-types
                other_available_schedule: JSON.stringify(formData.otherAvailableTimes),
                // eslint-disable-next-line react/prop-types
                additional_requirements: formData.additionalRequirements,
                // eslint-disable-next-line react/prop-types
                registered_course: formData.registeredCourse,
                // eslint-disable-next-line react/prop-types
                course_start_date: formData.courseStartDate,
                // eslint-disable-next-line react/prop-types
                teacher_ratio: formData.teacherRatio,
                // eslint-disable-next-line react/prop-types
                course_materials: formData.courseMaterials
            }

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response)

            const payload2 = {
                student_id: response.data.student_id,
                process_id: 2,
                is_sale_done: true
            }

            await axios.post(apiStudentCircleUrl, payload2, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                onSubmit()
                onClose()
                setIsLoading(false)
                setStatus('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatus(null)
                }, 2000)
            }
        } catch (error) {
            console.error('Error creating student:', error)
            setIsLoading(false)
            setStatus('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatus(null)
            }, 2000)
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
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                style={{
                    content: {
                        maxWidth: '800px',
                        height: 'auto',
                        margin: 'auto',
                        padding: '30px',
                        borderRadius: '10px'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1001
                    }
                }}
            >
                <HeaderLabel>{t('create student')}</HeaderLabel>
                <Form>
                    <SubTitleCustom>{t('contact information')}</SubTitleCustom>
                    {/* Cụm 1: Contact Information */}
                    <GroupWrapper>
                        <FormGroup>
                            <Label htmlFor="full_name">{t('full name')}</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="birthday">{t('birthday')}</Label>
                            <Input
                                type={'date'}
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="phoneNumber">{t('phone number')}</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="address">{t('address')}</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="occupation">{t('occupation')}</Label>
                            <Input
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="parentNotes">{t('parent note')}</Label>
                            <Input
                                id="parentNotes"
                                name="parentNotes"
                                value={formData.parentNotes}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </GroupWrapper>

                    {/* Cụm 2: Student Capacity */}
                    <SubTitleCustom>{t('details')}</SubTitleCustom>
                    <GroupWrapper>
                        <FormGroup>
                            <Label htmlFor="program">{t('program')}</Label>
                            <Select
                                id="program"
                                name="program"
                                value={formData.program}
                                onChange={handleChange}
                            >
                                <option value="TADN">TADN</option>
                                <option value="IELTS">IELTS</option>
                                <option value="KIDS/TEENS">KIDS/TEENS</option>
                                <option value="Other">Other</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="englishLevel">{t('learner’s level')}</Label>
                            <Input
                                id="englishLevel"
                                name="englishLevel"
                                value={formData.englishLevel}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="learningGoal">{t('learning goal')}</Label>
                            <Input
                                id="learningGoal"
                                name="learningGoal"
                                value={formData.learningGoal}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="learningMode">{t('learning mode')}</Label>
                            <Select
                                id="learningMode"
                                name="learningMode"
                                value={formData.learningMode}
                                onChange={handleChange}
                            >
                                <option value="">{t('select program')}</option>
                                <option value="online">{t('online')}</option>
                                <option value="offline">{t('offline')}</option>
                            </Select>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="learningOutcomes">{t('learning outcomes')}</Label>
                            <Input
                                id="learningOutcomes"
                                name="learningOutcomes"
                                value={formData.learningOutcomes}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {formData.learningMode === 'offline' && (
                            <FormGroup>
                                <Label htmlFor="preferredAddress">{t('preferred address')}</Label>
                                <Input
                                    id="preferredAddress"
                                    name="preferredAddress"
                                    value={formData.preferredAddress}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        )}
                        <FormGroup>
                            <Label htmlFor="additionalRequirements">{t('additional requirements')}</Label>
                            <Input
                                id="additionalRequirements"
                                name="additionalRequirements"
                                value={formData.additionalRequirements}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="registeredCourse">{t('registered course')}</Label>
                            <Input
                                id="registeredCourse"
                                name="registeredCourse"
                                type={'number'}
                                value={formData.registeredCourse}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="courseStartDate">{t('course start date')}</Label>
                            <Input
                                type={'date'}
                                id="courseStartDate"
                                name="courseStartDate"
                                value={formData.courseStartDate}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="teacherRatio">{t('teacher ratio (foreign) %')}</Label>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Input
                                    type="number"
                                    id="teacherRatio"
                                    name="teacherRatio"
                                    value={formData.teacherRatio}
                                    onChange={(e) => {
                                        const value = Math.max(0, Math.min(100, Number(e.target.value)));
                                        handleChange({target: {name: e.target.name, value}});
                                    }}
                                    min={0}
                                    max={100}
                                    style={{flex: '1 0 auto', marginRight: '5px'}}
                                />
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="courseMaterials">{t('course materials')}</Label>
                            <Input
                                id="courseMaterials"
                                name="courseMaterials"
                                value={formData.courseMaterials}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup fullwidth>
                            <Label>{t('available schedule')}</Label>
                            {availableTimes.map((time, index) => (
                                <ScheduleEntry key={index}>
                                    <Select
                                        value={time.day}
                                        onChange={(e) => handleAvailableChange(index, 'day', e.target.value)}
                                    >
                                        <option value="">{t('select day')}</option>
                                        <option value="Monday">{t('monday')}</option>
                                        <option value="Tuesday">{t('tuesday')}</option>
                                        <option value="Wednesday">{t('wednesday')}</option>
                                        <option value="Thursday">{t('thursday')}</option>
                                        <option value="Friday">{t('friday')}</option>
                                        <option value="Saturday">{t('saturday')}</option>
                                        <option value="Sunday">{t('sunday')}</option>
                                    </Select>
                                    <Input
                                        type="time"
                                        placeholder={t('start time')}
                                        value={time.start_time}
                                        onChange={(e) => handleAvailableChange(index, 'start_time', e.target.value)}
                                    />
                                    <Input
                                        type="time"
                                        placeholder={t('end time')}
                                        value={time.end_time}
                                        onChange={(e) => handleAvailableChange(index, 'end_time', e.target.value)}
                                    />
                                    <ButtonRemove type="button" onClick={() => handleRemoveAvailable(index)}>
                                        {t('remove')}
                                    </ButtonRemove>
                                </ScheduleEntry>
                            ))}
                            <ButtonAdd type="button" onClick={handleAddAvailable}>
                                + {t('add available time')}
                            </ButtonAdd>
                        </FormGroup>
                        <FormGroup fullwidth>
                            <Label>{t('other availability')}</Label>
                            {otherAvailableTimes.map((time, index) => (
                                <ScheduleEntry key={index}>
                                    <Select
                                        value={time.day}
                                        onChange={(e) => handleOtherAvailableChange(index, 'day', e.target.value)}
                                    >
                                        <option value="">{t('select day')}</option>
                                        <option value="Monday">{t('monday')}</option>
                                        <option value="Tuesday">{t('tuesday')}</option>
                                        <option value="Wednesday">{t('wednesday')}</option>
                                        <option value="Thursday">{t('thursday')}</option>
                                        <option value="Friday">{t('friday')}</option>
                                        <option value="Saturday">{t('saturday')}</option>
                                        <option value="Sunday">{t('sunday')}</option>
                                    </Select>
                                    <Input
                                        type="time"
                                        placeholder={t('start time')}
                                        value={time.start_time}
                                        onChange={(e) => handleOtherAvailableChange(index, 'start_time', e.target.value)}
                                    />
                                    <Input
                                        type="time"
                                        placeholder={t('end time')}
                                        value={time.end_time}
                                        onChange={(e) => handleOtherAvailableChange(index, 'end_time', e.target.value)}
                                    />
                                    <ButtonRemove type="button" onClick={() => handleRemoveOtherAvailable(index)}>
                                        {t('remove')}
                                    </ButtonRemove>
                                </ScheduleEntry>
                            ))}
                            <ButtonAdd type="button" onClick={handleAddOtherAvailable}>
                                + {t('add other available time')}
                            </ButtonAdd>
                        </FormGroup>
                    </GroupWrapper>
                </Form>
                <ButtonWrapper>
                    <ButtonCancel type="button" onClick={onClose} style={{marginTop: '10px'}}>
                        {t('cancel')}
                    </ButtonCancel>
                    <ButtonSubmit type="button" onClick={handleSubmit} style={{marginTop: '10px'}}>
                        {t('submit')}
                    </ButtonSubmit>
                </ButtonWrapper>
            </Modal>
        </>
    )
}

export default CreateStudentModal