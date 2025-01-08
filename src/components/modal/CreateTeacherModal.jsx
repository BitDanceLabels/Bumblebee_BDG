import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import Loading from '../General/Loading'
import countryList from 'country-list'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const {getNames} = countryList
const countryOptions = getNames()

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

// eslint-disable-next-line react/prop-types
const CreateTeacherModal = ({isOpen, onClose, onSubmit, formData, setFormData}) => {
    const {t,} = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false)
    const [status, setStatus] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const apiUrl = import.meta.env.VITE_URL_CREAT_TEACHER

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value})
    }
    // const handleCountryChange = (selectedOption) => {
    //   setFormData({
    //     ...formData,
    //     country_current: selectedOption ? selectedOption.value : ''
    //   });
    // };
    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const requestData = {
                // eslint-disable-next-line react/prop-types
                full_name: formData.full_name,
                // eslint-disable-next-line react/prop-types
                email: formData.email,
                // eslint-disable-next-line react/prop-types
                phone_number: formData.phone_number,
                // eslint-disable-next-line react/prop-types
                telegram: formData.telegram,
                // eslint-disable-next-line react/prop-types
                address: formData.address,
                // eslint-disable-next-line react/prop-types
                country_current: formData.country_current,
                // eslint-disable-next-line react/prop-types
                birthday: formData.birthday,
                // eslint-disable-next-line react/prop-types
                place_of_birth: formData.placeOfBirth,
                // eslint-disable-next-line react/prop-types
                gender: formData.gender,
                // eslint-disable-next-line react/prop-types
                id_cccd: formData.cccd,
                // eslint-disable-next-line react/prop-types
                date_of_issue: formData.dateOfIssue,
                // eslint-disable-next-line react/prop-types
                date_of_expiry: formData.dateOfExpiry,
                // eslint-disable-next-line react/prop-types
                place_of_issue: formData.placeOfIssue,
                // eslint-disable-next-line react/prop-types
                document_folder: formData.documentFolder,
                // eslint-disable-next-line react/prop-types
                offline_address_map: formData.offlineAddressMap,
                // eslint-disable-next-line react/prop-types
                bank_name: formData.bankName,
                // eslint-disable-next-line react/prop-types
                account_number: formData.accountNumber,
                // eslint-disable-next-line react/prop-types
                account_holder_name: formData.accountHolederName,
                // eslint-disable-next-line react/prop-types
                paypal_account_name: formData.paypalAccountName,
                // eslint-disable-next-line react/prop-types
                paypal_account: formData.paypalAccount,
                // eslint-disable-next-line react/prop-types
                certificates: formData.certificates,
                // eslint-disable-next-line react/prop-types
                degrees: formData.degrees,
                // eslint-disable-next-line react/prop-types
                years_of_experience: formData.yearsOfExperience,
                // eslint-disable-next-line react/prop-types
                teacher_background: formData.teacherBackground,
                // eslint-disable-next-line react/prop-types
                demo_result: formData.demoResult,
                // eslint-disable-next-line react/prop-types
                programs: formData.programs,
                // eslint-disable-next-line react/prop-types
                rate: formData.ratePerProgram
            }

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                setStatus('success')
                setMessage('Teacher created successfully!')
                onSubmit()
                setTimeout(() => {
                    setStatus(null)
                    onClose()
                }, 2000)
            }
        } catch (error) {
            setStatus('error')
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
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
                <HeaderLabel>{t('create teacher')}</HeaderLabel>
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
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="phone_number">{t('phone number')}</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup> {/* FormGroup này sẽ chiếm hết một hàng */}
                            <Label htmlFor="telegram">Telegram</Label>
                            <Input
                                id="telegram"
                                name="telegram"
                                value={formData.telegram}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="gender">{t('gender')}</Label>
                            <Select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">{t('select gender')}</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Select>
                        </FormGroup>
                        <FormGroup> {/* FormGroup này sẽ chiếm hết một hàng */}
                            <Label htmlFor="address">{t('address')}</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="country_current">{t('country current')}</Label>
                            <Select
                                id="country_current"
                                name="country_current"
                                value={formData.country_current}
                                onChange={handleChange}
                            >
                                <option value="">{t('select country')}</option>
                                {countryOptions.map((country, index) => (
                                    <option key={index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </Select>
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
                            <Label htmlFor="placeOfBirth">{t('place of birth')}</Label>
                            <Input
                                id="placeOfBirth"
                                name="placeOfBirth"
                                value={formData.placeOfBirth}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="cccd">{t('citizen identification card')}</Label>
                            <Input
                                id="cccd"
                                name="cccd"
                                value={formData.cccd}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="dateOfIssue">{t('date of issue')}</Label>
                            <Input
                                type={'date'}
                                id="dateOfIssue"
                                name="dateOfIssue"
                                value={formData.dateOfIssue}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="dateOfExpiry">{t('date of expiry')}</Label>
                            <Input
                                type={'date'}
                                id="dateOfExpiry"
                                name="dateOfExpiry"
                                value={formData.dateOfExpiry}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="placeOfIssue">{t('place of issue')}</Label>
                            <Input
                                id="placeOfIssue"
                                name="placeOfIssue"
                                value={formData.placeOfIssue}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="documentFolder">{t('document folder')}</Label>
                            <Input
                                id="documentFolder"
                                name="documentFolder"
                                value={formData.documentFolder}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="offlineAddressMap">{t('offline address map')}</Label>
                            <Input
                                id="offlineAddressMap"
                                name="offlineAddressMap"
                                value={formData.offlineAddressMap}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </GroupWrapper>

                    {/*/!* Cụm 2: Teacher Skills *!/*/}
                    {/*<SubTitleCustom>Teacher Skills</SubTitleCustom>*/}
                    {/*<GroupWrapper>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="certificates">Certificates</Label>*/}
                    {/*    <Input*/}
                    {/*      id="certificates"*/}
                    {/*      name="certificates"*/}
                    {/*      value={formData.certificates}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="degrees">Degrees</Label>*/}
                    {/*    <Input*/}
                    {/*      id="degrees"*/}
                    {/*      name="degrees"*/}
                    {/*      value={formData.degrees}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="yearsOfExperience">Years of experience</Label>*/}
                    {/*    <Input*/}
                    {/*      type={'number'}*/}
                    {/*      id="yearsOfExperience"*/}
                    {/*      name="yearsOfExperience"*/}
                    {/*      value={formData.yearsOfExperience}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="teacherBackground">Teacher’s background</Label>*/}
                    {/*    <Input*/}
                    {/*      id="teacherBackground"*/}
                    {/*      name="teacherBackground"*/}
                    {/*      value={formData.teacherBackground}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="demoResult">Demo result</Label>*/}
                    {/*    <Input*/}
                    {/*      id="demoResult"*/}
                    {/*      name="demoResult"*/}
                    {/*      value={formData.demoResult}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="programs">Programs</Label>*/}
                    {/*    <Input*/}
                    {/*      id="programs"*/}
                    {/*      name="programs"*/}
                    {/*      value={formData.programs}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="ratePerProgram">Rate Per Program</Label>*/}
                    {/*    <Input*/}
                    {/*      id="ratePerProgram"*/}
                    {/*      name="ratePerProgram"*/}
                    {/*      value={formData.ratePerProgram}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*</GroupWrapper>*/}

                    {/*/!* Cụm 3: Bank Info *!/*/}
                    {/*<SubTitleCustom>Bank Info</SubTitleCustom>*/}
                    {/*<GroupWrapper>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="bankName">Bank Name</Label>*/}
                    {/*    <Input*/}
                    {/*      id="bankName"*/}
                    {/*      name="bankName"*/}
                    {/*      value={formData.bankName}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="accountNumber">Account Number</Label>*/}
                    {/*    <Input*/}
                    {/*      id="accountNumber"*/}
                    {/*      name="accountNumber"*/}
                    {/*      value={formData.accountNumber}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="accountHolederName">Account Holder Name</Label>*/}
                    {/*    <Input*/}
                    {/*      id="accountHolederName"*/}
                    {/*      name="accountHolederName"*/}
                    {/*      value={formData.accountHolederName}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}
                    {/*</GroupWrapper>*/}

                    {/*/!* Cụm 3: Palpal Info *!/*/}
                    {/*<SubTitleCustom>Paypal Info</SubTitleCustom>*/}
                    {/*<GroupWrapper>*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="paypalAccountName">Paypal account name</Label>*/}
                    {/*    <Input*/}
                    {/*      id="paypalAccountName"*/}
                    {/*      name="paypalAccountName"*/}
                    {/*      value={formData.paypalAccountName}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}

                    {/*  <FormGroup>*/}
                    {/*    <Label htmlFor="paypalAccount">Paypal account</Label>*/}
                    {/*    <Input*/}
                    {/*      id="paypalAccount"*/}
                    {/*      name="paypalAccount"*/}
                    {/*      value={formData.paypalAccount}*/}
                    {/*      onChange={handleChange}*/}
                    {/*    />*/}
                    {/*  </FormGroup>*/}

                    {/*</GroupWrapper>*/}


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

export default CreateTeacherModal

