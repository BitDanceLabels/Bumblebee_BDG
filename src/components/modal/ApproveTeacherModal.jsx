import styled from 'styled-components'
import { useTranslation } from "react-i18next";

const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    z-index: 1000;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`

const Button = styled.button`
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
`

const CancelButton = styled(Button)`
    background-color: #dc3545;
    color: white;
    font-weight: bold;

    &:hover {
        background-color: #c82333;
    }
`

const SubmitButton = styled(Button)`
    background-color: #28a745;
    color: white;
    font-weight: bold;

    &:hover {
        background-color: #218838;
    }
`

const ButtonWrapper = styled.div`
    text-align: right;
    margin-top: 2rem;
`

// eslint-disable-next-line react/prop-types
const ApproveTeacherModal = ({ isOpen, onClose, onSubmit }) => {
    const { t, } = useTranslation();
    if (!isOpen) return null

    return (
        <>
            <Overlay onClick={onClose} />
            <ModalContainer>
                <h3>{t('are you sure you want to approved this ticket')}?</h3>
                <ButtonWrapper>
                    <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
                    <SubmitButton onClick={onSubmit}>{t('submit')}</SubmitButton>
                </ButtonWrapper>
            </ModalContainer>
        </>
    )
}

export default ApproveTeacherModal
