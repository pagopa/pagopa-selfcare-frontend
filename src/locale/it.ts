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
      errorMessageTitle: 'Errore',
      errorMessageDesc: 'Errore nella generazione delle ApiKey',
    },
    products: {
      NODOAUTH: 'Connessione con nodo',
      GPD: 'Posizioni debitorie',
      BIZ: 'Evento di pagamento',
    },
  },
  channelsPage: {
    title: 'Canali',
    subtitle: 'Cerca e visualizza lo stato dei canali presenti.',
    createChannelButtonLabel: 'Crea canale',
    searchPlaceholder: 'Cerca per codice',
    table: {
      noResults: 'Non sono ancora presenti canali in questo ambiente.<1><0> Crea Canale</0></1>',
      loading: 'Caricamento...',
    },
    channelsTableColumns: {
      headerFields: {
        name: 'Codice canale',
        description: 'Descrizione',
        status: 'Stato',
      },
    },
  },
  addEditChannelPage: {
    create: {
      title: 'Crea un nuovo canale',
      subtitle: 'Completa i campi',
      breadcrumb: 'Crea canale',
    },
    edit: {
      title: 'Modifica canale',
      subtitle: 'Dopo la modifica sarà richiesta una nuova revisione del canale.',
      breadcrumb: 'Modifica',
    },
    duplicate: {
      title: 'Duplica canale',
      subtitle: 'Modifica l’ID channel e i campi che ritieni necessari.',
      breadcrumb: 'Duplica',
    },
    exit: 'Esci',
    addForm: {
      backButton: 'Indietro',
      continueButton: 'Conferma',
      successMessage:
        'Il canale è in attesa di revisione da parte di un operatore PagoPA. Riceverai una mail a procedura completata.',
      sections: {
        registry: 'Anagrafica',
        redirect: 'Redirect',
        target: 'Target',
        paymentType: 'Tipo di versamento',
      },
      fields: {
        pspBrokerCode: 'Codice intermediario PSP',
        businessName: 'Ragione sociale intermediario',
        idChannel: 'ID channel',
        redirectProtocol: 'Protocollo',
        redirectPort: 'Porta',
        redirectIp: 'Indirizzo',
        redirectService: 'Path',
        redirectParameters: 'Parametri',
        targetAddress: 'Indirizzo',
        targetService: 'Path',
        targetPort: 'Porta',
        paymentType: 'Seleziona tipo di versamento',
      },
      errorMessageTitle: 'Errore',
      errorMessageDesc: 'Errore durante la creazione, ID Channel duplicato',
    },
    confirmModal: {
      title: 'Invio per la revisione',
      message:
        'Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di approvare. Riceverai una notifica a revisione completata.<br/>',
      confirmButton: 'Invia',
      cancelButton: 'Torna indietro',
    },
  },
  editChannelPage: {
    title: 'Modifica canale',
    subtitle: 'Dopo la modifica sarà richiesta una nuova revisione del canale.',
  },
  channelDetailPage: {
    channels: 'Canali',
    edit: 'Modifica',
    duplicate: 'Duplica',
    disable: 'Disabilita',
    createdOn: 'Creato il',
    detail: 'dettaglio',
    state: 'Stato',
    status: {
      revision: 'In revisione',
      needCorrection: 'Da correggere',
      active: 'Attivo',
    },
    channelConfiguration: 'Configurazione del canale',
    registry: 'Anagrafica',
    pspBrokerCode: 'Codice intermediario PSP',
    companyName: 'Ragione sociale',
    idChannel: 'ID Channel',
    redirect: 'Redirect',
    redirectProtocol: 'Protocollo',
    redirectPort: 'Porta',
    redirectUrl: 'URL di redirect',
    target: 'Target',
    targetAddress: 'Indirizzo',
    targetService: 'Path',
    targetPort: 'Porta',
    paymentType: 'Tipo di versamento',
    associatedPsp: 'PSP associati',
    managePsp: 'Gestisci PSP',
    associated: 'Associati',
    changes: 'Modifiche',
    lastChange: 'Ultima modifica',
    operatedBy: 'Operata da',
  },
  channelPSPList: {
    title: 'Gestisci PSP',
    subtitle: 'Gestisci e associa nuovi PSP.',
    searchPlaceholder: 'Cerca per nome PSP',
    csvDownload: 'Scarica csv',
    associatePspButtonLabel: 'Associa PSP',
    dissociatePSPsuccessMessage: 'PSP dissociato con successo',
    noResults: `Non sono ancora presenti PSP associati a questo canale.<1><0> Associa PSP</0></1>`,
    channelsTableColumns: {
      headerFields: {
        name: 'Nome PSP',
        referent: 'Referente',
        contact: 'Contatto',
        status: 'Stato',
      },
    },
    dissociateModal: {
      title: 'Dissocia PSP',
      message: 'Se dissoci un PSP, sarà disattivata la sua connessione al canale.',
      confirmButton: 'Dissocia PSP',
      cancelButton: 'Torna indietro',
    },
  },
  channelAssociatePSPPage: {
    title: 'Associa PSP',
    subTitle: 'Digita il nome del nuovo PSP da associare al canale',
    associationForm: {
      PSPSelectionInputPlaceholder: 'Cerca PSP',
      successMessage: 'PSP associato con successo.',
      errorMessageTitle: 'Errore',
      errorMessageDesc: 'Non è stato possibile associare il PSP al canale',
      backButton: 'Annulla',
      confirmButton: 'Conferma',
    },
  },

  addEditStationPage: {
    title: 'Configurazione della stazione',
    create: {
      title: 'Crea una nuova stazione',
      subtitle: 'Completa i campi',
      breadcrumb: 'Crea stazione',
    },
    addForm: {
      backButton: 'Indietro',
      continueButton: 'Conferma',
      sections: {
        registry: 'Anagrafica',
        redirect: 'Redirect',
        target: 'Target',
      },
      fields: {
        stationCode: 'Codice stazione',
        primitiveVersion: 'Versione primitive',
        redirectProtocol: 'Protocollo',
        redirectPort: 'Porta',
        redirectIp: 'IP',
        redirectService: 'Path',
        redirectParameters: 'Parametri',
        targetAddress: 'IP',
        targetService: 'Path',
        targetPort: 'Porta',
      },
    },
    confirmModal: {
      title: 'Invio per la revisione',
      message:
        'Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di approvare. Riceverai una notifica a revisione completata.<br/>',
      confirmButton: 'Invia',
      cancelButton: 'Torna indietro',
    },
    validation: {
      overPort: 'Il numero di porta deve essere compreso tra 1 e 65556',
    },
    successMessage:
      'La stazione è in attesa di revisione da parte di un operatore PagoPA. Riceverai una mail a procedura completata.',
    errorMessageTitle: 'Errore',
    errorMessageDesc: 'Errore durante la creazione, Codice stazione duplicato',
  },

  stationsPage: {
    title: 'Stazioni',
    subtitle: 'Cerca e visualizza lo stato delle stazioni.',
    searchPlaceholder: 'Cerca per codice stazione',
    createStationButtonLabel: 'Crea stazione',
    notFoundStations:
      'Non sono ancora presenti stazioni in ambiente di collaudo. <1> Crea stazione</1>',
    stationsTableColumns: {
      headerFields: {
        name: 'Codice stazione',
        creationDate: 'Data creazione',
        lastEditDate: 'Ultima modifica',
        activationDate: 'Data attivazione',
        status: 'Stato',
      },
    },
    states: {
      revision: 'In revisione',
      needCorrection: 'Da correggere',
      active: 'Attiva',
    },
    stationOptions: {
      manageStation: 'Gestisci stazione',
      manageEC: 'Gestisci EC',
      correctStation: 'Correggi',
      editStation: 'Modifica',
    },
  },
  stationDetailPage: {
    detail: 'dettaglio {{code}}',
    createdAt: 'Creata il {{data}}',
    state: 'Stato',
    stationConfiguration: 'Configurazione della stazione',
    stationConfigurationDescription: 'Lorem ipsum dolor sit.',
    anagraphic: 'Anagrafica',
    stationId: 'ID Stazione',
    version: 'Versione',
    primitiveVersion: 'Versione Primitive',
    password: 'Password',
    redirectUrl: 'URL di redirezione',
    activationDate: 'Data di attivazione',
    target: 'Target',
    address: 'IP',
    service: 'Path',
    port: 'Porta',
    associatesEC: 'EC associati',
    manageEC: 'Gestisci EC',
    associates: 'Associati',
    changes: 'Modifiche',
    lastChanges: 'Ultima modifica',
    operatedBy: 'Operata da',
    actionButtons: {
      revise: 'Correggi',
      edit: 'Modifica',
      duplicate: 'Duplica',
      askElimination: 'Chiedi eliminazione',
    },
    states: {
      revision: 'In revisione',
      needCorrection: 'Da correggere',
      active: 'Attiva',
    },
    stationOptions: {
      manageStation: 'Gestisci stazione',
      manageEC: 'Gestisci EC',
      correctStation: 'Correggi',
      editStation: 'Modifica',
    },
  },
  sideMenu: {
    home: {
      title: 'API Key',
    },
    channels: {
      title: 'Canali',
    },
    stations: {
      title: 'Stazioni',
    },
  },
  header: {
    envLabel: {
      LOCAL_DEV: 'Sviluppo locale',
      DEV: 'Sviluppo',
      UAT: 'Collaudo',
      PROD: 'Produzione',
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
  general: {
    noDataLabel: 'Nessun risultato',
    exit: 'Esci',
    back: 'Indietro',
    channels: 'canali',
    Channels: 'Canali',
    Stations: 'Stazioni',
  },
};
