import React from 'react'
import styled from 'styled-components'
import { FaFileExport } from 'react-icons/fa'

// Styled components
const Container = styled.div`
  color: #566787;
  background: #f5f5f5;
  font-family: 'Varela Round', sans-serif;
  font-size: 13px;
  margin: 30px 0;
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

// Component
const Users = () => {
  return (
    <Container>
      <TableWrapper>
        <TableTitle>
          <h2>User Management</h2>
          <div>
            <button>
              <i className="material-icons">&#xE147;</i> Add New User
            </button>
            <button>
              <FaFileExport /> Export to Excel
            </button>
          </div>
        </TableTitle>
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
            <tr>
              <td>1</td>
              <td>
                <a href="#">
                  <img
                    src="/examples/images/avatar/1.jpg"
                    className="avatar"
                    alt="Avatar"
                  />{' '}
                  Michael Holz
                </a>
              </td>
              <td>04/10/2013</td>
              <td>Admin</td>
              <td>
                <span className="status text-success">&bull;</span> Active
              </td>
              <td className="actions">
                <i className="material-icons settings" title="Settings">
                  &#xE8B8;
                </i>
                <i className="material-icons delete" title="Delete">
                  &#xE5C9;
                </i>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <a href="#">
                  <img
                    src="/examples/images/avatar/2.jpg"
                    className="avatar"
                    alt="Avatar"
                  />{' '}
                  Paula Wilson
                </a>
              </td>
              <td>05/08/2014</td>
              <td>Publisher</td>
              <td>
                <span className="status text-success">&bull;</span> Active
              </td>
              <td className="actions">
                <i className="material-icons settings" title="Settings">
                  &#xE8B8;
                </i>
                <i className="material-icons delete" title="Delete">
                  &#xE5C9;
                </i>
              </td>
            </tr>
            {/* Thêm các hàng khác tương tự */}
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
