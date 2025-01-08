import React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
  max-width: 100%;
  max-height: 400px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-top: 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
`

const Th = styled.th`
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: left;
`

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  line-height: 1.5;
`

const TeacherName = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const TeacherTable = ({ data, handleTeacherClick }) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>No.</Th>
            <Th>Name</Th>
            <Th>Weekday</Th>
            <Th>Weekend</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((person, index) => (
            <tr key={person.id}>
              <Td>{index + 1}</Td>
              <Td>
                <TeacherName onClick={() => handleTeacherClick(person)}>
                  <strong>{person.name}</strong>
                </TeacherName>
                <br />
                {person.id}
                <br />
                Start: {person.start}
                <br />
                {person.description}
              </Td>
              <Td>
                {Object.entries(person.weekday).map(([day, time]) => (
                  <div key={day}>
                    {day.toUpperCase()}: {time}
                  </div>
                ))}
              </Td>
              <Td>
                {Object.entries(person.weekend).map(([day, time]) => (
                  <div key={day}>
                    {day.toUpperCase()}: {time}
                  </div>
                ))}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default TeacherTable
