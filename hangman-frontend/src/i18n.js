import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translation files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind with React
  .init({
    fallbackLng: 'en', // Fallback language if detection fails
    debug: true, // Enable debugging
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
  });

export default i18n;
