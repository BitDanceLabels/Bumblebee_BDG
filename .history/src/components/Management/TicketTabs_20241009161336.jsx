import React, { useState } from 'react'
import styled from 'styled-components'
import ListTicketUnReview from './ListTicketUnReview'
import ListTicketReviewed from './ListTicketReviewed'
import { useLocation } from 'react-router-dom'

// Styled components
const Container = styled.div`
  background: #f7f7ff;
  font-size: 20px;
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

const ListTicketUnReviewTab = () => {
  return <ListTicketUnReview />
}

const ListTicketReviewedTab = () => {
  return <ListTicketReviewed />
}

const TicketTabs = ({}) => {
  const [activeTab, setActiveTab] = useState('ListTicketUnReviewed')
  const location = useLocation()
  const { teacher } = location.state || {}

  useEffect(() => {
    // Lấy URL API từ biến môi trường
    const API_URL =
      process.env.VITE_URL_GET_ALL_USERS || 'http://127.0.0.1:8000/api/users/'

    // Gọi API khi component render lần đầu
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Dữ liệu từ API:', data)
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error)
      })
  }, []) // Chỉ chạy 1 lần khi component được render

  // console.log(teacher)

  return (
    <Container>
      <TabContainer>
        <Tab
          active={activeTab === 'ListTicketUnReviewed'}
          onClick={() => setActiveTab('ListTicketUnReviewed')}
        >
          Unreview
        </Tab>
        <Tab
          active={activeTab === 'ListTicketReviewed'}
          onClick={() => setActiveTab('ListTicketReviewed')}
        >
          Reviewed
        </Tab>
      </TabContainer>

      {activeTab === 'ListTicketUnReviewed' && <ListTicketUnReviewTab />}
      {activeTab === 'ListTicketReviewed' && <ListTicketReviewedTab />}
    </Container>
  )
}

export default TicketTabs
