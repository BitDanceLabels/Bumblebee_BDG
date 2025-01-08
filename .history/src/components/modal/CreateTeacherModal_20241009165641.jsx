// export default CreateTeacherModal
import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
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

const ButtonWrapper = styled.div`
  text-align: right;
`

const ButtonCancel = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c92a2a;
  }
`

const ButtonSubmit = styled.button`
  padding: 10px 20px;
  margin-left: 20px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`

const HeaderLabel = styled.h2`
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
`

const CreateTeacherModal = ({
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
          maxWidth: '800px',
          height: 'auto',
          margin: 'auto',
          padding: '30px',
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
      <HeaderLabel>Create Teacher</HeaderLabel>
      <Form>
        {/* Thông tin cơ bản của giáo viên */}
        <FormGroup>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
        </FormGroup>
        <FormGroup fullWidth>
          <Label htmlFor="role_group">Role Group</Label>
          <Input
            id="role_group"
            name="role_group"
            value={formData.role_group}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="extension_number">Extension Number</Label>
          <Input
            id="extension_number"
            name="extension_number"
            value={formData.extension_number}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Thông tin hợp đồng */}
        <FormGroup>
          <Label htmlFor="contract_signed_date">Contract Signed Date</Label>
          <Input
            type="date"
            id="contract_signed_date"
            name="contract_signed_date"
            value={formData.contract_signed_date}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="contract_expired_date">Contract Expired Date</Label>
          <Input
            type="date"
            id="contract_expired_date"
            name="contract_expired_date"
            value={formData.contract_expired_date}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Thông tin kỹ năng */}
        <FormGroup>
          <Label htmlFor="skill">Skill</Label>
          <Input
            id="skill"
            name="skill"
            value={formData.skill}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="level">Skill Level</Label>
          <Input
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="teaching_certificate">Teaching Certificate</Label>
          <Input
            id="teaching_certificate"
            name="teaching_certificate"
            value={formData.teaching_certificate}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ielts_certificate">IELTS Certificate</Label>
          <Input
            id="ielts_certificate"
            name="ielts_certificate"
            value={formData.ielts_certificate}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="teaching_experience">Teaching Experience</Label>
          <Input
            id="teaching_experience"
            name="teaching_experience"
            value={formData.teaching_experience}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="suggested_class_level">Suggested Class Level</Label>
          <Input
            id="suggested_class_level"
            name="suggested_class_level"
            value={formData.suggested_class_level}
            onChange={handleChange}
          />
        </FormGroup>
      </Form>
      <ButtonWrapper>
        <ButtonCancel
          type="button"
          onClick={onClose}
          style={{ marginTop: '10px' }}
        >
          Cancel
        </ButtonCancel>
        <ButtonSubmit
          type="button"
          onClick={onSubmit}
          style={{ marginTop: '10px' }}
        >
          Submit
        </ButtonSubmit>
      </ButtonWrapper>
    </Modal>
  )
}

export default CreateTeacherModal
