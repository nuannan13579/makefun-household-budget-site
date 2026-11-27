// HearthLedger charts: small, dependency-free SVG charts drawn from data.
// donutChart returns an SVG string; barChart returns an SVG string.

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const [sx, sy] = polar(cx, cy, r, startAngle);
  const [ex, ey] = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

// slices: [{label, value, color}] — values must sum to more than 0.
export function donutChart(slices, size = 200) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, thick = 34;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="No spending yet"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e4dccb" stroke-width="${thick}"/><text x="${cx}" y="${cy}" text-anchor="middle" font-size="15" fill="#6b7263">No data</text></svg>`;
  }
  let angle = 0;
  const parts = slices.map((s) => {
    const frac = s.value / total;
    const sweep = Math.max(frac * 360 - 1.2, 0.5);
    const d = arcPath(cx, cy, r, angle, angle + sweep);
    angle += frac * 360;
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${thick}" stroke-linecap="butt"><title>${s.label}: ${Math.round(frac * 100)}%</title></path>`;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category donut chart">${parts.join('')}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#6b7263">Spent in</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="15" font-weight="bold" fill="#22301f">Nov 2026</text></svg>`;
}

// bars: [{label, value, color}] — vertical bars with value labels on top.
export function barChart(bars, width = 640, height = 260) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const padL = 8, padB = 28, padT = 26;
  const plotH = height - padB - padT;
  const slot = (width - padL * 2) / bars.length;
  const barW = Math.min(64, slot * 0.55);
  const parts = bars.map((b, i) => {
    const h = Math.max((b.value / max) * plotH, 2);
    const x = padL + slot * i + (slot - barW) / 2;
    const y = padT + plotH - h;
    const label = b.label;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${b.color}"><title>${label}: $${b.value.toLocaleString('en-US')}</title></rect>` +
      `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="bold" fill="#22301f">$${Math.round(b.value).toLocaleString('en-US')}</text>` +
      `<text x="${(x + barW / 2).toFixed(1)}" y="${(height - 8).toFixed(1)}" text-anchor="middle" font-size="12" fill="#6b7263">${label}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Monthly spending bar chart">${parts.join('')}</svg>`;
}
