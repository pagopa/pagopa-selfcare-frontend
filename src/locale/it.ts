export default {
  session: {
    expired: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
  roles: {
    // TODO put product roles keys and their description here
    admin: 'Amministratore',
    operator: 'Referente Tecnico',
  },
  homepage: {
    title: 'API Key',
    subtitle:
      'Qui puoi generare e gestire le chiavi API da utilizzare per spiegare a cosa servono.',
    decription: 'API Key generate',
    apiNotPresent: {
      apiNotPresentDescription: `Non è stata ancora generata nessuna chiave API per questo ente. <1><0> Genera chiave API</0></1>`,
      buttonLabel: 'Genera chiave API',
    },
    apiPresent: {
      primaryApiKey: 'Codice chiave API primaria',
      secondaryApiKey: 'Codice chiave API secondaria',
      regeneratesBtn: 'Rigenera',
      useKeyBtn: 'Usa questa chiave',
      copyPrimaryKeyLabel: 'Chiave primaria copiata correttamente',
      errorCopyPrimaryKeyLabel: 'Errore durante la copia della chiave primaria',
      copySecondaryKeyLabel: 'Chiave secondaria copiata correttamente',
      errorCopySecondaryKeyLabel: 'Errore durante la copia della chiave secondaria',
      regeneratePrimaryKey: 'Chiave primaria rigenerata correttamente',
      errorRegeneratePrimaryKey: 'Errore durante la rigenerazione della chiave primaria',
      regenerateSecondaryKey: 'Chiave secondaria rigenerata correttamente',
      errorRegenerateSecondariKey: 'Errore durante la rigenerazione della chiave secondaria',
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
