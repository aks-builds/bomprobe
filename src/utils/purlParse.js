function parsePurl(purl) {
  if (!purl || typeof purl !== 'string') return null;

  const schemeIdx = purl.indexOf('pkg:');
  if (schemeIdx !== 0) return null;

  let rest = purl.slice(4);

  let subpath = null;
  const hashIdx = rest.indexOf('#');
  if (hashIdx !== -1) {
    subpath = rest.slice(hashIdx + 1);
    rest = rest.slice(0, hashIdx);
  }

  let qualifiersStr = null;
  const qIdx = rest.indexOf('?');
  if (qIdx !== -1) {
    qualifiersStr = rest.slice(qIdx + 1);
    rest = rest.slice(0, qIdx);
  }

  let version = null;
  const atIdx = rest.lastIndexOf('@');
  if (atIdx !== -1) {
    version = decodeURIComponent(rest.slice(atIdx + 1));
    rest = rest.slice(0, atIdx);
  }

  const slashIdx = rest.indexOf('/');
  if (slashIdx === -1) return null;
  const type = rest.slice(0, slashIdx);
  rest = rest.slice(slashIdx + 1);

  let namespace = null;
  const lastSlash = rest.lastIndexOf('/');
  let name;
  if (lastSlash !== -1) {
    namespace = rest.slice(0, lastSlash);
    name = decodeURIComponent(rest.slice(lastSlash + 1));
  } else {
    name = decodeURIComponent(rest);
  }

  if (!type || !name) return null;

  return {
    type,
    namespace,
    name,
    version,
    qualifiers: qualifiersStr ? parseQualifiers(qualifiersStr) : {},
    subpath
  };
}

function parseQualifiers(qs) {
  const result = {};
  for (const pair of qs.split('&')) {
    const [k, v] = pair.split('=');
    if (k) result[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
  }
  return result;
}

function purlToString(parsed) {
  if (!parsed) return '';
  let s = `pkg:${parsed.type}/`;
  if (parsed.namespace) s += `${parsed.namespace}/`;
  s += encodeURIComponent(parsed.name);
  if (parsed.version) s += `@${encodeURIComponent(parsed.version)}`;
  const qs = Object.entries(parsed.qualifiers || {});
  if (qs.length > 0) {
    s += '?' + qs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  }
  if (parsed.subpath) s += `#${parsed.subpath}`;
  return s;
}

module.exports = { parsePurl, purlToString };
