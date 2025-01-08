import { useState } from 'react'
import styled from 'styled-components'

const Modal = styled.div`
    display: ${(props) => (props.show ? 'block' : 'none')};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    width: 400px;
`

const ModalTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
  color: #333;
`

const ComboBox = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

const ModalButton = styled.button`
    background-color: ${(props) => (props.primary ? '#4CAF50' : '#f44336')};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: ${(props) => (props.primary ? '#45a049' : '#d32f2f')};
    }
`

// eslint-disable-next-line react/prop-types
const ClassUpdateBookingModal = ({ show, onClose, onSubmit, classInfo, teachers }) => {
  // eslint-disable-next-line react/prop-types
  const [selectedClass, setSelectedClass] = useState(classInfo.code) // Use prop
  // eslint-disable-next-line react/prop-types
  const [selectedTeacher, setSelectedTeacher] = useState(classInfo.teacher) // Use prop

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value)
  }

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value)
  }

  return (
    <Modal show={show}>
      <ModalTitle>Chỉnh sửa thông tin lớp học</ModalTitle>

      {/* Combobox chọn lớp */}
      <ComboBox value={selectedClass} onChange={handleClassChange}>
        {/* eslint-disable-next-line react/prop-types */}
        <option value={classInfo.code}>
          {/* eslint-disable-next-line react/prop-types */}
          {classInfo.code} - {classInfo.name}
        </option>
      </ComboBox>

      {/* Combobox chọn giáo viên */}
      <ComboBox value={selectedTeacher} onChange={handleTeacherChange}>
        {/* eslint-disable-next-line react/prop-types */}
        {teachers.map((teacher, index) => (
          <option key={index} value={teacher.name}>
            {teacher.name}
          </option>
        ))}
      </ComboBox>

      <ButtonContainer>
        <ModalButton onClick={onClose}>Cancel</ModalButton>
        <ModalButton primary onClick={onSubmit}>
          Submit
        </ModalButton>
      </ButtonContainer>
    </Modal>
  )
}

export default ClassUpdateBookingModal
