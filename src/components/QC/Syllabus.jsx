import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateTemplateModal from '../modal/CreateTemplateModal.jsx';
import { FaTrashAlt, FaArrowUp, FaArrowDown, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import Loading from "../General/Loading.jsx";
import axios from "axios";

const Container = styled.div`
    display: flex;
    width: 100%;
    background-color: #f8f9fa;
`;

const LeftPanel = styled.div`
    width: 30%;
    padding: 20px;
    border-right: 2px solid #ccc;
    background-color: #ffffff;
    height: 100vh;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const RightPanel = styled.div`
    width: 70%;
    padding: 20px;
    background-color: #ffffff;
    height: 100vh;
`;

const TemplateList = styled.ul`
    margin-top: 20px;
    list-style-type: none;
    padding: 0;
`;

const TemplateItem = styled.li`
    padding: 16px 12px;
    cursor: pointer;
    background-color: #f1f1f1;
    border-radius: 8px;
    margin-bottom: 12px;
    transition: background-color 0.3s ease;
    font-size: 16px;
    font-weight: 700;

    &:hover {
        background-color: #007bff;
        color: white;
    }

    ${({ selected }) => selected && `
        background-color: #007bff;
        color: white;
    `}
`;

const ScheduleTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #007bff;
    color: white;
    text-align: left;
    font-size: 16px;
    letter-spacing: 1px;
`;

const TableCell = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    vertical-align: middle;
    display: table-cell;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    ${({ highlighted }) => highlighted && `
        background-color: rgba(0, 123, 255, 0.1);
        border: 2px solid #007bff;
    `}
`;

const Button = styled.button`
    padding: 12px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838;
    }

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    margin-left: 12px;
    transition: color 0.3s ease;

    &:hover {
        color: #555;
    }
`;

const TitleCustom = styled.h3`
    font-size: 20px;
`

const HeaderRightWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledSelect = styled.select`
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8f9fa;
    color: #495057;
    appearance: none;
    outline: none;
    transition: all 0.3s ease;

    &:hover {
        border-color: #007bff;
    }

    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    option {
        padding: 10px;
    }
