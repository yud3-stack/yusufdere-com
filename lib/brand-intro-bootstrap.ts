// Runs before page markup paints; sessionStorage never needs to be read during hydration.
export const brandIntroBootstrap = `(() => {
  const root = document.documentElement;
  try {
    const path = location.pathname;
    if (path === '/admin' || path.startsWith('/admin/') ||
        matchMedia('(prefers-reduced-motion: reduce)').matches ||
        sessionStorage.getItem('yd-brand-intro-seen')) return;
    sessionStorage.setItem('yd-brand-intro-seen', '1');
    root.setAttribute('data-brand-intro-start', String(Date.now()));
    root.setAttribute('data-brand-intro', 'playing');
    setTimeout(() => root.setAttribute('data-brand-intro', 'done'), 2400);
  } catch { /* With unavailable storage, show the page immediately. */ }
})();`;
