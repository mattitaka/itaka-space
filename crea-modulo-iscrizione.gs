/**
 * ItaKA APS · Crea il Google Form "Domanda di ammissione"
 *
 * Le domande seguono l'art. 5 dello statuto: domanda scritta al Consiglio Direttivo,
 * con la dichiarazione di conoscere e accettare statuto, regolamenti e deliberazioni.
 *
 * Oltre al modulo, lo script:
 *  - crea il foglio delle risposte con una scheda "Controllo età" che confronta
 *    la data di nascita con la risposta a "Sei maggiorenne?";
 *  - installa un'automazione che, a ogni domanda inviata, scrive a ciao@itaka.space
 *    e manda una ricevuta al richiedente (e al genitore o tutore, se minorenne).
 *
 * Va eseguita UNA SOLA VOLTA la funzione "creaModulo": ogni esecuzione crea un nuovo
 * modulo, un nuovo foglio e una nuova automazione.
 */

var EMAIL_ASSOCIAZIONE = 'ciao@itaka.space';
var NOME_MITTENTE = 'ItaKA APS';

function creaModulo() {
  var form = FormApp.create('Domanda di ammissione a ItaKA APS');
  form.setDescription(
    'Con questo modulo chiedi di diventare socia o socio di ItaKA APS. ' +
    'La domanda viene esaminata dal Consiglio Direttivo, che ti comunica l’esito via email. ' +
    'La quota associativa annuale è stabilita dal Consiglio Direttivo: te la indichiamo dopo l’ammissione.\n\n' +
    'Informativa privacy: https://itaka.space/it/privacy/'
  );
  form.setConfirmationMessage('Grazie! Abbiamo ricevuto la tua domanda. Il Consiglio Direttivo la esaminerà e ti scriverà all’indirizzo email che hai indicato.');
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);

  // Pagina 1 · Dati personali
  form.addSectionHeaderItem().setTitle('I tuoi dati');
  form.addTextItem().setTitle('Nome').setRequired(true);
  form.addTextItem().setTitle('Cognome').setRequired(true);
  form.addDateItem().setTitle('Data di nascita').setRequired(true);
  form.addTextItem().setTitle('Luogo di nascita').setRequired(true);
  form.addTextItem().setTitle('Codice fiscale').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Inserisci i 16 caratteri del codice fiscale.')
      .requireTextMatchesPattern('^[A-Za-z0-9]{16}$').build());
  form.addParagraphTextItem().setTitle('Indirizzo di residenza')
    .setHelpText('Via e numero civico, CAP, comune, provincia.').setRequired(true);
  form.addTextItem().setTitle('Email').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Inserisci un indirizzo email valido.')
      .requireTextIsEmail().build());
  form.addTextItem().setTitle('Telefono').setRequired(false);

  form.addSectionHeaderItem().setTitle('Perché vuoi associarti');
  form.addParagraphTextItem().setTitle('Raccontaci in breve perché vuoi far parte di ItaKA').setRequired(true);
  form.addCheckboxItem().setTitle('Come ti piacerebbe partecipare?')
    .setChoiceValues([
      'Progetti europei (scambi, formazioni, mobilità)',
      'Attività sul territorio',
      'Volontariato nell’organizzazione',
      'Comunicazione e social',
      'Altro'
    ]).setRequired(false);
  form.addParagraphTextItem().setTitle('Competenze ed esperienze che vuoi mettere a disposizione').setRequired(false);

  var eta = form.addMultipleChoiceItem().setTitle('Sei maggiorenne?').setRequired(true);

  // Pagina 2 · Solo per chi ha meno di 18 anni
  var paginaGenitore = form.addPageBreakItem().setTitle('Dati del genitore o del tutore')
    .setHelpText('Per chi ha meno di 18 anni la domanda va presentata da un genitore o da chi ne fa le veci.');
  form.addTextItem().setTitle('Nome e cognome del genitore o del tutore').setRequired(true);
  form.addTextItem().setTitle('Codice fiscale del genitore o del tutore').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Inserisci i 16 caratteri del codice fiscale.')
      .requireTextMatchesPattern('^[A-Za-z0-9]{16}$').build());
  form.addTextItem().setTitle('Email del genitore o del tutore').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Inserisci un indirizzo email valido.')
      .requireTextIsEmail().build());
  form.addCheckboxItem().setTitle('Dichiarazione del genitore o del tutore')
    .setChoiceValues(['In qualità di genitore o tutore presento questa domanda per conto della persona minorenne indicata.'])
    .setRequired(true);

  // Pagina 3 · Dichiarazioni
  var paginaDichiarazioni = form.addPageBreakItem().setTitle('Dichiarazioni');
  form.addCheckboxItem().setTitle('Statuto')
    .setChoiceValues(['Dichiaro di conoscere e accettare integralmente lo statuto di ItaKA APS, gli eventuali regolamenti e le deliberazioni legalmente adottate dagli organi associativi.'])
    .setRequired(true);
  form.addCheckboxItem().setTitle('Informativa privacy')
    .setChoiceValues(['Ho letto l’informativa privacy pubblicata su https://itaka.space/it/privacy/.'])
    .setRequired(true);
  form.addMultipleChoiceItem().setTitle('Il tuo nome sul sito')
    .setHelpText('Nella pagina «Chi siamo» del sito elenchiamo per nome le socie e i soci.')
    .setChoiceValues(['Acconsento alla pubblicazione del mio nome', 'Non acconsento'])
    .setRequired(true);
  form.addMultipleChoiceItem().setTitle('Foto e video')
    .setHelpText('Durante le attività scattiamo foto e giriamo video che possono essere pubblicati sul sito e sui social dell’associazione.')
    .setChoiceValues(['Acconsento alla pubblicazione di foto e video in cui compaio', 'Non acconsento'])
    .setRequired(true);

  // Chi è maggiorenne salta la pagina del genitore
  eta.setChoices([
    eta.createChoice('Sì', paginaDichiarazioni),
    eta.createChoice('No', paginaGenitore)
  ]);

  // Foglio per le risposte
  var foglio = SpreadsheetApp.create('Risposte · Domanda di ammissione ItaKA APS');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, foglio.getId());
  creaSchedaControllo_(foglio.getId());

  // Automazione: email a ogni domanda inviata
  ScriptApp.newTrigger('allInvioDomanda')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('1) Link del modulo per il pulsante del sito (MEMBERSHIP_FORM_URL): ' + form.getPublishedUrl());
  Logger.log('2) Per modificare il modulo: ' + form.getEditUrl());
  Logger.log('3) Foglio delle risposte: ' + foglio.getUrl());
  Logger.log('4) Automazione email attiva: notifiche a ' + EMAIL_ASSOCIAZIONE + ' e ricevuta al richiedente.');
}

