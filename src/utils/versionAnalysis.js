function parseVersion(version) {
  if (!version || typeof version !== 'string') return null;
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)(.*)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || ''
  };
}

function isPrerelease(version) {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  return parsed.prerelease.length > 0;
}

function isMajorZero(version) {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  return parsed.major === 0;
}

function analyzeVersions(components) {
  let total = 0;
  let withVersion = 0;
  let prerelease = 0;
  let majorZero = 0;
  let noVersion = 0;

  for (const c of components) {
    total++;
    if (!c.version) { noVersion++; continue; }
    withVersion++;
    if (isPrerelease(c.version)) prerelease++;
    if (isMajorZero(c.version)) majorZero++;
  }

  return { total, withVersion, prerelease, majorZero, noVersion };
}

module.exports = { parseVersion, isPrerelease, isMajorZero, analyzeVersions };
