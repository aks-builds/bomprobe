function parsePurl(purl) {
  if (!purl || typeof purl !== 'string') return null;

  const match = purl.match(/^pkg:([^/]+)\/(?:([^/]+)\/)?([^@]+)(?:@(.+))?$/);
  if (!match) return null;

  return {
    type: match[1],
    namespace: match[2] || null,
    name: match[3],
    version: match[4] || null
  };
}

function isValidPurl(purl) {
  return parsePurl(purl) !== null;
}

module.exports = { parsePurl, isValidPurl };
