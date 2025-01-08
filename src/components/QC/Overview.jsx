import {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import NoData from '../../assets/NoData.jpg';
import Loading from '../General/Loading.jsx';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const Container = styled.div`
    padding: 10px;
`;

const TabsWrapper = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const Tab = styled.div`
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
    background-color: ${(props) => (props.active ? '#007bff' : '#f1f1f1')};
    color: ${(props) => (props.active ? '#fff' : '#495057')};
    margin-right: 10px;
    transition: background-color 0.3s;
    font-weight: bold;
    font-size: 1.6rem;

    &:hover {
        background-color: ${(props) => (props.active ? '#0056b3' : '#e2e6ea')};
    }
`;

const TabContent = styled.div`
    padding: 0 20px 20px;
    border: 1px solid #ccc;
    border-radius: 0 0 5px 5px;
    background-color: #f8f9fa;
    margin-bottom: 20px;
`;

const TableWrapper = styled.div`
    margin-top: 20px;
`;

const TableTitle = styled.h3`
    text-align: center;
    margin-bottom: 10px;
    font-size: 1.6rem;
    color: #007bff;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th,
    td {
        padding: 20px 16px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        font-size: 1.4rem;
    }

    th {
        background-color: #f1f1f1;
    }

    tr:hover {
        background-color: #f9f9f9;
    }
`;

const ClickableCell = styled.td`
    cursor: pointer;
    font-weight: bold;
    color: #007bff;

    &:hover {
        background-color: #e2e6ea;
        color: #0056b3;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
`;

const NoDataImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
`;

const apiCourseUrl = import.meta.env.VITE_API_COURSE;
const apiProgramUrl = import.meta.env.VITE_API_PROGRAM;
const apiStudentUrl = import.meta.env.VITE_URL_GET_ALL_STUDENT;
const apiTeacherUrl = import.meta.env.VITE_URL_GET_IDX_TEACHER;
const apiClassSessionUrl = import.meta.env.VITE_URL_GET_ALL_CLASS_SESSION;

const Overview = () => {
    const {t,} = useTranslation();
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [, setStudents] = useState([]);
    const [, setTeachers] = useState([]);
    const [, setCourses] = useState([]);
    const [programCourses, setProgramCourses] = useState([]);
    const [, setClassSession] = useState([]);
    const [loading, setLoading] = useState(false);
    const fullData = JSON.parse(localStorage.getItem('fullData'));
    let token = '';
    if (!fullData) {
        console.log('Empty');
    } else {
        token = fullData.access_token;
    }

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const [responseProgram, responseStudent, responseTeacher, responseCourses, responseClassSession] = await Promise.all([
                    axios.get(apiProgramUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(apiStudentUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(apiTeacherUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(apiCourseUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(apiClassSessionUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);

                const dataProgram = responseProgram.data;
                const dataStudents = responseStudent.data;
                const dataTeachers = responseTeacher.data;
                const dataCourses = responseCourses.data;
                const dataClassSession = responseClassSession.data;

                setPrograms(dataProgram);
                setStudents(dataStudents);
                setTeachers(dataTeachers);
                setCourses(dataCourses);
                setClassSession(dataClassSession)

                const joinedCourses = dataCourses.map((course) => {
                    const program = dataProgram.find((p) => p.program_id === course.program_id);
                    const student = dataStudents.find((s) => s.student_id === course.student_id);
                    const teacher = dataTeachers.find((t) => t.teacher_id === course.teacher_id);
                    const classSession = dataClassSession.filter((cs) => cs.course_id === course.course_id);

                    const finishedLesson = classSession.filter(
                        (session) => session.session_status === 'finished'
                    ).length;

                    const upcomingLesson = classSession.filter(
                        (session) => session.session_status === 'upcoming'
                    ).length;

                    return {
                        ...course,
                        classSession: classSession,
                        program_name: program ? program.program_name : 'Unknown Program',
                        student_name: student ? student.name_student : 'Unknown Student',
                        teacher_name: teacher ? teacher.full_name : 'Unknown Teacher',
                        total_session: classSession.length,
                        finished_lesson: finishedLesson,
                        upcoming_lesson: upcomingLesson,
                    };
                });

                setProgramCourses(joinedCourses);

                if (dataProgram.length > 0) {
                    setSelectedProgram(dataProgram[0].program_id);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [token]);

    const handleProgramSelect = (programId) => {
        setSelectedProgram(programId);
    };

    const filteredCourses = programCourses.filter((course) => course.program_id === selectedProgram);

    // Navigate to the course details page
    const handleNameClick = (courseId) => {
        navigate(`/course-info?courseId=${courseId}`);
    };

    return (
        <>
            {loading && <Loading/>}
            <Container>
                <TabsWrapper>
                    {programs.map((program) => (
                        <Tab
                            key={program.program_id}
                            active={selectedProgram === program.program_id}
                            onClick={() => handleProgramSelect(program.program_id)}
                        >
                            {program.program_name}
                        </Tab>
                    ))}
                </TabsWrapper>

                <TabContent>
                    <TableWrapper>
                        <TableTitle>{t('on going')}</TableTitle>
                        <Table>
                            <thead>
                            <tr>
                                <th>{t('course name')}</th>
                                <th>{t('finished lessons')}</th>
                                <th>{t('paid lessons')}</th>
                                <th>{t('remaining lessons')}</th>
                                <th>{t('pic')}</th>
                                <th>{t('notes for qc')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCourses.filter((course) => course.status_course === 'active').length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        <NoDataImage src={NoData} alt="No Data"/>
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.filter((course) => course.status_course === 'active').map((course) => (
                                    <tr key={course.course_id}>
                                        <ClickableCell onClick={() => handleNameClick(course.course_id)}>
                                            {`${course.course_id}-${course.program_name}-${course.student_name}`}
                                        </ClickableCell>
                                        <td>{course.finished_lesson}</td>
                                        <td></td>
                                        <td>{course.upcoming_lesson}</td>
                                        <td>{course.pic_name}</td>
                                        <td>{course.note_for_qc}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                </TabContent>

                <TabContent>
                    <TableWrapper>
                        <TableTitle>{t('finished')}</TableTitle>
                        <Table>
                            <thead>
                            <tr>
                                <th>{t('course name')}</th>
                                <th>{t('finished lessons')}</th>
                                <th>{t('paid lessons')}</th>
                                <th>{t('remaining lessons')}</th>
                                <th>{t('pic')}</th>
                                <th>{t('notes for qc')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCourses.filter((course) => course.status_course === 'finished').length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        <NoDataImage src={NoData} alt="No Data"/>
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.filter((course) => course.status_course === 'finished').map((course) => (
                                    <tr key={course.course_id}>
                                        <ClickableCell onClick={() => handleNameClick(course.course_id)}>
                                            {`${course.course_id}-${course.program_name}-${course.student_name}`}
                                        </ClickableCell>
                                        <td>{course.finished_lesson}</td>
                                        <td></td>
                                        <td>{course.upcoming_lesson}</td>
                                        <td>{course.pic_name}</td>
                                        <td>{course.note_for_qc}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                </TabContent>
            </Container>
        </>
    );
};

export default Overview;