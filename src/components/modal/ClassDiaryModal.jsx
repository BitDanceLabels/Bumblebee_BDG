import {useTranslation} from "react-i18next";
import {useState} from "react";
import Loading from "../General/Loading.jsx";
import axios from "axios";
import APIStatusNotificationModal from "./APIStatusNotificationModal.jsx";
import {MdWarning} from "react-icons/md";
import styled, {keyframes} from "styled-components";

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const contentStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
};

const tableStyle = {
    width: '100%',
    marginTop: '15px',
    borderCollapse: 'collapse',
};

const thStyle = {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    fontSize: '16px',
    fontWeight: 'bold',
};

const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
};

const formStyle = {
    marginTop: '25px',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0 15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
};

const textareaStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0 15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
};

const buttonStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
};

const shake = keyframes`
    0% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.2);
    }
    50% {
        transform: scale(1);
    }
    75% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
`;

const ShakeIcon = styled(MdWarning)`
    margin-left: 5px;
    font-size: 20px;
    font-weight: bold;
    color: red;
    animation: ${shake} 1s ease-in-out infinite;
`;

const apiClassSessionUrl = import.meta.env.VITE_URL_CLASS_SESSION

// eslint-disable-next-line react/prop-types
const ClassDiaryModal = ({data, onClose, fetchData}) => {
    const {t,} = useTranslation();
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line react/prop-types
    const [lessonReport, setLessonReport] = useState(data.lessonReport);
    // eslint-disable-next-line react/prop-types
    const [coachPlanNextLesson, setCoachPlanNextLesson] = useState(data.coachPlanNextLesson);
    const [apiStatus, setApiStatus] = useState(null)
    const [message, setMessage] = useState('')
    const [apiDone, setApiDone] = useState(false)

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    if (!data) {
        return <p>No event selected.</p>;
    }

    // eslint-disable-next-line react/prop-types
    const {day, time, code, student, status} = data;

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();
        try {
            const apiUrl = `${apiClassSessionUrl}${code}`;

            const headers = token ? {Authorization: `Bearer ${token}`} : {};

            const response = await axios.put(apiUrl, {
                lesson_report: lessonReport,
                coach_plan_next_lesson: coachPlanNextLesson,
            }, {headers});

            if (response.status === 200) {
                fetchData()
                setApiDone(true)
                setApiStatus('success')
                setMessage('Class diary updated successfully!')
                setTimeout(() => {
                    setApiStatus(null)
                    setMessage('')
                    setApiDone(false)
                    onClose();
                }, 2000)
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating class diary:", error);
            fetchData()
            setApiDone(true)
            setApiStatus('error')
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
            setTimeout(() => {
                setApiStatus(null)
                setMessage('')
                setApiDone(false)
                onClose();
            }, 2000)
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!apiStatus}
                onClose={() => setApiStatus(null)}
                message={message}
                status={apiStatus}
            />
            <div
                style={{
                    ...overlayStyle,
                    display: apiDone ? 'none' : 'flex',
                }}
                onClick={onClose}
            >
                <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                    <button style={closeButtonStyle} onClick={onClose}>
                        &times;
                    </button>
                    <h1 style={{
                        marginBottom: '15px',
                        color: '#333',
                        textAlign: 'center',
                        fontSize: '24px'
                    }}>{t('class diary')}</h1>
                    <h2 style={{color: '#555', fontSize: '20px'}}>{t('date')}: {day}</h2>
                    <table style={tableStyle}>
                        <thead>
                        <tr>
                            <th style={thStyle}>{t('time')}</th>
                            <th style={thStyle}>{t('class code')}</th>
                            <th style={thStyle}>{t('student')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={tdStyle}>{time}</td>
                            <td style={tdStyle}>{code}</td>
                            <td style={tdStyle}>{student}</td>
                        </tr>
                        </tbody>
                    </table>
                    <form style={formStyle}>
                        <div>
                            <label htmlFor="status"
                                   style={{
                                       marginBottom: '5px',
                                       fontSize: '16px',
                                       fontWeight: 'bold'
                                   }}>{t('status')}:</label>
                            <input type="text" id="status" name="status" style={inputStyle} value={status} disabled/>
                        </div>
                        <div>
                            <label
                                htmlFor="lessonReport"
                                style={{
                                    marginBottom: '5px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {t('lesson report')}:
                                {lessonReport === '' || lessonReport === null ? (
                                    <ShakeIcon size={20}/>
                                ) : null}
                            </label>
                            <textarea
                                id="lessonReport"
                                name="lessonReport"
                                style={textareaStyle}
                                value={lessonReport}
                                onChange={(e) => setLessonReport(e.target.value)}
                            ></textarea>
                        </div>

                        <div>
                            <label
                                htmlFor="plan"
                                style={{
                                    marginBottom: '5px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {t("coach's plan for next lesson")}:
                                {coachPlanNextLesson === '' || coachPlanNextLesson === null ? (
                                    <ShakeIcon size={20}/>
                                ) : null}
                            </label>
                            <textarea
                                id="plan"
                                name="plan"
                                style={textareaStyle}
                                value={coachPlanNextLesson}
                                onChange={(e) => setCoachPlanNextLesson(e.target.value)}
                            ></textarea>
                        </div>

                        <button type="submit" style={buttonStyle} onClick={handleSubmit}>
                            {t('save')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ClassDiaryModal;