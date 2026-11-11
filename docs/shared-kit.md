# Shared kit: themes and records

`shared/lgt-kit.js` + `shared/lgt-kit.css` give every game the same theme picker and local score records.

## Use in a game
```html
<span data-lgt-kit></span>            <!-- where the two buttons go; omit to float them top-right -->
<script src="/shared/lgt-kit.js"></script>
<script>
LGT.init({
  game: 'snake', title: '貪食蛇',
  themes: ['original', 'dark', 'light', 'neo'],   // first = default
  swatch: 'linear-gradient(135deg,#050505 50%,#39ff14 50%)',  // menu swatch for 原版
  buttonClass: 'iconbtn',                          // match the game's own icon buttons
  records: { kind: 'score' },                      // or 'time' (seconds, lower is better), optional variants
});
// at game end
const r = LGT.addRecord({ value: score, detail: '行數 42' });   // r.isBest
</script>
```

## Themes
- `<html data-theme="original|dark|light|neo">`; style games with `:root[data-theme="neo"] …`.
- `original` keeps the game's own look; `dark` / `light` are the site family palette (see make-ten); `neo` is neubrutalism (lavender #c9b8ff, white panels, 3px #111 borders, hard offset shadows, Archivo Black). Shared neo tokens: `--neo-*` in `lgt-kit.css`.
- The kit restyles the portal header/footer for light and neo.
- Canvas games read colours with `LGT.css('--var')` and repaint on the `lgt:theme` event.

## Records
- `LGT.addRecord({value, variant, won, detail})` once per finished game. `won:false` entries are listed as 未完成 and never become best (for time games).
- Panel: best + last 10 games per variant, clear with inline confirm. `lgt:records-open` / `lgt:records-close` events let timed games pause. `LGT.isOpen()` is true while the panel or theme menu is open; games ignore their own keys then.
- Storage: `localStorage['lgt:<game>:theme']`, `localStorage['lgt:<game>:records']`. Nothing is sent anywhere.
