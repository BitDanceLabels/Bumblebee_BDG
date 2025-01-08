// Modal.js
import React from 'react'
import styled from 'styled-components'

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
`

const FormField = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`

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
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    opacity: 0.8;
  }
`

const CreateUserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>

        <FormField>
          <label>Name</label>
          <input type="text" placeholder="Enter name" />
        </FormField>

        <FormField>
          <label>Date Created</label>
          <input type="date" />
        </FormField>

        <FormField>
          <label>Role</label>
          <input type="text" placeholder="Enter role" />
        </FormField>

        <FormField>
          <label>Status</label>
          <input type="text" placeholder="Enter status" />
        </FormField>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={() => alert('Submitted!')}>
            Submit
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  )
}

export default CreateUserModal
