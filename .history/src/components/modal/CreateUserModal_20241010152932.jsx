// Modal.js
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Loading from '../General/Loading'

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
    flex: 2;
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

const CheckBoxGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 10;

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

const TextSexCustom = styled.text`
  margin-left: 6px;
`

const token = import.meta.env.VITE_TOKEN
const getUserAPI = import.meta.env.VITE_URL_GET_ALL_USERS

const CreateUserModal = ({ isOpen, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    gender: '',
    email: '',
    phone: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  // Sử dụng useEffect để cập nhật formData khi initialData có giá trị
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.role) {
      alert('Please fill in all required fields.')
      return
    }

    const requestBody = {
      username: formData.name,
      password: '123456', // Default password
      role_group: formData.role
    }

    try {
      setIsLoading(true)
      const response = await fetch(getUserAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        console.log('User created successfully')
        onClose() // Call the function to close the modal and refresh users
      } else {
        const errorData = await response.json()
        console.error('Error creating user:', errorData)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {isLoading && <Loading />}{' '}
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
                <TextSexCustom>Male</TextSexCustom>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                />
                <TextSexCustom>Female</TextSexCustom>
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
    </>
  )
}

export default CreateUserModal
