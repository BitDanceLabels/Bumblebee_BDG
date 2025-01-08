import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import CreateTemplateModal from '../modal/CreatEbookModal.jsx';

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

const Syllabus = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
    const [bookList, setBookList] = useState([]); // Đổi tên state từ books thành bookList
    const [unitMap, setUnitMap] = useState({});
    const [firstBookId, setFirstBookId] = useState(null);
    const [, setFirstBookName] = useState(null);
    const [loading, setLoading] = useState(true);
    const student_id = location.state?.student_id || null; // Lấy student_id từ state
    console.log('Received Student ID:', student_id); // In giá trị student_id
    const [studentName, setStudentName] = useState('');
    const [unitNameList, setUnitNameList] = useState([]);
    const [sessionEbook, setSessionEbook] = useState([]); // Đổi tên sessions thành sessionEbook
    const [originalSessionEbook, setOriginalSessionEbook] = useState([]); // Đổi tên originalSessions thành originalSessionEbook
    const [linkDocument, setLinkDocument] = useState('');

    const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL; // Lấy URL gốc từ biến môi trường

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        console.log(token)
    }


    const fetchBooks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${API_BASE_URL}/api/book`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                // Trực tiếp gán response.data vào state bookList
                const bookList = response.data.map((book) => ({
                    book_id: book.book_id,
                    book_name: book.book_name,
                    created_by: book.created_by,
                    created_by_name: book.created_by_name,
                    created_by_date: book.created_by_date,
                    modified_by: book.modified_by,
                    modified_by_name: book.modified_by_name,
                    modified_by_date: book.modified_by_date,
                    link_document: book.link_document,
                }));

                console.log("Books:", JSON.stringify(bookList, null, 2)); // Kiểm tra dữ liệu
                setBookList(bookList); // Lưu dữ liệu vào state bookList
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error.response?.data || error.message);
            setLoading(false);
        }
    };


    const fetchBookById = async (bookId, token) => {
        try {
            console.log(`Fetching book details for ID: ${bookId}`);

            const response = await axios.get(`${API_BASE_URL}/api/book/${bookId}/units`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const parsedData = JSON.parse(response.data?.data || '[]'); // Nếu response.data hoặc data null, trả về mảng rỗng
            console.log("Parsed Book Details:", parsedData);

            setSessionEbook(parsedData); // Lưu dữ liệu vào state
            setOriginalSessionEbook(parsedData); // Lưu dữ liệu gốc

            // Cập nhật unitNameList chỉ với dữ liệu mới
            const updatedUnitNameList = parsedData
                .filter((unit) => unit.unit_name && unit.unit_name.trim() !== '') // Lọc unit_name hợp lệ
                .map((unit) => unit.unit_name); // Lấy danh sách unit_name

            setUnitNameList([...new Set(updatedUnitNameList)]); // Loại bỏ trùng lặp

            return parsedData; // Trả về dữ liệu đã parse
        } catch (error) {
            console.error(`Error fetching book details for ID ${bookId}:`, error);

            // Đặt state sessionEbook và unitNameList thành mảng rỗng nếu có lỗi
            setSessionEbook([]);
            setOriginalSessionEbook([]);
            setUnitNameList([]);

            return []; // Trả về mảng rỗng
        }
    };

    const updateBookAndUnits = async (updateData) => {
        try {
            setLoading(true); // Bắt đầu trạng thái loading

            const response = await axios.put(`${API_BASE_URL}/api/update_book_and_units`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Update response:", response.data); // In kết quả trả về
            setLoading(false); // Kết thúc trạng thái loading
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error updating book and units:", error.response?.data || error.message);
            setLoading(false);
            throw error; // Ném lỗi để xử lý
        }
    };


    const createBook = async (newBookData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/book`, newBookData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Book created successfully:", response.data); // Kiểm tra kết quả trả về
            return response.data; // Trả về dữ liệu sách vừa tạo
        } catch (error) {
            console.error("Error creating book:", error.response?.data || error.message); // Hiển thị lỗi nếu có
            throw error; // Ném lỗi để xử lý ở cấp độ cao hơn
        }
    };


    const fetchStudentIdBySyllabusId = async (syllabusId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/syllabus/${syllabusId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const studentId = response.data.student_id; // Lấy student_id từ response
            console.log("Student ID:", studentId);
            return studentId;
        } catch (error) {
            console.error("Error fetching student ID by syllabus ID:", error);
            throw error;
        }
    };
    const fetchStudentNameById = async (studentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const nameStudent = response.data.name_student; // Lấy name_student từ response
            console.log("Student Name:", nameStudent);
            return nameStudent;
        } catch (error) {
            console.error("Error fetching student name by ID:", error);
            throw error;
        }
    };


    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/syllabus_data`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const parsedData = JSON.parse(response.data.data);
            console.log("Khoá học:", parsedData);
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

            // Lấy tên học viên từ syllabus_id
            if (uniqueTemplates.length > 0) {
                const syllabusId = uniqueTemplates[0]?.syllabus_id; // Lấy syllabus_id đầu tiên
                if (syllabusId) {
                    console.log("Syllabus ID:", syllabusId);

                    // Lấy student_id từ syllabus_id
                    const studentId = await fetchStudentIdBySyllabusId(syllabusId);

                    if (studentId) {
                        console.log("Student ID:", studentId);

                        // Lấy name_student từ student_id
                        const nameStudent = await fetchStudentNameById(studentId);

                        if (nameStudent) {
                            console.log("Student Name:", nameStudent);
                            setStudentName(nameStudent); // Lưu tên học viên vào state
                        } else {
                            console.error("No student name found.");
                        }
                    } else {
                        console.error("No student ID found.");
                    }
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };


    console.log('Received Student ID:', student_id); // In giá trị student_id
    useEffect(() => {
        if (student_id) {
            console.log('Received Student ID:', student_id); // In giá trị student_id
            setIsModalOpen(true); // Tự động mở modal chọn template
        }
    }, [student_id]);

    const fetchBookUnitData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/book_unit_data', {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcWgyOTA1MjAwM0BnbWFpbC5jb20iLCJleHAiOjE3MzY5MTIwMDZ9.LaQjQ5DAxwJqXwWVlJ9CNZl_dFtkU3J8MMRZNkS-yqM',
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
            console.log('unitMap', unitMap);
            console.log('books', books);
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
        fetchBooks();
    }, []);
    console.log("Current sessionEbook:", sessionEbook);

    useEffect(() => {
        fetchBookUnitData();
    }, []);


    const handleTemplateClick = async (book) => {
        setSessionEbook([]); // Xóa dữ liệu cũ trước khi fetch mới
        setOriginalSessionEbook([]);
        setUnitNameList([]); // Đặt danh sách unitNameList về rỗng
        setLinkDocument(''); // Đặt lại linkDocument về giá trị rỗng
        setSelectedTemplate(book);
        try {
            setLoading(true); // Hiển thị trạng thái loading
            setSelectedTemplate(book); // Lưu sách được chọn vào state

            console.log(`Fetching details for book ID: ${book.book_id}`);

            // Gọi API để lấy dữ liệu chi tiết sách
            const bookDetails = await fetchBookById(book.book_id, token);
            /// Lưu link_document của sách vào state
            const documentLink = book.link_document || ''; // Lấy giá trị link_document từ book
            setLinkDocument(documentLink);
            console.log("Current link_document:", documentLink); // In giá trị link_document trực tiếp
            // Chuyển đổi dữ liệu API trả về thành dạng sessions
            const formattedSessions = bookDetails.units.map((unit, index) => ({
                ordialnum: index + 1, // Số thứ tự
                session: `Session ${index + 1}`, // Tên session
                book_id: book.book_id, // ID sách
                unit: unit.unit_id || '', // ID đơn vị
                unitName: unit.unit_name || '', // Tên đơn vị
                unitParent: unit.unit_parent || '', // Đơn vị cha
            }));

            console.log("Formatted Sessions:", formattedSessions);

            setSessions(formattedSessions); // Cập nhật state `sessions`
            setOriginalSessions(formattedSessions); // Lưu bản sao để reset nếu cần
            setLoading(false); // Ẩn trạng thái loading
        } catch (error) {
            console.error("Error fetching book details:", error);
            setLoading(false); // Ẩn trạng thái loading nếu lỗi
        }
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

    // const handleAddSession = () => {
    //     const newSession = {
    //         ordialnum: sessions.length + 1,
    //         session: `Session ${sessions.length + 1}`,
    //         book_id: firstBookId,
    //     };
    //     const updatedSessions = [...sessions, newSession];
    //     setSessions(updatedSessions);
    //     setIsDataChanged(true);
    // };
    const handleAddSession = () => {
        const newSession = {
            ordialnum: sessionEbook.length + 1, // Dùng sessionEbook thay vì sessions
            unit_name: '', // Giá trị mặc định
            unit_parent: '', // Giá trị mặc định
            session: `Session ${sessionEbook.length + 1}`, // Nếu cần tên session
            book_id: firstBookId, // Giữ nguyên logic book_id
        };
        const updatedSessionEbook = [...sessionEbook, newSession];
        setSessionEbook(updatedSessionEbook);
        setIsDataChanged(true);
    };

    const prepareFinalUpdatingBookUnit = () => {
        const finalData = {
            book_id: selectedTemplate?.book_id || null, // Lấy book_id từ selectedTemplate
            link_document: linkDocument || '', // Sử dụng giá trị link_document đã cập nhật
            units: sessionEbook.map((unit) => ({
                unit_name: unit.unit_name || '', // Tên đơn vị
                ordialnum: unit.ordialnum || 0, // Số thứ tự
                unit_parent: unit.unit_parent || null, // Đơn vị cha
            })),
        };

        // console.log("Final Updating Book Unit Data:", finalData);
        return finalData;
    };

    // Theo dõi thay đổi của sessionEbook
    useEffect(() => {
        console.log("Current sessionEbook:", sessionEbook); // In ra giá trị mới nhất
        const finalData = prepareFinalUpdatingBookUnit(); // Gọi hàm chuẩn bị dữ liệu
        console.log("Final Updating Book Unit:", finalData); // In ra console
    }, [sessionEbook, linkDocument]); // Theo dõi sự thay đổi của sessionEbook và linkDocument


    // const handleSave = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch('http://127.0.0.1:8000/api/update_syllabus', {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcWgyOTA1MjAwM0BnbWFpbC5jb20iLCJleHAiOjE3MzY5MTIwMDZ9.LaQjQ5DAxwJqXwWVlJ9CNZl_dFtkU3J8MMRZNkS-yqM',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 syllabusId: selectedTemplate.syllabus_id,
    //                 updateData: JSON.stringify(sessions),
    //             }),
    //         });

    //         const data = await response.json();
    //         console.log('Data saved', data);
    //         setIsDataChanged(false);
    //         await fetchData();
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //         setLoading(false);
    //     }
    // };
    const handleSave = async () => {
        try {
            setLoading(true); // Hiển thị trạng thái loading

            // Chuẩn bị dữ liệu cuối cùng từ sessionEbook và linkDocument
            const finalUpdatingBookUnit = prepareFinalUpdatingBookUnit();

            console.log("Final data to save:", finalUpdatingBookUnit); // Kiểm tra dữ liệu trước khi gửi

            // Gọi API updateBookAndUnits với dữ liệu đã chuẩn bị
            const response = await updateBookAndUnits(finalUpdatingBookUnit);

            console.log('Data saved successfully:', response); // Kiểm tra phản hồi từ API

            setIsDataChanged(false); // Đặt lại trạng thái đã lưu
            await fetchData(); // Làm mới dữ liệu
            setLoading(false); // Ẩn trạng thái loading
        } catch (error) {
            console.error('Error saving data:', error); // In ra lỗi nếu có
            setLoading(false); // Ẩn trạng thái loading nếu lỗi xảy ra
        }
    };

    // const handleReset = () => {
    //     setSessions([...originalSessions]);
    //     setIsDataChanged(false);
    // };
    const handleReset = () => {
        setSessionEbook([...originalSessionEbook]); // Sử dụng sessionEbook thay vì sessions
        setIsDataChanged(false); // Đặt lại trạng thái không có thay đổi
    };

    // const handleDeleteSession = (sessionId) => {
    //     const updatedSessions = sessions
    //         .filter((session) => session.ordialnum !== sessionId)
    //         .map((session, index) => ({
    //             ...session,
    //             ordialnum: index + 1,
    //         }));
    //     setSessions(updatedSessions);
    //     setIsDataChanged(true);
    // };
    const handleDeleteSession = (sessionId) => {
        const updatedSessionEbook = sessionEbook
            .filter((session) => session.ordialnum !== sessionId)
            .map((session, index) => ({
                ...session,
                ordialnum: index + 1, // Cập nhật lại thứ tự
            }));
        setSessionEbook(updatedSessionEbook);
        setIsDataChanged(true);
    };

    // const handleMoveUp = (sessionId) => {
    //     const index = sessions.findIndex((session) => session.ordialnum === sessionId);
    //     if (index > 0) {
    //         const updatedSessions = [...sessions];
    //         [updatedSessions[index], updatedSessions[index - 1]] = [
    //             updatedSessions[index - 1],
    //             updatedSessions[index],
    //         ];
    //         setSessions(updatedSessions);
    //         setIsDataChanged(true);
    //     }
    // };

    const handleMoveUp = (sessionId) => {
        const index = sessionEbook.findIndex((session) => session.ordialnum === sessionId);
        if (index > 0) {
            const updatedSessionEbook = [...sessionEbook];
            [updatedSessionEbook[index], updatedSessionEbook[index - 1]] = [
                updatedSessionEbook[index - 1],
                updatedSessionEbook[index],
            ];
            setSessionEbook(updatedSessionEbook);
            setIsDataChanged(true);
        }
    };

    // const handleMoveDown = (sessionId) => {
    //     const index = sessions.findIndex((session) => session.ordialnum === sessionId);
    //     if (index < sessions.length - 1) {
    //         const updatedSessions = [...sessions];
    //         [updatedSessions[index], updatedSessions[index + 1]] = [
    //             updatedSessions[index + 1],
    //             updatedSessions[index],
    //         ];
    //         setSessions(updatedSessions);
    //         setIsDataChanged(true);
    //     }
    // };
    const handleMoveDown = (sessionId) => {
        const index = sessionEbook.findIndex((session) => session.ordialnum === sessionId);
        if (index < sessionEbook.length - 1) {
            const updatedSessionEbook = [...sessionEbook];
            [updatedSessionEbook[index], updatedSessionEbook[index + 1]] = [
                updatedSessionEbook[index + 1],
                updatedSessionEbook[index],
            ];
            setSessionEbook(updatedSessionEbook);
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



    const StudentName = styled.a`
    font-size: 24px; /* Tăng kích thước chữ */
    font-weight: bold; /* Làm đậm chữ */
    color: #007bff; /* Màu chữ (xanh) */
    text-transform: capitalize; /* Viết hoa chữ cái đầu */
    margin: 10px 0; /* Thêm khoảng cách bên trên và dưới */
    display: inline-block; /* Hiển thị dưới dạng khối nội dòng */
