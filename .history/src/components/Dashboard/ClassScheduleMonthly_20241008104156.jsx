import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

// Styled components
const Container = styled.div`
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
`

const InputCustom = styled.input`
  height: 50px;
  padding: 5px 10px;
  font-size: 16px;
`

const SearchInput = styled.input`
  width: 300px;
  height: 40px;
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  &:focus {
    border: 1px solid #53c653;
  }
`

const TagSuggestions = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`

const Tag = styled.span`
  background-color: ${(props) => (props.active ? '#53c653' : '#ddd')};
  color: white;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  display: block;
  &:hover {
    background-color: #46b346;
  }
`

const Button = styled.button`
  padding: 16px 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #46b346;
  }
`

const Month = styled.h3`
  text-align: center;
`

const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

const CalendarHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  text-align: center;
`

const CalendarCell = styled.td`
  vertical-align: center;
  border: 1px solid #ddd;
  position: relative;
  padding: 5px;
  width: 150px;
  height: 180px;
  font-size: 16px;
`

const ClassScheduleMonthly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestedTags, setSuggestedTags] = useState([
    'Trần Thị Thùy Dung',
    'Nguyễn Văn B',
    'Phạm Văn C',
    'Lê Thị Hương',
    'All Teachers'
  ])
  const [filteredTags, setFilteredTags] = useState([])
  const [activeTag, setActiveTag] = useState('')
  const cellRef = useRef(null)

  // Lọc các thẻ tag dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm === '') {
      // Nếu ô tìm kiếm trống, không hiển thị gợi ý
      setFilteredTags([])
    } else {
      const filtered = suggestedTags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTags(filtered)
    }
  }, [searchTerm, suggestedTags])

  const getCurrentMonth = () => {
    const year = selectedDate.getFullYear()
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
    return `${year}-${month}`
  }

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-')
    setSelectedDate(new Date(year, month - 1, 1))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleTagClick = (tag) => {
    setSearchTerm(tag)
    setActiveTag(tag)
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const generateCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    let calendar = []
    let week = []
    let dayCounter = 1

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(<CalendarCell key={`empty-${i}`} />)
    }

    while (dayCounter <= daysInMonth) {
      for (let i = week.length; i < 7; i++) {
        if (dayCounter <= daysInMonth) {
          week.push(
            <CalendarCell key={dayCounter} ref={cellRef}>
              <div>{dayCounter}</div>
            </CalendarCell>
          )
          dayCounter++
        } else {
          week.push(<CalendarCell key={`empty-${i}`} />)
        }
      }
      calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>)
      week = []
    }

    return calendar
  }

  return (
    <Container>
      <Header>
        <div>
          <InputCustom
            type="month"
            value={getCurrentMonth()}
            onChange={handleMonthChange}
          />
        </div>

        {/* Thêm ô tìm kiếm và thẻ tag gợi ý */}
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="Search teacher by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {/* Chỉ hiển thị danh sách gợi ý khi có từ khóa nhập vào */}
          {filteredTags.length > 0 && (
            <TagSuggestions>
              {filteredTags.map((tag, index) => (
                <Tag
                  key={index}
                  active={tag === activeTag}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </TagSuggestions>
          )}
        </SearchWrapper>

        <Button>Export Schedule (Excel)</Button>
      </Header>
      <Month>
        {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
        {selectedDate.getFullYear()}
      </Month>
      <CalendarTable>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <CalendarHeader key={day}>{day}</CalendarHeader>
            ))}
          </tr>
        </thead>
        <tbody>{generateCalendar()}</tbody>
      </CalendarTable>
    </Container>
  )
}

export default ClassScheduleMonthly
