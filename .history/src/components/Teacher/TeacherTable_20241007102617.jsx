import React from 'react'
import styled from 'styled-components'

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

const TeacherTable = ({
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
          <th>Start Date</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((teacher, index) => (
          <tr key={index}>
            <td
              onClick={() => handleTeacherClick(teacher)}
              style={{ cursor: 'pointer' }}
            >
              {teacher.name}
            </td>
            <td>{teacher.id}</td>
            <td>{teacher.start}</td>
            <td>{teacher.description}</td>
            <td>
              <ActionButton
                actionType={actionType}
                onClick={() => handleActionClick(teacher)}
              >
                {actionType}
              </ActionButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TeacherTable
