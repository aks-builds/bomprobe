function parseVersionParts(version) {
  if (!version || typeof version !== 'string') return null;
  const clean = version.replace(/^[v=\s]+/, '');
  const match = clean.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-(.+))?(?:\+(.+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: match[2] !== undefined ? parseInt(match[2], 10) : 0,
    patch: match[3] !== undefined ? parseInt(match[3], 10) : 0,
    prerelease: match[4] || null,
    build: match[5] || null
  };
}

function compareVersions(a, b) {
  const pa = parseVersionParts(a);
  const pb = parseVersionParts(b);
  if (!pa || !pb) return 0;

  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  if (pa.patch !== pb.patch) return pa.patch - pb.patch;

  if (pa.prerelease && !pb.prerelease) return -1;
  if (!pa.prerelease && pb.prerelease) return 1;
  if (pa.prerelease && pb.prerelease) {
    return pa.prerelease < pb.prerelease ? -1 : pa.prerelease > pb.prerelease ? 1 : 0;
  }

  return 0;
}

function isMajorBump(from, to) {
  const pf = parseVersionParts(from);
  const pt = parseVersionParts(to);
  if (!pf || !pt) return false;
  return pt.major > pf.major;
}

function sortVersions(versions) {
  return [...versions].sort(compareVersions);
}

module.exports = { parseVersionParts, compareVersions, isMajorBump, sortVersions };
