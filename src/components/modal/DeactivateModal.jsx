import Modal from 'react-modal'
import styled from 'styled-components'
import {useTranslation} from "react-i18next";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 20px;
  font-size: 20px;
  z-index: 1;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
`

const ModalTitle = styled.h5`
  margin: 0;
  font-size: 20px;
`

const ModalBody = styled.div`
  margin: 20px 0;
  padding: 10px 0;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
`

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;

    ${(props) =>
            props.primary
                    ? `
      background-color: #007bff;
      color: white;
      &:hover {
        background-color: #0056b3;
      }
    `
                    : `
      background-color: #6c757d;
      color: white;
      &:hover {
        background-color: #5a6268;
      `}
`

// eslint-disable-next-line react/prop-types
const DeactivateModal = ({ isOpen, onClose, onSubmit, student }) => {
  const {t,} = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px',
          border: 'none',
          width: 'auto',
          maxWidth: '500px',
          position: 'none'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('deactivate student')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {/* eslint-disable-next-line react/prop-types */}
          <p>{t('are you sure you want to deactivate')} {student?.name}?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>{t('close')}</Button>
          <Button primary onClick={onSubmit}>
            {t('submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeactivateModal