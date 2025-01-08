import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {getFirestore, doc, setDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDcNCpEpyhxHlCWakQirSMMppzvR5W6g4s",
    authDomain: "pec-web-crm.firebaseapp.com",
    projectId: "pec-web-crm",
    storageBucket: "pec-web-crm.firebasestorage.app",
    messagingSenderId: "820174014657",
    appId: "1:820174014657:web:13e513b8844dcf2e56ec40",
    measurementId: "G-Q8BDBBQR1E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);

// File upload handler
const handleFileUpload = async (sessionId, file) => {
    try {
        console.log("processing file upload...");
        const storageRef = ref(storage, `uploads/${sessionId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("File uploaded successfully:", snapshot);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("File download URL: ", downloadURL);

        const fileDocRef = doc(db, "files", sessionId);
        await setDoc(fileDocRef, {
            fileName: file.name,
            fileUrl: downloadURL,
            uploadedAt: new Date()
        });
        console.log("File URL saved to Firestore");

    } catch (error) {
        console.error("Error uploading file to Firebase: ", error);
    }
};

export default handleFileUpload;