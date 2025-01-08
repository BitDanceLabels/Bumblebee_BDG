import React, { useState } from 'react'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import styled from 'styled-components'

const TimeRangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

const TimeLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 200px;
`

const TimeRangeComponent = () => {
  // State lưu trữ khung giờ (bắt đầu và kết thúc)
  const [timeRange, setTimeRange] = useState([4, 24])

  // Hàm để chuyển đổi giá trị số thành khung giờ định dạng HH:MM
  const formatTime = (value) => {
    const hours = Math.floor(value)
    const minutes = (value % 1) * 60
    return `${hours.toString().padStart(2, '0')}:${
      minutes === 0 ? '00' : minutes
    }`
  }

  return (
    <TimeRangeWrapper>
      {/* Label hiển thị thời gian */}
      <TimeLabel>
        <span>{formatTime(timeRange[0])}</span>
        <span>{formatTime(timeRange[1])}</span>
      </TimeLabel>

      {/* Range slider */}
      <Range
        min={0} // Tối thiểu 00:00
        max={24} // Tối đa 24:00
        step={0.5} // Bước nhảy mỗi 30 phút (0.5 giờ)
        defaultValue={timeRange}
        allowCross={false}
        onChange={(value) => setTimeRange(value)}
        trackStyle={[{ backgroundColor: 'blue', height: 5 }]}
        handleStyle={[
          { borderColor: 'blue', height: 20, width: 20 },
          { borderColor: 'blue', height: 20, width: 20 }
        ]}
      />
    </TimeRangeWrapper>
  )
}

export default TimeRangeComponent
