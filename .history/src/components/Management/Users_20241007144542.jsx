import React, { useState } from 'react'
import styled from 'styled-components'

const initialUsers = [
  {
    id: 1,
    firstName: 'Nguyen',
    lastName: 'Hung',
    email: 'hungpham@pec.edu.vn',
    phone: '0123456789',
    gender: 'Male',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    firstName: 'Le',
    lastName: 'Minh',
    email: 'minhle@gmail.com',
    phone: '0987654321',
    gender: 'Female',
    role: 'User',
    status: 'Inactive'
  }
]

const Users = () => {
  const [users, setUsers] = useState(initialUsers)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    role: 'User',
    status: 'Active'
  })
  const [editingUser, setEditingUser] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditingUser({
      ...editingUser,
      [name]: value
    })
  }

  const handleAddUser = () => {
    const newId = users.length ? users[users.length - 1].id + 1 : 1
    setUsers([...users, { ...newUser, id: newId }])
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Male',
      role: 'User',
      status: 'Active'
    })
  }

  const handleEditUser = (id) => {
    const user = users.find((u) => u.id === id)
    setEditingUser(user)
  }

  const handleSaveEditUser = () => {
    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    )
    setEditingUser(null)
  }

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <Container>
      <h1>User Management</h1>

      <UserList>
        {users.map((user) => (
          <UserCard key={user.id}>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            <Button onClick={() => handleEditUser(user.id)}>Edit</Button>
            <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
          </UserCard>
        ))}
      </UserList>

      <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>

      <Form>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={editingUser ? editingUser.firstName : newUser.firstName}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={editingUser ? editingUser.lastName : newUser.lastName}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={editingUser ? editingUser.email : newUser.email}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={editingUser ? editingUser.phone : newUser.phone}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        />
        <select
          name="gender"
          value={editingUser ? editingUser.gender : newUser.gender}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          name="role"
          value={editingUser ? editingUser.role : newUser.role}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          name="status"
          value={editingUser ? editingUser.status : newUser.status}
          onChange={editingUser ? handleEditInputChange : handleInputChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <Button onClick={editingUser ? handleSaveEditUser : handleAddUser}>
          {editingUser ? 'Save' : 'Add User'}
        </Button>
      </Form>
    </Container>
  )
}

const Container = styled.div`
  width: 80%;
  margin: 20px auto;
`

const UserList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`

const UserCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  select {
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`

const Button = styled.button`
  padding: 8px 12px;
  font-size: 1rem;
  background-color: #2d2e83;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #5051a3;
  }
`

export default Users
