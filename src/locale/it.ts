export default {
  session: {
    expired: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
  roles: {
    // TODO put product roles keys and their description here
    'incaricato-ente-creditore': 'Incaricato Ente Creditore',
    'referente-legale': 'Referente Legale',
    'referente-dei-pagamenti': 'Referente Dei Pagamenti',
  },
  homepage: {
    title: 'API Key',
    subtitle:
      'Qui puoi generare e gestire le chiavi API da utilizzare per spiegare a cosa servono.',
    decription: 'API Key generate',
    apiNotPresentDescription: `Non è stata ancora generata nessuna chiave API per questo ente. <1><0> Genera chiave API</0></1>`,
    apiPresent: {
      primaryApiKey: 'Codice chiave API primaria',
      secondaryApiKey: 'Codice chiave API secondaria',
      regeneratesBtn: 'Rigenera',
      useKeyBtn: 'Usa questa chiave',
    },
  },
  sideMenu: {
    home: {
      title: 'API Key',
    },
    wizard: {
      title: 'Wizard',
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
  },
  wizard: {
    stepOne: {
      title: 'Informazioni generali',
    },
    stepTwo: {
      title: 'Destinatari',
    },
    stepThree: {
      title: 'Regole di spesa',
    },
    stepFour: {
      title: 'Regole di rimborso',
    },
    stepFive: {
      title: 'Informazioni legali',
    },
    common: {
      buttons: {
        back: 'Indietro',
        skip: 'Salva bozza',
        continue: 'Continua',
        send: 'Invia per la revisione',
        reset: 'Reset',
      },
    },
  },
};
