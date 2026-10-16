/* Completes the contact page vocabulary for the Italian and Slovenian guest journeys. */
Object.assign(words, {
  it: {
    header: 'Contatti e arrivo', book: 'Prenota ora', eyebrow: 'Qui quando serve',
    title: 'Rendiamo<br>il tuo soggiorno <em>semplice.</em>',
    copy: 'Prima dell’arrivo, per una domanda sulla regione o per un soggiorno costruito su misura: non vediamo l’ora di sentirti.',
    detailsEyebrow: 'Vieni a salutarci', detailsTitle: 'Tutto comincia<br>con un <em>ciao.</em>',
    email: 'E-mail', phone: 'Telefono', address: 'Indirizzo', arrivalEyebrow: 'Facile da trovare',
    arrivalTitle: 'Arriva.<br><em>Rilassati.</em>',
    arrivalCopy: 'BoRa è a Warmbad, tranquilla e perfettamente collegata. L’A2 è vicina e il parcheggio gratuito è proprio accanto alla casa.',
    route: 'Pianifica il percorso', messageEyebrow: 'Una domanda prima di partire?',
    messageTitle: 'Scrivici<br>due <em>righe.</em>', messageCopy: 'Ti risponderemo personalmente appena possibile.',
    name: 'Nome', senderEmail: 'E-mail', message: 'Messaggio', send: 'Prepara e-mail',
    bookingEyebrow: 'Il tuo tempo a Villach', bookingTitle: 'La parte bella<br>inizia <em>qui.</em>',
    bookStay: 'Prenota il soggiorno', status: 'La bozza della tua e-mail è stata aperta.'
  },
  sl: {
    header: 'Stik in prihod', book: 'Rezerviraj', eyebrow: 'Tukaj, ko nas potrebujete',
    title: 'Naj bo<br>vaše bivanje <em>preprosto.</em>',
    copy: 'Pred prihodom, ob vprašanju o regiji ali za bivanje po vaši meri: veselimo se vašega sporočila.',
    detailsEyebrow: 'Pozdravite nas', detailsTitle: 'Vse se začne<br>z <em>živjo.</em>',
    email: 'E-pošta', phone: 'Telefon', address: 'Naslov', arrivalEyebrow: 'Preprosto najti',
    arrivalTitle: 'Pridite.<br><em>Odpočijte si.</em>',
    arrivalCopy: 'BoRa je v Warmbadu, mirnem, a odlično povezanem predelu. Avtocesta A2 je hitro dosegljiva, brezplačno parkirišče pa vas čaka ob hiši.',
    route: 'Načrtuj pot', messageEyebrow: 'Vprašanje pred potjo?',
    messageTitle: 'Napišite nam<br>nekaj <em>vrstic.</em>', messageCopy: 'Osebno vam bomo odgovorili takoj, ko bo mogoče.',
    name: 'Ime', senderEmail: 'E-pošta', message: 'Sporočilo', send: 'Pripravi e-pošto',
    bookingEyebrow: 'Vaš čas v Villachu', bookingTitle: 'Dober del<br>se začne <em>tukaj.</em>',
    bookStay: 'Rezerviraj bivanje', status: 'Osnutek e-pošte je odprt.'
  }
});

if (['it', 'sl'].includes(select.value)) {
  select.dispatchEvent(new Event('change'));
}
