// Modal.js
import React, { useState } from 'react'
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
  display: flex;
  align-items: center;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`

const CheckBoxGroup = styled.div`
  display: flex;
  justify-content: space-around;

  label {
    font-weight: normal;
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
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    gender: '',
    email: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = () => {
    console.log('Form Data:', formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>

        <FormField>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </FormField>

        <FormField>
          <label>Gender</label>
          <CheckBoxGroup>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
              />
              Female
            </label>
          </CheckBoxGroup>
        </FormField>

        <FormField>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </FormField>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSubmit}>
            Submit
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  )
}

export default CreateUserModal
