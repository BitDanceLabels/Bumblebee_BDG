import {useState, useEffect} from 'react'
import styled from 'styled-components'
import ListTicketUnReview from './ListTicketUnReview'
import ListTicketReviewed from './ListTicketReviewed'
import axios from 'axios'
import Loading from '~/components/General/Loading.jsx'
import {useTranslation} from "react-i18next";

const Container = styled.div`
    background: #f7f7ff;
    font-size: 20px;
    padding: 0 10px;
`

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #ddd;
`

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
`

const apiGetAllTicket = import.meta.env.VITE_URL_CREATE_TICKET

const TicketTabs = () => {
    const {t,} = useTranslation();
    const [activeTab, setActiveTab] = useState('ListTicketUnReviewed')
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    const fetchTickets = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(apiGetAllTicket, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            setTickets(response.data.tickets)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching tickets:', error)
            setIsLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const unreviewedTickets = tickets.filter(
        (ticket) => ticket.status === 'In Progress'
    )
    const reviewedTickets = tickets.filter(
        (ticket) => ticket.status !== 'In Progress'
    )

    return (
        <>
            {isLoading && <Loading/>}
            <Container>
                <TabContainer>
                    <Tab
                        active={activeTab === 'ListTicketUnReviewed'}
                        onClick={() => setActiveTab('ListTicketUnReviewed')}
                    >
                        {t('not yet processed')}
                    </Tab>
                    <Tab
                        active={activeTab === 'ListTicketReviewed'}
                        onClick={() => setActiveTab('ListTicketReviewed')}
                    >
                        {t('processed')}
                    </Tab>
                </TabContainer>

                {loading ? (
                    <p>Loading...</p>
                ) : activeTab === 'ListTicketUnReviewed' ? (
                    <ListTicketUnReview tickets={unreviewedTickets} refreshTickets={fetchTickets}/>
                ) : (
                    <ListTicketReviewed tickets={reviewedTickets} refreshTickets={fetchTickets}/>
                )}
            </Container>
        </>
    )
}

export default TicketTabs
