/* LGT kit: shared theme picker + local score records for play.lgt.wtf games.
 *
 * Include early (before the game's own script), then call LGT.init once:
 *   <script src="/shared/lgt-kit.js"></script>
 *   LGT.init({
 *     game: 'snake',                       // storage namespace
 *     title: '貪食蛇',                      // shown in the records panel
 *     themes: ['original','dark','light','neo'],   // first one is the default
 *     swatch: 'linear-gradient(135deg,#050505 50%,#39ff14 50%)', // menu swatch for 'original'
 *     buttonClass: 'iconbtn',              // optional extra class for the two header buttons
 *     legacyTheme: 'light',                // optional: a theme saved by older code, used once
 *     records: {
 *       kind: 'score' | 'time',            // score: higher is better; time: seconds, lower is better
 *       variants: [{id:'easy',label:'簡單'}], // optional (difficulty / size); omit for one table
 *       format: v => ...,                  // optional custom formatter
 *       legacyBest: 1234,                  // optional: best from older storage, seeds an empty table
 *     },
 *   });
 * Buttons render into the first element with [data-lgt-kit]; without one they float top-right.
 *
 * Theme: sets <html data-theme="original|dark|light|neo">, fires window 'lgt:theme' {detail:{theme}}.
 * Records: LGT.addRecord({value, variant, won=true, detail}) -> {isBest, best, prev}
 *          LGT.best(variant) -> value | null;  LGT.openRecords(variant)
 *          Fires window 'lgt:records-open' / 'lgt:records-close' so a timed game can pause.
 * Storage: localStorage 'lgt:<game>:theme' and 'lgt:<game>:records'. Nothing leaves the browser.
 */
