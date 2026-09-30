// Kit di disegno vettoriale per le illustrazioni delle carte (750×1050, 5:7). Ogni carta è una funzione che riceve un Kit e disegna con SVG.
// Stile comune: sfondo atmosferico con luce, sagome forti con contorno scuro, riflessi, grana e ombre ai bordi (in alto a sinistra ci sono i numeri, in basso il nome).
const W = 750, H = 1050, INK = '#0d0b22';
const hash = s=>{ let h = 2166136261; for(const c of String(s)){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry = a=> ()=>{ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const r1 = n=> Math.round(n * 10) / 10;

class Kit{
  constructor(id){ this.id = id; this.defs = []; this.body = []; this.n = 0; this.rnd = mulberry(hash(id)); this.W = W; this.H = H; this.INK = INK; }
  uid(p){ return (p || 'g') + (this.n++); }
  lg(stops, a){ a = a || [0, 0, 0, 1]; const id = this.uid(); this.defs.push(`<linearGradient id="${id}" x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}">${stops.map(s=> `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`); return `url(#${id})`; }
  rg(stops, cx, cy, r){ const id = this.uid(); this.defs.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${stops.map(s=> `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`); return `url(#${id})`; }
  blur(sd){ const id = this.uid('f'); this.defs.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${id})`; }
  add(...s){ this.body.push(...s); return this; }
  // ---- sfondi e atmosfera
  sky(c){ const g = this.lg(c.map((x, i)=> [i / (c.length - 1), x])); return this.add(`<rect width="${W}" height="${H}" fill="${g}"/>`); }
  glow(cx, cy, r, color, op){ const g = this.rg([[0, color, op == null ? .9 : op], [1, color, 0]]); return this.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${g}"/>`); }
  rays(cx, cy, color, n, op, len){ n = n || 14; len = len || 1400; let s = ''; const rot = this.rnd() * 6; for(let i = 0; i < n; i++){ const a = rot + i * 6.283 / n, w = .09 + this.rnd() * .06; s += `<path d="M${cx} ${cy} L${r1(cx + Math.cos(a - w) * len)} ${r1(cy + Math.sin(a - w) * len)} L${r1(cx + Math.cos(a + w) * len)} ${r1(cy + Math.sin(a + w) * len)}Z"/>`; } return this.add(`<g fill="${color}" opacity="${op == null ? .18 : op}">${s}</g>`); }
  stars(n, y0, y1, col){ let s = ''; for(let i = 0; i < n; i++){ const x = this.rnd() * W, y = y0 + this.rnd() * (y1 - y0), r = .8 + this.rnd() * 2.4; s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" opacity="${r1(.4 + this.rnd() * .6)}"/>`; } return this.add(`<g fill="${col || '#fff'}">${s}</g>`); }
  dots(n, x0, y0, x1, y1, col, rmin, rmax, op){ let s = ''; for(let i = 0; i < n; i++){ s += `<circle cx="${r1(x0 + this.rnd() * (x1 - x0))}" cy="${r1(y0 + this.rnd() * (y1 - y0))}" r="${r1(rmin + this.rnd() * (rmax - rmin))}"/>`; } return this.add(`<g fill="${col}" opacity="${op == null ? .7 : op}">${s}</g>`); }
  // colline / montagne: profilo ondulato o a picchi fino al fondo
  hills(y, amp, color, o){ o = o || {}; const f1 = o.f || .008, ph = this.rnd() * 9, sharp = o.sharp; let d = `M0 ${H}`; for(let x = 0; x <= W + 10; x += 10){ let v = Math.sin(x * f1 + ph) * .6 + Math.sin(x * f1 * 2.3 + ph * 1.7) * .3 + Math.sin(x * f1 * 5.1 + ph) * .1; if(sharp) v = 1 - Math.abs(v) * 2 + Math.sin(x * f1 * 7) * .08; d += ` L${x} ${r1(y - v * amp)}`; } d += ` L${W} ${H}Z`; const fill = Array.isArray(color) ? this.lg([[0, color[0]], [1, color[1]]]) : color; return this.add(`<path d="${d}" fill="${fill}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`); }
  cloud(x, y, s, col, op){ const c = col || '#fff'; return this.add(`<g fill="${c}" opacity="${op == null ? .9 : op}" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="26"/><circle cx="-30" cy="-16" r="30"/><circle cx="14" cy="-26" r="38"/><circle cx="48" cy="-8" r="26"/></g>`); }
  // sagome di città / castelli ecc: rettangoli di altezze casuali
  skyline(y, color, o){ o = o || {}; let s = '', x = -10; while(x < W){ const w = (o.wmin || 34) + this.rnd() * (o.wvar || 50), h = (o.hmin || 60) + this.rnd() * (o.hvar || 220); s += `<rect x="${r1(x)}" y="${r1(y - h)}" width="${r1(w)}" height="${r1(h + (H - y))}"/>`; if(o.windows){ for(let wy = y - h + 14; wy < y - 8; wy += 22) for(let wx = x + 6; wx < x + w - 8; wx += 14) if(this.rnd() < .35) s += `<rect x="${r1(wx)}" y="${r1(wy)}" width="6" height="9" fill="${o.windows}" opacity=".85"/>`; } x += w + (o.gap || 2); } return this.add(`<g fill="${color}">${s}</g>`); }
  // ---- finitura comune: grana, vignetta, ombre dove vanno numeri e nome
  finish(o){ o = o || {};
    const top = this.lg([[0, '#000', .58], [1, '#000', 0]], [0, 0, 0, 1]), bot = this.lg([[0, '#000', 0], [1, '#000', .7]], [0, 0, 0, 1]), vig = this.rg([[.55, '#000', 0], [1, '#000', .55]], .5, .5, .75);
    this.defs.push(`<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${hash(this.id) % 97}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 -.12"/></filter>`);
    this.add(`<rect width="${W}" height="${H}" fill="${vig}"/>`, `<rect width="${W}" height="300" fill="${top}"/>`, `<rect y="${H - 300}" width="${W}" height="300" fill="${bot}"/>`, `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${o.grain == null ? .35 : o.grain}" style="mix-blend-mode:overlay"/>`);
    return this;
  }
  out(){ return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${this.defs.join('')}</defs>${this.body.join('')}</svg>`; }
}
// ---- pezzi riutilizzabili
const o = (fill, sw)=> `fill="${fill}" stroke="${INK}" stroke-width="${sw == null ? 6 : sw}" stroke-linejoin="round" stroke-linecap="round"`;      // attributi «con contorno»
const shadow = (k, cx, cy, rx, ry)=> k.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".38" filter="${k.blur(8)}"/>`);
module.exports = {Kit, W, H, INK, o, shadow, r1, hash, mulberry};
