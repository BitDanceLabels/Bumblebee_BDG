// import React, { useState } from 'react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CreateTeacherModal from '../modal/CreateTeacherModal'
import TeacherTable from './TeacherTable'

const Container = styled.div`
  background: #f7f7ff;
  font-size: 20px;
  padding: 20px;
`

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`

const Tab = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: ${(props) => (props.active ? '#007bff' : '#f7f7ff')};
  color: ${(props) => (props.active ? '#fff' : '#000')};
  font-size: 16px;
  border-radius: 5px 5px 0 0;
  margin-right: 5px;
  &:focus {
    outline: none;
  }
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

const ListOfTeacher = () => {
  const [activeTab, setActiveTab] = useState('Working')

  const [teachers, setTeachers] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  // URL lấy dữ liệu giáo viên
  const apiUrl =
    import.meta.env.VITE_URL_GET_ALL_TEACHER ||
    'http://127.0.0.1:8000/api/teachers/'
  // Hàm để lấy dữ liệu từ API
  const handleGetAll = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTeachers(data) // Cập nhật state `teachers` với dữ liệu mới từ API
      } else {
        alert(`Failed to fetch teachers: ${response.statusText}`)
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  // Gọi hàm `handleGetAll` khi `activeTab` thay đổi
  useEffect(() => {
    handleGetAll()
  }, [activeTab])

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
    if (activeTab === 'Working') {
      console.log(`Deactivating teacher: ${teacher.name}`)
      // Thực hiện logic "deactivate" tại đây
    } else {
      console.log(`Activating teacher: ${teacher.name}`)
      // Thực hiện logic "activate" tại đây
    }
  }

  return (
    <Container>
      <CreateButton onClick={handleCreateTeacher}>Create Teacher</CreateButton>
      <CreateTeacherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
      <TabContainer>
        <Tab
          active={activeTab === 'Working'}
          onClick={() => setActiveTab('Working')}
        >
          Working
        </Tab>
        <Tab
          active={activeTab === 'Stopped'}
          onClick={() => setActiveTab('Stopped')}
        >
          Stopped
        </Tab>
      </TabContainer>

      {activeTab === 'Working' && (
        <TeacherTable
          // data={sampleDataWorking} //dữ liệu được get từ bảng TeacherTable
          data={teachers} // Truyền dữ liệu giáo viên vào bảng
          handleTeacherClick={handleTeacherClick}
          handleActionClick={handleActionClick}
          actionType="Deactive"
        />
      )}

      {activeTab === 'Stopped' && (
        <TeacherTable
          // data={sampleDataStopped}
          data={teachers} // Truyền dữ liệu giáo viên vào bảng
          handleTeacherClick={handleTeacherClick}
          handleActionClick={handleActionClick}
          actionType="Activate"
        />
      )}
    </Container>
  )
}

export default ListOfTeacher
