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

  apiKeysPage: {
    title: 'API Key',
    subtitle:
      'Genera le API Key per gestire l’autenticazione dei soggetti connessi al nodo pagoPA.',
    decription: 'API Key generate',
    apiKey: {
      'Connessione con nodo': 'Connessione con nodo',
      'Posizioni debitorie': 'Posizioni debitorie',
      'Evento di pagamento': 'Evento di pagamento',
    },
    apiNotPresent: {
      apiNotPresentDescription: `Non è stata ancora generata nessuna chiave API per questo ente.<1><0> Genera API Key</0></1>`,
      buttonLabel: 'Genera API Key',
    },
    apiPresent: {
      primaryApiKey: 'Codice API Key primaria',
      secondaryApiKey: 'Codice API Key secondaria',
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
    regenerateModal: {
      title: 'Rigenera API Key',
      message: `Se rigeneri, disattivi la API Key esistente e ne generi una nuova, con gli stessi attributi.<br/><br/>
        Dopo che hai inserito la nuova API Key nella piattaforma dell’ente, blocca ed elimina la versione precedente.`,
      confirmButton: 'Rigenera',
      cancelButton: 'Annulla',
    },
  },
  addApiKeyPage: {
    addForm: {
      title: 'Generazione API Key',
      subTitle: 'Inserisci le informazioni per generare la coppia di chiavi',
      product: {
        title: 'Tipo di prodotto',
      },
      backButton: 'Annulla',
      continueButton: 'Genera API Key',
      successMessage: 'Pacchetto API Key generato correttamente.',
    },
    products: {
      NODOAUTH: 'Connessione con nodo',
      GPD: 'Posizioni debitorie',
      BIZ: 'Evento di pagamento',
    },
  },
  sideMenu: {
    home: {
      title: 'API Key',
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
  },
  tos: {
    title: 'pagoPA',
    description:
      'Prima di entrare, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso. Potrai consultarli di nuovo quando vuoi: li trovi sempre in fondo alla pagina.',
    termsDescription:
      'Entrando dichiari di aver letto e accettato l’<1>Informativa Privacy</1> e i <1>Termini e condizioni d’uso</1> di PagoPA',
  },
};
