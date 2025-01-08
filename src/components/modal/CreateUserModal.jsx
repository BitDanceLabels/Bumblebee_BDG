import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Loading from '../General/Loading'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    width: 400px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`

const ModalHeader = styled.h2`
    margin-top: 0;
    text-align: center;
    margin-bottom: 20px;
`

const FormField = styled.div`
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        flex: 6;
    }

    input,
    select {
        width: auto;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 10px;
        flex: 10;
    }
`

// const CheckBoxGroup = styled.div`
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   flex: 10;
//
//   label {
//     font-weight: normal;
//   }
// `

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Button = styled.button`
    background-color: ${(props) => (props.primary ? '#03a9f4' : '#ccc')};
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        opacity: 0.8;
    }
`

// const TextSexCustom = styled.text`
//   margin-left: 6px;
// `

let getUserAPI = import.meta.env.VITE_URL_GET_ALL_USERS

// eslint-disable-next-line react/prop-types
const CreateUserModal = ({isOpen, onClose, initialData = null, onUserCreated, method}) => {
    const {t,} = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        gender: '',
        email: '',
        phone: ''
    })

    const [isLoading, setIsLoading] = useState(false)
    const [statusAPI, setStatusAPI] = React.useState(null)
    const [apiDone, setApiDone] = React.useState(false)
    const [message, setMessage] = React.useState('')

    // Update formData when initialData has a value
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                full_name: '',
                role: '',
                gender: '',
                name: '',
                phone: ''
            })
        }
    }, [initialData])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    }

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.role) {
            alert(t('please fill in all required fields'))
            return
        }

        let api = getUserAPI
        let password = '123456'

        if (method === 'PUT') {
            api = `${api}${initialData.id}`
            password = initialData.password
        }

        const requestBody = {
            full_name: formData.full_name,
            password: password,
            role_group: formData.role,
            username: formData.name,
            phone: formData.phone
        }

        try {
            setIsLoading(true)

            const response = await axios({
                method: method,
                url: api,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: requestBody
            })

            if (response.status === 200 || response.status === 201) {
                setIsLoading(false)
                onUserCreated()
                setApiDone(true)
                setStatusAPI('success')
                setMessage('Successfully!')
                setTimeout(() => {
                    setStatusAPI(null)
                    setApiDone(false)
                    onClose()
                }, 2000)
            }
        } catch (error) {
            console.error('Error:', error)
            setIsLoading(false)
            setApiDone(true)
            setStatusAPI('error')
            setMessage(error.response?.data?.message || error.message || 'Failed')
            setTimeout(() => {
                setStatusAPI(null)
                setApiDone(false)
            }, 2000)
        }
    }

    const handleCancel = () => {
        onClose()
    }

    if (!isOpen) return null

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!statusAPI}
                onClose={() => setStatusAPI(null)}
                message={message}
                status={statusAPI}
            />
            <ModalOverlay style={{display: apiDone ? 'none' : 'flex'}}>
                <ModalContent>
                    <ModalHeader>{t('add new user')}</ModalHeader>
                    <FormField>
                        <label>{t('full name')}</label>
                        <input
                            type="text"
                            name="full_name"
                            placeholder={t('enter your full name')}
                            value={formData.full_name}
                            onChange={handleInputChange}
                        />
                    </FormField>

                    <FormField>
                        <label>{t('role')}</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="">{t('select role')}</option>
                            <option value="admin">{t('admin')}</option>
                            <option value="sub_admin">{t('sub admin')}</option>
                            <option value="teacher">{t('teacher')}</option>
                        </select>
                    </FormField>

                    {/*<FormField>*/}
                    {/*  <label>Gender</label>*/}
                    {/*  <CheckBoxGroup>*/}
                    {/*    <label>*/}
                    {/*      <input*/}
                    {/*        type="radio"*/}
                    {/*        name="gender"*/}
                    {/*        value="male"*/}
                    {/*        checked={formData.gender === 'male'}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*      />*/}
                    {/*      <TextSexCustom>Male</TextSexCustom>*/}
                    {/*    </label>*/}
                    {/*    <label>*/}
                    {/*      <input*/}
                    {/*        type="radio"*/}
                    {/*        name="gender"*/}
                    {/*        value="female"*/}
                    {/*        checked={formData.gender === 'female'}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*      />*/}
                    {/*      <TextSexCustom>Female</TextSexCustom>*/}
                    {/*    </label>*/}
                    {/*  </CheckBoxGroup>*/}
                    {/*</FormField>*/}

                    <FormField>
                        <label>{t('user name')}</label>
                        <input
                            type="name"
                            name="name"
                            placeholder={t('enter email')}
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </FormField>

                    <FormField>
                        <label>{t('phone number')}</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder={t('enter phone number')}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </FormField>

                    <ButtonGroup>
                        <Button onClick={handleCancel}>{t('cancel')}</Button>
                        <Button primary onClick={handleSubmit}>
                            {t('submit')}
                        </Button>
                    </ButtonGroup>
                </ModalContent>
            </ModalOverlay>
        </>
    )
}

export default CreateUserModal