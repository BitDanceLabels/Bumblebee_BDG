import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import english from './locales/en/translation.json';
import vietnamese from './locales/vi/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('language') || 'vi',
        fallbackLng: 'vi',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: english,
            },
            vi: {
                translation: vietnamese,
            },
        },
    });

export default i18n;