import React, { useState } from 'react'
import styled from 'styled-components'
import StudentProfile from './StudentProfile'
import Modal from 'react-modal'

// Cấu hình Modal để có thể mở trên toàn bộ ứng dụng
Modal.setAppElement('#root')

const ListOfStudent = () => {
  const [selectedStudent, setSelectedStudent] = useState(null)
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

  // State cho modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [studentToDeactivate, setStudentToDeactivate] = useState(null)

  // State để lưu thông tin sinh viên mới
  const [newStudent, setNewStudent] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    course: '',
    status: 'Active'
  })

  const handleNameClick = (student) => {
    setSelectedStudent(student)
  }

  const handleCreateStudent = () => {
    setIsCreateModalOpen(true)
  }

  const handleDeactivate = (student) => {
    setStudentToDeactivate(student)
    setIsDeactivateModalOpen(true)
  }

  const handleCreateSubmit = () => {
    // Thực hiện thêm sinh viên mới vào danh sách
    setStudents([
      ...students,
      {
        ...newStudent,
        no: students.length + 1,
        id: `S00${students.length + 1}`
      }
    ])
    setIsCreateModalOpen(false)
    setNewStudent({
      name: '',
      phoneNumber: '',
      email: '',
      course: '',
      status: 'Active'
    })
  }

  const handleDeactivateSubmit = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentToDeactivate.id
          ? { ...student, status: 'Inactive' }
          : student
      )
    )
    setIsDeactivateModalOpen(false)
  }

  return (
    <div>
      {selectedStudent ? (
        <StudentProfile
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
        />
      ) : (
        <>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.no}</td>
                    <td
                      className="name"
                      onClick={() => handleNameClick(student)}
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
                      <Button
                        onClick={() => handleDeactivate(student)}
                        disabled={student.status === 'Inactive'}
                      >
                        Deactive
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </>
      )}

      {/* Modal tạo sinh viên */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Tạo Sinh Viên Mới"
      >
        <h2>Tạo Sinh Viên Mới</h2>
        <form>
          <label>Tên:</label>
          <input
            type="text"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
          <label>Số điện thoại:</label>
          <input
            type="text"
            value={newStudent.phoneNumber}
            onChange={(e) =>
              setNewStudent({ ...newStudent, phoneNumber: e.target.value })
            }
          />
          <label>Email:</label>
          <input
            type="email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
          />
          <label>Khóa học:</label>
          <input
            type="text"
            value={newStudent.course}
            onChange={(e) =>
              setNewStudent({ ...newStudent, course: e.target.value })
            }
          />
        </form>
        <Button onClick={handleCreateSubmit}>Submit</Button>
        <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
      </Modal>

      {/* Modal Deactive */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onRequestClose={() => setIsDeactivateModalOpen(false)}
        contentLabel="Xác nhận Deactive"
      >
        <h2>
          Are you sure you want to Deactivate {studentToDeactivate?.name}?
        </h2>
        <Button onClick={handleDeactivateSubmit}>Submit</Button>
        <Button onClick={() => setIsDeactivateModalOpen(false)}>Cancel</Button>
      </Modal>
    </div>
  )
}

const StatusLabel = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === 'Active' ? '#8BC34A' : '#F44336'};
`

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin: 10px 0;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
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
