import React, { useState } from 'react'
import styled from 'styled-components'
import avt_me from '.../assets/avt_me.jpg'
import {
  FaEdit,
  FaSave,
  FaTelegram,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa'

const Container = styled.div`
  background: #f7f7ff;
  margin-top: 20px;
  font-size: 20px;
`

const WrapperAll = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const WrapperHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px 0 rgba(218, 218, 253, 0.65),
    0 2px 6px 0 rgba(206, 206, 238, 0.54);
`

const CardBody = styled.div`
  padding: 20px;
`

const LeftItem = styled.div`
  flex: 5;
`

const RightItem = styled.div`
  flex: 7;
  margin-left: 40px;
`

const ProfileImage = styled.img`
  width: 110px;
  border-radius: 50%;
  padding: 1px;
  background-color: #007bff;
`

const ProfileInfo = styled.div`
  text-align: center;
  margin-top: 10px;
`

const UserName = styled.h4`
  margin: 10px 0;
`

const JobTitle = styled.p`
  color: #6c757d;
  margin-bottom: 5px;
`

const Location = styled.p`
  color: #adb5bd;
  font-size: 14px;
`

const ListGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ListGroupItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #ddd;
`

const Label = styled.h6`
  font-size: 16px;
`

const Value = styled.span`
  color: #6c757d;
`

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const InputLabel = styled.h6`
  margin-bottom: 0;
  flex: 2;
`

const Input = styled.input`
  flex: 10;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 10px;
  ${(props) =>
    props.disabled &&
    `background-color: #e9ecef;`}/* Gray background for disabled inputs */
`

const ProgressBar = styled.div`
  height: 5px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
`

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${(props) => props.color || '#007bff'};
  width: ${(props) => props.percentage || '0%'};
`

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 8px;
  }
`

const TextCustom = styled.text`
  margin-left: 10px;
`

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false) // One state for all card bodies

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '(239) 816-9029',
    mobile: '(320) 380-4539',
    address: 'Bay Area, San Francisco, CA'
  })

  const toggleEdit = () => setIsEditing(!isEditing)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <Container>
      <div className="row">
        <EditButton onClick={toggleEdit}>
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? 'Save' : 'Edit'}
        </EditButton>

        <WrapperAll>
          <LeftItem>
            <div className="col-lg-4">
              <Card>
                <CardBody>
                  <div className="d-flex flex-column align-items-center text-center">
                    <WrapperHeader>
                      <ProfileImage src={avt_me} alt="Profile" />
                      <ProfileInfo>
                        <UserName>Phạm Quốc Hưng</UserName>
                        <JobTitle>Developer</JobTitle>
                        <Location>Cam Lâm, Khánh Hòa</Location>
                      </ProfileInfo>
                    </WrapperHeader>
                  </div>
                  <hr />
                  <ListGroup>
                    <ListGroupItem>
                      <Label>
                        <RowWrapper>
                          <FaTelegram fontSize={32} />
                          <TextCustom>Telegram</TextCustom>
                        </RowWrapper>
                      </Label>
                      <Value>0376762125</Value>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Label>
                        <RowWrapper>
                          <FaInstagram fontSize={32} />
                          <TextCustom>Instagram</TextCustom>
                        </RowWrapper>
                      </Label>
                      <Value>_pqh29_</Value>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Label>
                        <RowWrapper>
                          <FaFacebook fontSize={32} />
                          <TextCustom>Facebook</TextCustom>
                        </RowWrapper>
                      </Label>
                      <Value>facebook.com/pqhung.2905/</Value>
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
            </div>
          </LeftItem>

          <RightItem>
            <div className="col-lg-8">
              <Card>
                <CardBody>
                  <InputGroup>
                    <InputLabel>Full Name</InputLabel>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Email</InputLabel>
                    <Input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Phone</InputLabel>
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Mobile</InputLabel>
                    <Input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Address</InputLabel>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </InputGroup>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h5>Skill</h5>
                  {/* <p>Web Design</p>
                  <ProgressBar>
                    <ProgressBarFill percentage="80%" />
                  </ProgressBar>
                  <p>Website Markup</p>
                  <ProgressBar>
                    <ProgressBarFill color="#dc3545" percentage="72%" />
                  </ProgressBar>
                  <p>One Page</p>
                  <ProgressBar>
                    <ProgressBarFill color="#28a745" percentage="89%" />
                  </ProgressBar>
                  <p>Mobile Template</p>
                  <ProgressBar>
                    <ProgressBarFill color="#ffc107" percentage="55%" />
                  </ProgressBar>
                  <p>Backend API</p>
                  <ProgressBar>
                    <ProgressBarFill color="#17a2b8" percentage="66%" />
                  </ProgressBar> */}
                </CardBody>
              </Card>
            </div>
          </RightItem>
        </WrapperAll>
      </div>
    </Container>
  )
}

export default TeacherProfile
