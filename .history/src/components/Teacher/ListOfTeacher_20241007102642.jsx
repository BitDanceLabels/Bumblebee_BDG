import React, { useState } from 'react'
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

const sampleDataWorking = [
  // Dữ liệu giáo viên đang làm việc
]

const sampleDataStopped = [
  // Dữ liệu giáo viên đã dừng làm việc
]

const ListOfTeacher = () => {
  const [activeTab, setActiveTab] = useState('Working')
  const [isModalOpen, setIsModalOpen] = useState(false)
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
          data={sampleDataWorking}
          handleTeacherClick={handleTeacherClick}
          handleActionClick={handleActionClick}
          actionType="Deactive"
        />
      )}

      {activeTab === 'Stopped' && (
        <TeacherTable
          data={sampleDataStopped}
          handleTeacherClick={handleTeacherClick}
          handleActionClick={handleActionClick}
          actionType="Activate"
        />
      )}
    </Container>
  )
}

export default ListOfTeacher
