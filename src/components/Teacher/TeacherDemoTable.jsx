import {useState} from 'react'
import styled from 'styled-components'
import SendMailModal from '../modal/SendMailModal'
import PdfViewerComponent from "../modal/view_convert_pdf";
import {useTranslation} from "react-i18next";

const TableWrapper = styled.div`
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;

    th,
    td {
        padding: 14px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #0056b3;
        color: white;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f0f8ff;
        color: #007bff;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
`

const TotalCustom = styled.span`
    font-size: 20px;
    font-weight: bold;
    margin-left: 16px;
`

const ActionButton = styled.button`
    padding: 8px 12px;
    margin-right: 5px;
    background-color: ${(props) => props.bgColor || '#007bff'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => props.hoverColor || '#0056b3'};
    }
`

// eslint-disable-next-line react/prop-types
const TeacherDemoTable = ({data, handleTeacherClick, handleMoveClick}) => {
    const {t,} = useTranslation();
    const [isSendMailModalOpen, setIsSendMailModalOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)

    const handleSendMailClick = (teacher) => {
        setSelectedTeacher(teacher)
        setIsSendMailModalOpen(true)
    }

    const handleSendMailSubmit = (files) => {
        console.log(
            `Sending mail to ${selectedTeacher.full_name} with files:`,
            files
        )
    }
    const handleSendMail = (emailPayload) => {
        console.log("Sending mail with payload:", emailPayload);
        // Here you would typically call your API to send the email
    };

    return (
        <>
            {/* eslint-disable-next-line react/prop-types */}
            <TotalCustom>{t('total')}: {data.length}</TotalCustom>
            <TableWrapper>
                <Table>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>{t('full name')}</th>
                        <th>{t('id')}</th>
                        <th>{t('contact info')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* eslint-disable-next-line react/prop-types */}
                    {data && data.length > 0 ? (
                        // eslint-disable-next-line react/prop-types
                        data.map((teacher, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td
                                    onClick={() => handleTeacherClick(teacher)}
                                    style={{cursor: 'pointer', fontWeight: 'bold'}}
                                >
                                    {teacher.full_name}
                                </td>
                                <td>{teacher.idx_teacher}</td>
                                <td>
                                    {teacher.phone_number && (
                                        <span>📞 {teacher.phone_number} | </span>
                                    )}
                                    {teacher.email && <span>📧 {teacher.email} | </span>}
                                    {teacher.telegram && <span>💬 {teacher.telegram} | </span>}
                                    {teacher.gender && <span>👤 {teacher.gender} | </span>}
                                    {teacher.role_group && <span>🏷️ {teacher.role_group}</span>}
                                    {teacher.country_current && <span>🌍 {teacher.country_current}</span>}
                                </td>
                                <td>
                                    <ActionButton
                                        bgColor="#007bff"
                                        hoverColor="#0056b3"
                                        onClick={() => handleSendMailClick(teacher)}
                                    >
                                        {t('offer')}
                                    </ActionButton>
                                    <ActionButton
                                        bgColor="#28a745"
                                        hoverColor="#218838"
                                        onClick={() => handleMoveClick(teacher)}
                                    >
                                        {t('approve')}
                                    </ActionButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center', fontStyle: 'italic', color: '#777'}}>
                                No Data Available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </TableWrapper>

            <SendMailModal
                show={isSendMailModalOpen}
                onClose={() => setIsSendMailModalOpen(false)}
                onSubmit={handleSendMailSubmit}
                selectedTeacher={selectedTeacher} // Truyền selectedTeacher vào modal
                onSendMail={handleSendMail} // Truyền hàm onSendMail vào đây
            />
        </>
    )
}

export default TeacherDemoTable
