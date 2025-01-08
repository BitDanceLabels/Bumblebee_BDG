export const rolePermissions = {
    admin: {
        classes: ['announcement', 'classes', 'class-schedule', ''],
        teacher: [
            'teacher',
            'teacher-demo',
            'teacher-register',
            'teacher-timetable',
            'teacher-profile',
            'teacher-schedule'
        ],
        manager: ['ticket', 'users', 'courses', 'classes-of-course'],
        student: ['student', 'student-profile', 'course-info'],
        qc: ['qc-overview', 'qc-syllabus', 'qc-student-group', 'qc-account-classin', 'book-manager', 'classin-manager']
    },
    teacher: {
        classes: ['announcement', ''],
        teacher: ['teacher-register', 'teacher-timetable', 'teacher-profile']
    },
    student: {
        classes: ['announcement', ''],
        student: ['student-profile']
    },
    sub_admin: {

        teacher: [
            'teacher',
            'teacher-demo',
            'teacher-register',
            'teacher-timetable',
            'teacher-profile'
        ],
        student: ['student', 'student-profile', 'course-info'],
        manager: ['ticket', 'courses', 'classes-of-course'],
        classes: ['announcement', 'classes', 'class-schedule', ''],
        qc: ['qc-overview', 'qc-syllabus', 'qc-student-group', 'qc-account-classin', 'book-manager', 'classin-manager']
    }
}

// ----------------------------------------------------------------------------------------

export const timeslots = [
    '06:00',
    '06:30',
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
        availableTimes: ['7-9', '13-16', '20-21'],
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
                /** giai thichi cho property code */
                code: 'I87645',
                /** */
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
        availableTimes: ['08:00-10:00', '16:15-18:30'],
        schedule: [
            {
                code: 'B96018',
                teacher: 'Trần Thị Thùy Dung',
                duration: 45,
                type: 1,
                time: '08:15',
                studentName: 'Ngô Văn E'
            },
            {
                code: 'B96018',
                teacher: 'Trần Thị Thùy Dung',
                duration: 45,
                type: 1,
                time: '17:15',
                studentName: 'Ngô Văn E'
            }
        ]
    },
    {
        name: 'Giáo viên B',
        availableTimes: ['09:00-11:00', '14:00-16:00'],
        schedule: [
            {
                code: 'C10245',
                teacher: 'Nguyễn Văn B',
                duration: 30,
                type: 2,
                time: '09:00',
                studentName: 'Bùi Văn F'
            }
        ]
    },
    {
        name: 'Giáo viên C',
        availableTimes: ['07:30-09:30', '13:30-15:30'],
        schedule: [
            {
                code: 'D34201',
                teacher: 'Phạm Văn X',
                duration: 60,
                type: 3,
                time: '07:30',
                studentName: 'Phạm Văn C'
            }
        ]
    },
    {
        name: 'Giáo viên D',
        availableTimes: ['08:00-10:00', '12:00-14:00'],
        schedule: [
            {
                code: 'B96018',
                teacher: 'Trần Thị Thùy Dung',
                duration: 45,
                type: 4,
                time: '08:00',
                studentName: 'Phạm Văn C'
            }
        ]
    },
    {
        name: 'Giáo viên E',
        availableTimes: ['09:30-11:30', '15:00-17:00'],
        schedule: [
            {
                code: 'C10245',
                teacher: 'Nguyễn Văn B',
                duration: 30,
                type: 5,
                time: '09:30',
                studentName: 'Lê Thị D'
            }
        ]
    },
    {
        name: 'Giáo viên F',
        availableTimes: ['10:30-12:30', '14:30-16:30'],
        schedule: [
            {
                code: 'D34201',
                teacher: 'Phạm Văn C',
                duration: 60,
                type: 2,
                time: '10:30',
                studentName: 'Trần Văn B'
            }
        ]
    },
    {
        name: 'Giáo viên G',
        availableTimes: ['08:30-10:30', '13:00-15:00'],
        schedule: [
            {
                code: 'B96018',
                teacher: 'Trần Thị Thùy Dung',
                duration: 45,
                type: 1,
                time: '08:30',
                studentName: 'Bùi Văn F'
            }
        ]
    },
    {
        name: 'Giáo viên H',
        availableTimes: ['10:00-12:00', '17:00-19:00'],
        schedule: [
            {
                code: 'C10245',
                teacher: 'Nguyễn Văn B',
                duration: 30,
                type: 3,
                time: '10:00',
                studentName: 'Nguyễn Văn A'
            }
        ]
    },
    {
        name: 'Giáo viên J',
        availableTimes: ['07:30-09:30', '16:30-18:30'],
        schedule: [
            {
                code: 'D34201',
                teacher: 'Phạm Văn C',
                duration: 60,
                type: 4,
                time: '07:30',
                studentName: 'Ngô Văn E'
            }
        ]
    }
]

