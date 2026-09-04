import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";


void i18n.use(initReactI18next).init({
  lng: "it",
  fallbackLng: "it",
  resources: {
    it: {
      translation: {},
    },
  },
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
});
