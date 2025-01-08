import styled from 'styled-components'

// Wrapper for entire component
export const WrapperAll = styled.div`
  width: 100%;
`

// Container for the table
export const TableContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 500px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ddd;
  position: relative;
`

export const RedLine = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 1.2px;
  background-color: red;
  z-index: 1000;
  transition: left 1s linear;
`

export const Table = styled.table`
  width: 5000px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
`

export const TableHeader = styled.th`
  height: 50px;
  position: sticky;
  top: 0;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  z-index: 1;
`

export const StickyTableHeader = styled(TableHeader)`
  left: 0;
  z-index: 3;
  background: white;
`

export const StickyTableCell = styled.td`
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  border: 1px solid #ddd;
  white-space: nowrap;
  text-align: left;
  height: 50px;
`

export const TableCell = styled.td`
  height: 70px;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
  padding: 10px 0px;
`

export const ClassInfo = styled.div`
  background-color: ${(props) => props.color || '#ddd'};
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  width: ${(props) =>
    props.colSpanFraction ? `${props.colSpanFraction * 100}%` : '100%'};
  overflow: hidden;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
`

export const StatusLabel = styled.div`
  display: inline-block;
  background-color: ${(props) => props.color || '#ddd'};
  color: white;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 15px;
  font-size: 14px;
`

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const CustomDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    z-index: 1000;
  }
  .date-picker {
    text-align: center;
    height: 40px;
    border-radius: 5px;
    letter-spacing: 1px;
    width: 200px;
  }

  .react-datepicker-popper {
    z-index: 10;
  }

  /* Increase the size of the calendar */
  .react-datepicker {
    font-size: 16px; /* Adjust the font size */
    width: 313px; /* Adjust the width */
    height: auto; /* Allow the height to be flexible */
  }

  /* Customize the size of the individual day cells */
  .react-datepicker__day {
    width: 40px; /* Increase width */
    height: 40px; /* Increase height */
    line-height: 40px; /* Center text vertically */
  }

  /* Customize the size of the header and navigation */
  .react-datepicker__header {
    font-size: 12px; /* Adjust font size for header */
    padding-top: 10px; /* Adjust padding */
  }

  .react-datepicker__navigation {
    top: 15px; /* Adjust the position of navigation buttons */
  }
`

export const ViewButton = styled.button`
  padding: 10px 20px;
  margin: 0 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`
