import styled from 'styled-components'
import {useTranslation} from "react-i18next";

const TableWrapper = styled.div`
    max-height: 70vh;
    overflow-y: auto;
    margin-top: 20px;
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
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
`

const ActionButton = styled.button`
    padding: 8px 15px;
    background-color: ${(props) => props.actionType === 'Activate' ? '#28a745' : '#dc3545'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: ${(props) => props.actionType === 'Activate' ? '#218838' : '#c82333'};
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
`

const TotalCustom = styled.h3`
    margin-bottom: 10px;
`

// eslint-disable-next-line react/prop-types
const TeacherTable = ({data, handleTeacherClick, handleActionClick, actionType}) => {
    const {t,} = useTranslation();
    return (
        <TableWrapper>
            {/* eslint-disable-next-line react/prop-types */}
            <TotalCustom>{t('total')}: {data.length}</TotalCustom>
            <Table>
                <thead>
                <tr>
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
                            <td onClick={() => handleTeacherClick(teacher)}
                                style={{cursor: 'pointer', fontWeight: 'bold'}}>
                                {teacher.full_name}
                            </td>
                            <td>{teacher.teacher_id}</td>
                            <td>
                                {teacher.phone_number && <span>📞 {teacher.phone_number} | </span>}
                                {teacher.email && <span>📧 {teacher.email} | </span>}
                                {teacher.telegram && <span>💬 {teacher.telegram} | </span>}
                                {teacher.gender && <span>👤 {teacher.gender} | </span>}
                                {teacher.role_group && <span>🏷️ {teacher.role_group} | </span>}
                                {teacher.country_current && <span>🌍 {teacher.country_current}</span>}
                            </td>
                            <td>
                                <ActionButton actionType={actionType} onClick={() => handleActionClick(teacher)}>
                                    {/* eslint-disable-next-line react/prop-types */}
                                    {t(actionType.toLowerCase())}
                                </ActionButton>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{textAlign: 'center', fontStyle: 'italic', color: '#777'}}>
                            {t('no data available')}
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </TableWrapper>
    )
}

export default TeacherTable