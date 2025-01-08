import React, { useState } from 'react'
import styled from 'styled-components'

// Styled components
const CoursesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const CourseCard = styled.div`
  width: calc(33.3333% - 20px);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const CourseImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`

const CourseContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
`

const CourseTitle = styled.h3`
  font-size: 1.2em;
  margin: 0;
  font-weight: bold;
`

const CourseDescription = styled.p`
  font-size: 0.9em;
  color: #555;
  margin-top: 8px;
  margin-bottom: 8px;
`

const CourseFooter = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Progress = styled.span`
  font-size: 0.9em;
  color: ${(props) => (props.progress === 0 ? '#007BFF' : '#28a745')};
  font-weight: bold;
`

const MoreOptions = styled.span`
  cursor: pointer;
  font-size: 1.5em;
  color: #999;
`

const courses = [
  {
    id: 1,
    title: 'Cac cong nghe phan mem moi_ Nhom 06CLC',
    description: '2024-2025 Học Kỳ 1 - Đại Học Chính Quy',
    image: 'https://via.placeholder.com/300',
    progress: '0% complete'
  },
  {
    id: 2,
    title: 'Chuyen de Doanh nghiep_ Nhom 02CLC',
    description: '2024-2025 Học Kỳ 1 - Đại Học Chính Quy',
    image: 'https://via.placeholder.com/300',
    progress: ''
  },
  {
    id: 3,
    title: 'Kiem thu phan mem_ Nhom 08CLC',
    description: '2024-2025 Học Kỳ 1 - Đại Học Chính Quy',
    image: 'https://via.placeholder.com/300',
    progress: '0% complete'
  },
  {
    id: 4,
    title: 'Lập trình di động nâng cao_01CLC_ST5_PM1.2',
    description: '2024-2025 Học Kỳ 1 - Đại Học Chính Quy',
    image: 'https://via.placeholder.com/300',
    progress: '20% complete'
  }
]

const Courses = () => {
  return (
    <CoursesContainer>
      {courses.map((course) => (
        <CourseCard key={course.id}>
          <CourseImage src={course.image} alt={course.title} />
          <CourseContent>
            <CourseTitle>{course.title}</CourseTitle>
            <CourseDescription>{course.description}</CourseDescription>
          </CourseContent>
          <CourseFooter>
            <Progress progress={course.progress.includes('0') ? 0 : 1}>
              {course.progress || 'Chưa hoàn thành'}
            </Progress>
            <MoreOptions>⋮</MoreOptions>
          </CourseFooter>
        </CourseCard>
      ))}
    </CoursesContainer>
  )
}

export default Courses
