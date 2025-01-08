import React, {useState, useEffect} from 'react'
import Loading from '../General/Loading'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import styled from 'styled-components'
import {FaFileExport} from 'react-icons/fa'
import {IoMdPersonAdd} from 'react-icons/io'
import {CiEdit} from 'react-icons/ci'
import {MdDelete} from 'react-icons/md'
import CreateUserModal from '~/components/modal/CreateUserModal.jsx'
import DeactivateModal from '~/components/modal/DeactivateModal.jsx'
import avt from '../../assets/avt.jpg'
import axios from 'axios'
import {useTranslation} from "react-i18next";

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
    max-height: 100vh;
    overflow-y: auto;
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

const TableWrapperBlock = styled.div`
    display: block;
    max-height: 70vh;
    overflow-y: auto;
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
        position: sticky;
        top: 0;
        z-index: 1;
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

const PAGE_SIZE = 50
const getUserAPI = import.meta.env.VITE_URL_GET_ALL_USERS

const Users = () => {
    const {t,} = useTranslation();
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [paginatedUsers, setPaginatedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [status, setStatus] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [isModalOpen, setModalOpen] = useState(false)
    const [isDeactiveModalOpen, setDeactiveModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [method, setMethod] = useState('POST')

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Rỗng')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    // Fetch user data from the API
    const fetchUserData = async () => {
        try {
            setIsLoading(true)

            const response = await axios.get(getUserAPI, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            const formattedUsers = response.data.map((user) => ({
                id: user.user_id,
                name: user.username,
                dateCreated: '',
                role: user.role_group,
                status: '',
                avatar: avt,
                password: user.password,
                phone: user.phone,
                full_name: user.full_name
            }))

            setUsers(formattedUsers)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching user data:', error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE
        const paginatedData = users.slice(startIndex, startIndex + PAGE_SIZE)
        setPaginatedUsers(paginatedData)
    }, [users, currentPage])

    const handleModalOpen = () => {
        setSelectedUser(null)
        setModalOpen(true)
        setMethod('POST')
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setMethod('PUT')
        setModalOpen(true)
    }

    const handleDeleteUser = (user) => {
        setSelectedUser(user)
        setDeactiveModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleUserCreated = () => {
        fetchUserData()
    }

    const handleDeactiveSubmit = async () => {
        console.log('Deleting user:', selectedUser)
        try {
            setIsLoading(true)

            const response = await axios.delete(`${getUserAPI}${selectedUser.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                console.log('User deleted successfully')
                setDeactiveModalOpen(false)
                setIsLoading(false)
                setStatus('success')
                setMessage('User deleted successfully!')
                setTimeout(() => {
                    setStatus(null)
                }, 2000)
                fetchUserData()
            }
        } catch (error) {
            setDeactiveModalOpen(false)
            setIsLoading(false)
            setStatus('error')
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
            setTimeout(() => {
                setStatus(null)
            }, 2000)
        }
    }

    // Calculate total number of pages
    const totalPages = Math.ceil(users.length / PAGE_SIZE)

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!status}
                onClose={() => setStatus(null)}
                message={message}
                status={status}
            />
            <Container>
                <TableWrapper>
                    <TableTitle>
                        <h2>{t('user management')}</h2>
                        <div>
                            <button onClick={handleModalOpen}>
                                <IoMdPersonAdd fontSize={16}/>
                                <TextCustom>{t('add new user')}</TextCustom>
                            </button>
                            <button>
                                <FaFileExport fontSize={16}/>
                                <TextCustom>{t('export to excel')}</TextCustom>
                            </button>
                        </div>
                    </TableTitle>
                    <CreateUserModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        onUserCreated={handleUserCreated}
                        initialData={selectedUser}
                        method={method}
                    />
                    <DeactivateModal
                        isOpen={isDeactiveModalOpen}
                        onClose={() => setDeactiveModalOpen(false)}
                        onSubmit={handleDeactiveSubmit}
                        student={selectedUser}
                    />
                    <TableWrapperBlock>
                        <StyledTable>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>{t('user name')}</th>
                                <th>{t('information')}</th>
                                <th>{t('role')}</th>
                                <th>{t('password')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                    <td>
                                        <ContentWrapper>
                                            <img
                                                src={user.avatar}
                                                className="avatar"
                                                alt="Avatar"
                                            />{' '}
                                            <TextNameCustom>{user.name}</TextNameCustom>
                                        </ContentWrapper>
                                    </td>
                                    <td> Phone : {user.phone} ; Full_name : {user.full_name} </td>
                                    <td>{user.role}</td>
                                    <td>{user.password}</td>
                                    <td className="actions">
                                        <EditIcon onClick={() => handleEditUser(user)}>
                                            <CiEdit fontSize={20}/>
                                        </EditIcon>
                                        <DeleteIcon onClick={() => handleDeleteUser(user)}>
                                            <MdDelete fontSize={20}/>
                                        </DeleteIcon>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </StyledTable>
                    </TableWrapperBlock>
                    <Pagination>
            <span className="hint-text">
              {t('showing')} <b>{paginatedUsers.length}</b> {t('out of')}{' '}
                <b>{users.length}</b> {t('entries')}
            </span>
                        <ul className="pagination">
                            <li className={currentPage === 1 ? 'disabled' : ''}>
                                <a
                                    href="#"
                                    onClick={() =>
                                        currentPage > 1 && handlePageChange(currentPage - 1)
                                    }
                                >
                                    {t('previous')}
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
                                        currentPage < totalPages &&
                                        handlePageChange(currentPage + 1)
                                    }
                                >
                                    {t('next')}
                                </a>
                            </li>
                        </ul>
                    </Pagination>
                </TableWrapper>
            </Container>
        </>
    )
}

export default Users
