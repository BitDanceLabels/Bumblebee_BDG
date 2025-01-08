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

  const handleNameClick = (student) => {
    navigate('/student-profile', { state: { student } })
  }

  return (
    <div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
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
