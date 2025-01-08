import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`

const ModalContainer = styled.div`
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const DetailClassInfo = ({ isOpen, onClose, classInfo }) => {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ ...classInfo })

  // Calculate end time based on start time and duration
  useEffect(() => {
    const [hours, minutes] = formData.time.split(':')
    const start = new Date()
    start.setHours(parseInt(hours), parseInt(minutes))

    const end = new Date(start.getTime() + formData.duration * 60000)
    const endTime = end.toTimeString().split(':').slice(0, 2).join(':')

    setFormData((prevData) => ({ ...prevData, endTime }))
  }, [formData.time, formData.duration])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  if (!isOpen) return null

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>{editMode ? 'Edit Class Info' : 'Class Info'}</h2>
        {editMode ? (
          <>
            <label>
              <strong>Code:</strong>
              <Input
                name="code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Teacher:</strong>
              <Input
                name="teacher"
                value={formData.teacher}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Start Time:</strong>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </label>
            <p>
              <strong>End Time:</strong> {formData.endTime}
            </p>
            <label>
              <strong>Type:</strong>
              <Input
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </label>
          </>
        ) : (
          <>
            <p>
              <strong>Code:</strong> {formData.code}
            </p>
            <p>
              <strong>Teacher:</strong> {formData.teacher}
            </p>
            {/* <p>
              <strong>Start Time:</strong> {formData.time}
            </p> */}
            {/* <p>
              <strong>End Time:</strong> {formData.endTime}
            </p> */}
            <p>
              <strong>Type:</strong> {formData.type}
            </p>
          </>
        )}
        <EditButton onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Save' : 'Edit'}
        </EditButton>
      </ModalContainer>
    </ModalBackground>
  )
}

export default DetailClassInfo
