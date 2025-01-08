import React from 'react'
import Modal from 'react-modal'
import 'bootstrap/dist/css/bootstrap.min.css'

const CreateStudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          width: '600px',
          height: 'auto',
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
      <h2>Create Student</h2>
      <form className="row g-3">
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            name="address"
            placeholder="1234 Main St"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress2" className="form-label">
            Address 2
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress2"
            name="address2"
            placeholder="Apartment, studio, or floor"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputCity" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCity"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputState" className="form-label">
            State
          </label>
          <select
            id="inputState"
            className="form-select"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option selected>Choose...</option>
            <option>...</option>
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="inputZip" className="form-label">
            Zip
          </label>
          <input
            type="text"
            className="form-control"
            id="inputZip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="gridCheck"
              name="check"
              checked={formData.check || false}
              onChange={(e) =>
                setFormData({ ...formData, check: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="gridCheck">
              Check me out
            </label>
          </div>
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            Sign in
          </button>
        </div>
      </form>
      <button type="button" onClick={onClose} style={{ marginTop: '10px' }}>
        Cancel
      </button>
    </Modal>
  )
}

export default CreateStudentModal
