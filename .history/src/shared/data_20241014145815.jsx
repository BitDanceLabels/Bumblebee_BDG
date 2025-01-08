export const rolePermissions = {
  admin: {
    teacher: [
      'teacher',
      'teacher-register',
      'teacher-timetable',
      'teacher-profile'
    ],
    student: ['student', 'student-profile', 'course-info'],
    booking: ['booking', 'ticket', 'users'],
    classes: ['announcement', 'classes', 'class-schedule', '']
  },
  teacher: {
    classes: ['announcement', ''],
    teacher: ['teacher-register', 'teacher-timetable', 'teacher-profile']
  },
  student: {
    classes: ['announcement', ''],
    student: ['student-profile']
  }
}

export const timeslots = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00'
]

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export const cm_teachers = [
  {
    name: 'Giáo viên A',
    availableTimes: ['7-9', '13-16', '20-21'], // Khung giờ dạy được
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
    availableTimes: ['9-12', '14-17'],
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
    availableTimes: ['7-8', '12-14', '19-21'],
    schedule: {
      '07:30': {
        code: 'D34201',
        teacher: 'Phạm Văn C',
        duration: 60,
        type: 3
      },
      '19:00': {
        code: 'E45321',
        teacher: 'Phạm Văn C',
        duration: 90,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên D',
    availableTimes: ['8-11', '13-15'],
    schedule: {
      '10:00': {
        code: 'F56232',
        teacher: 'Lê Thị D',
        duration: 45,
        type: 4
      }
    }
  },
  {
    name: 'Giáo viên E',
    availableTimes: ['10-12', '15-17'],
    schedule: {
      '11:00': {
        code: 'G63412',
        teacher: 'Nguyễn Thị E',
        duration: 60,
        type: 2
      },
      '16:00': {
        code: 'H75621',
        teacher: 'Nguyễn Thị E',
        duration: 45,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên F',
    availableTimes: ['8-10', '14-18', '19-20'],
    schedule: {
      '09:00': {
        code: 'I87645',
        teacher: 'Trần Văn F',
        duration: 30,
        type: 3
      },
      '15:30': {
        code: 'J98021',
        teacher: 'Trần Văn F',
        duration: 90,
        type: 1
      }
    }
  },
  {
    name: 'Giáo viên G',
    availableTimes: ['6-9', '18-21'],
    schedule: {
      '07:00': {
        code: 'K10982',
        teacher: 'Phạm Thị G',
        duration: 60,
        type: 2
      },
      '19:30': {
        code: 'L23094',
        teacher: 'Phạm Thị G',
        duration: 90,
        type: 4
      }
    }
  },
  {
    name: 'Giáo viên H',
    availableTimes: ['9-11', '13-16'],
    schedule: {
      '09:30': {
        code: 'M34981',
        teacher: 'Nguyễn Văn H',
        duration: 45,
        type: 5
      }
    }
  },
  {
    name: 'Giáo viên I',
    availableTimes: ['6-8', '17-19'],
    schedule: {
      '06:30': {
        code: 'N45023',
        teacher: 'Trần Thị I',
        duration: 60,
        type: 1
      },
      '18:00': {
        code: 'O56104',
        teacher: 'Trần Thị I',
        duration: 60,
        type: 2
      }
    }
  },
  {
    name: 'Giáo viên J',
    availableTimes: ['8-10', '16-18'],
    schedule: {
      '08:30': {
        code: 'P67012',
        teacher: 'Lê Văn J',
        duration: 45,
        type: 4
      }
    }
  }
]

export const db_teachers = [
  {
    name: 'Giáo viên A',
    schedule: {
      '08:15': {
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
      '13:30': { code: 'D34201', teacher: 'Phạm Văn C', duration: 60, type: 3 }
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
