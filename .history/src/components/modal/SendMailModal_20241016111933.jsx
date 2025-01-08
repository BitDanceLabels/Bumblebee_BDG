import React, { useState } from 'react'
import styled from 'styled-components'

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
`

const CloseButton = styled.button`
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
`

const TitleCustom = styled.h3`
  text-align: center;
`

const InputCustom = styled.input`
  font-size: 2rem;
  margin: 0 1.5rem;
`

const SendMailModal = ({ show, onClose, onSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files) // Convert FileList to array

    // Kiểm tra các tệp mới xem có trùng với các tệp đã được chọn không
    const duplicateFiles = newFiles.filter((newFile) =>
      selectedFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size
      )
    )

    if (duplicateFiles.length > 0) {
      alert('Some files are already selected and will not be added again.')
    }

    // Thêm các tệp mới mà không trùng lặp vào danh sách
    const uniqueFiles = newFiles.filter(
      (newFile) =>
        !selectedFiles.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size
        )
    )

    setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueFiles])
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert('Please attach at least one file.')
      return
    }
    onSubmit(selectedFiles)
    onClose()
  }

  return (
    <ModalOverlay show={show}>
      <ModalContent>
        <TitleCustom>Send Mail with Attachments</TitleCustom>
        <InputCustom type="file" multiple onChange={handleFileChange} />
        <FileList>
          {selectedFiles.map((file, index) => (
            <FileItem key={index}>
              <span>{file.name}</span>
              <RemoveButton onClick={() => handleRemoveFile(index)}>
                Remove
              </RemoveButton>
            </FileItem>
          ))}
        </FileList>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <SubmitButton onClick={handleSubmit}>Send Mail</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  )
}

export default SendMailModal
