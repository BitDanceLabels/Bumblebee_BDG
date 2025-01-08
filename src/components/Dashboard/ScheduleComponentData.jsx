const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL

// Token and user info
const fullData = JSON.parse(localStorage.getItem('fullData'))
let role = ''
let token = ''
let teacher_id = '23'
if (fullData) {
  role = fullData.role_group.toLowerCase()
  token = fullData.access_token
  console.log('Logged in with role:', role)
}

export const fetchClassSessions = async (selectedDateFormatted) => {
  const response = await fetch(
    // `${API_BASE_URL}/api/search_class_sessions?teacher_id=${teacher_id}&start_date=${selectedDateFormatted}&range_days=1`,
    `${API_BASE_URL}/api/get_class_sessions_by_day?selected_date=${selectedDateFormatted}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error('Failed to fetch class sessions')
  }
  const data = await response.json()
  return data.map((session) => ({
    code: session.id_class_session,
    name: session.programmer,
    student: session.student_id,
    duration: session.duration,
    type: session.session_status === 'regular' ? 2 : 1,
    start_time: session.going_date_time.split('T')[1].slice(0, 5),
    teacher_id: session.teacher_id,
    course_id: session.course_id // thêm course_id

  }))
}

// Function to fetch teachers
export const fetchTeachers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/teachers_with_teacher_id`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch teachers')
  }
  return response.json()
}

// Function to fetch available times
export const fetchAvailableTimes = async () => {
  // const response = await fetch(`${API_BASE_URL}/api/get_latest_time_entries_for_all_teachers`, {
  const response = await fetch(`${API_BASE_URL}/api/timezone_jsons/latest`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch available times')
  }
  return response.json()
  // json_time_zone: session.json_time_zone
}

// Function to fetch students
export const fetchStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/api/students`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }
  return response.json()
}

// Function to map data to JSON
// export const mapDataToJson = (teachers, availableTimes, classes, students) => {
//   return teachers.map((teacher) => {
//     const teacherAvailableTimes = availableTimes
//       .filter((time) => time.teacher_id === teacher.teacher_id)
//       .map(
//         (time) =>
//           `${time.start_time.split(':')[0]}:${time.start_time.split(':')[1]}-${time.end_time.split(':')[0]}:${time.end_time.split(':')[1]}`
//       )

//     const teacherClasses = classes.filter(
//       (classItem) => classItem.teacher_id === teacher.teacher_id
//     )

//     const schedule = teacherClasses.map((classItem) => {
//       const student = students.find(
//         (student) => student.student_id === classItem.student
//       )
//       const studentName = student ? student.name_student : 'Unknown'

//       return {
//         code: classItem.code,
//         teacher: teacher.full_name,
//         duration: classItem.duration,
//         type: classItem.type,
//         time: classItem.start_time,
//         studentName: studentName,
//         studentId: classItem.student
//       }
//     })
//     console.log('Classes: ', classes)

//     return {
//       teacher_id: teacher.teacher_id,
//       name: teacher.full_name,
//       availableTimes: teacherAvailableTimes,
//       schedule: schedule
//     }
//   })
// }

// Function to map data to JSON
export const mapDataToJson = (teachers, availableTimes, classes, students) => {
  return teachers.map((teacher) => {
    // const teacherAvailableTimes = availableTimes
    //   .filter((time) => time.teacher_id === teacher.teacher_id)
    //   .map((time) => {
    //     const startTime = time.start_time ? time.start_time.split(':') : ['00', '00'];
    //     const endTime = time.end_time ? time.end_time.split(':') : ['00', '00'];

    //     return `${startTime[0]}:${startTime[1]}-${endTime[0]}:${endTime[1]}`;
    //   });
    const teacherTimeData = availableTimes.find(
      (time) => time.teacher_id === teacher.teacher_id
    );

    // Chuyển đổi `json_time_zone` từ chuỗi JSON sang đối tượng JSON nếu tồn tại
    const availableTimesJson = teacherTimeData?.json_time_zone
      ? JSON.parse(teacherTimeData.json_time_zone)
      : {};

    const teacherAvailableTimes = Object.entries(availableTimesJson).flatMap(
      ([day, times]) =>
        times.map((time) => {
          const startTime = time.start_time ? time.start_time.split(':') : ['00', '00'];
          const endTime = time.end_time ? time.end_time.split(':') : ['00', '00'];
          return `${day}: ${startTime[0]}:${startTime[1]}-${endTime[0]}:${endTime[1]}`;
        })
    );

    const teacherClasses = classes.filter(
      (classItem) => classItem.teacher_id === teacher.teacher_id
    );

    const schedule = teacherClasses.map((classItem) => {
      const student = students.find(
        (student) => student.student_id === classItem.student
      );
      const studentName = student ? student.name_student : 'Unknown';

      return {
        code: classItem.code,
        teacher: teacher.full_name,
        duration: classItem.duration,
        type: classItem.type,
        time: classItem.start_time,
        studentName: studentName,
        studentId: classItem.student
      };
    });
    console.log('Classes: ', classes);

    return {
      teacher_id: teacher.teacher_id,
      name: teacher.full_name,
      availableTimes: teacherAvailableTimes,
      schedule: schedule
    };
  });
};