import {useState} from 'react'
import styled from 'styled-components'
import {FaTimes, FaEdit, FaPlus, FaSave} from 'react-icons/fa'
import {useTranslation} from "react-i18next";

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 100%;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`

const Title = styled.h2`
    margin: 0;
`

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
`

const ResultList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`

const ResultItem = styled.li`
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const SkillInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    margin-top: 10px;
`

const AddSkillButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 16px;

    &:hover {
        background-color: #0056b3;
    }
`

// eslint-disable-next-line react/prop-types
const DemoResultModal = ({demoResults, onClose, onEditDemoResult}) => {
    const {t,} = useTranslation();
    const [notes, setNotes] = useState(demoResults)
    const [newNote, setNewNote] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)
    const [editedValue, setEditedValue] = useState('')

    const handleAddNote = () => {
        setShowInput(true)
    }

    const handleSaveNewNote = () => {
        if (newNote.trim()) {
            const updatedNotes = [...notes, {note: newNote}]
            setNotes(updatedNotes)
            setNewNote('')
            setShowInput(false)
            onEditDemoResult(updatedNotes)
        }
    }

    const handleEditClick = (index) => {
        setEditingIndex(index)
        setEditedValue(notes[index].note)
    }

    const handleSaveClick = (index) => {
        if (editedValue.trim()) {
            const updatedNotes = [...notes]
            updatedNotes[index] = {...updatedNotes[index], note: editedValue}
            setNotes(updatedNotes)
            onEditDemoResult(updatedNotes)
            setEditingIndex(null)
            setEditedValue('')
        }
    }

    const handleDeleteNote = (index) => {
        const updatedNotes = notes.filter((_, i) => i !== index)
        setNotes(updatedNotes)
        onEditDemoResult(updatedNotes)
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <Title>{t('demo results')}</Title>
                    <CloseButton onClick={onClose}><FaTimes/></CloseButton>
                </ModalHeader>
                {notes.length > 0 ? (
                    <ResultList>
                        {notes.map((result, index) => (
                            <ResultItem key={index}>
                                {editingIndex === index ? (
                                    <SkillInput
                                        type="text"
                                        value={editedValue}
                                        onChange={(e) => setEditedValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveClick(index)}
                                    />
                                ) : (
                                    <span>{result.note}</span>
                                )}
                                <div style={{display: 'flex', gap: '10px'}}>
                                    {editingIndex === index ? (
                                        <FaSave onClick={() => handleSaveClick(index)} style={{cursor: 'pointer'}}/>
                                    ) : (
                                        <FaEdit onClick={() => handleEditClick(index)} style={{cursor: 'pointer'}}/>
                                    )}
                                    <FaTimes onClick={() => handleDeleteNote(index)} style={{cursor: 'pointer'}}/>
                                </div>
                            </ResultItem>
                        ))}
                    </ResultList>
                ) : (
                    <p>{t('no demo results available')}</p>
                )}
                {showInput && (
                    <SkillInput
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNewNote()}
                        placeholder={t('enter new note')}
                    />
                )}
                {!showInput && (
                    <AddSkillButton onClick={handleAddNote}>
                        <FaPlus style={{marginRight: '5px'}}/> {t('add note')}
                    </AddSkillButton>
                )}
            </ModalContent>
        </ModalOverlay>
    )
}

export default DemoResultModal