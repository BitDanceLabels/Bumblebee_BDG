import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import CreateStudentModal from '../modal/CreateStudentModal'
import DeactiveModal from '../modal/DeactiveModal'

Modal.setAppElement('#root')

const ListOfStudent = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([
    {
      no: 1,
      name: 'John Doe',
      phoneNumber: '123-456-789',
      id: 'S001',
      email: 'johndoe@example.com',
      course: 'Math',
      status: 'Active'
    },
    {
      no: 2,
      name: 'Jane Smith',
      phoneNumber: '987-654-321',
      id: 'S002',
      email: 'janesmith@example.com',
      course: 'Science',
      status: 'Inactive'
    },
    {
      no: 3,
      name: 'Michael Johnson',
      phoneNumber: '555-123-456',
      id: 'S003',
      email: 'michaelj@example.com',
      course: 'History',
      status: 'Active'
    }
  ])

  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isDeactiveModalOpen, setDeactiveModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [newStudent, setNewStudent] = useState({
    name: '',
    phoneNumber: '',
    id: '',
    email: '',
    course: '',
    status: 'Active'
  })

  const handleNameClick = (student) => {
    navigate('/student-profile', { state: { student } })
  }

  const handleCreateStudent = () => {
    setCreateModalOpen(true)
  }

  const handleCreateSubmit = () => {
    setStudents([...students, { no: students.length + 1, ...newStudent }])
    setCreateModalOpen(false)
  }

  const handleActivateClick = (student) => {
    setSelectedStudent(student)
    const updatedStudents = students.map((s) =>
      s.id === student.id ? { ...s, status: 'Active' } : s
    )
    setStudents(updatedStudents)
  }

  const handleDeactiveClick = (student) => {
    setSelectedStudent(student)
    setDeactiveModalOpen(true)
  }

  const handleDeactiveSubmit = () => {
    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? { ...student, status: 'Inactive' }
        : student
    )
    setStudents(updatedStudents)
    setDeactiveModalOpen(false)
  }

  return (
    <div>
      <Button onClick={handleCreateStudent}>Create Student</Button>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>PhoneNumber</th>
              <th>Id</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.no}</td>
                <td
                  className="name"
                  onClick={() => handleNameClick(student)}
                  style={{ cursor: 'pointer' }}
                >
                  {student.name}
                </td>
                <td>{student.phoneNumber}</td>
                <td>{student.id}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>
                  <StatusLabel status={student.status}>
                    {student.status}
                  </StatusLabel>
                </td>
                <td>
                  {student.status === 'Active' ? (
                    <Button onClick={() => handleDeactiveClick(student)}>
                      Deactive
                    </Button>
                  ) : (
                    <Button onClick={() => handleActivateClick(student)}>
                      Activate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {/* Modal for Creating a Student */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        formData={newStudent}
        setFormData={setNewStudent}
      />

      {/* Modal for Deactivating a Student */}
      <DeactiveModal
        isOpen={isDeactiveModalOpen}
        onClose={() => setDeactiveModalOpen(false)}
        onSubmit={handleDeactiveSubmit}
        student={selectedStudent}
      />
    </div>
  )
}

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`

const StatusLabel = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === 'Active' ? '#8BC34A' : '#F44336'};
`

const TableWrapper = styled.div`
  width: 100%;
  height: 400px;
  overflow-x: auto;
  overflow-y: auto;
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
    font-size: 16px;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #007bff;
    color: #fff;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #a52a2a;
    color: white;
  }

  tbody td.name {
    cursor: pointer;
  }

  tbody td.name:hover {
    color: #ff4500;
  }
`

export default ListOfStudent
