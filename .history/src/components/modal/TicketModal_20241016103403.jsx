import React, { useState } from 'react'
import styled from 'styled-components'
import Loading from '../General/Loading'

// Styled components
const FullModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const FullModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  z-index: 999;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`

const SelectClass = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  resize: none;
  height: 100px;
  margin-bottom: 20px;
`

const Title = styled.textarea`
  padding: 10px;
  font-size: 16px;
  resize: none;
  height: 40px;
  margin-bottom: 20px;
`

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

const CancelButton = styled.button`
  padding: 16px 10px;
  background-color: red;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
  }
`

const SubmitButton = styled.button`
  padding: 16px 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
  }
`

const apiCreateTicket = import.meta.env.VITE_URL_CREATE_TICKET

const TicketModal = ({ show, events, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('defer')
  const [selectedClass, setSelectedClass] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fullData = JSON.parse(localStorage.getItem('fullData'))
  let token = ''
  if (!fullData) {
    console.log('Rỗng')
  } else {
    token = fullData.access_token
    console.log(token)
  }

  // Function to handle submit
  const handleSubmit = async () => {
    if (!title || !description || !status) {
      alert('Please fill in all required fields.')
      return
    }

    const data = {
      title: title,
      description: description,
      priority: null,
      status: 'Đang xử lý',
      class_id: 1,
      creator_id: 1,
      assignee_id: 1
    }

    try {
      setIsLoading(true)
      const response = await fetch(apiCreateTicket, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        onClose()
        setIsLoading(false)
      }
    } catch (error) {
      onClose()
      setIsLoading(false)
    }
  }

  // Create a set to hold unique classes based on code
  const uniqueClasses = new Set()

  Object.keys(events).forEach((day) => {
    events[day].forEach((event) => {
      const classInfo = `${event.code} - ${event.student}`
      uniqueClasses.add(classInfo) // Add the combination of code and student
    })
  })

  return (
    <>
      {isLoading && <Loading />}
      <FullModalOverlay show={show}>
        <FullModalWrapper>
          <ModalContent>
            <SelectClass
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="defer">Lỗi kỹ thuật học sinh</option>
              <option value="cancel">Lỗi kỹ thuật giáo viên</option>
              <option value="defer">Học viên chưa vào lớp</option>
              <option value="cancel">Thiếu tài liệu buổi học</option>
              <option value="defer">Nhắc nhở học sinh</option>
              <option value="cancel">Học sinh lệch lộ trình</option>
              <option value="defer">Lỗi sai về tài liệu</option>
              <option value="cancel">Phản hồi về tài liệu</option>
              <option value="defer">Lỗi sai thời khóa biểu</option>
              <option value="cancel">Thắc mắc về bảng lương</option>
              <option value="cancel">Đơn xin đổi giờ học</option>
            </SelectClass>

            <SelectClass
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="" disabled>
                Select a Class
              </option>
              {[...uniqueClasses].map((classInfo, index) => (
                <option key={index} value={classInfo}>
                  {classInfo}
                </option>
              ))}
            </SelectClass>

            <TextArea
              placeholder="Enter your reason"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <ModalButtonWrapper>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
            </ModalButtonWrapper>
          </ModalContent>
        </FullModalWrapper>
      </FullModalOverlay>
    </>
  )
}

export default TicketModal
