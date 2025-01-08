import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './i18n.jsx';
import {Provider} from 'react-redux'
// import store from './redux/store'
import MainApp from './pages/MainApp.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MainApp/>
    </StrictMode>
)