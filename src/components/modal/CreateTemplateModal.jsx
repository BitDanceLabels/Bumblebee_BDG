import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import Loading from "../General/Loading.jsx";
import axios from 'axios';

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

const apiCreateSyllabusUrl = import.meta.env.VITE_URL_CREATE_SYLLABUS;

// eslint-disable-next-line react/prop-types
const CreateTemplateModal = ({ isOpen, onClose, onSave, templates = [] }) => {
    const { t, } = useTranslation();
    const fullData = JSON.parse(localStorage.getItem("fullData"));
    const token = fullData?.access_token || "";
    const [loading, setLoading] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleCreate = async () => {
        if (selectedTemplate === '') {
            setSelectedTemplate(0)
        }

        if (templateName) {
            setLoading(true);
            try {
                const response = await axios.post(apiCreateSyllabusUrl,
                    null,
                    {
                        params: {
                            sourceSyllabusId: selectedTemplate,
                            syllabusName: templateName,
                            duration: duration,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                onSave();
                setLoading(false);
                onClose();
            } catch (error) {
                console.error("Error calling API: ", error);
                setLoading(false);
            }
        } else {
            console.error("Missing templateName or selectedTemplate");
        }
    };

    return isOpen ? (
        <>
            {loading && <Loading />}
            <ModalOverlay>
                <ModalContent>
                    <TitleCustom>{t('create new template')}</TitleCustom>
                    <InputField
                        type="text"
                        placeholder={t('enter template name')}
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <SelectField
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                        <option value="">{t('blank template')}</option>
                        {Array.isArray(templates) && templates.length > 0 ? (
                            templates.map((template) => (
                                <option key={template.syllabus_id} value={template.syllabus_id}>
                                    {template.syllabus_name}
                                </option>
                            ))
                        ) : (
                            <option disabled>{t('no templates available')}</option>
                        )}
                    </SelectField>
                    {!selectedTemplate && (
                        <InputField
                            type="number"
                            placeholder={t('enter duration')}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    )}

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