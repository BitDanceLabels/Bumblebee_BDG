import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`

const NotificationSection = styled.div`
  margin-bottom: 40px;
`

const NotificationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`

const NotificationItem = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
`

const SeeMoreButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

// Notification Data
const hotNewsData = [
  { id: 1, title: 'Hot News 1' },
  { id: 2, title: 'Hot News 2' },
  { id: 3, title: 'Hot News 3' },
  { id: 4, title: 'Hot News 4' },
  { id: 5, title: 'Hot News 5' },
  { id: 6, title: 'Hot News 6' },
  { id: 7, title: 'Hot News 7' }
]

const announcementData = [
  { id: 1, title: 'Announcement 1' },
  { id: 2, title: 'Announcement 2' },
  { id: 3, title: 'Announcement 3' },
  { id: 4, title: 'Announcement 4' },
  { id: 5, title: 'Announcement 5' },
  { id: 6, title: 'Announcement 6' },
  { id: 7, title: 'Announcement 7' }
]

// Main Component
const AnnouncementComponent = () => {
  const [hotNewsLimit, setHotNewsLimit] = useState(6)
  const [announcementLimit, setAnnouncementLimit] = useState(6)

  const showMoreHotNews = () => {
    setHotNewsLimit(hotNewsLimit + 3)
  }

  const showMoreAnnouncement = () => {
    setAnnouncementLimit(announcementLimit + 3)
  }

  return (
    <Container>
      <NotificationSection>
        <SectionTitle>Hot News</SectionTitle>
        <NotificationGrid>
          {hotNewsData.slice(0, hotNewsLimit).map((news) => (
            <NotificationItem key={news.id}>{news.title}</NotificationItem>
          ))}
        </NotificationGrid>
        {hotNewsLimit < hotNewsData.length && (
          <SeeMoreButton onClick={showMoreHotNews}>See More</SeeMoreButton>
        )}
      </NotificationSection>

      <NotificationSection>
        <SectionTitle>Announcement</SectionTitle>
        <NotificationGrid>
          {announcementData.slice(0, announcementLimit).map((announcement) => (
            <NotificationItem key={announcement.id}>
              {announcement.title}
            </NotificationItem>
          ))}
        </NotificationGrid>
        {announcementLimit < announcementData.length && (
          <SeeMoreButton onClick={showMoreAnnouncement}>See More</SeeMoreButton>
        )}
      </NotificationSection>
    </Container>
  )
}

export default AnnouncementComponent
