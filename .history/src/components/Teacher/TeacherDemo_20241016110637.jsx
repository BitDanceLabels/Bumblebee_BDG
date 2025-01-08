import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CreateTeacherModal from '../modal/CreateTeacherModal'
import TeacherDemoTable from './TeacherDemoTable'
import Loading from '../General/Loading'

const Container = styled.div`
  background: #f7f7ff;
  font-size: 20px;
  padding: 20px;
`

const CreateButton = styled.button`
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #218838;
  }
`

const TeacherDemo = () => {
  const [teachers, setTeachers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl =
    import.meta.env.VITE_URL_GET_ALL_TEACHER ||
    'http://127.0.0.1:8000/api/teachers/'

  // Hàm để lấy dữ liệu từ API
  const handleGetAll = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTeachers(data)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        alert(`Failed to fetch teachers: ${response.statusText}`)
      }
    } catch (error) {
      setIsLoading(false)
      alert(`Error: ${error.message}`)
    }
  }

  // Gọi API chỉ một lần khi component được render lần đầu
  useEffect(() => {
    handleGetAll()
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  })

  const navigate = useNavigate()

  const handleCreateTeacher = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    setIsModalOpen(false)
    console.log('Form data:', formData)
  }

  const handleTeacherClick = (teacher) => {
    navigate('/teacher-profile', { state: { teacher } })
  }

  const handleActionClick = (teacher) => {
    // Xử lý action khi click vào Activate/Deactivate
    console.log(`Action on teacher: ${teacher.name}`)
    // Thực hiện logic "activate" hoặc "deactivate" tại đây
  }

  return (
    <>
      {isLoading && <Loading />}

      <Container>
        <CreateButton onClick={handleCreateTeacher}>
          Create Teacher
        </CreateButton>
        <CreateTeacherModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Hiển thị luôn danh sách TeacherTable */}
        <TeacherDemoTable
          data={teachers}
          handleTeacherClick={handleTeacherClick}
          handleActionClick={handleActionClick}
          actionType="Action" // Bạn có thể đổi tên actionType này nếu cần
        />
      </Container>
    </>
  )
}

export default TeacherDemo
