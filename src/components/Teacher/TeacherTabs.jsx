import { useState } from 'react'
import styled from 'styled-components'
import TeacherProfile from './TeacherProfile'
import Salary from './Salary'
import { useLocation } from 'react-router-dom'
import {useTranslation} from "react-i18next";

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
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    margin-right: 5px;

    &:focus {
        outline: none;
    }
`

const SalaryTab = () => {
  return <Salary />
}

const TeacherProfileTab = () => {
  return <TeacherProfile />
}

// eslint-disable-next-line no-empty-pattern
const TeacherTabs = ({}) => {
  const {t,} = useTranslation();
  const [activeTab, setActiveTab] = useState('profile')
  const location = useLocation()
  const { teacher } = location.state || {}
  console.log(teacher)

  return (
    <Container>
      <TabContainer>
        <Tab
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        >
          {t('teacher profile')}
        </Tab>
        <Tab
          active={activeTab === 'salary'}
          onClick={() => setActiveTab('salary')}
        >
          {t('salary')}
        </Tab>
      </TabContainer>

      {activeTab === 'profile' && <TeacherProfileTab />}
      {activeTab === 'salary' && <SalaryTab />}
    </Container>
  )
}

export default TeacherTabs
