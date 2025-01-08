import {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Loading from "../General/Loading.jsx";
import axios from "axios";

const Container = styled.div`
    background: #f7f7ff;
    font-size: 20px;
    padding: 0 10px;
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background: ${(props) => (props.active ? '#007bff' : '#f7f7ff')};
    color: ${(props) => (props.active ? '#fff' : '#000')};
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    margin-right: 5px;

    &:focus {
        outline: none;
    }
`;

const TableContainer = styled.div`
    max-height: 80vh;
    overflow-y: auto;
    margin-top: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #333;

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f0f8ff;
        color: #007bff;
        cursor: pointer;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
`;

const TableHeader = styled.th`
    padding: 14px;
    border: 1px solid #ddd;
    text-align: left;
    background-color: #0056b3;
    color: white;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
`;

const TableData = styled.td`
    padding: 14px;
    border: 1px solid #ddd;
    text-align: left;
`;

const ActionButton = styled.button`
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    background-color: #ffc107;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: #e0a800;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

const courseStudentGroupDataUrl = import.meta.env.VITE_COURSE_STUDENT_GROUP_DATA_URL;

const StudentGroup = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Mid Course Test");
    const [data, setData] = useState({
        "Mid Course Test": [],
        "End Course Test": [],
        "Report To Sale": [],
        "Not Desire New Course": [],
        "Desire New Course": []
    });
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(courseStudentGroupDataUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const parsedData = JSON.parse(response.data.data);

                const categorizedData = {
                    "Mid Course Test": [],
                    "End Course Test": [],
                    "Report To Sale": [],
                    "Not Desire New Course": [],
                    "Desire New Course": []
                };

                parsedData.forEach(item => {
                    if (item.total_finished >= 28) {
                        categorizedData["Not Desire New Course"].push({...item, action: "note feedback"});
                        // eslint-disable-next-line no-dupe-else-if
                    } else if (item.total_finished >= 28) {
                        categorizedData["Desire New Course"].push({...item, action: "note feedback new course"});
                    } else if (item.total_finished >= 25) {
                        categorizedData["End Course Test"].push({...item, action: "report to PD"});
                    } else if (item.total_finished >= 12) {
                        categorizedData["Mid Course Test"].push({...item, action: "report to PD"});
                    } else if (item.total_finished >= 23) {
                        categorizedData["Report To Sale"].push({...item, action: "report to sale"});
                    }
                });
                setData(categorizedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message || error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {loading && <Loading/>}
            <Container>
                {/* Tabs */}
                <TabContainer>
                    {Object.keys(data).map(tab => (
                        <Tab
                            key={tab}
                            active={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </Tab>
                    ))}
                </TabContainer>

                <TableContainer>
                    <Table>
                        <thead>
                        <tr>
                            <TableHeader>{t('STT')}</TableHeader>
                            <TableHeader>{t('Course Name')}</TableHeader>
                            <TableHeader>{t('Student Name')}</TableHeader>
                            <TableHeader>{t('Start Date')}</TableHeader>
                            <TableHeader>{t('PIC Name')}</TableHeader>
                            <TableHeader>{t('Progress')}</TableHeader>
                            <TableHeader>{t('Note for QC')}</TableHeader>
                            <TableHeader>{t('Action')}</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {data[activeTab].map((student, index) => (
                            <tr key={student.student_id}>
                                <TableData style={{textAlign: 'center'}}>{index + 1}</TableData>
                                <TableData onClick={
                                    () => {
                                        navigate(`/course-info?courseId=${student.course_id}`);
                                    }
                                }>{`${student.course_id} - ${student.program_name} - ${student.level_program}`}</TableData>
                                <TableData onClick={
                                    () => {
                                        navigate(`/student-info?studentId=${student.student_id}`);
                                    }
                                }>{student.name_student}</TableData>
                                <TableData>{student.start_date}</TableData>
                                <TableData>{student.pic_name}</TableData>
                                <TableData>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        backgroundColor: '#d8d8f8',
                                        borderRadius: '8px'
                                    }}>
                                        <div
                                            style={{
                                                width: `${(student.total_finished / student.total_session) * 100}%`,
                                                backgroundColor: '#007bff',
                                                height: '10px',
                                                borderRadius: '8px'
                                            }}
                                        ></div>
                                    </div>
                                    <span style={{fontSize: '12px', marginTop: '5px', display: 'inline-block'}}>
                                    {student.total_finished}/{student.total_session} ({((student.total_finished / student.total_session) * 100).toFixed(2)}%)
                                </span>
                                </TableData>
                                <TableData>{student.note_for_qc}</TableData>
                                <TableData><ActionButton>{student.action}</ActionButton></TableData>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
};

export default StudentGroup;