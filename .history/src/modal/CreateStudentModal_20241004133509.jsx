import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 30px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.fullWidth ? '100%' : '48%')};
`

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`

const HeaderLabel = styled.h2`
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
`

const CreateStudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
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
          borderRadius: '10px',
          position: 'none'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <HeaderLabel>
        <h2>Create Student</h2>
      </HeaderLabel>
      <Form>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup fullWidth>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            placeholder="1234 Main St"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup fullWidth>
          <Label htmlFor="address2">Address 2</Label>
          <Input
            type="text"
            id="address2"
            name="address2"
            placeholder="Apartment, studio, or floor"
            value={formData.address2}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="state">State</Label>
          <Select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Choose...</option>
            <option value="state1">State 1</option>
            <option value="state2">State 2</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="zip">Zip</Label>
          <Input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup fullWidth></FormGroup>
      </Form>
      <Button type="button" onClick={onClose} style={{ marginTop: '10px' }}>
        Cancel
      </Button>
    </Modal>
  )
}

export default CreateStudentModal
