/* BoRa Studio runtime — applies the locally saved admin customisations on every guest page. */
(() => {
  const STORAGE_KEY = 'bora-studio-config-v1';
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const defaults = {
    theme: { ink: '', cream: '', accent: '', fontScale: 100 },
    header: { desktopLogo: '', mobileLogo: '', desktopPadding: '', mobilePadding: '', mobileBookBackground: '', mobileMenuSize: '', mobileMenuSide: 'right', mobileMenuPanel: '' },
    menu: {}, globalCss: '', pages: {}
  };

  const readConfig = () => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return defaults; }
  };
  const safeSelector = (selector) => { try { return document.querySelectorAll(selector); } catch { return []; } };
  const styleId = 'bora-studio-overrides';

  function rulesFor(config) {
    const theme = config.theme || {};
    const header = config.header || {};
    const page = config.pages?.[currentPage] || {};
    const declarations = [];
    if (theme.ink) declarations.push(`--ink:${theme.ink}`);
    if (theme.cream) declarations.push(`--cream:${theme.cream}`);
    if (theme.accent) declarations.push(`--orange:${theme.accent}`);
    let css = declarations.length ? `:root{${declarations.join(';')}}` : '';
    if (Number(theme.fontScale) && Number(theme.fontScale) !== 100) css += `html{font-size:${Number(theme.fontScale)}%!important}`;
    if (header.desktopLogo) css += `.site-header>.brand{font-size:${header.desktopLogo}px!important}`;
    if (header.desktopPadding) css += `.site-header{padding:${header.desktopPadding}!important}`;
    css += '@media(max-width:991.98px){';
    if (header.mobileLogo) css += `.site-header>.brand{font-size:${header.mobileLogo}px!important}`;
    if (header.mobilePadding) css += `.site-header{padding:${header.mobilePadding}!important}`;
    if (header.mobileBookBackground) css += `.header-actions .header-book{background:${header.mobileBookBackground}!important}`;
    if (header.mobileMenuSize) css += `.site-menu .menu-links a{font-size:${header.mobileMenuSize}px!important}`;
    if (header.mobileMenuPanel) css += `.site-menu-panel{background:${header.mobileMenuPanel}!important}`;
    if (header.mobileMenuSide === 'left') css += `.site-menu{grid-template-columns:minmax(300px,68vw) minmax(0,1fr)!important}.site-menu-panel{justify-self:start!important;transform:translateX(-105%)!important}.site-menu.is-open .site-menu-panel{transform:none!important}`;
    css += '}';
    (page.styles || []).forEach((item) => {
      if (!item.selector || !item.property || !item.value) return;
      const rule = `${item.selector}{${item.property}:${item.value}!important}`;
      if (item.scope === 'mobile') css += `@media(max-width:575.98px){${rule}}`;
      else if (item.scope === 'tablet') css += `@media(min-width:576px) and (max-width:991.98px){${rule}}`;
      else css += rule;
    });
    css += config.globalCss || '';
    css += page.customCss || '';
    return css;
  }

  function applyContent(config) {
    const page = config.pages?.[currentPage] || {};
    (page.content || []).forEach((item) => {
      safeSelector(item.selector).forEach((node) => {
        if (item.kind === 'html') node.innerHTML = item.value;
        else if (item.kind === 'text') node.textContent = item.value;
        else if (item.kind) node.setAttribute(item.kind, item.value);
      });
    });
    Object.entries(config.menu || {}).forEach(([name, value]) => {
      if (value) safeSelector(`[data-menu="${name}"]`).forEach((node) => { node.textContent = value; });
    });
  }

  function applyStudio() {
    const config = readConfig();
    let style = document.getElementById(styleId);
    if (!style) { style = document.createElement('style'); style.id = styleId; document.head.append(style); }
    style.textContent = rulesFor(config);
    applyContent(config);
  }

  applyStudio();
  document.querySelector('#languageSelect')?.addEventListener('change', () => setTimeout(applyStudio, 30));
  window.addEventListener('storage', (event) => { if (event.key === STORAGE_KEY) applyStudio(); });
})();
