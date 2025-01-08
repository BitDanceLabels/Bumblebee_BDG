import {useTranslation} from "react-i18next";
import {useState} from "react";
import Loading from "../General/Loading.jsx";
import axios from "axios";

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

const apiUpdateDeferOrCancelledSession = import.meta.env.VITE_URL_UPDATE_DEFFER_OR_CANCEL_SESSION

// eslint-disable-next-line react/prop-types
const ChangeStatusClassSessionModal = ({data, onClose, fetchData}) => {
    const {t} = useTranslation();
    const [message, setMessage] = useState('');
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    const [loading, setLoading] = useState(false);
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    if (!data) {
        return <p>No event selected.</p>;
    }

    // eslint-disable-next-line react/prop-types
    const {time, code, student, goingDateTime} = data;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [status, setStatus] = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [reason, setReason] = useState('');

    const handleStatusChange = (e) => {
        const currentTime = new Date();
        const goingTime = new Date(goingDateTime);

        const timeDiff = (goingTime - currentTime) / (1000 * 60 * 60);

        setStatus(e.target.value);

        if (timeDiff <= 8 && timeDiff > 4) {
            setMessage('You will be charged 50% of the lesson fee if you cancel or postpone the lesson between 4 and 8 hours before the lesson');
        } else if (timeDiff <= 4 && timeDiff >= 0) {
            setMessage('You will be charged 100% of the lesson fee if you cancel or postpone the lesson less than 4 hours before the lesson takes place');
        } else {
            setMessage('');
        }
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const microseconds = "000000";

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (!status || status.trim() === "") {
            alert("Please select a status before submitting.");
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({
            goingDateTime: formatDateTime(goingDateTime),
            classSessionId: code,
            sessionStatus: status,
        });

        try {
            await axios.put(`${apiUpdateDeferOrCancelledSession}?${params.toString()}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            fetchData();
            onClose();
            setLoading(false);
        } catch (error) {
            console.error(
                "Failed to update session:",
                error.response?.data?.message || error.message
            );
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    return (
        <>
            {loading && <Loading/>}
            <div style={overlayStyle} onClick={onClose}>
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
                    <h2 style={{color: '#555', fontSize: '20px'}}>{t('date')}: {formatDate(goingDateTime)}</h2>
                    {message && (
                        <div style={{
                            backgroundColor: '#ffcc00',
                            color: '#d9534f',
                            padding: '10px',
                            borderRadius: '5px',
                            marginTop: '20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            {message}
                        </div>
                    )}
                    <table style={{width: '100%', marginTop: '15px', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr>
                            <th style={{
                                textAlign: 'left',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>{t('time')}</th>
                            <th style={{
                                textAlign: 'left',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>{t('class code')}</th>
                            <th style={{
                                textAlign: 'left',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>{t('student')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{padding: '10px', borderBottom: '1px solid #ddd', fontSize: '14px'}}>{time}</td>
                            <td style={{padding: '10px', borderBottom: '1px solid #ddd', fontSize: '14px'}}>{code}</td>
                            <td style={{
                                padding: '10px',
                                borderBottom: '1px solid #ddd',
                                fontSize: '14px'
                            }}>{student}</td>
                        </tr>
                        </tbody>
                    </table>
                    <form style={formStyle} onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="status" style={{marginBottom: '5px', fontSize: '16px'}}>
                                {t('status')}
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                                style={inputStyle}
                            >
                                <option value="">{t('select status')}</option>
                                <option value="deferred">{t('defer')}</option>
                                <option value="cancelled">{t('cancel')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="reason" style={{marginBottom: '5px', fontSize: '16px'}}>
                                {t('reason')}
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={handleReasonChange}
                                style={textareaStyle}
                                placeholder={t('enter reason')}
                            />
                        </div>
                        <button type="submit" style={buttonStyle}>
                            {t('save')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangeStatusClassSessionModal;
