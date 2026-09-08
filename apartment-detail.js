const apartments = {
  green: {
    name: 'Green',
    tone: 'nature view',
    hero: 'https://boraapartments.at/wp-content/uploads/2025/01/BoRa-Apartment-Green-3.jpg.webp',
    moment: 'https://boraapartments.at/wp-content/uploads/2019/06/BoRa-Apartment-Green-3.jpg.webp',
    book: 'https://boraapartments.at/wp-content/uploads/2025/01/BoRa-Apartment-Green-3.jpg.webp',
    gallery: [
      'https://boraapartments.at/wp-content/uploads/2025/01/BoRa-Apartment-Green-3.jpg.webp',
      'https://boraapartments.at/wp-content/uploads/2025/02/Wohnzimmer1.1.jpg.webp',
      'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-113.jpg.webp'
    ],
    labels: { de: ['Wohnfläche', 'Gäste', 'Bergblick', 'Balkon ins Grüne'], en: ['Living space', 'Guests', 'Mountain view', 'Green balcony'], hu: ['Alapterület', 'Vendégek', 'Hegyi kilátás', 'Zöld erkély'], it: ['Superficie', 'Ospiti', 'Vista montagna', 'Balcone verde'], sl: ['Bivalna površina', 'Gostje', 'Pogled na gore', 'Balkon v zelenje'] }
  },
  heaven: {
    name: 'Heaven',
    tone: 'panorama view',
    hero: 'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-126-1024x683.jpg.webp',
    moment: 'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-121-1024x683.jpg.webp',
    book: 'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-115-1024x683.jpg.webp',
    gallery: [
      'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-126-1024x683.jpg.webp',
      'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-115-1024x683.jpg.webp',
      'https://boraapartments.at/wp-content/uploads/2025/01/bora-apartment-heven-113.jpg.webp'
    ],
    labels: { de: ['Wohnfläche', 'Gäste', 'Bergblick', 'Sonniger Balkon'], en: ['Living space', 'Guests', 'Mountain view', 'Sunny balcony'], hu: ['Alapterület', 'Vendégek', 'Hegyi kilátás', 'Napos erkély'], it: ['Superficie', 'Ospiti', 'Vista montagna', 'Balcone soleggiato'], sl: ['Bivalna površina', 'Gostje', 'Pogled na gore', 'Sončen balkon'] }
  }
};

const stories = {
  de: {
    green: ['Das Grün<br><em>vor dem Fenster.</em>', 'Panoramafenster, Bergblick und ein Balkon ins Grüne. Green macht aus jedem Tag eine kleine Pause.', 'Natürlich hell.<br><em>Ganz bei sich.</em>', 'Green verbindet offenen Raum mit ruhigem Naturblick. Ein entspannter Ort für 1–4 Gäste, zwischen Alpen, Seen und Villach.', 'Bergblick,<br><em>ganz privat.</em>', 'Ein Kaffee am Fenster. Ein freier Nachmittag auf dem Balkon. Green schenkt Ihnen die schönste Art, nichts zu müssen.', 'Wohnen, das<br><em>nach draußen schaut.</em>', 'Licht, natürliche Farben und der Blick auf Kärntens Berge machen den Unterschied.', 'Make Green<br><em>your own.</em>'],
    heaven: ['Mehr Himmel<br><em>im Alltag.</em>', 'Hell, modern und offen: Heaven bringt Bergblick und Komfort in eine ganz entspannte Balance.', 'Leicht leben.<br><em>Weit schauen.</em>', 'Heaven ist Ihr sonniger Rückzugsort in Warmbad. Für 1–4 Gäste, die von einem Tag in Kärnten noch ein wenig mehr mitnehmen möchten.', 'Das Licht<br><em>bleibt länger.</em>', 'Wenn der Tag langsam wird, bleibt der Blick nach draußen. Heaven ist ein stiller Ort für gute Gespräche und neue Pläne.', 'Raum für<br><em>den Augenblick.</em>', 'Klare Linien, weiches Licht und ein Balkon, der die Berge zum Teil Ihres Tages macht.', 'Stay a little<br><em>closer to heaven.</em>']
  },
  en: {
    green: ['Green<br><em>outside your window.</em>', 'Panoramic windows, mountain views and a balcony facing green. Green makes every day a small pause.', 'Naturally bright.<br><em>Entirely yours.</em>', 'Green brings open space and quiet nature views together. A relaxed place for 1–4 guests, between the Alps, lakes and Villach.', 'Mountain views,<br><em>entirely private.</em>', 'Coffee at the window. An unhurried afternoon on the balcony. Green gives you the best reason to have no plan.', 'A home that<br><em>looks outward.</em>', 'Light, natural hues and views of Carinthia’s mountains make the difference.', 'Make Green<br><em>your own.</em>'],
    heaven: ['More sky<br><em>in every day.</em>', 'Bright, modern and open, Heaven brings mountain views and comfort into easy balance.', 'Live lightly.<br><em>Look farther.</em>', 'Heaven is your sunny retreat in Warmbad, for 1–4 guests who want to take a little more from a day in Carinthia.', 'The light<br><em>stays longer.</em>', 'When the day slows down, the view remains. Heaven is a quiet place for good conversation and new plans.', 'Room for<br><em>the moment.</em>', 'Clean lines, soft light and a balcony that makes the mountains part of your day.', 'Stay a little<br><em>closer to heaven.</em>']
  },
  hu: {
    green: ['Zöld<br><em>az ablak előtt.</em>', 'Panorámaablakok, hegyi kilátás és zöldre néző erkély. A Green minden napból egy kis pihenőt csinál.', 'Természetesen világos.<br><em>Teljesen a tiéd.</em>', 'A Green nyitott tereket és nyugodt természetes kilátást kapcsol össze. Pihentető hely 1–4 vendégnek, az Alpok, tavak és Villach között.', 'Hegyi kilátás,<br><em>csak neked.</em>', 'Kávé az ablaknál. Ráérős délután az erkélyen. A Green a legjobb ok arra, hogy ne legyen terv.', 'Egy otthon, ami<br><em>kifelé néz.</em>', 'A fény, a természetes árnyalatok és Karintia hegyeire nyíló kilátás teszi különlegessé.', 'Legyen a Green<br><em>a tiéd.</em>'],
    heaven: ['Több égbolt<br><em>a mindennapokban.</em>', 'Világos, modern és nyitott: a Heaven könnyed egyensúlyba hozza a hegyi kilátást és a kényelmet.', 'Élj könnyedén.<br><em>Nézz messzebbre.</em>', 'A Heaven napfényes menedék Warmbadban, 1–4 vendégnek, akik egy karintiai napból egy kicsivel többet szeretnének magukkal vinni.', 'A fény<br><em>tovább marad.</em>', 'Amikor lelassul a nap, a kilátás megmarad. A Heaven csendes hely jó beszélgetésekhez és új tervekhez.', 'Hely a<br><em>pillanatnak.</em>', 'Tiszta vonalak, puha fény és egy erkély, amely a hegyeket a napod részévé teszi.', 'Maradj egy kicsit<br><em>közelebb az éghez.</em>']
  },
  it: {
    green: ['Il verde<br><em>fuori dalla finestra.</em>', 'Finestre panoramiche, vista montagna e balcone nel verde. Green trasforma ogni giorno in una piccola pausa.', 'Naturalmente luminoso.<br><em>Completamente tuo.</em>', 'Green unisce spazio aperto e viste naturali tranquille. Un luogo rilassato per 1–4 ospiti, tra Alpi, laghi e Villach.', 'Vista montagna,<br><em>tutta privata.</em>', 'Un caffè alla finestra. Un pomeriggio senza fretta sul balcone. Green ti dà la migliore ragione per non avere programmi.', 'Una casa che<br><em>guarda fuori.</em>', 'Luce, colori naturali e vista sulle montagne della Carinzia fanno la differenza.', 'Rendi Green<br><em>tutto tuo.</em>'],
    heaven: ['Più cielo<br><em>ogni giorno.</em>', 'Luminoso, moderno e aperto, Heaven unisce vista montagna e comfort in un equilibrio naturale.', 'Vivi leggero.<br><em>Guarda più lontano.</em>', 'Heaven è il tuo rifugio soleggiato a Warmbad per 1–4 ospiti che vogliono portare con sé qualcosa in più da una giornata in Carinzia.', 'La luce<br><em>resta più a lungo.</em>', 'Quando la giornata rallenta, la vista rimane. Heaven è un luogo quieto per belle conversazioni e nuovi progetti.', 'Spazio per<br><em>il momento.</em>', 'Linee pulite, luce morbida e un balcone che rende le montagne parte della tua giornata.', 'Resta un po’<br><em>più vicino al cielo.</em>']
  },
  sl: {
    green: ['Zelenje<br><em>pred oknom.</em>', 'Panoramska okna, pogled na gore in balkon v zelenje. Green vsak dan spremeni v kratek oddih.', 'Naravno svetel.<br><em>Povsem vaš.</em>', 'Green združuje odprt prostor in mirne naravne razglede. Sproščen kraj za 1–4 goste med Alpami, jezeri in Beljakom.', 'Pogled na gore,<br><em>povsem zaseben.</em>', 'Kava ob oknu. Počasno popoldne na balkonu. Green vam da najboljši razlog, da nimate načrta.', 'Dom, ki<br><em>gleda navzven.</em>', 'Svetloba, naravni toni in pogled na koroške gore naredijo razliko.', 'Naj bo Green<br><em>vaš.</em>'],
    heaven: ['Več neba<br><em>v vsakem dnevu.</em>', 'Svetel, sodoben in odprt Heaven združuje pogled na gore in udobje v lahkotno ravnovesje.', 'Živite lahkotno.<br><em>Glejte dlje.</em>', 'Heaven je vaše sončno zatočišče v Warmbadu za 1–4 goste, ki želijo iz dneva na Koroškem vzeti še nekaj več.', 'Svetloba<br><em>ostane dlje.</em>', 'Ko se dan upočasni, pogled ostane. Heaven je tih kraj za dobre pogovore in nove načrte.', 'Prostor za<br><em>trenutek.</em>', 'Čiste linije, mehka svetloba in balkon, ki gore naredi del vašega dneva.', 'Ostanite malo<br><em>bližje nebu.</em>']
  }
};

const ui = {
  de: { featureTitle: 'Komfort, der<br><em>leicht bleibt.</em>', inside: 'Innen erleben', moment: 'Ein anderer Rhythmus', gallery: 'Ein Blick hinein', location: 'Warmbad,<br><em>klar verbunden.</em>', locationCopy: 'Therme, Altstadt und Wege ins Grüne liegen nah. Doch hier fühlt sich alles angenehm weit weg.', availability: 'Verfügbarkeit prüfen', route: 'Route planen', book: 'Jetzt buchen', amenities: [['Panoramawohnen', 'Helles Wohnen mit weitem Bergblick und Smart-TV.'], ['Kochen', 'Küche mit Induktion, Backofen, Geschirrspüler und Kaffee.'], ['Schlafen', 'Doppelbett, Schlafsofa und viel Raum zum Ausschlafen.'], ['Einfach da', 'Balkon, WLAN, Parkplatz und Waschtrockner inklusive.']] },
  en: { featureTitle: 'Comfort that<br><em>feels light.</em>', inside: 'Inside the apartment', moment: 'A different pace', gallery: 'A closer look', location: 'Warmbad,<br><em>well connected.</em>', locationCopy: 'The thermal spa, old town and green paths are close. Yet here, everything feels pleasantly far away.', availability: 'Check availability', route: 'Plan your route', book: 'Book now', amenities: [['Panoramic living', 'Bright living with wide mountain views and smart TV.'], ['Cooking', 'A kitchen with induction, oven, dishwasher and coffee.'], ['Sleeping', 'Double bed, sofa bed and all the space to sleep in.'], ['Simply there', 'Balcony, Wi-Fi, parking and washer-dryer included.']] },
  hu: { featureTitle: 'Könnyed<br><em>kényelem.</em>', inside: 'Az apartman belülről', moment: 'Egy más ritmus', gallery: 'Közelebbről', location: 'Warmbad,<br><em>mindenhez közel.</em>', locationCopy: 'A termál, az óváros és a zöld utak mind közel vannak. Itt mégis minden kellemesen távolinak tűnik.', availability: 'Elérhetőség ellenőrzése', route: 'Útvonaltervezés', book: 'Foglalás most', amenities: [['Panorámás nappali', 'Világos tér széles hegyi kilátással és Smart TV-vel.'], ['Konyha', 'Indukció, sütő, mosogatógép és kávé minden reggelhez.'], ['Alvás', 'Franciaágy, kanapéágy és sok hely a ráérős reggelekhez.'], ['Egyszerűen adott', 'Erkély, Wi‑Fi, parkoló és mosó-szárítógép benne van.']] },
  it: { featureTitle: 'Un comfort<br><em>leggero.</em>', inside: 'Dentro l’appartamento', moment: 'Un ritmo diverso', gallery: 'Uno sguardo più vicino', location: 'Warmbad,<br><em>ben collegata.</em>', locationCopy: 'Terme, centro storico e sentieri verdi sono vicini. Eppure qui tutto sembra piacevolmente lontano.', availability: 'Verifica disponibilità', route: 'Pianifica il percorso', book: 'Prenota ora', amenities: [['Vivere panoramico', 'Zona luminosa con ampia vista montagna e Smart TV.'], ['Cucinare', 'Cucina con induzione, forno, lavastoviglie e caffè.'], ['Dormire', 'Letto matrimoniale, divano letto e spazio per dormire a lungo.'], ['Tutto qui', 'Balcone, Wi-Fi, parcheggio e lavasciuga inclusi.']] },
  sl: { featureTitle: 'Udobje, ki<br><em>je lahkotno.</em>', inside: 'V notranjosti apartmaja', moment: 'Drugačen ritem', gallery: 'Pogled od blizu', location: 'Warmbad,<br><em>dobro povezan.</em>', locationCopy: 'Terme, staro mestno jedro in zelene poti so blizu. Tukaj pa se vse zdi prijetno daleč.', availability: 'Preverite razpoložljivost', route: 'Načrtujte pot', book: 'Rezervirajte zdaj', amenities: [['Panoramsko bivanje', 'Svetel bivalni prostor s pogledom na gore in pametnim televizorjem.'], ['Kuhanje', 'Kuhinja z indukcijo, pečico, pomivalnim strojem in kavo.'], ['Spanje', 'Zakonska postelja, kavč postelja in dovolj prostora za počasna jutra.'], ['Preprosto tu', 'Balkon, Wi-Fi, parkirišče in pralno-sušilni stroj vključeni.']] }
};

