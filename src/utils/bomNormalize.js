function normalizeComponentNames(sbom) {
  const clone = JSON.parse(JSON.stringify(sbom));

  for (const c of (clone.components || [])) {
    if (c.name) {
      c.name = c.name.trim().toLowerCase();
    }
    if (c.group) {
      c.group = c.group.trim().toLowerCase();
    }
  }

  return clone;
}

function normalizeVersions(sbom) {
  const clone = JSON.parse(JSON.stringify(sbom));

  for (const c of (clone.components || [])) {
    if (c.version) {
      c.version = c.version.replace(/^v/i, '').trim();
    }
  }

  return clone;
}

function normalizeLicenses(sbom) {
  const clone = JSON.parse(JSON.stringify(sbom));

  for (const c of (clone.components || [])) {
    if (c.licenses) {
      for (const l of c.licenses) {
        if (l.license?.id) {
          l.license.id = l.license.id.trim();
        }
      }
    }
  }

  return clone;
}

module.exports = { normalizeComponentNames, normalizeVersions, normalizeLicenses };
