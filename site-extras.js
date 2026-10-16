/* Progressive enhancements shared across the public BoRa site. */
(() => {
  const language = localStorage.getItem('bora-language') || document.documentElement.lang || 'de';
  const words = {
    de: { skip: 'Zum Inhalt springen', top: 'Nach oben' }, en: { skip: 'Skip to content', top: 'Back to top' },
    hu: { skip: 'Ugrás a tartalomra', top: 'Vissza a tetejére' }, it: { skip: 'Vai al contenuto', top: 'Torna su' }, sl: { skip: 'Preskoči na vsebino', top: 'Nazaj na vrh' }
  };
  const utilityText = (code) => words[code] || words.de;
  const text = utilityText(language);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main-content';
  if (main && !document.querySelector('.skip-link')) {
    const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = `#${main.id}`; skip.textContent = text.skip; document.body.prepend(skip);
  }
  if (!document.querySelector('.reading-progress')) { const progress = document.createElement('div'); progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true'); document.body.prepend(progress); }
  if (!document.querySelector('.to-top')) {
    const button = document.createElement('button'); button.className = 'to-top'; button.type = 'button'; button.setAttribute('aria-label', text.top); button.textContent = '↑'; document.body.append(button);
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  const progress = document.querySelector('.reading-progress'); const topButton = document.querySelector('.to-top');
  const updateUtilityLanguage = () => { const translated = utilityText(localStorage.getItem('bora-language') || document.documentElement.lang); const skip = document.querySelector('.skip-link'); if (skip) skip.textContent = translated.skip; if (topButton) topButton.setAttribute('aria-label', translated.top); };
  const updateScrollUi = () => { const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); progress.style.setProperty('--reading-progress', `${Math.min(100, Math.round((window.scrollY / max) * 100))}%`); topButton.classList.toggle('is-visible', window.scrollY > 650); };
  window.addEventListener('scroll', updateScrollUi, { passive: true }); updateScrollUi();
  document.querySelectorAll('img').forEach((image) => { image.decoding = 'async'; if (!image.closest('.hero') && !image.closest('.booking')) image.loading = 'lazy'; });
  document.querySelectorAll('a[target="_blank"]').forEach((link) => { link.rel = `${link.rel} noopener noreferrer`.trim(); });
  document.querySelector('#languageSelect')?.addEventListener('change', () => setTimeout(updateUtilityLanguage, 40));
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pageDescriptions = { 'index.html': 'BoRa Apartments — stilvolle Ferienwohnungen in Villach, Kärnten.', 'apartment-first.html': 'Apartment First bei BoRa Apartments in Villach.', 'apartment-green.html': 'Apartment Green bei BoRa Apartments in Villach.', 'apartment-heaven.html': 'Apartment Heaven bei BoRa Apartments in Villach.', 'activities.html': 'Seen, Berge, Trails und Genuss rund um Villach entdecken.', 'booking.html': 'Verfügbarkeit und Aufenthalt bei BoRa Apartments anfragen.', 'contact.html': 'Kontakt und Anreise zu BoRa Apartments in Villach.' };
  const pageDescription = pageDescriptions[current] || pageDescriptions['index.html'];
  const putMeta = (attribute, name, content) => { let tag = document.head.querySelector(`meta[${attribute}="${name}"]`); if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, name); document.head.append(tag); } tag.content = content; };
  const productionPaths = { 'index.html': '', 'apartment-first.html': 'bora-apartment-first/', 'apartment-green.html': 'bora-apartment-green/', 'apartment-heaven.html': 'bora-apartment-heaven/', 'activities.html': 'aktivitaeten-in-der-region/', 'booking.html': 'rental-search/', 'contact.html': 'kontakt/' };
  const productionUrl = `https://boraapartments.at/${productionPaths[current] || ''}`;
  let canonical = document.head.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); } canonical.href = productionUrl;
  putMeta('name', 'theme-color', '#183f37'); putMeta('name', 'description', pageDescription); putMeta('property', 'og:type', 'website'); putMeta('property', 'og:title', document.title); putMeta('property', 'og:description', pageDescription); putMeta('property', 'og:url', productionUrl);
  const ogImage = document.querySelector('.hero img, .booking img, img')?.currentSrc || document.querySelector('.hero img, .booking img, img')?.src; if (ogImage) putMeta('property', 'og:image', ogImage);
  if (!document.querySelector('#bora-structured-data')) { const schema = document.createElement('script'); schema.type = 'application/ld+json'; schema.id = 'bora-structured-data'; schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'LodgingBusiness', name: 'BoRa Apartments', url: 'https://boraapartments.at/', telephone: '+43 699 108 330 83', email: 'info@boraapartments.at', address: { '@type': 'PostalAddress', streetAddress: 'Warmbader Allee 53', postalCode: '9500', addressLocality: 'Villach', addressCountry: 'AT' } }); document.head.append(schema); }
  const menu = document.querySelector('.site-menu'); const toggle = document.querySelector('.menu-toggle'); const close = document.querySelector('.menu-close');
  if (menu && toggle) {
    menu.id ||= 'site-menu'; menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); toggle.setAttribute('aria-controls', menu.id);
    let lastFocused;
    toggle.addEventListener('click', () => { if (menu.classList.contains('is-open')) { lastFocused = document.activeElement; setTimeout(() => menu.querySelector('a,button')?.focus(), 0); } else { setTimeout(() => toggle.focus(), 0); } });
    close?.addEventListener('click', () => setTimeout(() => (lastFocused || toggle).focus(), 0));
    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || !menu.classList.contains('is-open')) return;
      const focusable = [...menu.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')].filter((node) => !node.hasAttribute('disabled'));
      if (!focusable.length) return; const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
