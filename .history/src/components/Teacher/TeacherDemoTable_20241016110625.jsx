import React from 'react'
import styled from 'styled-components'

// Định nghĩa các styled components cho bảng
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #007bff;
    color: white;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #007bff;
    color: white;
  }
`

const ActionButton = styled.button`
  padding: 5px 10px;
  background-color: ${(props) =>
    props.actionType === 'Activate' ? '#28a745' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.actionType === 'Activate' ? '#218838' : '#c82333'};
  }
`

const TeacherDemoTable = ({
  data,
  handleTeacherClick,
  handleActionClick,
  actionType
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Contact Info</th> {/* Gộp thông tin liên lạc vào một cột */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((teacher, index) => (
            <tr key={index}>
              <td
                onClick={() => handleTeacherClick(teacher)}
                style={{ cursor: 'pointer' }}
              >
                {teacher.full_name}
              </td>
              <td>{teacher.teacher_id}</td>
              {/* Gộp thông tin liên lạc trong một dòng */}
              <td>
                {teacher.phone_number && (
                  <span>📞 {teacher.phone_number} | </span>
                )}
                {teacher.email && <span>📧 {teacher.email} | </span>}
                {teacher.telegram && <span>💬 {teacher.telegram} | </span>}
                {teacher.gender && <span>👤 {teacher.gender} | </span>}
                {teacher.role_group && <span>🏷️ {teacher.role_group}</span>}
              </td>
              <td>
                <ActionButton
                  actionType={actionType}
                  onClick={() => handleActionClick(teacher)}
                >
                  {actionType}
                </ActionButton>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>
              No Data Available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default TeacherDemoTable
