import React, { useState } from 'react'
import styled from 'styled-components'
import { FaFileExport } from 'react-icons/fa'
import { IoMdPersonAdd } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'

// Styled components
const Container = styled.div`
  color: #566787;
  background: #f5f5f5;
  font-family: 'Varela Round', sans-serif;
  font-size: 13px;
`

const TableWrapper = styled.div`
  min-width: 1000px;
  background: #fff;
  padding: 20px 25px;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
`

const TableTitle = styled.div`
  padding: 16px 30px;
  background: #299be4;
  color: white;
  margin: -20px -25px 10px;
  border-radius: 3px 3px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 24px;
  }

  button {
    background-color: white;
    color: #566787;
    border: none;
    font-size: 13px;
    border-radius: 2px;
    padding: 8px 16px;
    margin-left: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  button:hover {
    background-color: #f2f2f2;
  }

  button i {
    margin-right: 5px;
  }
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th,
  td {
    padding: 12px 15px;
    border: 1px solid #e9e9e9;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f5f5f5;
  }

  tbody tr:nth-child(odd) {
    background-color: #fcfcfc;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }

  td i {
    font-size: 19px;
  }

  .status {
    font-size: 30px;
    line-height: 10px;
  }

  .text-success {
    color: #10c469;
  }

  .text-danger {
    color: #ff5b5b;
  }

  .text-warning {
    color: #ffc107;
  }

  .actions i {
    margin-right: 10px;
    cursor: pointer;
    opacity: 0.9;
  }

  .actions i:hover {
    color: #2196f3;
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  .hint-text {
    font-size: 13px;
  }

  .pagination {
    list-style: none;
    display: flex;
    margin: 0;
  }

  .pagination li {
    margin: 0 2px;
  }

  .pagination a {
    border: none;
    padding: 5px 10px;
    color: #999;
    cursor: pointer;
    font-size: 13px;
    border-radius: 2px;
    text-decoration: none;
  }

  .pagination a:hover {
    color: #666;
  }

  .pagination .active a {
    background-color: #03a9f4;
    color: white;
  }

  .pagination .disabled a {
    cursor: not-allowed;
  }
`

const TextCustom = styled.text`
  margin-left: 6px;
`

const EditIcon = styled.div`
  display: inline;
  cursor: pointer;
`
const DeleteIcon = styled.div`
  margin-left: 10px;
  display: inline;
  cursor: pointer;
`

// Component
const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Michael Holz',
      dateCreated: '04/10/2013',
      role: 'Admin',
      status: 'Active',
      avatar: '/examples/images/avatar/1.jpg'
    },
    {
      id: 2,
      name: 'Paula Wilson',
      dateCreated: '05/08/2014',
      role: 'Publisher',
      status: 'Active',
      avatar: '/examples/images/avatar/2.jpg'
    }
  ])

  const [isModalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  return (
    <Container>
      <TableWrapper>
        <TableTitle>
          <h2>User Management</h2>
          <div>
            <button onClick={handleModalOpen}>
              <IoMdPersonAdd fontSize={16} />
              <TextCustom>Add New User</TextCustom>
            </button>
            <button>
              <FaFileExport fontSize={16} />
              <TextCustom>Export to Excel</TextCustom>
            </button>
          </div>
        </TableTitle>
        <Modal isOpen={isModalOpen} onClose={handleModalClose} />
        <StyledTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date Created</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <a href="#">
                    <img src={user.avatar} className="avatar" alt="Avatar" />{' '}
                    {user.name}
                  </a>
                </td>
                <td>{user.dateCreated}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status text-${
                      user.status === 'Active' ? 'success' : 'danger'
                    }`}
                  >
                    &bull;
                  </span>{' '}
                  {user.status}
                </td>
                <td className="actions">
                  <EditIcon>
                    <CiEdit fontSize={20} />
                  </EditIcon>
                  <DeleteIcon>
                    <MdDelete fontSize={20} />
                  </DeleteIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        <Pagination>
          <span className="hint-text">
            Showing <b>5</b> out of <b>25</b> entries
          </span>
          <ul className="pagination">
            <li className="disabled">
              <a href="#">Previous</a>
            </li>
            <li className="active">
              <a href="#">1</a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li>
              <a href="#">4</a>
            </li>
            <li>
              <a href="#">Next</a>
            </li>
          </ul>
        </Pagination>
      </TableWrapper>
    </Container>
  )
}

export default Users
