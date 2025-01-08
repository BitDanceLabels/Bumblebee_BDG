import { rolePermissions } from './data'

export const generateTimeslots = (startTime, endTime, step) => {
  const timeslots = []
  let currentHour = startTime
  let currentMinute = 0

  while (
    currentHour < endTime ||
    (currentHour === endTime && currentMinute === 0)
  ) {
    const hour = currentHour.toString().padStart(2, '0')
    const minute = currentMinute.toString().padStart(2, '0')
    timeslots.push(`${hour}:${minute}`)

    currentMinute += step
    if (currentMinute >= 60) {
      currentMinute = 0
      currentHour++
    }
  }
  return timeslots
}

// Calculate the colspan based on class duration
export const calculateColSpan = (duration) => {
  const timeslotDuration = 30
  return duration / timeslotDuration
}

// Map class type to color
export const getClassColor = (type) => {
  switch (type) {
    case 1:
      return '#6b8e23' // Trial
    case 2:
      return '#1e90ff' // Regular
    case 3:
      return '#ffd700' // Bonus
    case 4:
      return '#ff4500' // Deferred
    case 5:
      return '#dc143c' // Cancelled
    default:
      return '#ddd' // Default color
  }
}

// Calculate the current time position for the red line
export const calculateCurrentTimePosition = () => {
  const currentTime = new Date()
  const currentHours = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  const currentTotalMinutes = currentHours * 60 + currentMinutes
  const startTime = 7 * 60 // 07:00
  const endTime = 23 * 60 + 30 // 23:30

  if (currentTotalMinutes < startTime || currentTotalMinutes > endTime) {
    return null
  }

  const totalTableMinutes = endTime - startTime
  const timePassedMinutes = currentTotalMinutes - startTime
  const positionPercent = ((timePassedMinutes + 10) / totalTableMinutes) * 100

  return positionPercent
}

export const teachers = [
  {
    name: 'Giáo viên A',
    schedule: {
      '08:00': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên B',
    schedule: {
      '09:00': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 2
      }
    }
  },
  {
    name: 'Giáo viên C',
    schedule: {
      '07:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 3 },
      '11:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 3 }
    }
  },
  {
    name: 'Giáo viên D',
    schedule: {
      '08:00': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 4
      }
    }
  },
  {
    name: 'Giáo viên E',
    schedule: {
      '09:30': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 5
      }
    }
  },
  {
    name: 'Giáo viên F',
    schedule: {
      '10:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 2 }
    }
  },
  {
    name: 'Giáo viên G',
    schedule: {
      '08:30': {
        code: 'B96018',
        teacher: 'Trần Thị Thùy Dung',
        duration: 45,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên H',
    schedule: {
      '10:00': {
        code: 'C10245',
        teacher: 'Nguyễn Văn B',
        duration: 30,
        type: 3
      }
    }
  },
  {
    name: 'Giáo viên J',
    schedule: {
      '07:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 4 }
    }
  }
]

export const hasAccess = (role, parentItem, childItem) => {
  const permissions = rolePermissions[role]
  if (!permissions) return false

  if (childItem) {
    return permissions[parentItem]?.includes(childItem)
  }

  return Boolean(permissions[parentItem])
}
