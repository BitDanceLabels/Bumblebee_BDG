import styled from 'styled-components'
// import ApproveTeacherModal from '../modal/ApproveTeacherModal'
import Loading from '../General/Loading'
import APIStatusNotificationModal from '~/components/modal/APIStatusNotificationModal.jsx'
import {useState} from 'react'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const ModalContainer = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
`

const ModalTitle = styled.h3`
    margin-bottom: 20px;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background: ${(props) => (props.primary ? '#007bff' : '#ddd')};
    color: ${(props) => (props.primary ? '#fff' : '#000')};

    &:focus {
        outline: none;
    }
`

// // eslint-disable-next-line react/prop-types
// const RejectTeacherModal = ({ isOpen, onClose, onConfirm, action }) => {
//   if (!isOpen) return null

//   return (
//     <ModalBackdrop>
//       <ModalContainer>
//         <ModalTitle>Are you sure you want to {action} this teacher?</ModalTitle>
//         <ButtonContainer>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button primary onClick={onConfirm}>Submit
//             onSubmit={handleMoveConfirm}
//           </Button>

//         </ButtonContainer>
//       </ModalContainer>
//     </ModalBackdrop>
//   )
// }
// eslint-disable-next-line react/prop-types
const RejectTeacherModal = ({isOpen, onClose, onConfirm, action, selectedTeacher}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const fullData = JSON.parse(localStorage.getItem('fullData'));
    let token = '';
    if (fullData) {
        token = fullData.access_token;
    }

    const handleConfirm = async () => {
        setIsLoading(true);

        try {
            await axios.put(
                // eslint-disable-next-line react/prop-types
                `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api/teachers/${selectedTeacher.idx_teacher}`,
                {offer_status: 'Approved'},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsLoading(false);
            const api_sendmail_smtp = import.meta.env.VITE_SEND_MAIL_SMTP_PA;

            const payload = {
                subject: 'Thông báo tạo tài khoản giáo viên trên hệ thống',
                // eslint-disable-next-line react/prop-types
                body: `Dear ${selectedTeacher.full_name}, ...`,
                // eslint-disable-next-line react/prop-types
                to: [selectedTeacher.email],
                cc: ['nhutpham@powerenglishcenter.vn'],
                attachments: [],
            };

            const emailResponse = await axios.post(api_sendmail_smtp, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (emailResponse.status === 200 || emailResponse.status === 201) {
                setStatus('success');
                setMessage('Successfully!');
                setTimeout(() => setStatus(null), 2000);
            }
        } catch (error) {
            setIsLoading(false);
            setStatus('error');
            setMessage(error.response?.data?.message || error.message || 'Failed');
            setTimeout(() => setStatus(null), 2000);
        }
    };

    return (
        <>
            {isLoading && <Loading/>}
            <APIStatusNotificationModal
                isOpen={!!status}
                onClose={() => setStatus(null)}
                message={message}
                status={status}
            />
            <ModalBackdrop>
                <ModalContainer>
                    {/* eslint-disable-next-line react/prop-types */}
                    <ModalTitle>{t('are you sure you want to')} {t(action.toLowerCase()).toLowerCase()} {t('this teacher')}?</ModalTitle>
                    <ButtonContainer>
                        <Button onClick={onClose}>{t('cancel')}</Button>
                        <Button primary onClick={() => {
                            handleConfirm();
                            onConfirm();
                        }}>
                            {t('submit')}
                        </Button>
                    </ButtonContainer>
                </ModalContainer>
            </ModalBackdrop>
        </>
    );
};

export default RejectTeacherModal