// import React from 'react'
// import Modal from 'react-modal'
// import styled from 'styled-components'

// const Form = styled.form`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 16px;
// `

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: ${(props) => (props.fullWidth ? '100%' : '48%')};
// `

// const Label = styled.label`
//   margin-bottom: 8px;
//   font-weight: bold;
//   font-size: 16px;
// `

// const Input = styled.input`
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 16px;
// `

// const Select = styled.select`
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 16px;
// `

// const ButtonWrapper = styled.div`
//   text-align: right;
// `

// const ButtonCancel = styled.button`
//   padding: 10px 20px;
//   background-color: red;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `

// const ButtonSubmit = styled.button`
//   padding: 10px 20px;
//   margin-left: 20px;
//   background-color: green;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `

// const HeaderLabel = styled.h2`
//   font-size: 20px;
//   text-align: center;
//   margin-bottom: 30px;
// `

// const CreateStudentModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   formData,
//   setFormData
// }) => {
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
//   }

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={{
//         content: {
//           maxWidth: '600px',
//           height: 'auto',
//           margin: 'auto',
//           padding: '30px',
//           borderRadius: '10px',
//           position: 'none'
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }
//       }}
//     >
//       <HeaderLabel>
//         <h2>Create Student</h2>
//       </HeaderLabel>
//       <Form>
//         <FormGroup>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup fullWidth>
//           <Label htmlFor="address">Address</Label>
//           <Input
//             type="text"
//             id="address"
//             name="address"
//             placeholder="1234 Main St"
//             value={formData.address}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup fullWidth>
//           <Label htmlFor="address2">Address 2</Label>
//           <Input
//             type="text"
//             id="address2"
//             name="address2"
//             placeholder="Apartment, studio, or floor"
//             value={formData.address2}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label htmlFor="city">City</Label>
//           <Input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label htmlFor="state">State</Label>
//           <Select
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//           >
//             <option value="">Choose...</option>
//             <option value="state1">State 1</option>
//             <option value="state2">State 2</option>
//           </Select>
//         </FormGroup>
//         <FormGroup>
//           <Label htmlFor="zip">Zip</Label>
//           <Input
//             type="text"
//             id="zip"
//             name="zip"
//             value={formData.zip}
//             onChange={handleChange}
//           />
//         </FormGroup>
//         <FormGroup fullWidth></FormGroup>
//       </Form>
//       <ButtonWrapper>
//         <ButtonCancel
//           type="button"
//           onClick={onClose}
//           style={{ marginTop: '10px' }}
//         >
//           Cancel
//         </ButtonCancel>
//         <ButtonSubmit
//           type="button"
//           onClick={onClose}
//           style={{ marginTop: '10px' }}
//         >
//           Submit
//         </ButtonSubmit>
//       </ButtonWrapper>
//     </Modal>
//   )
// }

// export default CreateStudentModal

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
  margin-top: 20px;
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
          justifyContent: 'center',
          zIndex: 1001
        }
      }}
    >
      <HeaderLabel>Create Student</HeaderLabel>
      <Form>
        {/* Trường class_id */}
        <FormGroup>
          <Label htmlFor="class_id">Full Name</Label>
          <Input
            type="text"
            id="class_id"
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường starting_day */}
        <FormGroup fullWidth>
          <Label htmlFor="starting_day">Starting Day</Label>
          <Input
            type="datetime-local"
            id="starting_day"
            name="starting_day"
            value={formData.starting_day}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường is_substitute */}
        <FormGroup>
          <Label htmlFor="is_substitute">Is Substitute</Label>
          <Input
            type="checkbox"
            id="is_substitute"
            name="is_substitute"
            checked={formData.is_substitute}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường english_level */}
        <FormGroup>
          <Label htmlFor="english_level">English Level</Label>
          <Select
            id="english_level"
            name="english_level"
            value={formData.english_level}
            onChange={handleChange}
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="IELTS">IELTS</option>
          </Select>
        </FormGroup>

        {/* Trường preferred_teacher */}
        <FormGroup>
          <Label htmlFor="preferred_teacher">Preferred Teacher ID</Label>
          <Input
            type="number"
            id="preferred_teacher"
            name="preferred_teacher"
            value={formData.preferred_teacher}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường learning_goal */}
        <FormGroup fullWidth>
          <Label htmlFor="learning_goal">Learning Goal</Label>
          <Input
            type="text"
            id="learning_goal"
            name="learning_goal"
            value={formData.learning_goal}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường available_schedule */}
        <FormGroup fullWidth>
          <Label htmlFor="available_schedule">
            Available Schedule (JSON format)
          </Label>
          <Input
            type="text"
            id="available_schedule"
            name="available_schedule"
            placeholder='{"Monday": ["9:00 AM - 11:00 AM"]}'
            value={formData.available_schedule}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường suggested_class */}
        <FormGroup>
          <Label htmlFor="suggested_class">Suggested Class ID</Label>
          <Input
            type="number"
            id="suggested_class"
            name="suggested_class"
            value={formData.suggested_class}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Trường status */}
        <FormGroup>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </Select>
        </FormGroup>
      </Form>
      <ButtonWrapper>
        <ButtonCancel type="button" onClick={onClose}>
          Cancel
        </ButtonCancel>
        <ButtonSubmit type="button" onClick={onSubmit}>
          Submit
        </ButtonSubmit>
      </ButtonWrapper>
    </Modal>
  )
}

export default CreateStudentModal