export const teacherRegister = {
    'Monday': [
        {
            'start_time': '12:00',
            'end_time': '14:00'
        },
        {
            'start_time': '15:00',
            'end_time': '17:00'
        }
    ],
    'Tuesday': [
        {
            'start_time': '09:00',
            'end_time': '11:00'
        },
        {
            'start_time': '13:00',
            'end_time': '15:00'
        }
    ],
    'Wednesday': [
        {
            'start_time': '08:00',
            'end_time': '10:00'
        },
        {
            'start_time': '14:00',
            'end_time': '16:00'
        }
    ],
    'Thursday': [
        {
            'start_time': '10:00',
            'end_time': '12:00'
        },
        {
            'start_time': '16:00',
            'end_time': '18:00'
        }
    ],
    'Friday': [
        {
            'start_time': '11:00',
            'end_time': '13:00'
        },
        {
            'start_time': '17:00',
            'end_time': '19:00'
        }
    ],
    'Saturday': [
        {
            'start_time': '09:00',
            'end_time': '11:00'
        }
    ],
    'Sunday': [
        {
            'start_time': '10:00',
            'end_time': '12:00'
        }
    ]
}

export const accountTimeTable = [
    {
        "TK1": [
            {
                "going_date_time": "2024-12-11 08:00",
                "class_session_name": "Math 101",
                "teacher_name": "Nguyen Minh Tuan",
                "student_name": "Nguyen Ai My"
            },
            {
                "going_date_time": "2024-12-11 10:00",
                "class_session_name": "Physics 101",
                "teacher_name": "Pham Thi Thanh Hồng",
                "student_name": "Nguyen Ai My"
            }
        ]
    },
    {
        "TK2": [
            {
                "going_date_time": "2024-12-11 13:00",
                "class_session_name": "Chemistry 101",
                "teacher_name": "Tran Quoc Toan",
                "student_name": "Nguyen Ai My"
            },
            {
                "going_date_time": "2024-12-11 15:00",
                "class_session_name": "Biology 101",
                "teacher_name": "Le Thi Mai",
                "student_name": "Nguyen Ai My"
            }
        ]
    },
    {
        "TK3": [
            {
                "going_date_time": "2024-12-11 18:00",
                "class_session_name": "Literature 101",
                "teacher_name": "Nguyen Thi Lan",
                "student_name": "Nguyen Ai My"
            },
            {
                "going_date_time": "2024-12-11 20:00",
                "class_session_name": "History 101",
                "teacher_name": "Hoang Minh Tu",
                "student_name": "Nguyen Ai My"
            }
        ]
    },
    {
        "TK4": [
            {
                "going_date_time": "2024-12-11 18:00",
                "class_session_name": "Literature 101",
                "teacher_name": "Nguyen Thi Lan",
                "student_name": "Nguyen Ai My"
            },
            {
                "going_date_time": "2024-12-11 20:00",
                "class_session_name": "History 101",
                "teacher_name": "Hoang Minh Tu",
                "student_name": "Nguyen Ai My"
            }
        ]
    },
    {
        "TK5": []
    }
]