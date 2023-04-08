const { categorizeType } = require('./purlRegistry');
const { parsePurl } = require('./purl');

function detectEcosystem(components) {
  const ecosystems = {};
  for (const c of components) {
    if (!c.purl) continue;
    const parsed = parsePurl(c.purl);
    if (!parsed) continue;
    const cat = categorizeType(parsed.type);
    const key = parsed.type;
    ecosystems[key] = (ecosystems[key] || 0) + 1;
  }

  const sorted = Object.entries(ecosystems)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count, category: categorizeType(type) }));

  const primary = sorted.length > 0 ? sorted[0].type : null;

  return { ecosystems: sorted, primary, totalWithPurl: sorted.reduce((s, e) => s + e.count, 0) };
}

module.exports = { detectEcosystem };
