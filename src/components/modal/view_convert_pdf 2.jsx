// import React from "react";

// const PdfViewerComponent = ({ pdfFile, onClose }) => {
//     return (
//         <div
//             className="pdf-viewer-container"
//             style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 1000
//             }}
//         >
//             <iframe
//                 src={pdfFile}
//                 title="PDF Viewer"
//                 width="80%"  // Adjust to 80% of the viewport width
//                 height="90%" // Adjust to 90% of the viewport height
//                 style={{ border: 'none', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
//             />
//             <button
//                 style={{
//                     position: 'absolute',
//                     top: '20px',
//                     right: '20px',
//                     backgroundColor: 'red',
//                     color: 'white',
//                     padding: '10px 20px',
//                     border: 'none',
//                     borderRadius: '5px',
//                     fontSize: '16px',
//                     fontWeight: 'bold',
//                     cursor: 'pointer',
//                     zIndex: 1100
//                 }}
//                 onClick={onClose}
//             >
//                 Close
//             </button>
//         </div>
//     );
// };

// export default PdfViewerComponent;

import React from "react";

const PdfViewerComponent = ({ pdfFile, onClose }) => {
    return (
        <div
            className="pdf-viewer-container"
            style={{
                position: 'fixed',
                top: '60px',  // Adjust this based on the header/navbar height
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <iframe
                src={pdfFile}
                title="PDF Viewer"
                width="80%"
                height="85%"  // Adjusted to fit the reduced height
                style={{ border: 'none', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
            />
            <button
                style={{
                    position: 'absolute',
                    top: '20px',  // Ensure it's visible and not blocked by the navbar
                    right: '20px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 1100
                }}
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default PdfViewerComponent;