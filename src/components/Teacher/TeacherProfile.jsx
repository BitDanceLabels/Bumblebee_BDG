import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import no_avt from '../../assets/no_avt.png'
import {
    FaEdit,
    FaSave,
    FaTelegram,
    FaInstagram,
    FaFacebook, FaEye
} from 'react-icons/fa'
import {useLocation, useNavigate} from 'react-router-dom'
import ConfirmUpdateTeacherProfile from '~/components/modal/ConfirmUpdateTeacherProfile.jsx'
import Loading from '~/components/General/Loading.jsx'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import SkillModal from '~/components/modal/SkillModal.jsx'
import DemoResultModal from '~/components/modal/DemoResultModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const Container = styled.div`
    background: #f7f7ff;
    margin-top: 16px;
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
const ValueSkill = styled.span`
    color: #6c757d;
    font-size: 16px;
    cursor: pointer;
`

const RowWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
`

const RateWrapper = styled.div`
    width: 100px;
    justify-content: space-between;
    display: flex;
    flex: 8;
    gap: 10px;
`


const InputGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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

const InputRate = styled.input`
    flex: 8;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    ${(props) =>
            props.disabled &&
            `background-color: #e9ecef;`}
`

const EditWrapper = styled.div`
    display: flex;
    align-items: center;
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

const ViewResultButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;

    ${(props) =>
            props.disabled &&
            `
            background-color: #b1b5b9;
            cursor: none;
            pointer-events: none;
            `}
    &:hover {
        background-color: #0056b3;
    }
`

const ResetButton = styled.button`
    background-color: green;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 1rem;

    &:hover {
        opacity: 0.8;
    }

    svg {
        margin-right: 8px;
    }
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

const SelectFromTo = styled.select`
    width: 75px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    flex: 6;
`

const TabContent = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-top: none;
    padding: 20px;
    border-radius: 0 5px 5px 5px;
`

const ProgramSelectWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
`

const RemoveButton = styled.button`
    width: 70px;
    height: 30px;
    margin-left: 10px;
    font-weight: bold;
    background-color: #fa3131;
    border-radius: 6px;
    color: #FFF;
    cursor: pointer;
`

const AddMoreButton = styled.button`
    width: 80px;
    height: 30px;
    font-weight: bold;
    background-color: #4e4ee8;
    border-radius: 6px;
    color: #FFF;
    cursor: pointer;
`

const TitleTeacherBackgroundCustom = styled.h3`
    text-align: center;
    font-size: 1.6rem;
    margin-bottom: 2rem;
`

