import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'

// Cấu hình Modal để có thể mở trên toàn bộ ứng dụng
Modal.setAppElement('#root')

const ListOfStudent = () => {
  const navigate = useNavigate() // Sử dụng navigate để điều hướng
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
                  <Button onClick={() => handleDeactiveClick(student)}>
                    Deactive
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {/* Modal for Creating a Student */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
      >
        <h2>Create Student</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              value={newStudent.phoneNumber}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phoneNumber: e.target.value })
              }
            />
          </label>
          <label>
            ID:
            <input
              type="text"
              value={newStudent.id}
              onChange={(e) =>
                setNewStudent({ ...newStudent, id: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
            />
          </label>
          <label>
            Course:
            <input
              type="text"
              value={newStudent.course}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course: e.target.value })
              }
            />
          </label>
          <button type="button" onClick={handleCreateSubmit}>
            Submit
          </button>
          <button type="button" onClick={() => setCreateModalOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>

      {/* Modal for Deactivating a Student */}
      <Modal
        isOpen={isDeactiveModalOpen}
        onRequestClose={() => setDeactiveModalOpen(false)}
      >
        <h2>Are you sure you want to deactivate {selectedStudent?.name}?</h2>
        <button type="button" onClick={handleDeactiveSubmit}>
          Submit
        </button>
        <button type="button" onClick={() => setDeactiveModalOpen(false)}>
          Cancel
        </button>
      </Modal>
    </div>
  )
}

const Button = styled.button`
  padding: 10px 15px;
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

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
