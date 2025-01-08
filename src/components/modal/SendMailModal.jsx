import {useState, useRef} from 'react'
import styled from 'styled-components'
import PdfViewerComponent from "../modal/view_convert_pdf";
import {saveAs} from "file-saver";
import Loading from "../General/Loading";
import {useTranslation} from "react-i18next"; // Import the Loading component


const PdfOverlay = styled.div`
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
`;
// Styled components for the modal
const ModalOverlay = styled.div`
    z-index: 900;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${({show}) => (show ? 'block' : 'none')};
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
    font-size: 1.5rem;
    font-weight: bold;

    &:hover {
        opacity: 0.7;
    }
`

const SubmitButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;

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
    font-weight: bold;
`

const TitleCustom = styled.h3`
    text-align: center;
    margin: 0;
`

const InputCustom = styled.div`
    position: relative;
    font-size: 1.5rem;
    margin: 1.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    input[type='file'] {
        display: none;
        margin-left: 10px;
    }

    input {
        width: 140px;
        padding: 6px;
        font-size: 16px;
        border: 2px solid #ccc;
        border-radius: 5px;
        outline: none;
        transition: border-color 0.3s ease;
    }

    input:focus {
        border-color: #007BFF;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    input::placeholder {
        color: #888;
        font-style: italic;
    }

    label {
        text-align: center;
        width: 200px;
        display: inline-block;
        background: #007bff;
        border: 1px solid #007bff;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        letter-spacing: 1px;
    }
`

const ViewButton = styled.a`
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    display: inline-block;
    text-align: center;

    &:hover {
        opacity: 0.8;
    }
`

const ButtonWrapper = styled.div`
    text-align: right;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
