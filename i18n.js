import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import th from './locales/th.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pl from './locales/pl.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import he from './locales/he.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  th: { translation: th },
  zh: { translation: zh },
  hi: { translation: hi },
  es: { translation: es },
  fr: { translation: fr },
  pl: { translation: pl },
  it: { translation: it },
  pt: { translation: pt },
  he: { translation: he },
  ar: { translation: ar },
  de: { translation: de },
  ja: { translation: ja },
  ko: { translation: ko },
  nl: { translation: nl },
  tr: { translation: tr },
  vi: { translation: vi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
