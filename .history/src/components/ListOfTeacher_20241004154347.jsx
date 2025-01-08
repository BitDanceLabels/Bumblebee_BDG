import React, { useState } from 'react'
import styled from 'styled-components'
import TeacherTabs from './TeacherTabs'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  background: #f7f7ff;
  font-size: 20px;
  padding: 20px;
`

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`

const Tab = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: ${(props) => (props.active ? '#007bff' : '#f7f7ff')};
  color: ${(props) => (props.active ? '#fff' : '#000')};
  font-size: 16px;
  border-radius: 5px 5px 0 0;
  margin-right: 5px;
  &:focus {
    outline: none;
  }
`

const CreateButton = styled.button`
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #218838;
  }
`

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

const sampleDataWorking = [
  {
    name: 'Lendelen Bensi (Lendy)',
    id: 'T96693',
    start: '02/10/2024',
    description:
      'Nice, easy-going, and energetic. Easily distracted, not detail...',
    weekday: {
      mon: '08:00 - 21:30',
      tue: '08:00 - 21:30',
      wed: '08:00 - 21:30',
      thu: '08:00 - 21:30',
      fri: '08:00 - 21:30'
    },
    weekend: {
      sat: '08:00 - 21:30',
      sun: ''
    }
  },
  {
    name: 'Jesty Jennica Kaye',
    id: 'T90715',
    start: '02/10/2024',
    description: 'Energetic, sometimes overreacts...',
    weekday: {
      mon: '17:00 - 21:30',
      tue: '17:00 - 21:30',
      wed: '17:00 - 21:30',
      thu: '17:00 - 21:30',
      fri: '17:00 - 21:30'
    },
    weekend: {
      sat: '07:00 - 11:00, 13:00 - 17:00',
      sun: '07:00 - 11:00'
    }
  }
]

const sampleDataStopped = [
  {
    name: 'Nina Marcela',
    id: 'T12345',
    start: '01/01/2023',
    description:
      'Calm, analytical, and detail-oriented. Recently stopped work.',
    weekday: {
      mon: '08:00 - 17:00',
      tue: '08:00 - 17:00',
      wed: '08:00 - 17:00',
      thu: '08:00 - 17:00',
      fri: '08:00 - 17:00'
    },
    weekend: {
      sat: 'Closed',
      sun: 'Closed'
    }
  },
  {
    name: 'David Jackson',
    id: 'T67890',
    start: '15/05/2023',
    description: 'Hardworking but had to stop due to personal reasons.',
    weekday: {
      mon: '09:00 - 18:00',
      tue: '09:00 - 18:00',
      wed: '09:00 - 18:00',
      thu: '09:00 - 18:00',
      fri: '09:00 - 18:00'
    },
    weekend: {
      sat: '09:00 - 12:00',
      sun: 'Closed'
    }
  }
]

const ListOfTeacher = () => {
  const [activeTab, setActiveTab] = useState('Working')
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher)
  }

  const navigate = useNavigate()

  React.useEffect(() => {
    if (selectedTeacher) {
      navigate('/teacher-profile', { state: { teacher: selectedTeacher } })
    }
  }, [selectedTeacher, navigate])

  const handleCreateTeacher = () => {
    navigate('/create-teacher')
  }

  return (
    <Container>
      <CreateButton onClick={handleCreateTeacher}>Create Teacher</CreateButton>
      <TabContainer>
        <Tab
          active={activeTab === 'Working'}
          onClick={() => setActiveTab('Working')}
        >
          Working
        </Tab>
        <Tab
          active={activeTab === 'Stopped'}
          onClick={() => setActiveTab('Stopped')}
        >
          Stopped
        </Tab>
      </TabContainer>

      {activeTab === 'Working' && (
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
              {sampleDataWorking.map((person, index) => (
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
      )}

      {activeTab === 'Stopped' && (
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
              {sampleDataStopped.map((person, index) => (
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
      )}
    </Container>
  )
}

export default ListOfTeacher
