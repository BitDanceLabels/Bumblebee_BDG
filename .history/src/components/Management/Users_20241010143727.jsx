import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaFileExport } from 'react-icons/fa'
import { IoMdPersonAdd } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import CreateUserModal from '../modal/CreateUserModal'
import DeactiveModal from '../modal/DeactiveModal'
import avt from '../../assets/avt.jpg'

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

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
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

const TextNameCustom = styled.text`
  margin-left: 20px;
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

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PAGE_SIZE = 50 // Number of users per page
const token = import.meta.env.VITE_TOKEN

const Users = () => {
  const [users, setUsers] = useState([]) // All users
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [paginatedUsers, setPaginatedUsers] = useState([]) // Users for current page

  const [isModalOpen, setModalOpen] = useState(false)
  const [isDeactiveModalOpen, setDeactiveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch user data from the API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Map the API data to the required format
        const formattedUsers = data.map((user) => ({
          id: user.user_id,
          name: user.username, // Mapping username to name
          dateCreated: '', // Leave empty
          role: user.role_group, // Mapping role_group to role
          status: '', // Leave empty
          avatar: avt // Use default avatar
        }))
        setUsers(formattedUsers) // Set all users
      })
      .catch((error) => console.error('Error fetching user data:', error))
  }, [])

  // Whenever users or currentPage changes, update the paginatedUsers for the current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const paginatedData = users.slice(startIndex, startIndex + PAGE_SIZE)
    setPaginatedUsers(paginatedData) // Set users for the current page
  }, [users, currentPage])

  const handleModalOpen = () => {
    setSelectedUser(null)
    setModalOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setDeactiveModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleDeactiveSubmit = () => {
    console.log('Deleting user:', selectedUser)
    setDeactiveModalOpen(false)
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(users.length / PAGE_SIZE)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
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
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          initialData={selectedUser}
        />
        <DeactiveModal
          isOpen={isDeactiveModalOpen}
          onClose={() => setDeactiveModalOpen(false)}
          onSubmit={handleDeactiveSubmit}
          student={selectedUser}
        />
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
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>
                  <ContentWrapper>
                    <img src={user.avatar} className="avatar" alt="Avatar" />{' '}
                    <TextNameCustom>{user.name}</TextNameCustom>
                  </ContentWrapper>
                </td>
                <td>{user.dateCreated}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="actions">
                  <EditIcon onClick={() => handleEditUser(user)}>
                    <CiEdit fontSize={20} />
                  </EditIcon>
                  <DeleteIcon onClick={() => handleDeleteUser(user)}>
                    <MdDelete fontSize={20} />
                  </DeleteIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        <Pagination>
          <span className="hint-text">
            Showing <b>{users.length}</b> out of <b>{PAGE_SIZE}</b> entries
          </span>
          <ul className="pagination">
            <li className={currentPage === 1 ? 'disabled' : ''}>
              <a
                href="#"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              >
                Previous
              </a>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                <a href="#" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </a>
              </li>
            ))}
            <li className={currentPage === totalPages ? 'disabled' : ''}>
              <a
                href="#"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              >
                Next
              </a>
            </li>
          </ul>
        </Pagination>
      </TableWrapper>
    </Container>
  )
}

export default Users
