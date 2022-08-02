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
  sideMenu: {
    home: {
      title: 'Home',
    },
    wizard: {
      title: 'Wizard',
    }
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
      title: 'Informazioni generali'
    },
    stepTwo: {
      title: 'Destinatari'
    },
    stepThree: {
      title: 'Regole di spesa'
    },
    stepFour: {
      title: 'Regole di rimborso'
    },
    stepFive: {
      title: 'Informazioni legali'
    },
    common: {
      buttons: {
        back: 'Indietro',
        skip: 'Salva bozza',
        continue: 'Continua',
        send: 'Invia per la revisione',
        reset: 'Reset'
      }
    }
  }
};
