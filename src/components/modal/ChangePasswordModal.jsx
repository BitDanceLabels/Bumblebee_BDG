import {useState, useRef} from 'react'
import styled from 'styled-components'
import Loading from '~/components/General/Loading.jsx'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useTranslation} from "react-i18next";

// eslint-disable-next-line react/prop-types
const ChangePasswordModal = ({isOpen, onClose}) => {
    const {t,} = useTranslation();
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [countdown, setCountdown] = useState(10)
    const countdownInterval = useRef(null)
    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_URL_GET_ALL_USERS
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    const passwordOld = localStorage.getItem('password')
    let token = ''
    let userId = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        userId = fullData.user_id
    }

    const handleSubmit = async () => {
        if (oldPassword === passwordOld && newPassword === confirmNewPassword) {
            try {
                setIsLoading(true)

                const response = await axios.put(
                    `${apiUrl}${userId}`,
                    {password: newPassword},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.status !== 200) {
                    setIsLoading(false)
                    setErrorMessage(t('failed to change password. please try again'))
                    return
                }
                setIsLoading(false)
                setIsSuccess(true)
                countdownInterval.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev === 1) {
                            clearInterval(countdownInterval.current)
                            handleRedirect()
                        }
                        return prev - 1
                    })
                }, 1000)
            } catch (error) {
                console.error('Error during API call:', error)
                setIsLoading(false)
                setErrorMessage(t('error during API call. please try again'))
            }
        } else {
            setErrorMessage(t('old password is incorrect or new password does not match confirm password'))
        }
    }

    const handleStayLoggedIn = () => {
        setIsSuccess(false)
        clearInterval(countdownInterval.current)
        setCountdown(10)
    }

    const handleRedirect = () => {
        localStorage.clear()
        navigate('/login')
    }

    if (!isOpen) {
        return null
    }

    return (
        <>
            {isLoading && <Loading/>}
            <ModalWrapper>
                <ModalContent>
                    <h2>Change Password</h2>
                    <SubTitleCustom>{t('old password')}</SubTitleCustom>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <SubTitleCustom>{t('new password')}</SubTitleCustom>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <SubTitleCustom>{t('confirm new password')}</SubTitleCustom>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <ButtonContainer>
                        <button onClick={onClose}>{t('cancel')}</button>
                        <button onClick={handleSubmit}>{t('submit')}</button>
                    </ButtonContainer>
                </ModalContent>
            </ModalWrapper>

            {isSuccess && (
                <ModalWrapper>
                    <SuccessModal>
                        <h2>{t('password changed successfully')}</h2>
                        <p>{t('your password has been changed. you will be redirected to the login page in')}
                            <strong>{countdown}</strong> {t('seconds')}.</p>
                        <StayLoggedInButton onClick={handleStayLoggedIn}>{t('stay login')}</StayLoggedInButton>
                        <StyledButton onClick={handleRedirect}>{t('OK')}</StyledButton>
                    </SuccessModal>
                </ModalWrapper>
            )}
        </>
    )
}

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

const ModalContent = styled.div`
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 320px;
    max-width: 90%;
    text-align: center;

    h2 {
        margin-bottom: 20px;
        font-size: 1.6rem;
    }

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`

const SuccessModal = styled.div`
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 350px;
    max-width: 90%;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    h2 {
        margin-bottom: 15px;
        font-size: 1.8rem;
        color: #2d2e83;
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }

    strong {
        font-weight: bold;
        color: #e74c3c;
    }
`

const StyledButton = styled.button`
    background: #2d2e83;
    color: white;
    padding: 10px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background 0.3s ease;

    &:hover {
        background: #1a1b66;
    }
`

const StayLoggedInButton = styled(StyledButton)`
    background: #28a745;
    margin-top: 10px;
    margin-right: 10px;
    font-weight: bold;

    &:hover {
        background: #218838;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;

        &:hover {
            opacity: 0.8;
        }

        &:first-child {
            background: #ccc;
        }

        &:last-child {
            background: #2d2e83;
            color: white;
        }
    }
`

const SubTitleCustom = styled.h3`
    font-size: 1.4rem;
    text-align: left;
    margin-bottom: 5px;
`

const ErrorMessage = styled.p`
    color: red;
    font-style: italic;
    margin-top: 5px;
    margin-bottom: 15px;
    text-align: left;
    font-size: 1.2rem;
`

export default ChangePasswordModal