`;

const syllabusDataUrl = import.meta.env.VITE_URL_SYLLABUS_DATA;
const bookUnitDataUrl = import.meta.env.VITE_URL_BOOK_UNIT_DATA;
const updateSyllabusUrl = import.meta.env.VITE_URL_UPDATE_SYLLABUS;

const Syllabus = () => {
    const { t, } = useTranslation();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [selectedRowForSwap, setSelectedRowForSwap] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [allSyllabusOutline, setAllSyllabusOutline] = useState([]);
    const [originalSessions, setOriginalSessions] = useState([...sessions]);
    const [selectedSessionForSwap, setSelectedSessionForSwap] = useState(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const [books, setBooks] = useState([]);
    const [unitMap, setUnitMap] = useState({});
    const [firstBookId, setFirstBookId] = useState(null);
    const [, setFirstBookName] = useState(null);
    const [loading, setLoading] = useState(true);
    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (fullData) {
        token = fullData.access_token
    }

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(syllabusDataUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const parsedData = JSON.parse(response.data.data);
            setAllSyllabusOutline(parsedData);
            const uniqueTemplates = [];
            const syllabusSet = new Set();
            parsedData.forEach((item) => {
                if (!syllabusSet.has(item.syllabus_id)) {
                    syllabusSet.add(item.syllabus_id);
                    uniqueTemplates.push(item);
                }
            });
            setTemplates(uniqueTemplates);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };

    const fetchBookUnitData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(bookUnitDataUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const parsedData = JSON.parse(response.data.data);

            const books = [];
            const bookSet = new Set();
            parsedData.forEach((item) => {
                if (!bookSet.has(item.book_id)) {
                    bookSet.add(item.book_id);
                    books.push({
                        book_id: item.book_id,
                        book_name: item.book_name,
                    });
                }
            });

            const unitMap = parsedData.reduce((map, item) => {
                if (!map[item.book_id]) {
                    map[item.book_id] = [];
                }
                map[item.book_id].push({
                    unit_id: item.unit_id,
                    unit_name: item.unit_name,
                });
                return map;
            }, {});
            setBooks(books);
            setUnitMap(unitMap);
            if (books.length > 0) {
                setFirstBookId(books[0].book_id);
                setFirstBookName(books[0].book_name);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching book and unit data:', error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        await Promise.all([fetchTemplates(), fetchBookUnitData()]);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        fetchBookUnitData();
    }, []);

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        const filteredSessions = allSyllabusOutline
            .filter((item) => item.syllabus_id === template.syllabus_id && item.syllabus_outline_id !== null)
            .sort((a, b) => a.ordialnum - b.ordialnum)
            .map((item, index) => ({
                ordialnum: index + 1,
                session: `Session ${index + 1}`,
                book_id: item.book_id || '',
                unit: item.unit_id || '',
                book_name: item.book_name || '',
            }));
        setSessions(filteredSessions);
        setOriginalSessions(filteredSessions);
    };


    const handleBookChange = (event, sessionId) => {
        const updatedSessions = sessions.map((session) =>
            session.ordialnum === sessionId
                ? { ...session, book_id: Number(event.target.value), unit: '' }
                : session
        );
        setSessions(updatedSessions);
        setIsDataChanged(true);
    };

    const handleUnitChange = (event, sessionId) => {
        const updatedSessions = sessions.map((session) =>
            session.ordialnum === sessionId ? { ...session, unit: Number(event.target.value) } : session
        );
        setSessions(updatedSessions);
        setIsDataChanged(true);
    };

    const handleAddSession = () => {
        const newSession = {
            ordialnum: sessions.length + 1,
            session: `Session ${sessions.length + 1}`,
            book_id: firstBookId,
        };
        const updatedSessions = [...sessions, newSession];
        setSessions(updatedSessions);
        setIsDataChanged(true);
    };


    // const handleSave = async () => {
    //     try {
    //         setLoading(true);

    //         const response = await axios.put(updateSyllabusUrl, {
    //             syllabusId: selectedTemplate.syllabus_id,
    //             updateData: JSON.stringify(sessions),
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         setIsDataChanged(false);
    //         await fetchData();
    //     } catch (error) {
    //         console.error('Error saving data:', error.message || error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSave = async () => {
        try {
            setLoading(true);

            // Kiểm tra và chuẩn hóa dữ liệu
            const validSessions = sessions.map(session => ({
                ...session,
                book_id: session.book_id || null, // Đặt null nếu trống
                unit: session.unit || null,      // Đặt null nếu trống
            }));

            const response = await axios.put(updateSyllabusUrl, {
                syllabusId: selectedTemplate.syllabus_id,
                updateData: JSON.stringify(validSessions),
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setIsDataChanged(false);
            await fetchData();
        } catch (error) {
            console.error('Error saving data:', error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSessions([...originalSessions]);
        setIsDataChanged(false);
    };

    const handleDeleteSession = (sessionId) => {
        const updatedSessions = sessions
            .filter((session) => session.ordialnum !== sessionId)
            .map((session, index) => ({
                ...session,
                ordialnum: index + 1,
            }));
        setSessions(updatedSessions);
        setIsDataChanged(true);
    };

    const handleMoveUp = (sessionId) => {
        const index = sessions.findIndex((session) => session.ordialnum === sessionId);
        if (index > 0) {
            const updatedSessions = [...sessions];
            [updatedSessions[index], updatedSessions[index - 1]] = [
                updatedSessions[index - 1],
                updatedSessions[index],
            ];
            setSessions(updatedSessions);
            setIsDataChanged(true);
        }
    };

    const handleMoveDown = (sessionId) => {
        const index = sessions.findIndex((session) => session.ordialnum === sessionId);
        if (index < sessions.length - 1) {
            const updatedSessions = [...sessions];
            [updatedSessions[index], updatedSessions[index + 1]] = [
                updatedSessions[index + 1],
                updatedSessions[index],
            ];
            setSessions(updatedSessions);
            setIsDataChanged(true);
        }
    };

    const handleSwapSessions = (sessionId) => {
        if (isSwapping) {
            if (selectedSessionForSwap) {
                const updatedSessions = [...sessions];
                const selectedSessionIndex = updatedSessions.findIndex(
                    (session) => session.ordialnum === selectedSessionForSwap.ordialnum
                );
                const swapSessionIndex = updatedSessions.findIndex(
                    (session) => session.ordialnum === sessionId
                );

                if (selectedSessionIndex !== -1 && swapSessionIndex !== -1) {
                    [updatedSessions[selectedSessionIndex], updatedSessions[swapSessionIndex]] = [
                        updatedSessions[swapSessionIndex],
                        updatedSessions[selectedSessionIndex],
                    ];
                    setSessions(updatedSessions);
                    setIsDataChanged(true);
                }
            }
            setSelectedSessionForSwap(null);
            setSelectedRowForSwap(null);
            setIsSwapping(false);
        } else {
            setSelectedSessionForSwap(sessions.find((session) => session.ordialnum === sessionId));
            setSelectedRowForSwap(sessionId);
            setIsSwapping(true);
        }
    };


    return (
        <>
            {loading && <Loading />}
            <Container>
                <LeftPanel>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TitleCustom>{t('available templates')}</TitleCustom>
                        <Button onClick={() => setIsModalOpen(true)}>{t('add new template')}</Button>
                    </div>
                    <TemplateList>
                        {templates.map(template => (
                            <TemplateItem
                                key={template.syllabus_id}
                                onClick={() => handleTemplateClick(template, sessions)}
                                selected={selectedTemplate?.syllabus_id === template.syllabus_id}
                            >
                                {template.syllabus_name}
                            </TemplateItem>
                        ))}
                    </TemplateList>
                </LeftPanel>

                <RightPanel>
                    <HeaderRightWrapper>
                        <TitleCustom>{t('sessions list')}</TitleCustom>
                        <ButtonGroup>
                            <Button
                                onClick={handleAddSession}
                                disabled={!selectedTemplate}
                            >
                                {t('add session')}
                            </Button>

                            <Button onClick={handleSave} disabled={!isDataChanged}>{t('save')}</Button>
                            <Button onClick={handleReset} disabled={!isDataChanged}>{t('reset')}</Button>
                        </ButtonGroup>
                    </HeaderRightWrapper>

                    <ScheduleTable>
                        <thead>
                            <tr>
                                <TableHeader>{t('session')}</TableHeader>
                                <TableHeader>{t('book')}</TableHeader>
                                <TableHeader>{t('unit')}</TableHeader>
                                <TableHeader>{t('actions')}</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.ordialnum}>
                                    <TableCell
                                        highlighted={selectedRowForSwap === session.ordialnum}>{session.session}</TableCell>
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        <StyledSelect
                                            value={session.book_id || ''}
                                            onChange={(e) => handleBookChange(e, session.ordialnum)}
                                        >
                                            <option value="" disabled>
                                                {t('select book')}
                                            </option>
                                            {books.map((book) => (
                                                <option key={book.book_id} value={book.book_id}>
                                                    {book.book_name}
                                                </option>
                                            ))}
                                        </StyledSelect>

                                    </TableCell>
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        <StyledSelect
                                            value={session.unit || ''}
                                            onChange={(e) => handleUnitChange(e, session.ordialnum)}
                                        >
                                            <option value="" disabled>
                                                {t('select unit')}
                                            </option>
                                            {(unitMap[session.book_id] || []).map((unit) => (
                                                <option key={unit.unit_id} value={unit.unit_id}>
                                                    {unit.unit_name}
                                                </option>
                                            ))}
                                        </StyledSelect>

                                    </TableCell>
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        <IconButton onClick={() => handleDeleteSession(session.ordialnum)}>
                                            <FaTrashAlt />
                                        </IconButton>
                                        <IconButton onClick={() => handleMoveUp(session.ordialnum)}>
                                            <FaArrowUp />
                                        </IconButton>
                                        <IconButton onClick={() => handleMoveDown(session.ordialnum)}>
                                            <FaArrowDown />
                                        </IconButton>
                                        <IconButton onClick={() => handleSwapSessions(session.ordialnum)}>
                                            {isSwapping && selectedSessionForSwap?.id === session.ordialnum ? (
                                                <FaTimes />
                                            ) : (
                                                <FaExchangeAlt />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </tr>
                            ))}
                        </tbody>
                    </ScheduleTable>
                </RightPanel>

                {isModalOpen && (
                    <CreateTemplateModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={fetchData}
                        templates={templates}
                    />
                )}
            </Container>
        </>
    );
};

export default Syllabus;