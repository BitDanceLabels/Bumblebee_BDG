import {rolePermissions} from './data'

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
    const startTime = 6 * 60
    const endTime = 23 * 60 + 30

    if (currentTotalMinutes < startTime || currentTotalMinutes > endTime) {
        return null
    }

    const timePassedMinutes = currentTotalMinutes - startTime
    return ((timePassedMinutes) / 30 + 1) * 135.11
}

export const hasAccess = (role, parentItem, childItem) => {
    const permissions = rolePermissions[role]
    if (!permissions) return false

    if (childItem) {
        return permissions[parentItem]?.includes(childItem)
    }

    return Boolean(permissions[parentItem])
}