`;

    return (
        <>
            {loading && <Loading />}
            <Container>
                <LeftPanel>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TitleCustom>{t('available ebook')}</TitleCustom>
                        <Button onClick={() => setIsModalOpen(true)}>{t('add new ebook')}</Button>
                    </div>
                    <TemplateList>

                        {/* {templates.map(template => (
                            <TemplateItem
                                key={template.syllabus_id}
                                onClick={() => handleTemplateClick(template, sessions)}
                                selected={selectedTemplate?.syllabus_id === template.syllabus_id}
                            >
                                {template.syllabus_name}
                            </TemplateItem>
                        ))}*/}

                        {bookList.map((book) => (
                            <TemplateItem
                                key={book.book_id} // Sử dụng book_id làm key duy nhất
                                onClick={() => handleTemplateClick(book)} // Gọi hàm xử lý khi click vào một book
                                selected={selectedTemplate?.book_id === book.book_id} // So sánh để đánh dấu item được chọn
                            >
                                {book.book_name} {/* Hiển thị tên sách */}
                            </TemplateItem>
                        ))}


                    </TemplateList>
                </LeftPanel>

                <RightPanel>
                    <HeaderRightWrapper>
                        <TitleCustom>{t('Drive Document :')}</TitleCustom>
                        <input
                            type="text"
                            value={linkDocument}
                            // onChange={(e) => setLinkDocument(e.target.value)} // Cập nhật giá trị tạm thời
                            onChange={(e) => {
                                const newLink = e.target.value; // Lấy giá trị mới
                                setLinkDocument(newLink); // Cập nhật state
                                console.log("Updated link_document:", newLink); // In giá trị mới ra console
                            }}
                            placeholder={t('Enter or update document link')}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        />

                        {/* <StudentName>{studentName || 'Chưa có tên học viên'}</StudentName> */}
                        {/* <a>{studentName || 'Chưa có tên học viên'}</a> Hiển thị tên học viên */}

                        {/* <ButtonGroup>
                            <Button
                                onClick={handleAddSession}
                                disabled={!selectedTemplate}
                            >
                                {t('add session')}
                            </Button>

                            <Button onClick={handleSave} disabled={!isDataChanged}>{t('save')}</Button>
                            <Button onClick={handleReset} disabled={!isDataChanged}>{t('reset')}</Button>
                        </ButtonGroup> */}
                    </HeaderRightWrapper>
                    <HeaderRightWrapper>
                        <TitleCustom>{t('sessions list')}</TitleCustom>
                        <ButtonGroup>
                            <Button
                                onClick={handleAddSession}
                                disabled={!selectedTemplate}
                            >
                                {t('add unit')}
                            </Button>

                            <Button onClick={handleSave} disabled={!isDataChanged}>{t('save')}</Button>
                            <Button onClick={handleReset} disabled={!isDataChanged}>{t('reset')}</Button>
                        </ButtonGroup>
                    </HeaderRightWrapper>

                    <ScheduleTable>
                        <thead>
                            <tr>
                                <TableHeader>{t('Chapter')}</TableHeader>
                                <TableHeader>{t('Unit Name')}</TableHeader>
                                <TableHeader>{t('Unit Parent')}</TableHeader>
                                <TableHeader>{t('actions')}</TableHeader>
                            </tr>
                        </thead>

                        <tbody>
                            {sessionEbook.map((session) => (
                                <tr key={session.ordialnum}>
                                    {/* Ordinal */}
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        {session.ordialnum}
                                    </TableCell>

                                    {/* Unit Name */}
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        <input
                                            type="text"
                                            value={session.unit_name || ''}
                                            onChange={(e) => {
                                                const updatedSessionEbook = sessionEbook.map((s) =>
                                                    s.ordialnum === session.ordialnum
                                                        ? { ...s, unit_name: e.target.value }
                                                        : s
                                                );
                                                setSessionEbook(updatedSessionEbook);
                                                setIsDataChanged(true);

                                                // Cập nhật danh sách Unit Name
                                                const updatedUnitNameList = updatedSessionEbook
                                                    .filter((s) => s.unit_name && s.unit_name.trim() !== '') // Lọc những Unit Name không rỗng
                                                    .map((s) => s.unit_name); // Lấy danh sách Unit Name
                                                setUnitNameList([...new Set(updatedUnitNameList)]); // Loại bỏ trùng lặp
                                            }}
                                            placeholder={t('Enter unit name')}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                fontSize: '14px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </TableCell>

                                    {/* Unit Parent */}
                                    <TableCell highlighted={selectedRowForSwap === session.ordialnum}>
                                        <select
                                            value={session.unit_parent || ''}
                                            onChange={(e) => {
                                                const updatedSessionEbook = sessionEbook.map((s) =>
                                                    s.ordialnum === session.ordialnum
                                                        ? { ...s, unit_parent: e.target.value }
                                                        : s
                                                );
                                                setSessionEbook(updatedSessionEbook);
                                                setIsDataChanged(true);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                fontSize: '14px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <option value="" disabled>
                                                {t('Select parent unit')}
                                            </option>
                                            {unitNameList.map((name, index) => (
                                                <option key={index} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </TableCell>

                                    {/* Actions */}
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
                                            {isSwapping && selectedSessionForSwap?.ordialnum === session.ordialnum ? (
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
                        studentId={student_id} // Truyền student_id vào modal
                    />
                )}
            </Container>
        </>
    );
};

export default Syllabus;