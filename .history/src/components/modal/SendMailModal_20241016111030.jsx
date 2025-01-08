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

const SendMailModal = ({ show, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Please select a PDF file.')
    }
  }

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please attach a PDF file.')
      return
    }
    onSubmit(selectedFile)
    onClose()
  }

  return (
    <ModalOverlay show={show}>
      <ModalContent>
        <h3>Send Mail with PDF</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <CloseButton onClick={onClose}>Close</CloseButton>
        <SubmitButton onClick={handleSubmit}>Send Mail</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  )
}

export default SendMailModal