const TeacherProfile = () => {
    const {t,} = useTranslation();
    const navigate = useNavigate()
    const location = useLocation()
    const teacher = location.state?.teacher || {}
    // console.log('Teacher Profile: ', teacher)

    const apiUrl = import.meta.env.VITE_URL_UPDATE_IDX_TEACHER

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    const [isEditing, setIsEditing] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const initialPrograms = teacher.programs ? teacher.programs.split(',').map((program) => program.trim()) : []
    const [selectedPrograms, setSelectedPrograms] = useState(initialPrograms)
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
    const availablePrograms = ['IELTS', 'TADN', 'KIDS']

    const initialFormData = {
        fullName: teacher.full_name,
        email: teacher.email,
        phoneNumber: teacher.phone_number,
        telegram: teacher.telegram,
        address: teacher.address,
        countryCurrent: teacher.country_current,
        birthday: teacher.birthday,
        placeOfBirth: teacher.place_of_birth,
        gender: teacher.gender,
        cccd: teacher.id_cccd,
        dateOfIssue: teacher.date_of_issue,
        dateOfExpiry: teacher.date_of_expiry,
        placeOfIssue: teacher.place_of_issue,
        documentFolder: teacher.document_folder,
        offlineAddressMap: teacher.offline_address_map,
        bankName: teacher.bank_name,
        accountNumber: teacher.account_number,
        accountHolderName: teacher.account_holder_name,
        paypalAccountName: teacher.paypal_account_name,
        paypalAccount: teacher.paypal_account,
        paymentMethod: teacher.payment_method || 'Cash',
        activeTab: teacher.payment_method === 'Bank' ? 'bank' : teacher.payment_method === 'Paypal' ? 'paypal' : null,
        certificates: teacher.certificates,
        degrees: teacher.degrees,
        yearsOfExperience: teacher.years_of_experience,
        teacherBackground: teacher.teacher_background,
        demoResult: teacher.demo_result,
        programs: teacher.programs,
        rateOnlineTADN: '',
        rateOfflineTADN: '',
        rateOnlineKID: '',
        rateOfflineKID: ''
    }

    const handleDemoResultClick = () => {
        setIsDemoModalOpen(true)
    }

    const handleDemoModalClose = () => {
        setIsDemoModalOpen(false)
    }

    const handleProgramToggle = (program) => {
        setSelectedPrograms((prevSelected) =>
            prevSelected.includes(program)
                ? prevSelected.filter((p) => p !== program)
                : [...prevSelected, program]
        )
    }

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            programs: selectedPrograms.join(', ')
        }))
    }, [selectedPrograms])

    const formatCertificates = (certificates) => {
        if (!certificates) return ''
        const skillsArray = certificates.split(',').map(skill => skill.trim())
        if (skillsArray.length <= 3) {
            return skillsArray.join(', ')
        } else {
            return `${skillsArray.slice(0, 3).join(', ')}, +${skillsArray.length - 3} skill(s)`
        }
    }

    if (teacher.rate) {
        try {
            const rateArray = JSON.parse(teacher.rate)
            rateArray.forEach(rateItem => {
                if (rateItem.program === 'TADN') {
                    if (rateItem.status === 'Online') {
                        initialFormData.rateOnlineTADN = rateItem.rate
                    } else if (rateItem.status === 'Offline') {
                        initialFormData.rateOfflineTADN = rateItem.rate
                    }
                } else if (rateItem.program === 'KID') {
                    if (rateItem.status === 'Online') {
                        initialFormData.rateOnlineKID = rateItem.rate
                    } else if (rateItem.status === 'Offline') {
                        initialFormData.rateOfflineKID = rateItem.rate
                    }
                }
            })
        } catch (error) {
            console.error('Invalid JSON format in teacher.rate', error)
        }
    }

    const [formData, setFormData] = useState(initialFormData)
    const [originalData, setOriginalData] = useState(initialFormData)
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
    const [demoResult, setDemoResult] = useState(formData.demoResult ? JSON.parse(formData.demoResult) : [])
    const [skills, setSkills] = useState(
        formData.certificates
            ? formData.certificates.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
            : []
    )

    const [backgroundEntries, setBackgroundEntries] = useState([])

    useEffect(() => {
        const parsedBackgroundEntries = teacher.teacher_background
            ? JSON.parse(teacher.teacher_background)
            : []

        const sortedEntries = parsedBackgroundEntries.sort((a, b) => {
            return new Date(a.end_date) - new Date(b.end_date)
        })

        setBackgroundEntries(
            sortedEntries.map(entry => ({
                from: {
                    month: entry.start_date ? new Date(entry.start_date).getMonth() + 1 : '',
                    year: entry.start_date ? new Date(entry.start_date).getFullYear() : ''
                },
                to: {
                    month: entry.end_date ? new Date(entry.end_date).getMonth() + 1 : '',
                    year: entry.end_date ? new Date(entry.end_date).getFullYear() : ''
                },
                description: entry.description || ''
            }))
        )
    }, [teacher.teacher_background])


    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            certificates: skills.join(', ')
        }))
    }, [skills])

    useEffect(() => {
        if (teacher.payment_method === 'Bank') {
            setFormData((prevData) => ({...prevData, activeTab: 'bank'}))
        } else if (teacher.payment_method === 'Paypal') {
            setFormData((prevData) => ({...prevData, activeTab: 'paypal'}))
        }
    }, [teacher.payment_method])

    const toggleEdit = () => {
        if (isEditing) {
            setIsModalOpen(true)
        } else {
            setIsEditing(true)
        }
    }

    const formatBackgroundEntries = () => {
        return backgroundEntries.map(entry => {
            const startDate = entry.from.year && entry.from.month
                ? `${entry.from.year}-${String(entry.from.month).padStart(2, '0')}-01`
                : null
            const endDate = entry.to.year && entry.to.month
                ? `${entry.to.year}-${String(entry.to.month).padStart(2, '0')}-01`
                : null

            return {
                start_date: startDate,
                end_date: endDate,
                description: entry.description
            }
        })
    }

    const handleAddEntry = () => {
        setBackgroundEntries([...backgroundEntries, {
            from: {month: '', year: ''},
            to: {month: '', year: ''},
            description: ''
        }])
    }

    const handleEntryChange = (index, field, subField, value) => {
        const updatedEntries = [...backgroundEntries]
        if (subField) {
            updatedEntries[index][field][subField] = value
        } else {
            updatedEntries[index][field] = value
        }
        setBackgroundEntries(updatedEntries)
    }

    const handleRemoveEntry = (index) => {
        setBackgroundEntries(backgroundEntries.filter((_, i) => i !== index))
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            ...(name === 'paymentMethod' && {activeTab: value === 'Bank' ? 'bank' : value === 'Paypal' ? 'paypal' : null})
        }))
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleReset = () => {
        setFormData(originalData)
        setIsEditing(false)
    }

    const handleSubmit = async () => {
        for (const entry of backgroundEntries) {
            const {from, to} = entry

            if (!from.month || !from.year || !to.month || !to.year) {
                alert('Please select both month and year for all time periods.')
                return
            }
        }

        try {
            setIsLoading(true)

            const formattedBackgroundEntries = formatBackgroundEntries()
            const rate = [
                {program: 'TADN', rate: formData.rateOnlineTADN, status: 'Online'},
                {program: 'TADN', rate: formData.rateOfflineTADN, status: 'Offline'},
                {program: 'KID', rate: formData.rateOnlineKID, status: 'Online'},
                {program: 'KID', rate: formData.rateOfflineKID, status: 'Offline'}
            ]

            const requestData = {
                full_name: formData.fullName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                telegram: formData.telegram,
                address: formData.address,
                country_current: formData.countryCurrent,
                birthday: formData.birthday,
                place_of_birth: formData.placeOfBirth,
                gender: formData.gender,
                id_cccd: formData.cccd,
                date_of_issue: formData.dateOfIssue,
                date_of_expiry: formData.dateOfExpiry,
                place_of_issue: formData.placeOfIssue,
                document_folder: formData.documentFolder,
                offline_address_map: formData.offlineAddressMap,
                bank_name: formData.bankName,
                account_number: formData.accountNumber,
                account_holder_name: formData.accountHolderName,
                paypal_account_name: formData.paypalAccountName,
                paypal_account: formData.paypalAccount,
                certificates: formData.certificates,
                degrees: formData.degrees,
                years_of_experience: formData.yearsOfExperience,
                teacher_background: JSON.stringify(formattedBackgroundEntries),
                demo_result: JSON.stringify(demoResult),
                programs: formData.programs,
                rate: JSON.stringify(rate),
                payment_method: formData.paymentMethod
            }

            const response = await axios.put(
                `${apiUrl}${teacher.idx_teacher}`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setIsModalOpen(false)
                setIsEditing(false)
                setOriginalData(formData)
                navigate(location.pathname, {
                    state: {
                        teacher: {
                            ...requestData,
                            idx_teacher: teacher.idx_teacher
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
                        <EditButton onClick={toggleEdit}>
                            {isEditing ? <FaSave/> : <FaEdit/>}
                            {isEditing ? t('save') : t('edit')}
                        </EditButton>
                        {isEditing && hasChanges && (
                            <ResetButton onClick={handleReset}>
                                {t('reset')}
                            </ResetButton>
                        )}
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
                                                    <UserName>{formData.fullName}</UserName>
                                                    <JobTitle>{t('teacher')}</JobTitle>
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
                                                <Value>{formData.phoneNumber}</Value>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Label>
                                                    <RowWrapper>
                                                        <FaInstagram fontSize={32}/>
                                                        <TextCustom>Instagram</TextCustom>
                                                    </RowWrapper>
                                                </Label>
                                                <Value>{teacher.instagram}</Value>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Label>
                                                    <RowWrapper>
                                                        <FaFacebook fontSize={32}/>
                                                        <TextCustom>Facebook</TextCustom>
                                                    </RowWrapper>
                                                </Label>
                                                <Value>{teacher.facebook}</Value>
                                            </ListGroupItem>
                                        </ListGroup>
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
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('email')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
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
                                            <InputGroup>
                                                <InputLabel>Telegram</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="telegram"
                                                    value={formData.telegram}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('gender')}</InputLabel>
                                                <Select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="">{t('select gender')}</option>
                                                    <option value="Male">{t('male')}</option>
                                                    <option value="Female">{t('female')}</option>
                                                    <option value="Other">{t('other')}</option>
                                                </Select>
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
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('birthday')}</InputLabel>
                                                <Input
                                                    type="date"
                                                    name="birthday"
                                                    value={formData.birthday}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('place of birth')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="placeOfBirth"
                                                    value={formData.placeOfBirth}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('citizen identification card')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="cccd"
                                                    value={formData.cccd}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('date of issue')}</InputLabel>
                                                <Input
                                                    type="date"
                                                    name="dateOfIssue"
                                                    value={formData.dateOfIssue}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('date of expiry')}</InputLabel>
                                                <Input
                                                    type="date"
                                                    name="dateOfExpiry"
                                                    value={formData.dateOfExpiry}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('place of issue')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="placeOfIssue"
                                                    value={formData.placeOfIssue}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('document folder')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="documentFolder"
                                                    value={formData.documentFolder}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('offline address map')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="offlineAddressMap"
                                                    value={formData.offlineAddressMap}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('country current')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="countryCurrent"
                                                    value={formData.countryCurrent}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                    </CardBody>
                                </Card>
                            </div>


                            <div className="col-lg-8">
                                <Card>
                                    <CardBody>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('certificates')}</InputLabel>
                                                <ValueSkill onClick={() => isEditing && setIsSkillModalOpen(true)}>
                                                    {skills.length === 0 || !formData.certificates ? t('add skill') : formatCertificates(skills.join(', '))}
                                                </ValueSkill>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('degrees')}</InputLabel>
                                                <Input
                                                    name="degrees"
                                                    value={formData.degrees}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('years of experience')}</InputLabel>
                                                <Input
                                                    type="text"
                                                    name="yearsOfExperience"
                                                    value={formData.yearsOfExperience}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('program')}</InputLabel>
                                                <ProgramSelectWrapper>
                                                    {availablePrograms.map((program) => (
                                                        <label key={program}
                                                               style={{display: 'block', marginBottom: '8px'}}>
                                                            <input style={{marginRight: '5px'}}
                                                                   type="checkbox"
                                                                   checked={selectedPrograms.includes(program)}
                                                                   onChange={() => handleProgramToggle(program)}
                                                                   disabled={!isEditing}
                                                            />
                                                            {program}
                                                        </label>
                                                    ))}
                                                </ProgramSelectWrapper>
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('rate per program (TADN)')}</InputLabel>
                                                <RateWrapper>
                                                    <div style={{position: 'relative', flex: 1}}>
                                                        <InputRate
                                                            type="text"
                                                            name="rateOnlineTADN"
                                                            placeholder={t('online rate')}
                                                            value={formData.rateOnlineTADN}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            style={{paddingRight: '40px'}}
                                                        />
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                                color: '#6c757d',
                                                                fontSize: '16px'
                                                            }}
                                                        >|ONL
                            </span>
                                                    </div>
                                                    <div style={{position: 'relative', flex: 1}}>
                                                        <InputRate
                                                            type="text"
                                                            name="rateOfflineTADN"
                                                            placeholder={t('offline rate')}
                                                            value={formData.rateOfflineTADN}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            style={{paddingRight: '40px'}}
                                                        />
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                                color: '#6c757d',
                                                                fontSize: '16px'
                                                            }}
                                                        >|OFF
                            </span>
                                                    </div>
                                                </RateWrapper>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputLabel>{t('rate per program (KID)')}</InputLabel>
                                                <RateWrapper>
                                                    <div style={{position: 'relative', flex: 1}}>
                                                        <InputRate
                                                            type="text"
                                                            name="rateOnlineKID"
                                                            placeholder={t('online rate')}
                                                            value={formData.rateOnlineKID}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            style={{paddingRight: '40px'}}
                                                        />
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                                color: '#6c757d',
                                                                fontSize: '16px'
                                                            }}
                                                        >|ONL
                            </span>
                                                    </div>
                                                    <div style={{position: 'relative', flex: 1}}>
                                                        <InputRate
                                                            type="text"
                                                            name="rateOfflineKID"
                                                            placeholder={t('offline rate')}
                                                            value={formData.rateOfflineKID}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            style={{paddingRight: '40px'}}
                                                        />
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                                color: '#6c757d',
                                                                fontSize: '16px'
                                                            }}
                                                        >|OFF
                            </span>
                                                    </div>
                                                </RateWrapper>
                                            </InputGroup>
                                        </RowWrapper>
                                        <RowWrapper>
                                            <InputGroup>
                                                <InputLabel>{t('demo result')}</InputLabel>
                                                <ViewResultButton onClick={handleDemoResultClick} disabled={!isEditing}>
                                                    <FaEye style={{marginRight: '5px'}}/> {t('view result')}
                                                </ViewResultButton>
                                            </InputGroup>
                                        </RowWrapper>
                                        <hr style={{width: '100%', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
                                        <TitleTeacherBackgroundCustom>{t('teacher’s biography')}</TitleTeacherBackgroundCustom>
                                        <RowWrapper>
                                            {backgroundEntries.map((entry, index) => (
                                                <div key={index} style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <InputGroup>
                                                        <div style={{display: 'flex', gap: '10px'}}>
                                                            <SelectFromTo
                                                                value={entry.from.month}
                                                                onChange={(e) => handleEntryChange(index, 'from', 'month', e.target.value)}
                                                                disabled={!isEditing}
                                                            >
                                                                <option value="">Tháng</option>
                                                                {[...Array(12).keys()].map(i => (
                                                                    <option key={i} value={i + 1}>
                                                                        {new Date(0, i).toLocaleString('en', {month: 'short'})}
                                                                    </option>
                                                                ))}
                                                            </SelectFromTo>
                                                            <SelectFromTo
                                                                value={entry.from.year}
                                                                onChange={(e) => handleEntryChange(index, 'from', 'year', e.target.value)}
                                                                disabled={!isEditing}
                                                            >
                                                                <option value="">Năm</option>
                                                                {[...Array(30).keys()].map(i => {
                                                                    const year = new Date().getFullYear() - i
                                                                    return <option key={year}
                                                                                   value={year}>{year}</option>
                                                                })}
                                                            </SelectFromTo>
                                                            <span style={{alignSelf: 'center'}}>to</span>
                                                            <SelectFromTo
                                                                value={entry.to.month}
                                                                onChange={(e) => handleEntryChange(index, 'to', 'month', e.target.value)}
                                                                disabled={!isEditing}
                                                            >
                                                                <option value="">Tháng</option>
                                                                {[...Array(12).keys()].map(i => (
                                                                    <option key={i} value={i + 1}>
                                                                        {new Date(0, i).toLocaleString('en', {month: 'short'})}
                                                                    </option>
                                                                ))}
                                                            </SelectFromTo>
                                                            <SelectFromTo
                                                                value={entry.to.year}
                                                                onChange={(e) => handleEntryChange(index, 'to', 'year', e.target.value)}
                                                                disabled={!isEditing}
                                                            >
                                                                <option value="">Năm</option>
                                                                {[...Array(30).keys()].map(i => {
                                                                    const year = new Date().getFullYear() - i
                                                                    return <option key={year}
                                                                                   value={year}>{year}</option>
                                                                })}
                                                            </SelectFromTo>
                                                        </div>
                                                    </InputGroup>

                                                    <InputGroup>
                                                        <InputLabel>{t('description')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            value={entry.description}
                                                            onChange={(e) => handleEntryChange(index, 'description', null, e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                        {isEditing && (
                                                            <RemoveButton onClick={() => handleRemoveEntry(index)}>
                                                                {t('remove')}
                                                            </RemoveButton>
                                                        )}
                                                    </InputGroup>
                                                </div>
                                            ))}
                                            {isEditing &&
                                                <AddMoreButton
                                                    onClick={handleAddEntry}> {t('add more')}</AddMoreButton>}
                                        </RowWrapper>
                                    </CardBody>
                                </Card>
                            </div>

                            <div className="col-lg-8">
                                <Card>
                                    <CardBody>
                                        <RowWrapper>
                                            <InputGroup fullWidth>
                                                <InputLabel>{t('payment method')}</InputLabel>
                                                <Select
                                                    name="paymentMethod"
                                                    value={formData.paymentMethod}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                >
                                                    <option value="Cash">{t('cash')}</option>
                                                    <option value="Bank">{t('bank')}</option>
                                                    <option value="Paypal">{t('paypal')}</option>
                                                </Select>
                                            </InputGroup>
                                        </RowWrapper>

                                        {formData.paymentMethod === 'Bank' && formData.activeTab === 'bank' && (
                                            <TabContent>
                                                <RowWrapper>
                                                    <InputGroup>
                                                        <InputLabel>{t('bank name')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            name="bankName"
                                                            value={formData.bankName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup>
                                                        <InputLabel>{t('account number')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            name="accountNumber"
                                                            value={formData.accountNumber}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </InputGroup>
                                                </RowWrapper>
                                                <RowWrapper>
                                                    <InputGroup>
                                                        <InputLabel>{t('account holder name')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            name="accountHolderName"
                                                            value={formData.accountHolderName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </InputGroup>
                                                </RowWrapper>
                                            </TabContent>
                                        )}
                                        {formData.paymentMethod === 'Paypal' && formData.activeTab === 'paypal' && (
                                            <TabContent>
                                                <RowWrapper>
                                                    <InputGroup>
                                                        <InputLabel>{t('paypal account name')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            name="paypalAccountName"
                                                            value={formData.paypalAccountName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup>
                                                        <InputLabel>{t('paypal account')}</InputLabel>
                                                        <Input
                                                            type="text"
                                                            name="paypalAccount"
                                                            value={formData.paypalAccount}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                        />
                                                    </InputGroup>
                                                </RowWrapper>
                                            </TabContent>
                                        )}
                                    </CardBody>
                                </Card>
                            </div>

                        </RightItem>
                    </WrapperAll>
                </div>
                {/* Modal for confirmation */}
                <ConfirmUpdateTeacherProfile
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    onConfirm={handleSubmit}
                    action="save the changes"
                />
                {isDemoModalOpen && (
                    <DemoResultModal
                        demoResults={demoResult}
                        onClose={handleDemoModalClose}
                        onEditDemoResult={(updatedDemoResult) => setDemoResult(updatedDemoResult)}
                    />
                )}
                {isSkillModalOpen && (
                    <SkillModal
                        skills={skills}
                        onClose={() => setIsSkillModalOpen(false)}
                        onEditSkill={(updatedSkills) => setSkills(updatedSkills)}
                    />
                )}
            </Container>
        </>
    )
}

export default TeacherProfile
