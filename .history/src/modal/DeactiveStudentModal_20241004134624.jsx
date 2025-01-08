import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  font-size: 20px;
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
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
      }
    `}
`

const DeactiveStudentModal = ({ isOpen, onClose, onSubmit, student }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          width: '400px',
          height: '220px',
          margin: 'auto',
          padding: '0px',
          borderRadius: '10px',
          border: 'none'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Deactivate Student</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            &times;
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to deactivate {student?.name}?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          <Button primary onClick={onSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeactiveStudentModal
