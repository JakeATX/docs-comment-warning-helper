// Docs Comment Warning Blocker
// Hides Google's "you're commenting too frequently" style warnings in Docs/Slides/Sheets.
// It only touches popups whose text mentions comments AND a rate/frequency phrase,
// so normal errors (lost connection, can't save edits, etc.) still show.

(() => {
  // --- Edit these if Google's wording differs from what you see -------------
  // A popup is hidden only if its text matches one COMMENT pattern
  // and one RATE pattern. Copy a word or two from the real message if needed.
  const COMMENT_PATTERNS = [/comment/i, /repl(y|ies)/i];
  const RATE_PATTERNS = [
    /too (many|frequent|frequently|often|quickly|fast)/i,
    /slow down/i,
    /rate limit/i,
    /try again (later|in a)/i,
    /wait (a|before)/i,
  ];
  // Set to true to see what gets matched in DevTools (F12 > Console).
  const DEBUG = false;
  // --------------------------------------------------------------------------

  // Containers Google uses for dialogs, toasts and the yellow "butter bar".
  const POPUP_SELECTORS = [
    '[role="alertdialog"]',
    '[role="dialog"]',
    '[role="alert"]',
    '[role="status"]',
    '.docs-butterbar-container',
    '.docs-butterbar-message',
    '.jfk-butterBar',
    '.modal-dialog',
  ].join(',');

  const DISMISS_LABELS = /^(ok|okay|got it|dismiss|close|cancel|×|x)$/i;
  const handled = new WeakSet();
  let hiddenCount = 0;
  let badge;

  const log = (...a) => DEBUG && console.log('[CommentWarningBlocker]', ...a);

  function isRateWarning(text) {
    if (!text || text.length > 600) return false; // skip big panels like the comment sidebar
    return COMMENT_PATTERNS.some(r => r.test(text)) && RATE_PATTERNS.some(r => r.test(text));
  }

  function tryDismiss(el) {
    // Prefer clicking Google's own close/OK so its internal state stays consistent.
    const buttons = el.querySelectorAll('button, [role="button"]');
    for (const b of buttons) {
      const label = (b.getAttribute('aria-label') || b.textContent || '').trim();
      if (DISMISS_LABELS.test(label)) {
        b.click();
        return true;
      }
    }
    return false;
  }

  function hide(el) {
    if (handled.has(el)) return;
    handled.add(el);
    log('Hiding:', el.innerText);
    tryDismiss(el);
    el.style.setProperty('display', 'none', 'important');
    // Modal dialogs often add a grey backdrop that blocks clicks; hide it too.
    document.querySelectorAll('.modal-dialog-bg, .docs-material-dialog-background')
      .forEach(bg => bg.style.setProperty('display', 'none', 'important'));
    hiddenCount++;
    showBadge();
  }

  // Small, unobtrusive notice so a rejected comment never disappears silently.
  function showBadge() {
    if (window.top !== window) return;
    if (!badge) {
      badge = document.createElement('div');
      badge.style.cssText = [
        'position:fixed', 'bottom:16px', 'left:16px', 'z-index:2147483647',
        'background:#202124', 'color:#fff', 'font:12px/1.4 Arial,sans-serif',
        'padding:6px 10px', 'border-radius:6px', 'opacity:.85', 'cursor:pointer',
        'max-width:320px', 'box-shadow:0 2px 6px rgba(0,0,0,.3)'
      ].join(';');
      badge.title = 'Click to dismiss';
      badge.addEventListener('click', () => { badge.remove(); badge = null; hiddenCount = 0; });
      document.body.appendChild(badge);
    }
    badge.textContent =
      `Hid ${hiddenCount} comment-rate warning${hiddenCount > 1 ? 's' : ''}. ` +
      `If a comment didn't appear in the sidebar, re-post it.`;
    clearTimeout(badge._t);
    badge._t = setTimeout(() => { if (badge) { badge.remove(); badge = null; hiddenCount = 0; } }, 8000);
  }

  function scan(root) {
    if (!(root instanceof Element)) return;
    const candidates = root.matches?.(POPUP_SELECTORS)
      ? [root, ...root.querySelectorAll(POPUP_SELECTORS)]
      : root.querySelectorAll(POPUP_SELECTORS);
    for (const el of candidates) {
      if (isRateWarning(el.innerText)) hide(el);
    }
  }

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') m.addedNodes.forEach(scan);
      // Google often reuses one hidden toast element and just swaps its text.
      else if (m.type === 'characterData') scan(m.target.parentElement?.closest(POPUP_SELECTORS));
    }
  });

  function start() {
    scan(document.body);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    log('Running on', location.href);
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
