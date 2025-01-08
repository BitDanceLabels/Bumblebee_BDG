import styled from 'styled-components'
import {useTranslation} from "react-i18next";

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const ModalContainer = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
`

const ModalTitle = styled.h3`
    margin-bottom: 20px;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background: ${(props) => (props.primary ? '#007bff' : '#ddd')};
    color: ${(props) => (props.primary ? '#fff' : '#000')};

    &:focus {
        outline: none;
    }
`

// eslint-disable-next-line react/prop-types
const ConfirmUpdateStudentProfile = ({ isOpen, onClose, onConfirm, action }) => {
  const {t,} = useTranslation();
  if (!isOpen) return null

  return (
    <ModalBackdrop>
      <ModalContainer>
        <ModalTitle>{t('are you sure you want to')} {action}?</ModalTitle>
        <ButtonContainer>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button primary onClick={onConfirm}>{t('submit')}</Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackdrop>
  )
}

export default ConfirmUpdateStudentProfile
