import {useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from "react-i18next";

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

const NotificationImage = styled.img`
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 8px;
`

const NotificationTitle = styled.h3`
    font-size: 18px;
    margin-bottom: 10px;
`

const NotificationContent = styled.p`
    font-size: 14px;
    color: #666;
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

const hotNewsData = [
    {
        id: 1,
        title: 'Hot News 1',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Hot News 1.'
    },
    {
        id: 2,
        title: 'Hot News 2',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Hot News 2.'
    },
    {
        id: 3,
        title: 'Hot News 3',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Hot News 3.'
    }
    // ...more items
]

const announcementData = [
    {
        id: 1,
        title: 'Announcement 1',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Announcement 1.'
    },
    {
        id: 2,
        title: 'Announcement 2',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Announcement 2.'
    },
    {
        id: 3,
        title: 'Announcement 3',
        image: 'https://via.placeholder.com/150',
        content: 'This is the content for Announcement 3.'
    }
    // ...more items
]

// Main Component
const AnnouncementComponent = () => {
    const [hotNewsLimit, setHotNewsLimit] = useState(6)
    const [announcementLimit, setAnnouncementLimit] = useState(6)
    const {t} = useTranslation();

    const showMoreHotNews = () => {
        setHotNewsLimit(hotNewsLimit + 3)
    }

    const showMoreAnnouncement = () => {
        setAnnouncementLimit(announcementLimit + 3)
    }

    return (
        <Container>
            <NotificationSection>
                <SectionTitle>{t('hot news')}</SectionTitle>
                <NotificationGrid>
                    {hotNewsData.slice(0, hotNewsLimit).map((news) => (
                        <NotificationItem key={news.id}>
                            <NotificationTitle>{news.title}</NotificationTitle>
                            <NotificationImage src={news.image} alt={news.title}/>
                            <NotificationContent>{news.content}</NotificationContent>
                        </NotificationItem>
                    ))}
                </NotificationGrid>
                {hotNewsLimit < hotNewsData.length && (
                    <SeeMoreButton onClick={showMoreHotNews}>See More</SeeMoreButton>
                )}
            </NotificationSection>

            <NotificationSection>
                <SectionTitle>{t('daily news')}</SectionTitle>
                <NotificationGrid>
                    {announcementData.slice(0, announcementLimit).map((announcement) => (
                        <NotificationItem key={announcement.id}>
                            <NotificationTitle>{announcement.title}</NotificationTitle>
                            <NotificationImage
                                src={announcement.image}
                                alt={announcement.title}
                            />
                            <NotificationContent>{announcement.content}</NotificationContent>
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

// abc