(function () {
  'use strict';
  var LABELS = { original: '原版', dark: '深色', light: '淺色', neo: '新粗獷' };
  var SWATCH = {
    dark: 'linear-gradient(135deg,#161922 50%,#7c8cff 50%)',
    light: 'linear-gradient(135deg,#ffffff 50%,#4f5bff 50%)',
    neo: '#c9b8ff'
  };
  var RECENT = 10;
  var ICON_THEME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.3" fill="currentColor"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor"/><circle cx="16" cy="10" r="1.3" fill="currentColor"/><path d="M12 21a2.5 2.5 0 0 1 0-5h2a3 3 0 0 0 3-3"/></svg>';
  var ICON_TROPHY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>';

  var cfg = null, theme = null, db = {}, ui = {}, curVariant = null, confirmClear = false;

  function rd(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function key(s) { return 'lgt:' + cfg.game + ':' + s; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function ensureAssets() {
    if (!document.querySelector('link[href$="/shared/lgt-kit.css"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/shared/lgt-kit.css';
      document.head.appendChild(l);
    }
    if (!document.querySelector('link[href*="Archivo+Black"]')) {
      var f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap';
      document.head.appendChild(f);
    }
  }

  /* ---------------- theme ---------------- */
  function setTheme(t, silent) {
    if (cfg.themes.indexOf(t) < 0) t = cfg.themes[0];
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    if (!silent) wr(key('theme'), t);
    if (ui.menu) ui.menu.querySelectorAll('[data-theme]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-theme') === t));
    });
    window.dispatchEvent(new CustomEvent('lgt:theme', { detail: { theme: t } }));
  }
  function cycleTheme() { setTheme(cfg.themes[(cfg.themes.indexOf(theme) + 1) % cfg.themes.length]); }
  function toggleMenu(open) {
    if (!ui.menu) return;
    var o = open == null ? ui.menu.hidden : open;
    ui.menu.hidden = !o;
    ui.themeBtn.setAttribute('aria-expanded', String(o));
  }

  /* ---------------- records ---------------- */
  function vkey(v) { return v == null ? '_' : String(v); }
  function table(v) { var k = vkey(v); if (!db[k]) db[k] = { best: null, recent: [] }; return db[k]; }
  function better(a, b) { return cfg.records.kind === 'time' ? a < b : a > b; }
  function fmt(v) {
    if (v == null) return '—';
    if (cfg.records.format) return cfg.records.format(v);
    if (cfg.records.kind === 'time') {
      var s = Math.round(v), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
      return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(ss).padStart(2, '0');
    }
    return Number(v).toLocaleString('zh-TW');
  }
  function when(t) {
    var d = new Date(t), now = new Date();
    var hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    if (d.toDateString() === now.toDateString()) return '今天 ' + hm;
    var y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return '昨天 ' + hm;
    return (d.getFullYear() !== now.getFullYear() ? d.getFullYear() + '/' : '') + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + hm;
  }
  function addRecord(o) {
    if (!cfg || !cfg.records) return { isBest: false, best: null, prev: null };
    var t = table(o.variant), won = o.won !== false;
    var e = { v: Number(o.value), at: Date.now(), won: won };
    if (o.detail) e.d = String(o.detail);
    t.recent.unshift(e); t.recent.length = Math.min(t.recent.length, RECENT);
    var prev = t.best ? t.best.v : null, isBest = false;
    if (won && (t.best == null || better(e.v, t.best.v))) { t.best = e; isBest = true; }
    wr(key('records'), db);
    if (ui.modal && !ui.modal.hidden) renderPanel();
    return { isBest: isBest, best: t.best ? t.best.v : null, prev: prev };
  }
  function best(v) { if (!cfg || !cfg.records) return null; var t = db[vkey(v)]; return t && t.best ? t.best.v : null; }

  function renderPanel() {
    var r = cfg.records, vs = r.variants, t = table(curVariant);
    var h = '<div class="lgt-card" role="document"><div class="lgt-card-head"><h2 id="lgt-rec-title">紀錄<span>' + esc(cfg.title || '') + '</span></h2>' +
      '<button class="lgt-x" data-act="close" aria-label="關閉">×</button></div>';
    if (vs && vs.length) {
      h += '<div class="lgt-tabs" role="tablist">' + vs.map(function (x) {
        return '<button role="tab" data-variant="' + esc(x.id) + '" aria-selected="' + (vkey(x.id) === vkey(curVariant)) + '">' + esc(x.label) + '</button>';
      }).join('') + '</div>';
    }
    h += '<div class="lgt-best"><div class="lgt-best-label">' + (r.kind === 'time' ? '最快' : '最佳') + '</div>' +
      '<div class="lgt-best-v">' + fmt(t.best && t.best.v) + '</div>' +
      '<div class="lgt-best-at">' + (t.best ? when(t.best.at) + (t.best.d ? '　·　' + esc(t.best.d) : '') : '還沒有完成的紀錄') + '</div></div>';
    h += '<h3>最近 ' + RECENT + ' 局</h3>';
    if (!t.recent.length) h += '<p class="lgt-empty">玩完一局就會出現在這裡。</p>';
    else {
      h += '<table class="lgt-table"><tbody>' + t.recent.map(function (e) {
        var isB = t.best && e.at === t.best.at && e.v === t.best.v;
        return '<tr class="' + (e.won ? '' : 'lgt-lost') + '"><td class="lgt-v">' + fmt(e.v) + (isB ? '<i class="lgt-tag">最佳</i>' : '') +
          (e.won ? '' : '<i class="lgt-tag lost">未完成</i>') + '</td><td class="lgt-d">' + esc(e.d || '') + '</td><td class="lgt-t">' + when(e.at) + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    h += '<div class="lgt-foot"><span>只存在這台瀏覽器</span>' + (confirmClear
      ? '<span class="lgt-confirm">清除' + (vs && vs.length ? '這個分頁的' : '全部') + '紀錄？<button data-act="clear-yes">清除</button><button data-act="clear-no">取消</button></span>'
      : '<button class="lgt-link" data-act="clear">清除紀錄</button>') + '</div></div>';
    ui.modal.innerHTML = h;
  }
  function openRecords(v) {
    if (!cfg.records) return;
    toggleMenu(false);
    if (v !== undefined) curVariant = v;
    else if (curVariant == null && cfg.records.variants && cfg.records.variants.length) curVariant = cfg.records.variants[0].id;
    confirmClear = false; renderPanel(); ui.modal.hidden = false;
    ui.modal.tabIndex = -1; ui.modal.focus({ preventScroll: true }); // focus the dialog, not ×, so Space/Enter don't close it
    window.dispatchEvent(new CustomEvent('lgt:records-open'));
  }
  function closeRecords() {
    if (!ui.modal || ui.modal.hidden) return;
    ui.modal.hidden = true;
    if (ui.recBtn) ui.recBtn.focus();
    window.dispatchEvent(new CustomEvent('lgt:records-close'));
  }

  /* ---------------- mount ---------------- */
  function mount() {
    var host = document.querySelector('[data-lgt-kit]');
    if (!host) { host = document.createElement('div'); host.className = 'lgt-kit-float'; document.body.appendChild(host); }
    host.classList.add('lgt-kit');
    var bc = 'lgt-btn' + (cfg.buttonClass ? ' ' + cfg.buttonClass : '');
    var h = '';
    if (cfg.records) h += '<button type="button" class="' + bc + '" id="lgtRecBtn" title="紀錄" aria-label="紀錄">' + ICON_TROPHY + '</button>';
    if (cfg.themes.length > 1) {
      h += '<span class="lgt-themewrap"><button type="button" class="' + bc + '" id="lgtThemeBtn" title="主題" aria-label="主題" aria-haspopup="menu" aria-expanded="false">' + ICON_THEME + '</button>' +
        '<div class="lgt-menu" role="menu" aria-label="主題" hidden>' + cfg.themes.map(function (t) {
          var sw = t === 'original' ? (cfg.swatch || '#888') : SWATCH[t];
          return '<button type="button" role="menuitemradio" data-theme="' + t + '"><i class="lgt-sw lgt-sw-' + t + '" style="background:' + sw + '"></i>' + LABELS[t] + '</button>';
        }).join('') + '</div></span>';
    }
    host.innerHTML = h;
    ui.recBtn = host.querySelector('#lgtRecBtn');
    ui.themeBtn = host.querySelector('#lgtThemeBtn');
    ui.menu = host.querySelector('.lgt-menu');
    if (ui.themeBtn) {
      ui.themeBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
      ui.menu.addEventListener('click', function (e) {
        var b = e.target.closest('[data-theme]'); if (!b) return;
        setTheme(b.getAttribute('data-theme')); toggleMenu(false);
      });
      document.addEventListener('pointerdown', function (e) { if (!e.target.closest('.lgt-themewrap')) toggleMenu(false); });
    }
    if (cfg.records) {
      ui.modal = document.createElement('div');
      ui.modal.className = 'lgt-modal'; ui.modal.hidden = true;
      ui.modal.setAttribute('role', 'dialog'); ui.modal.setAttribute('aria-modal', 'true'); ui.modal.setAttribute('aria-labelledby', 'lgt-rec-title');
      document.body.appendChild(ui.modal);
      ui.recBtn.addEventListener('click', function () { openRecords(); });
      ui.modal.addEventListener('click', function (e) {
        if (e.target === ui.modal) return closeRecords();
        var b = e.target.closest('button'); if (!b) return;
        var a = b.getAttribute('data-act'), v = b.getAttribute('data-variant');
        if (v != null) { curVariant = v; confirmClear = false; renderPanel(); }
        else if (a === 'close') closeRecords();
        else if (a === 'clear') { confirmClear = true; renderPanel(); }
        else if (a === 'clear-no') { confirmClear = false; renderPanel(); }
        else if (a === 'clear-yes') {
          if (cfg.records.variants && cfg.records.variants.length) delete db[vkey(curVariant)]; else db = {};
          wr(key('records'), db); confirmClear = false; renderPanel();
        }
      });
    }
    // capture phase so a game's own Escape/keys don't also fire while a kit popup is open
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (ui.modal && !ui.modal.hidden) { closeRecords(); e.stopImmediatePropagation(); e.preventDefault(); }
      else if (ui.menu && !ui.menu.hidden) { toggleMenu(false); e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);
    setTheme(theme, true);
  }

  function init(c) {
    cfg = Object.assign({ themes: ['original', 'dark', 'light', 'neo'] }, c);
    ensureAssets();
    var t = rd(key('theme'), null);
    if (t == null && c.legacyTheme && cfg.themes.indexOf(c.legacyTheme) >= 0) { t = c.legacyTheme; wr(key('theme'), t); }
    setTheme(t || cfg.themes[0], true);
    if (cfg.records) {
      cfg.records = Object.assign({ kind: 'score' }, cfg.records);
      db = rd(key('records'), {}) || {};
      var lb = Number(cfg.records.legacyBest);
      if (lb > 0) {
        var tb = table(cfg.records.variants && cfg.records.variants.length ? cfg.records.variants[0].id : null);
        if (!tb.best) { tb.best = { v: lb, at: Date.now(), won: true, d: '舊紀錄' }; wr(key('records'), db); }
      }
    }
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  }

  window.LGT = {
    init: init,
    setTheme: function (t) { setTheme(t); },
    cycleTheme: cycleTheme,
    theme: function () { return theme; },
    addRecord: addRecord,
    best: best,
    format: function (v) { return fmt(v); },
    openRecords: openRecords,
    closeRecords: closeRecords,
    isOpen: function () { return !!((ui.modal && !ui.modal.hidden) || (ui.menu && !ui.menu.hidden)); },
    /* read a CSS custom property from <html> (for canvas games that paint with theme colours) */
    css: function (name, el) { return getComputedStyle(el || document.documentElement).getPropertyValue(name).trim(); }
  };
})();
