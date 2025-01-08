import React from 'react'
import Modal from 'react-modal'

const DeactiveStudentModal = ({ isOpen, onClose, onSubmit, student }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          width: '400px',
          height: '200px',
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <h2>Are you sure you want to deactivate {student?.name}?</h2>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </Modal>
  )
}

export default DeactiveStudentModal
