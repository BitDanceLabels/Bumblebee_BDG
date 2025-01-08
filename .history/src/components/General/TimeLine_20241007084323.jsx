import React from 'react'
import styled from 'styled-components'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
`

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 40px;
  margin-bottom: 20px;
  height: 60px;
  width: 100%;
`

const TimelineDot = styled.div`
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlusIcon = styled(FaPlus)`
  color: white;
  font-size: 12px;
`

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const DateLabel = styled.div`
  font-size: 12px;
  color: #adb5bd;
  margin-bottom: 5px;
`

const TitleLabel = styled.h4`
  font-size: 16px;
  margin: 0;
  cursor: pointer;
`

const Divider = styled.div`
  height: 2px;
  width: 2px;
  background-color: #e9ecef;
  margin: 5px 0;
  border-radius: 50%;
`

const StatusBadge = styled.span`
  background-color: ${(props) =>
    props.status === 'Doing' ? '#28a745' : '#6c757d'};
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  margin-left: auto;
`

const Timeline = () => {
  const navigate = useNavigate()
  const data = [
    {
      date: '06 Sep 2024',
      title: 'Everybody up - Lvl 3,4 (Khóa 1)',
      status: 'Doing'
    },
    { date: '22 May 2024', title: 'TRIAL2405023', status: 'End' },
    { date: '15 Jan 2024', title: 'Beginner Course - Lvl 1,2', status: 'End' },
    {
      date: '10 Dec 2023',
      title: 'Intermediate Course - Lvl 2,3',
      status: 'Doing'
    }
  ]

  const handleTitleClick = () => {
    navigate('/booking') // Điều hướng tới trang booking
  }

  return (
    <TimelineContainer>
      {data.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineDot>
            <PlusIcon />
          </TimelineDot>
          <TimelineContent>
            <DateLabel>{item.date}</DateLabel>
            <TitleLabel onClick={handleTitleClick}>{item.title}</TitleLabel>
          </TimelineContent>
          <StatusBadge status={item.status}>{item.status}</StatusBadge>
          {index < data.length - 1 && <Divider />}
        </TimelineItem>
      ))}
    </TimelineContainer>
  )
}

export default Timeline
