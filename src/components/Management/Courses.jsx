// Courses.js
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom' // Import useNavigate

// Styled components
const CoursesContainer = styled.div`
  padding: 20px;
`

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const TabButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? '#007BFF' : 'transparent')};
  background-color: ${(props) => (props.active ? '#F0F0F0' : '#FFF')};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};

  &:hover {
    background-color: #e0e0e0;
  }
`

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CourseItem = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
  font-size: 2rem;
`

const CourseDescription = styled.p`
  font-size: 1.5rem;
  color: #555;
  margin-top: 1.5rem;
`

// Data for courses (You can fetch this from an API)
const courses = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Learn the basics of React.js and how to create components.',
    image: 'https://via.placeholder.com/150',
    status: 'ongoing'
  },
  {
    id: 2,
    title: 'Advanced React',
    description:
      'Dive deeper into React.js hooks, context API, and performance optimization.',
    image: 'https://via.placeholder.com/150',
    status: 'ongoing'
  },
  {
    id: 3,
    title: 'Node.js for Beginners',
    description: 'Understand how to create backend services with Node.js.',
    image: 'https://via.placeholder.com/150',
    status: 'completed'
  }
]

// Courses component
const Courses = () => {
  const [activeTab, setActiveTab] = useState('ongoing')
  const navigate = useNavigate()

  // Filter courses based on the active tab
  const filteredCourses = courses.filter(
    (course) => course.status === activeTab
  )

  // Handle course item click
  const handleCourseClick = (courseId) => {
    // Navigate to the classes-of-course page with courseId as a parameter
    navigate(`/classes-of-course?courseId=${courseId}`)
  }

  return (
    <CoursesContainer>
      <TabContainer>
        <TabButton
          active={activeTab === 'ongoing'}
          onClick={() => setActiveTab('ongoing')}
        >
          Khóa học đang diễn ra
        </TabButton>
        <TabButton
          active={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
        >
          Khóa học đã kết thúc
        </TabButton>
      </TabContainer>

      <CourseList>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseItem
              key={course.id}
              onClick={() => handleCourseClick(course.id)} // Add click handler
            >
              <CourseImage src={course.image} alt={course.title} />
              <CourseContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDescription>{course.description}</CourseDescription>
              </CourseContent>
            </CourseItem>
          ))
        ) : (
          <p>Không có khóa học nào trong danh mục này.</p>
        )}
      </CourseList>
    </CoursesContainer>
  )
}

export default Courses