const pageKey = document.body.dataset.apartment || 'green';
const page = apartments[pageKey];
const select = document.querySelector('#languageSelect');
const get = function (selector) { return document.querySelector(selector); };
const text = function (selector, value) { document.querySelectorAll(selector).forEach(function (node) { node.textContent = value; }); };
const html = function (selector, value) { document.querySelectorAll(selector).forEach(function (node) { node.innerHTML = value; }); };

function showReveals() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });
}

function bindGallery() {
  const dialog = get('.lightbox');
  document.querySelectorAll('.gallery-card').forEach(function (card) {
    card.addEventListener('click', function () {
      get('.lightbox img').src = card.dataset.image;
      dialog.showModal();
    });
  });
}

function render(language) {
  const story = stories[language][pageKey];
  const words = ui[language];
  document.documentElement.lang = language;
  document.title = 'Apartment ' + page.name + ' — BoRa Apartments';
  get('.hero-image img').src = page.hero;
  get('.moment-image img').src = page.moment;
  get('.book-image img').src = page.book;
  html('.hero h1', story[0]);
  text('.hero-copy', story[1]);
  html('.hero-tag', page.name + '<span>' + page.tone + '</span>');
  html('.intro h2', story[2]);
  text('.intro-copy p', story[3]);
  html('.intro-copy .text-link', words.availability + ' <i>→</i>');
  html('.feature-head h2', words.featureTitle);
  text('.feature-head .eyebrow', words.inside);
  text('.moment-copy .eyebrow', words.moment);
  html('.moment-copy h2', story[4]);
  text('.moment-copy p:last-child', story[5]);
  text('.gallery-head .eyebrow', words.gallery);
  html('.gallery-head h2', story[6]);
  text('.gallery-head > p:last-child', story[7]);
  html('.location h2', words.location);
  text('.location-intro > p:not(.eyebrow)', words.locationCopy);
  html('.location-intro .text-link', words.route + ' <i>↗</i>');
  text('.book-content .eyebrow', words.inside);
  html('.book-content h2', story[8]);
  text('.book-content .button-light span', words.book);
  document.querySelectorAll('.detail-stats span').forEach(function (element, index) {
    element.textContent = page.labels[language][index];
  });
  get('.feature-grid').innerHTML = words.amenities.map(function (item, index) {
    const icon = ['⌂', '⌁', '☾', '✦'][index];
    return '<article class="feature-card reveal"><span>0' + (index + 1) + '</span><div class="icon">' + icon + '</div><h3>' + item[0] + '</h3><p>' + item[1] + '</p></article>';
  }).join('');
  get('.gallery-grid').innerHTML = page.gallery.map(function (image, index) {
    return '<button class="gallery-card reveal" data-image="' + image + '" aria-label="Open image"><img src="' + image + '" alt="Apartment ' + page.name + '" /><span>0' + (index + 1) + ' <i>↗</i></span></button>';
  }).join('');
  bindGallery();
  showReveals();
  localStorage.setItem('bora-language', language);
  select.value = language;
}

const dialog = get('.lightbox');
get('.lightbox button').addEventListener('click', function () { dialog.close(); });
dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
select.value = localStorage.getItem('bora-language') || 'de';
render(select.value);
select.addEventListener('change', function (event) { render(event.target.value); });
window.addEventListener('scroll', function () {
  const heroImage = get('.hero-image');
  if (heroImage && window.scrollY < window.innerHeight) heroImage.style.translate = '0 ' + (window.scrollY * 0.15) + 'px';
}, { passive: true });
