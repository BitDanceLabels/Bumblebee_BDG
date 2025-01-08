// CreateTemplateModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useTranslation } from "react-i18next";
import Loading from "../General/Loading.jsx";
import axios from 'axios';

// Styled components cho modal
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const SelectField = styled.select`
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        background-color: #45a049;
    }
`;

const CancelButton = styled(Button)`
    background-color: #f44336;
    margin-right: 10px;
    font-weight: bold;

    &:hover {
        background-color: #e53935;
    }
`;

const TitleCustom = styled.h3`
    font-size: 20px;
    text-align: center;
    margin-bottom: 10px;
`

// eslint-disable-next-line react/prop-types
const CreateTemplateModal = ({ isOpen, onClose, onSave, templates = [], studentId }) => {
    const { t, } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [duration, setDuration] = useState(0);
    const [linkDocument, setLinkDocument] = useState(''); // Khởi tạo state linkDocument

    const navigate = useNavigate();
    const location = useLocation();
    const student_id = location.state?.student_id || null; // Lấy student_id từ state
    const name_student = location.state?.name_student || "Unknown";
    console.log('Received Student I syllabus :', student_id); // In giá trị student_id
    console.log('Received Student Name:', name_student);

    const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL; // Lấy URL gốc từ biến môi trường

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    const handleCreate = async () => {
        if (selectedTemplate === '') {
            setSelectedTemplate(0);
        }

        if (templateName) {
            setLoading(true);
            try {
                // Create new book data object based on API specifications
                const newBookData = {
                    book_name: templateName, // Using templateName for the book_name
                    // created_by: 1, // Assuming this is the ID of the creator
                    // created_by_name: "Admin", // Assuming "Admin" as the creator's name
                    // created_by_date: new Date().toISOString(), // Current date in ISO format
                    link_document: linkDocument || null, // Optional document link
                };

                // Call the new book creation API
                const response = await axios.post(`${API_BASE_URL}/api/book`, newBookData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Book created successfully:", response.data); // Log success response
                onSave(); // Trigger onSave callback
                setLoading(false);
                onClose(); // Close modal
            } catch (error) {
                console.error("Error creating book:", error.response?.data || error.message); // Log error
                setLoading(false);
            }
        } else {
            console.error("Missing templateName or selectedTemplate"); // Validation error message
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
    return isOpen ? (
        <>
            {loading && <Loading />}
            <ModalOverlay>
                <ModalContent>
                    <TitleCustom>{t('create new ebook')}</TitleCustom>
                    {/* <TitleCustom>{`${t('Name Student')}: ${name_student}`}</TitleCustom> */}
                    <InputField
                        type="text"
                        placeholder={t('enter ebook name')}
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />

                    <InputField
                        type="text"
                        placeholder="Enter link document (optional)"
                        value={linkDocument} // Liên kết với state linkDocument
                        onChange={(e) => setLinkDocument(e.target.value)} // Cập nhật state linkDocument
                    />


                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
                        <Button onClick={handleCreate}>{t('submit')}</Button>
                    </div>
                </ModalContent>
            </ModalOverlay>
        </>
    ) : null;
};

export default CreateTemplateModal;
