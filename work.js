const STUDIO_KEY = 'bora-studio-config-v1';
const blankConfig = () => ({
  theme: { ink: '', cream: '', accent: '', fontScale: 100 },
  header: { desktopLogo: '', mobileLogo: '', desktopPadding: '', mobilePadding: '', mobileBookBackground: '', mobileMenuSize: '', mobileMenuSide: 'right', mobileMenuPanel: '' },
  menu: {}, globalCss: '', pages: {}
});
const pageInfo = {
  'index.html': { label: 'Főoldal', presets: [['Hero főcím', '.hero h1', 'html'], ['Hero bevezető', '.hero-bottom p', 'text'], ['Hero kép', '.hero-image img', 'src'], ['Apartman cím', '.section-title h2', 'html'], ['Foglalási cím', '.booking h2', 'html'], ['Foglalási kép', '.booking-image img', 'src']] },
  'apartment-first.html': { label: 'Apartment First', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Bevezető cím', '.intro h2', 'html'], ['Foglalási cím', '.booking h2', 'html']] },
  'apartment-green.html': { label: 'Apartment Green', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Bevezető cím', '.intro h2', 'html'], ['Foglalási cím', '.booking h2', 'html']] },
  'apartment-heaven.html': { label: 'Apartment Heaven', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Bevezető cím', '.intro h2', 'html'], ['Foglalási cím', '.booking h2', 'html']] },
  'activities.html': { label: 'Élmények', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Szezon címsor', '.season-intro h2', 'html'], ['Foglalási cím', '.booking h2', 'html']] },
  'booking.html': { label: 'Foglalás', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Foglalási leírás', '.booking-copy p', 'text']] },
  'contact.html': { label: 'Kapcsolat & érkezés', presets: [['Hero cím', '.hero h1', 'html'], ['Hero kép', '.hero-image img', 'src'], ['Kapcsolat címsor', '.details-intro h2', 'html'], ['Érkezés címsor', '.arrival h2', 'html']] }
};
const menuLabels = [['home', 'Főoldal'], ['apartments', 'Apartmanok'], ['experiences', 'Élmények'], ['book', 'Foglalás'], ['contact', 'Kapcsolat'], ['menu', 'Menü'], ['close', 'Bezárás']];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
let config;
let activePage = 'index.html';
let refreshTimer;

function readConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(STUDIO_KEY) || '{}');
    return { ...blankConfig(), ...stored, theme: { ...blankConfig().theme, ...(stored.theme || {}) }, header: { ...blankConfig().header, ...(stored.header || {}) }, menu: stored.menu || {}, pages: stored.pages || {} };
  } catch { return blankConfig(); }
}
function pageConfig() {
  config.pages[activePage] ||= { content: [], styles: [], customCss: '' };
  config.pages[activePage].content ||= [];
  config.pages[activePage].styles ||= [];
  return config.pages[activePage];
}
function flash(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(flash.timer); flash.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
function refreshPreview() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => { $('#previewFrame').src = `${activePage}?studio=${Date.now()}`; $('#openPreview').href = activePage; }, 180);
}
function save(message = 'Elmentve') {
  try { localStorage.setItem(STUDIO_KEY, JSON.stringify(config)); refreshPreview(); if (message) flash(message); }
  catch { flash('A kép vagy a beállítás túl nagy a helyi tárhelyhez.'); }
}
function getPreviewValue(selector, kind) {
  try {
    const node = $('#previewFrame').contentDocument?.querySelector(selector);
    if (!node) return '';
    return kind === 'html' ? node.innerHTML : kind === 'text' ? node.textContent : node.getAttribute(kind) || '';
  } catch { return ''; }
}
function renderPageSelect() {
  $('#pageSelect').innerHTML = Object.entries(pageInfo).map(([file, data]) => `<option value="${file}">${data.label}</option>`).join('');
  $('#pageSelect').value = activePage;
}
function renderPresets() {
  $('#contentPreset').innerHTML = `<option value="">Válassz gyors mezőt…</option>${pageInfo[activePage].presets.map(([name, selector, kind], index) => `<option value="${index}">${name}</option>`).join('')}`;
}
function renderMenuFields() {
  $('#menuLabels').innerHTML = menuLabels.map(([key, label]) => `<label>${label}<input data-menu-label="${key}" value="${escapeHtml(config.menu[key] || '')}" placeholder="Alapértelmezett" /></label>`).join('');
}
function renderContentList() {
  const list = pageConfig().content;
  $('#contentList').innerHTML = list.length ? list.map((item, index) => `<article class="saved-item"><div><code>${escapeHtml(item.selector)} · ${escapeHtml(item.kind)}</code><small>${escapeHtml(item.value)}</small></div><button class="delete-item" data-delete-content="${index}" type="button">Törlés</button></article>`).join('') : '';
}
function renderImageList() {
  const list = pageConfig().content.filter((item) => item.kind === 'src');
  $('#imageList').innerHTML = list.length ? list.map((item) => `<article class="saved-item"><div><code>${escapeHtml(item.selector)}</code><small>${escapeHtml(item.value)}</small></div><button class="delete-item" data-edit-image="${escapeHtml(item.selector)}" type="button">Szerkesztés</button></article>`).join('') : '';
}
function renderStyleList() {
  const list = pageConfig().styles;
  $('#styleList').innerHTML = list.length ? list.map((item, index) => `<article class="saved-item"><div><code>${escapeHtml(item.selector)} { ${escapeHtml(item.property)}: ${escapeHtml(item.value)} }</code><small>${item.scope === 'all' ? 'Minden nézet' : item.scope}</small></div><button class="delete-item" data-delete-style="${index}" type="button">Törlés</button></article>`).join('') : '';
}
function renderControls() {
  const { theme, header } = config;
  $('#currentPageLabel').textContent = pageInfo[activePage].label.toUpperCase(); $('#previewName').textContent = pageInfo[activePage].label;
  $('#themeInk').value = theme.ink || '#183f37'; $('#themeCream').value = theme.cream || '#f4f0e9'; $('#themeAccent').value = theme.accent || '#da6846'; $('#fontScale').value = theme.fontScale || 100; $('#fontScaleOutput').value = `${theme.fontScale || 100}%`;
  $('#mobileLogo').value = header.mobileLogo || ''; $('#mobileMenuSize').value = header.mobileMenuSize || ''; $('#mobilePadding').value = header.mobilePadding || ''; $('#mobileBookBackground').value = header.mobileBookBackground || '#f4f0e9'; $('#mobileMenuPanel').value = header.mobileMenuPanel || '#f4f0e9'; $('#mobileMenuSide').value = header.mobileMenuSide || 'right';
  $('#pageCss').value = pageConfig().customCss || ''; $('#globalCss').value = config.globalCss || '';
  renderPageSelect(); renderPresets(); renderMenuFields(); renderContentList(); renderImageList(); renderStyleList();
}
function updateTheme() {
  config.theme.ink = $('#themeInk').value; config.theme.cream = $('#themeCream').value; config.theme.accent = $('#themeAccent').value; config.theme.fontScale = Number($('#fontScale').value); $('#fontScaleOutput').value = `${config.theme.fontScale}%`; save();
}
function resetForms() {
  $('#contentSelector').value = ''; $('#contentKind').value = 'text'; $('#contentValue').value = ''; $('#contentPreset').value = '';
}
function addContent(item) {
  const items = pageConfig().content;
  const found = items.findIndex((entry) => entry.selector === item.selector && entry.kind === item.kind);
  if (found >= 0) items.splice(found, 1, item); else items.push(item);
  renderContentList(); renderImageList(); save('Tartalom mentve');
}
function deleteContent(index) {
  pageConfig().content.splice(index, 1); renderContentList(); renderImageList(); save('Elem törölve');
}
function addStyle(item) {
  const items = pageConfig().styles;
  const found = items.findIndex((entry) => entry.selector === item.selector && entry.property === item.property && entry.scope === item.scope);
  if (found >= 0) items.splice(found, 1, item); else items.push(item);
  renderStyleList(); save('Stílus mentve');
}
function switchTab(name) {
  $$('.studio-tabs button').forEach((button) => button.classList.toggle('is-active', button.dataset.tab === name));
  $$('.editor-panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === name));
}

config = readConfig();
renderControls();
refreshPreview();

$('#pageSelect').addEventListener('change', (event) => { activePage = event.target.value; renderControls(); refreshPreview(); });
$$('.studio-tabs button').forEach((button) => button.addEventListener('click', () => switchTab(button.dataset.tab)));
$('#contentPreset').addEventListener('change', (event) => {
  const preset = pageInfo[activePage].presets[event.target.value]; if (!preset) return;
  const [, selector, kind] = preset; $('#contentSelector').value = selector; $('#contentKind').value = kind; $('#contentValue').value = getPreviewValue(selector, kind);
});
$('#saveContentButton').addEventListener('click', () => { const selector = $('#contentSelector').value.trim(), kind = $('#contentKind').value, value = $('#contentValue').value; if (!selector || !value) return flash('Adj meg kijelölőt és tartalmat.'); addContent({ selector, kind, value }); });
$('#clearContentForm').addEventListener('click', resetForms);
$('#saveImageButton').addEventListener('click', () => { const selector = $('#imageSelector').value.trim(), value = $('#imageUrl').value.trim(); if (!selector || !value) return flash('Adj meg kijelölőt és kép URL-t.'); addContent({ selector, kind: 'src', value }); flash('Kép mentve'); });
$('#imageUpload').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; $('#uploadName').textContent = file.name; const reader = new FileReader(); reader.addEventListener('load', () => { $('#imageUrl').value = reader.result; flash('Kép betöltve — mentsd a Kép mentése gombbal.'); }); reader.readAsDataURL(file); });
$('#saveStyleButton').addEventListener('click', () => { const selector = $('#styleSelector').value.trim(), property = $('#styleProperty').value.trim(), value = $('#styleValue').value.trim(), scope = $('#styleScope').value; if (!selector || !property || !value) return flash('Töltsd ki mindhárom stílusmezőt.'); addStyle({ selector, property, value, scope }); });
['themeInk', 'themeCream', 'themeAccent', 'fontScale'].forEach((id) => $(`#${id}`).addEventListener('input', updateTheme));
$('#saveMobileButton').addEventListener('click', () => { const header = config.header; header.mobileLogo = $('#mobileLogo').value.trim(); header.mobileMenuSize = $('#mobileMenuSize').value.trim(); header.mobilePadding = $('#mobilePadding').value.trim(); header.mobileBookBackground = $('#mobileBookBackground').value; header.mobileMenuPanel = $('#mobileMenuPanel').value; header.mobileMenuSide = $('#mobileMenuSide').value; $$('[data-menu-label]').forEach((input) => { config.menu[input.dataset.menuLabel] = input.value.trim(); }); save('Mobil és menü beállítások mentve'); });
$('#saveCssButton').addEventListener('click', () => { pageConfig().customCss = $('#pageCss').value; config.globalCss = $('#globalCss').value; save('CSS mentve'); });
$('#resetPageButton').addEventListener('click', () => { if (!confirm(`${pageInfo[activePage].label} összes saját módosítását törlöd?`)) return; delete config.pages[activePage]; renderControls(); save('Oldal visszaállítva'); });
$('#resetAllButton').addEventListener('click', () => { if (!confirm('Minden BoRa Studio módosítást törölsz ebben a böngészőben?')) return; localStorage.removeItem(STUDIO_KEY); config = blankConfig(); activePage = 'index.html'; renderControls(); refreshPreview(); flash('Minden módosítás törölve'); });
document.addEventListener('click', (event) => {
  const contentButton = event.target.closest('[data-delete-content]'); if (contentButton) deleteContent(Number(contentButton.dataset.deleteContent));
  const styleButton = event.target.closest('[data-delete-style]'); if (styleButton) { pageConfig().styles.splice(Number(styleButton.dataset.deleteStyle), 1); renderStyleList(); save('Stílus törölve'); }
  const imageButton = event.target.closest('[data-edit-image]'); if (imageButton) { const item = pageConfig().content.find((entry) => entry.selector === imageButton.dataset.editImage && entry.kind === 'src'); if (item) { $('#imageSelector').value = item.selector; $('#imageUrl').value = item.value; switchTab('images'); } }
});
$$('.viewport-switch button').forEach((button) => button.addEventListener('click', () => { $$('.viewport-switch button').forEach((item) => item.classList.toggle('is-active', item === button)); $('#previewFrame').className = button.dataset.viewport === 'desktop' ? '' : button.dataset.viewport; }));
$('#exportButton').addEventListener('click', () => { const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'bora-studio-backup.json'; link.click(); URL.revokeObjectURL(link.href); flash('Biztonsági mentés letöltve'); });
$('#importInput').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener('load', () => { try { const imported = JSON.parse(reader.result); config = { ...blankConfig(), ...imported, theme: { ...blankConfig().theme, ...(imported.theme || {}) }, header: { ...blankConfig().header, ...(imported.header || {}) }, menu: imported.menu || {}, pages: imported.pages || {} }; save('Biztonsági mentés betöltve'); renderControls(); } catch { flash('Ez nem olvasható BoRa Studio mentés.'); } }); reader.readAsText(file); });
