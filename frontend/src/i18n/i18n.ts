import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const importAllTranslations = async () => {
  const modules = import.meta.glob('./locales/*.json', {eager: true});
  const resources: Record<string, any> = {};

  Object.entries(modules).forEach(([path, content]) => {
    const lang = path.match(/\/([a-z]{2})\.json$/)?.[1];
    if (lang) {
      resources[lang] = {translation: (content as any).default};
    }
  });

  return resources;
};

const setupI18n = async () => {
  const resources = await importAllTranslations();

  return i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: import.meta.env.MODE === 'development',
      interpolation: {escapeValue: false},
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
};

void setupI18n();

export default i18n;
