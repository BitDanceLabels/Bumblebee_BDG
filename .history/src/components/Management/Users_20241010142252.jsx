import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaFileExport } from 'react-icons/fa'
import { IoMdPersonAdd } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import CreateUserModal from '../modal/CreateUserModal'
import DeactiveModal from '../modal/DeactiveModal'
import avt from '../../assets/avt.jpg'

// Styled components (same as your current code)

const Users = () => {
  const [users, setUsers] = useState([]) // Initialize as an empty array
  const [isModalOpen, setModalOpen] = useState(false)
  const [isDeactiveModalOpen, setDeactiveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch user data from the API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_TOKEN' // Replace with your actual token
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
        setUsers(formattedUsers)
      })
      .catch((error) => console.error('Error fetching user data:', error))
  }, [])

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
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
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
            Showing <b>{users.length}</b> out of <b>{users.length}</b> entries
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
