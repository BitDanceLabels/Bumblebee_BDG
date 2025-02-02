import styled from 'styled-components'

export const WrapperAll = styled.div`
    width: 100%;
`

// Container for the table
export const TableContainer = styled.div`
    width: 100%;
    max-width: 100vw;
    height: 70vh;
    overflow-x: auto;
    overflow-y: auto;
    border: 1px solid #ddd;
    position: relative;
`

export const RedLine = styled.div`
    position: absolute;
    top: 0;
    width: 1.5px;
    background-color: red;
    z-index: 5;
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
    z-index: 15;
    background: white;
`

export const StickyTableCell = styled.td`
    position: sticky;
    left: 0;
    background: white;
    z-index: 12;
    border: 1px solid #ddd;
    white-space: nowrap;
    text-align: left;
    height: 100px;
`

export const TableCell = styled.td`
    height: 80px;
    text-align: left;
    border: 1px solid #ddd;
    white-space: nowrap;
    padding: 10px 0;
    position: relative;
`

export const ClassInfo = styled.div`
    background-color: ${(props) => props.color || '#ddd'};
    color: white;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.5;
    position: relative;
    z-index: 10; // Higher than RedLine
    left: ${(props) => props.left || '0px'};
    width: ${(props) => props.width || '100px'};
    cursor: pointer;

    &::before,
    &::after {
        display: block;
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100%);
        height: 15px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        z-index: 10;
        cursor: none;
    }

    &::before {
        top: -15px;
    }

    &::after {
        bottom: -15px;
    }
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
        z-index: 1;
    }

    .react-datepicker-popper {
        z-index: 1001;
    }

    .date-picker {
        text-align: center;
        height: 40px;
        border-radius: 5px;
        letter-spacing: 1px;
        width: 200px;
        cursor: pointer;
    }

    .react-datepicker {
        font-size: 12px;
    }

    .react-datepicker__header {
        font-size: 12px;
    }

    .react-datepicker__day,
    .react-datepicker__day-name {
        width: 32px;
        height: 32px;
        line-height: 32px;
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

// New component for AvailableTimeSlot
export const AvailableTimeSlot = styled.div`
    position: absolute;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: brown;
    opacity: 0.3;
    left: ${(props) => props.left || '0px'};
    width: ${(props) => props.width || '100px'};
    height: 100px;
    z-index: 1;
    cursor: pointer;
`