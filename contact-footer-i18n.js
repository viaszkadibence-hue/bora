const footerWords={
  de:{info:'Informationen',privacy:'Datenschutz',terms:'Reservierungsbedingungen',contact:'Kontakt',find:'Finden Sie uns',route:'Route planen',legal:'© BoRa Apartments · Alle Rechte vorbehalten'},
  en:{info:'Information',privacy:'Privacy policy',terms:'Booking terms',contact:'Contact',find:'Find us',route:'Plan your route',legal:'© BoRa Apartments · All rights reserved'},
  hu:{info:'Információk',privacy:'Adatvédelem',terms:'Foglalási feltételek',contact:'Kapcsolat',find:'Találj meg minket',route:'Útvonaltervezés',legal:'© BoRa Apartments · Minden jog fenntartva'},
  it:{info:'Informazioni',privacy:'Privacy',terms:'Condizioni di prenotazione',contact:'Contatti',find:'Dove trovarci',route:'Pianifica il percorso',legal:'© BoRa Apartments · Tutti i diritti riservati'},
  sl:{info:'Informacije',privacy:'Zasebnost',terms:'Pogoji rezervacije',contact:'Stik',find:'Najdete nas',route:'Načrtuj pot',legal:'© BoRa Apartments · Vse pravice pridržane'}
};
function applyFooterLanguage(){const footer=footerWords[select.value]||footerWords.de;document.querySelectorAll('[data-footer]').forEach(node=>node.textContent=footer[node.dataset.footer]||node.textContent)}
applyFooterLanguage();select.addEventListener('change',applyFooterLanguage);
