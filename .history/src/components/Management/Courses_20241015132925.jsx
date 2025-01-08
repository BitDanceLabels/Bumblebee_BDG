// Courses.js
import React from 'react'
import styled from 'styled-components'

// Styled components
const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`

const CourseItem = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const CourseImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-right: 1px solid #ddd;
`

const CourseContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const CourseTitle = styled.h3`
  font-size: 1.5em;
  margin: 0;
`

const CourseDescription = styled.p`
  font-size: 1em;
  color: #555;
`

// Data for courses (You can fetch this from an API)
const courses = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Learn the basics of React.js and how to create components.',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    title: 'Advanced React',
    description:
      'Dive deeper into React.js hooks, context API, and performance optimization.',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    title: 'Node.js for Beginners',
    description: 'Understand how to create backend services with Node.js.',
    image: 'https://via.placeholder.com/150'
  }
]

// Courses component
const Courses = () => {
  return (
    <CoursesContainer>
      {courses.map((course) => (
        <CourseItem key={course.id}>
          <CourseImage src={course.image} alt={course.title} />
          <CourseContent>
            <CourseTitle>{course.title}</CourseTitle>
            <CourseDescription>{course.description}</CourseDescription>
          </CourseContent>
        </CourseItem>
      ))}
    </CoursesContainer>
  )
}

export default Courses
