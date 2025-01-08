import {useState, useEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Loading from "../General/Loading.jsx";

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
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: auto;
    max-width: 90%;
    display: inline-block;
    transition: all 0.3s ease;
`;

const Container = styled.div`
    padding: 0 10px;
    font-size: 20px;
`;

const WrapperAll = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
`;

const WrapperHeader = styled.div`
    text-align: center;
`;

const TitleCustom = styled.h3``;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #e0e0e0;
    }

    &.submit {
        background: #4caf50;
        color: white;

        &:hover {
            background: #45a049;
        }
    }

    &.cancel {
        background: #f44336;
        color: white;

        &:hover {
            background: #d32f2f;
        }
    }
`;

const Select = styled.select`
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
`;

const LabelCustom = styled.label`
    margin-bottom: 20px;
`;

// eslint-disable-next-line react/prop-types
const AddSyllabusToStudentModal = ({isOpen, onClose, onSubmit, student}) => {
    const {t} = useTranslation();
    const [template, setTemplate] = useState([]);
    const fullData = JSON.parse(localStorage.getItem("fullData"));
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = fullData?.access_token || "";

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/syllabus",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTemplate(response.data);
            } catch (error) {
                console.error("Error fetching template:", error);
            }
        };
        fetchTemplate();
    }, [token]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        console.log(selectedTemplateId);
        const url = `http://127.0.0.1:8000/api/update_student_circle_by_student_id`;
        try {
            setLoading(true);
            await axios.put(url, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    // eslint-disable-next-line react/prop-types
                    studentId: student.student_id,
                    syllabusId: selectedTemplateId,
                },
            });
            onSubmit();
            onClose();
            setLoading(false);
        } catch (error) {
            console.error('Error calling API:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading/>}
            <ModalOverlay onClick={onClose}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <Container>
                        <WrapperAll>
                            <WrapperHeader>
                                <TitleCustom>{t("add syllabus to student")}</TitleCustom>
                            </WrapperHeader>

                            <div>
                                <LabelCustom htmlFor="templateSelect">{t("select template")}:</LabelCustom>
                                <Select
                                    id="templateSelect"
                                    value={selectedTemplateId || ""}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                >
                                    <option value="" disabled>
                                        {t("Please select a template")}
                                    </option>
                                    {template.map((item) => (
                                        <option key={item.syllabus_id} value={item.syllabus_id}>
                                            {item.syllabus_name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </WrapperAll>
                        <ButtonGroup>
                            <Button className="cancel" onClick={onClose}>
                                {t("cancel")}
                            </Button>
                            <Button className="submit" onClick={handleSubmit}>
                                {t("submit")}
                            </Button>
                        </ButtonGroup>
                    </Container>
                </ModalContent>
            </ModalOverlay>
        </>
    );
};

export default AddSyllabusToStudentModal;