import Modal from 'react-modal'
import styled, {keyframes} from 'styled-components'
import {MdOutlineDoneOutline} from 'react-icons/md'
import {MdErrorOutline} from 'react-icons/md'
import React from 'react'
import {useTranslation} from "react-i18next";

const slideUpFadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(20px);
    }
`

const AnimatedModalContent = styled.div`
    animation: ${(props) => (props.isClosing ? fadeOut : slideUpFadeIn)} 0.3s ease-out;
    max-width: 300px;
    height: 150px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
`

const SuccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
`

const IconWrapper = styled.div`
    font-size: 50px;
    color: ${(props) => ((props.status === 'success' || props.status === 'Thành công') ? 'green' : 'red')};
    margin-bottom: 10px;
`

const Message = styled.p`
    font-size: 1.8rem;
    color: ${(props) => ((props.status === 'success' || props.status === 'Thành công') ? 'green' : 'red')};
    font-weight: bold;
`

// eslint-disable-next-line react/prop-types
const APIStatusNotificationModal = ({isOpen, onClose, message, status}) => {
    const {t,} = useTranslation();
    const [isClosing, setIsClosing] = React.useState(false)

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            onClose()
        }, 300)
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001
                }
            }}
            contentElement={(props, children) => (
                <AnimatedModalContent {...props} isClosing={isClosing}>
                    {children}
                </AnimatedModalContent>
            )}
        >
            <SuccessContainer>
                <IconWrapper status={status}>
                    {status === t('success') ? <MdOutlineDoneOutline/> : <MdErrorOutline/>}
                </IconWrapper>
                <Message status={status}>{message}</Message>
            </SuccessContainer>
        </Modal>
    )
}

export default APIStatusNotificationModal