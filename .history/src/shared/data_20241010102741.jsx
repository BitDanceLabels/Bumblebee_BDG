export const rolePermissions = {
  admin: {
    teacher: ['teacher', 'teacher-register', 'teacher-timetable'],
    student: ['students'],
    booking: ['booking', 'ticket', 'users'],
    classes: ['classes']
  },
  teacher: {
    teacher: ['teacher-register', 'teacher-timetable']
  },
  student: {
    student: ['listOfStudent']
  }
}
