import React from 'react'
import styled from 'styled-components'

// Styled components
const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  background-color: #fff;
  padding: 10px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

const Th = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f4f4f4;
  text-align: left;
`

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`

const Button = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #ffc107;
  color: #fff;
  border: none;
  border-radius: 3px;
`

const ListTicketReviewed = () => {
  // Dữ liệu mẫu
  const tickets = [
    {
      id: 1,
      ticketName: 'Math Exam',
      className: 'Grade 10',
      teacherName: 'Mr. Smith',
      goingDateTime: '2024-10-10 10:00 AM',
      ticketStatus: 'Approved',
      reason: 'Giáo viên bị bệnh'
    },
    {
      id: 2,
      ticketName: 'Science Quiz',
      className: 'Grade 12',
      teacherName: 'Ms. Johnson',
      goingDateTime: '2024-10-11 11:00 AM',
      ticketStatus: 'Rejected',
      reason: 'Học sinh bận'
    }
  ]

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Ticket Name</Th>
            <Th>Class Name</Th>
            <Th>Teacher Name</Th>
            <Th>Going DateTime</Th>
            <Th>Ticket Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketName}>
              <Td>{ticket.ticketName}</Td>
              <Td>{ticket.className}</Td>
              <Td>{ticket.teacherName}</Td>
              <Td>{ticket.goingDateTime}</Td>
              <Td>{ticket.ticketStatus}</Td>
              <Td>
                <Button onClick={() => alert('Reverted')}>Revert</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default ListTicketReviewed