/**
 * Trasforma la scheda vuota iniziale del foglio in "Controllo età".
 * La formula legge la scheda delle risposte collegata al modulo e, per ogni domanda,
 * calcola l'età alla data di invio e la confronta con la risposta a "Sei maggiorenne?".
 */
function creaSchedaControllo_(idFoglio) {
  SpreadsheetApp.flush();
  var ss = SpreadsheetApp.openById(idFoglio);
  var schedaRisposte = null;
  var schedaVuota = null;
  ss.getSheets().forEach(function (s) {
    if (s.getFormUrl()) schedaRisposte = s; else if (!schedaVuota) schedaVuota = s;
  });
  if (!schedaRisposte) {
    Logger.log('Attenzione: scheda delle risposte non trovata, scheda "Controllo età" non creata.');
    return;
  }
  var controllo = schedaVuota || ss.insertSheet();
  controllo.setName('Controllo età');

  var n = "'" + schedaRisposte.getName().replace(/'/g, "''") + "'";
  controllo.getRange('A1:F1')
    .setValues([['Nome', 'Cognome', 'Data di nascita', 'Dichiara maggiorenne', 'Età all’invio', 'Esito']])
    .setFontWeight('bold');

  // Sintassi per foglio con impostazioni internazionali italiane:
  // ";" separa gli argomenti, "\" separa le colonne nelle matrici {…}.
  // I nomi in LET non possono essere "r" o "c" (riservati alla notazione R1C1).
  var formula =
    '=LET(' +
      'risp;' + n + '!A2:ZZ;' +
      'intest;' + n + '!A1:ZZ1;' +
      'colonna;LAMBDA(titolo;INDEX(risp;0;MATCH(titolo;intest;0)));' +
      'invio;INDEX(risp;0;1);' +
      'nascita;colonna("Data di nascita");' +
      'dichiara;colonna("Sei maggiorenne?");' +
      'anni;MAP(invio;nascita;LAMBDA(x_inv;x_nas;IF(OR(x_inv="";x_nas="");"";IFERROR(DATEDIF(x_nas;x_inv;"Y");""))));' +
      'esito;MAP(invio;nascita;dichiara;anni;LAMBDA(x_inv;x_nas;x_dic;x_anni;' +
        'IF(x_inv="";"";IF(x_nas="";"Data mancante";IF(x_anni="";"Data non valida";' +
        'IF((x_anni>=18)=(x_dic="Sì");"OK";"INCONGRUENZA"))))));' +
      'IFERROR(FILTER({colonna("Nome")\\colonna("Cognome")\\nascita\\dichiara\\anni\\esito};invio<>"");""))';
  controllo.getRange('A2').setFormula(formula);
  controllo.getRange('C2:C').setNumberFormat('dd/mm/yyyy');
  controllo.setFrozenRows(1);

  // Evidenzia in rosso le incongruenze
  var regola = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('INCONGRUENZA')
    .setBackground('#F4C7C3')
    .setRanges([controllo.getRange('F2:F')])
    .build();
  controllo.setConditionalFormatRules([regola]);
}

/**
 * Eseguita automaticamente a ogni domanda inviata (trigger installato da creaModulo).
 */
function allInvioDomanda(e) {
  var r = {};
  e.response.getItemResponses().forEach(function (ir) {
    var v = ir.getResponse();
    r[ir.getItem().getTitle()] = Array.isArray(v) ? v.join(', ') : v;
  });

  var nome = r['Nome'] || '';
  var cognome = r['Cognome'] || '';
  var emailRichiedente = r['Email'];
  var emailGenitore = r['Email del genitore o del tutore'];
  var minorenne = r['Sei maggiorenne?'] === 'No';
  var dataInvio = Utilities.formatDate(e.response.getTimestamp(), 'Europe/Rome', 'dd/MM/yyyy HH:mm');

  // 1) Notifica all'associazione, con tutte le risposte
  var righe = Object.keys(r).map(function (k) { return k + ': ' + r[k]; });
  MailApp.sendEmail({
    to: EMAIL_ASSOCIAZIONE,
    subject: 'Nuova domanda di ammissione: ' + nome + ' ' + cognome + (minorenne ? ' (minorenne)' : ''),
    body: 'È arrivata una nuova domanda di ammissione a ItaKA APS il ' + dataInvio + '.\n\n' +
          righe.join('\n') + '\n\n' +
          'La domanda è registrata anche nel foglio delle risposte.',
    replyTo: emailRichiedente || EMAIL_ASSOCIAZIONE,
    name: NOME_MITTENTE
  });

  // 2) Ricevuta al richiedente (e al genitore o tutore, se minorenne)
  var destinatari = [emailRichiedente];
  if (minorenne && emailGenitore && emailGenitore !== emailRichiedente) destinatari.push(emailGenitore);
  destinatari = destinatari.filter(function (x) { return x; });
  if (destinatari.length === 0) return;

  MailApp.sendEmail({
    to: destinatari.join(','),
    subject: 'Abbiamo ricevuto la tua domanda di ammissione a ItaKA APS',
    body: 'Ciao ' + nome + ',\n\n' +
          'abbiamo ricevuto la domanda di ammissione a ItaKA APS inviata il ' + dataInvio +
          (minorenne ? ' (presentata dal genitore o tutore)' : '') + '.\n\n' +
          'Il Consiglio Direttivo la esaminerà e ti comunicherà l’esito a questo indirizzo email. ' +
          'Dopo l’ammissione ti indicheremo la quota associativa annuale.\n\n' +
          'Per qualsiasi domanda puoi rispondere a questa email.\n\n' +
          'Un saluto,\nItaKA APS\nhttps://itaka.space',
    replyTo: EMAIL_ASSOCIAZIONE,
    name: NOME_MITTENTE
  });
}
