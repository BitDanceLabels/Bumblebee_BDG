import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const ButtonWrapper = styled.div``

export const Button = styled.button`
  padding: 16px 10px;
  background-color: #53c653;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.6;
  }
`

export const ExcelButton = styled(Button)`
  margin-right: 20px;
`

export const TicketButton = styled(Button)`
  background-color: orange;
  margin-right: 20px;
`

export const ViewTicketButton = styled(Button)`
  background-color: orange;
`

export const CancelButton = styled(Button)`
  background-color: red;
`

export const SubmitButton = styled(Button)``

export const Month = styled.h3`
  text-align: center;
  font-size: 20px;
`

export const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

export const CalendarHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 16px;
`

export const CalendarCell = styled.td`
  vertical-align: center;
  border: 1px solid #ddd;
  position: relative;
  padding: 5px;
  width: 150px; // Set fixed width
  height: 180px;
  font-size: 16px;
`

export const DayNumber = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.9em;
  font-weight: bold;
`

export const Event = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
`

export const InputCustom = styled.input`
  height: 50px;
  padding: 5px 10px;
  font-size: 16px;
`

export const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const CloseButton = styled(Button)`
  margin-left: auto;
  margin-top: 10px;
  background-color: #46b346;
  &:hover {
    background-color: #3fa139;
  }
`

export const SelectClass = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`

export const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  resize: none;
  height: 100px;
  margin-bottom: 20px;
`

export const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

export const TeacherSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 20px;
  outline: none;
  &:focus {
    border-color: #007bff;
  }
`

const LeftHeaderWrapper = styled.div``
