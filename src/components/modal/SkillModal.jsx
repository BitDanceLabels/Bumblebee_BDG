import {useState} from 'react'
import styled from 'styled-components'
import {FaTimes, FaPlus, FaEdit, FaSave} from 'react-icons/fa'
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
    max-width: 500px;
    width: 100%;
`

const SkillCard = styled.div`
    display: flex;
    align-items: center;
    background: #f1f1f1;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px 10px;
    margin-bottom: 10px;
    justify-content: space-between;
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

const SkillInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    margin-top: 10px;
`

const Title = styled.h2`
    text-align: center;
    margin-bottom: 2rem;
`

// eslint-disable-next-line react/prop-types
const SkillModal = ({skills: initialSkills, onClose, onEditSkill}) => {
    const {t} = useTranslation();
    const [skills, setSkills] = useState(initialSkills)
    const [newSkill, setNewSkill] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)
    const [editedValue, setEditedValue] = useState('')

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            const updatedSkills = [...skills, newSkill]
            setSkills(updatedSkills)
            onEditSkill(updatedSkills)
            setNewSkill('')
            setShowInput(false)
        }
    }

    const handleEditClick = (index) => {
        setEditingIndex(index)
        setEditedValue(skills[index])
    }

    const handleSaveClick = (index) => {
        if (editedValue.trim()) {
            const updatedSkills = [...skills]
            updatedSkills[index] = editedValue
            setSkills(updatedSkills)
            console.log('updatedSkills', updatedSkills)
            setEditingIndex(null)
            setEditedValue('')
            onEditSkill(updatedSkills)
        }
    }

    const handleDeleteSkill = (skillToDelete) => {
        const updatedSkills = skills.filter((skill) => skill !== skillToDelete)
        setSkills(updatedSkills)
        onEditSkill(updatedSkills)
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Title>{t('certificates')}</Title>
                {skills.map((skill, index) => (
                    <SkillCard key={index}>
                        {editingIndex === index ? (
                            <SkillInput
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveClick(index)}
                            />
                        ) : (
                            <span>{skill}</span>
                        )}
                        <div style={{display: 'flex', gap: '10px'}}>
                            {editingIndex === index ? (
                                <FaSave onClick={() => handleSaveClick(index)} style={{cursor: 'pointer'}}/>
                            ) : (
                                <FaEdit onClick={() => handleEditClick(index)} style={{cursor: 'pointer'}}/>
                            )}
                            <FaTimes onClick={() => handleDeleteSkill(skill)} style={{cursor: 'pointer'}}/>
                        </div>
                    </SkillCard>
                ))}
                {showInput && (
                    <SkillInput
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder={t('enter new skill')}
                    />
                )}
                {!showInput && (
                    <AddSkillButton onClick={() => setShowInput(true)}>
                        <FaPlus style={{marginRight: '5px'}}/> {t('add skill')}
                    </AddSkillButton>
                )}
            </ModalContent>
        </ModalOverlay>
    )
}

export default SkillModal
