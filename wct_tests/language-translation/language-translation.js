crComLibTranslator = CrComLib.translationFactory.translator;
CrComLib.registerTranslationInterface(crComLibTranslator, "-+", "+-");
crComLibTranslator.init({
  fallbackLng: "en",
  language: "en",
  debug: true,
  resources: {
    en: {
      translation: {
        label: "EN",
      },
    },
    de: {
      translation: {
        label: "DE",
      },
    },
    cz: {
      translation: {
        label: "CZ",
      },
    },
  },
});
