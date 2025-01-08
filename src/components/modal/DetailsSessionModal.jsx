import styled from 'styled-components'

// Styled components
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9; // Behind the modal
`

const MiniModalWrapper = styled.div`
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px 16px;
    z-index: 10; // Above the overlay
    width: 220px;
    top: ${({position}) => position.top}px;
    left: ${({position}) => position.left}px;
    max-height: 250px;
    overflow-y: auto;
`

const EventCard = styled.div`
    background-color: #b4d1ead6;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
`

const CloseButton = styled.button`
    padding: 10px;
    background-color: #53c653;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    margin-left: auto;
    margin-top: 10px;
    font-weight: bold;

    &:hover {
        background-color: #46b346;
    }
`

// eslint-disable-next-line react/prop-types
const DetailsSession = ({position, events, onClose}) => (
    <>
        <Overlay onClick={onClose}/> {/* Overlay to detect outside clicks */}
        <MiniModalWrapper position={position}>
            {/* eslint-disable-next-line react/prop-types */}
            {events.map((event, index) => (
                <EventCard
                    key={index}
                    style={{
                        backgroundColor:
                            event.status === 'deferred'
                                ? '#f6b585'
                                : event.status === 'cancelled'
                                    ? '#f27c7c'
                                    : event.status === 'finished'
                                        ? '#CCC'
                                        : event.status === 'upcoming'
                                            ? '#8afc8a'
                                            : 'white',
                    }}
                >
                    {`${event.time} - ${event.code} - ${event.student}`}
                </EventCard>
            ))}
            <CloseButton onClick={onClose}>Close</CloseButton>
        </MiniModalWrapper>
    </>
)

export default DetailsSession