`

// eslint-disable-next-line react/prop-types
const SendMailModal = ({show, onClose, onSubmit, selectedTeacher, onSendMail}) => {
    const {t} = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([])
    const fileInputRef = useRef(null)
    const [dateInterview, setDateInterview] = useState('')
    const [dateDeadline, setDateDeadline] = useState('')
    const [rateOfferOnline, setRateOfferOnline] = useState('')
    const [rateOfferOffline, setRateOfferOffline] = useState('')

    const [pdfFile, setPdfFile] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const [checkboxValues, setCheckboxValues] = useState({
        checkbox_cccd: null,
        checkbox_passport: null,
        Bank_check: null,
        Paypal_check: null
    })

    console.log('selectedTeacher: ', selectedTeacher)

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    const token = fullData?.access_token || ''

    const handleCheckboxChange = (option, description) => {
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [option]: prevValues[option] === null ? description : null
        }))
    }
    // Initialize the `isLoading` state
    const [isLoading, setIsLoading] = useState(false); // Add this line for loading state


    const handleViewFile = async () => {
        if (!token) {
            console.log('Token is missing')
            return
        }

        setIsLoading(true); // Show loading spinner before starting the fetch
        const emailPayload = {
            // eslint-disable-next-line react/prop-types
            teacher_id: selectedTeacher.idx_teacher.toString(),
            // eslint-disable-next-line react/prop-types
            full_name: selectedTeacher.full_name,
            date_interview: dateInterview,
            date_deadline: dateDeadline,
            rate_offer_online: rateOfferOnline,
            rate_offer_offline: rateOfferOffline,
            ...checkboxValues
        }
        console.log('emailPayload', emailPayload)

        try {
            const emailResponse = await fetch(import.meta.env.VITE_CREAT_MAIL_PA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emailPayload)
            })

            if (!emailResponse.ok) {
                console.log('Failed to create email template:', emailResponse)
                return
            }

            console.log('Email template created successfully')

            const response = await fetch(import.meta.env.VITE_VIEW_OFFER, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                console.log('Failed to fetch the file:', response)

                return
            }

            const blob = await response.blob()
            // const url = window.URL.createObjectURL(blob)
            // window.open(url, '_blank')
            const pdfUrl = URL.createObjectURL(blob);
            // const fileName = `${selectedTeacher.idx_teacher}offer_teacher.pdf`;
            const wordOfferPath = import.meta.env.VITE_PATH_WORD_OFFER;
            // const fileName = wordOfferPath.split('/').pop(); // Extracts just 'output_mail_offer_teacher.docx'

            // Đặt file PDF vào state và lưu file với tên mới
            setPdfFile(pdfUrl);
            setIsViewing(true);


            // saveAs(blob, fileName);

            // Lưu tên file để gửi mail sau này
            onSendMail({
                // subject: `${selectedTeacher.idx_teacher} Teacher Offer Details _ ${selectedTeacher.full_name}`,
                // body: `
                //   Dear ${selectedTeacher.full_name},

                //   PEC xin trân trọng cảm ơn anh/chị.
                //   Dưới đây là thông tin offer đi kèm. Nếu có bất kỳ thắc mắc nào, anh/chị vui lòng liên hệ với bộ phận hỗ trợ.

                //   Trân trọng,
                //   Đội ngũ hỗ trợ PEC
                // `,
                // to: [selectedTeacher.email],
                // cc: ["nhutpham@powerenglishcenter.vn"],
                subject: `${selectedTeacher.idx_teacher} Teacher Offer Details _ ${selectedTeacher.full_name}`,
                body: `Dear ${selectedTeacher.full_name},\n\nPEC xin trân trọng cảm ơn anh/chị.\nDưới đây là thông tin offer đi kèm. Nếu có bất kỳ thắc mắc nào, anh/chị vui lòng liên hệ với bộ phận hỗ trợ.\n\nTrân trọng,\nĐội ngũ hỗ trợ PEC`,
                to: [selectedTeacher.email],
                cc: ["nhutpham@powerenglishcenter.vn"],
                attachments: [wordOfferPath] // Use the variable here
            });


        } catch (error) {
            console.error('Error in fetching email template or file:', error)
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    }

    const closePdfViewer = () => {
        setIsViewing(false);
        URL.revokeObjectURL(pdfFile); // Giải phóng bộ nhớ sau khi đóng file
        setPdfFile(null);
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files)
        const uniqueFiles = newFiles.filter(
            (newFile) => !selectedFiles.some(
                (existingFile) =>
                    existingFile.name === newFile.name &&
                    existingFile.size === newFile.size
            )
        )
        setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueFiles])
        fileInputRef.current.value = null
    }

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    // }
    // const handleSubmit = async () => {
    //   // if (selectedFiles.length === 0) {
    //   //   alert('Please attach at least one file.');
    //   //   return;
    //   // }

    //   // onSubmit(selectedFiles);
    //   // onClose();

    //   const api_sendmail_smtp = import.meta.env.VITE_SEND_MAIL_SMTP_PA;
    //   const wordOfferPath = import.meta.env.VITE_PATH_WORD_OFFER;

    //   // Gọi onSendMail để tạo payload email
    //   const payload = onSendMail({
    //     // subject: `${selectedTeacher.idx_teacher}_${selectedTeacher.full_name} Teacher Offer Details `,
    //     // body: `
    //     //   Dear ${selectedTeacher.full_name},

    //     //   PEC xin trân trọng cảm ơn anh/chị.
    //     //   Dưới đây là thông tin offer đi kèm. Nếu có bất kỳ thắc mắc nào, anh/chị vui lòng liên hệ với bộ phận hỗ trợ.

    //     //   Trân trọng,
    //     //   Đội ngũ hỗ trợ PEC
    //     // `,
    //     // to: [selectedTeacher.email],
    //     // cc: ["nhutpham@powerenglishcenter.vn"],
    //     subject: `${selectedTeacher.idx_teacher} Teacher Offer Details _ ${selectedTeacher.full_name}`,
    //     // body: `Dear ${selectedTeacher.full_name},\n\nPEC xin trân trọng cảm ơn anh/chị.\nDưới đây là thông tin offer đi kèm. Nếu có bất kỳ thắc mắc nào, anh/chị vui lòng liên hệ với bộ phận hỗ trợ.\n\nTrân trọng,\nĐội ngũ hỗ trợ PEC`,
    //     body: 'Please find the attached document with the offer details.',
    //     to: [selectedTeacher.email],
    //     cc: ["nhutpham@powerenglishcenter.vn"],
    //     attachments: [wordOfferPath] // Use the variable here
    //   });

    //   console.log('Payload:', payload);

    //   try {
    //     const response = await fetch(api_sendmail_smtp, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`
    //       },
    //       body: JSON.stringify(payload)
    //     });

    //     if (!response.ok) {
    //       console.log('Failed to send email:', response);
    //       return;
    //     }

    //     const result = await response.json();
    //     console.log('Email sent successfully:', result);
    //   } catch (error) {
    //     console.error('Failed to send email:', error);
    //   }
    // };

    const handleSubmit = async () => {
        const api_sendmail_smtp = import.meta.env.VITE_SEND_MAIL_SMTP_PA;
        const wordOfferFileName = import.meta.env.VITE_PATH_WORD_OFFER; // Make sure this is just the filename, e.g., "output_mail_offer_teacher.docx"

        // Create the payload directly
        const payload = {
            // eslint-disable-next-line react/prop-types
            subject: `${selectedTeacher.idx_teacher} Teacher Offer Details _ ${selectedTeacher.full_name}`,
            // body: 'Please find the attached document with the offer details.',
            body: `
      // eslint-disable-next-line react/prop-types
      Dear ${selectedTeacher.full_name},

      PEC would like to express our sincere gratitude.
      Please find attached the offer details. If you have any questions, feel free to contact our support team.

      Best regards,
      The PEC Support Team
    `.trim(),
            to: [selectedTeacher.email],
            cc: ["nhutpham@powerenglishcenter.vn"],
            attachments: [wordOfferFileName]
        };

        console.log('Sending mail with payload:', payload);

        try {
            const response = await fetch(api_sendmail_smtp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.log('Failed to send email:', response);
                return;
            }

            const result = await response.json();
            console.log('Email sent successfully:', result);
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    };

    return (
        <ModalOverlay show={show}>
            <ModalContent>
                <TitleCustom>{t('send mail with attachments')}</TitleCustom>

                {/* <InputCustom>
          <label htmlFor="fileInput">Choose File</label>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </InputCustom> */}

                <FileList>
                    {selectedFiles.map((file, index) => (
                        <FileItem key={index}>
                            <span>{file.name}</span>
                            <RemoveButton onClick={() => handleRemoveFile(index)}>
                                {t('remove')}
                            </RemoveButton>
                        </FileItem>
                    ))}
                </FileList>

                <InputCustom>
                    <label htmlFor="dateInterview">{t('interview date')}</label>
                    <input
                        id="dateInterview"
                        type="date"
                        value={dateInterview}
                        onChange={(e) => setDateInterview(e.target.value)}
                    />
                </InputCustom>

                <InputCustom>
                    <label htmlFor="dateDeadline">{t('deadline date')}</label>
                    <input
                        id="dateDeadline"
                        type="date"
                        value={dateDeadline}
                        onChange={(e) => setDateDeadline(e.target.value)}
                    />
                </InputCustom>

                <InputCustom>
                    <label htmlFor="rateOfferOnline">{t('Rate offer (online)')}</label>
                    <input
                        id="rateOfferOnline"
                        type="text"
                        placeholder="20 USD/hour"
                        value={rateOfferOnline}
                        onChange={(e) => setRateOfferOnline(e.target.value)}
                    />
                </InputCustom>

                <InputCustom>
                    <label htmlFor="rateOfferOffline">{t('Rate offer (offline)')}</label>
                    <input
                        id="rateOfferOffline"
                        type="text"
                        placeholder="25 USD/hour"
                        value={rateOfferOffline}
                        onChange={(e) => setRateOfferOffline(e.target.value)}
                    />
                </InputCustom>

                <div>
                    <label style={{marginBottom: '10px'}}>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange('checkbox_cccd', 'A scanned copy of your identity card, including ID number, date of issue, and date of expiration')}
                        />
                        {t('identity card')}
                    </label>
                    <br/>
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange('checkbox_passport', 'A scanned copy of your passport, including the passport number, date of issue, and expiration date.')}
                        />
                        {t('passport')}
                    </label>
                    <br/>
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange('Bank_check', 'Bank account information, including the name of the bank, account number, and the account holder\'s name')}
                        />
                        {t('bank account')}
                    </label>
                    <br/>
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange('Paypal_check', 'PayPal account, including the account holder\'s name')}
                        />
                        {t('paypal')}
                    </label>
                </div>

                <ButtonWrapper>
                    <CloseButton onClick={onClose}>{t('close')}</CloseButton>
                    {/* <ViewButton onClick={handleViewFile}>Xem lại</ViewButton> */}

                    <ViewButton onClick={() => handleViewFile(selectedTeacher)}>{t('review')}</ViewButton>

                    <SubmitButton onClick={handleSubmit}>{t('send mail')}</SubmitButton>
                </ButtonWrapper>
            </ModalContent>
            {/* Hiển thị PdfViewerComponent khi có pdfFile và đang xem */}
            {isLoading && <Loading/>}
            {/* Show Loading component when loading */}
            {isViewing && (
                <PdfViewerComponent
                    pdfFile={pdfFile}
                    // onClose={() => setIsViewing(false)}
                    onClose={closePdfViewer}
                />
            )}
        </ModalOverlay>
    )
}

export default SendMailModal