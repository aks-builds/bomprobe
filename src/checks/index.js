const checks = [
  require('./component-name'),
  require('./component-version'),
  require('./component-supplier'),
  require('./component-license'),
  require('./component-purl'),
  require('./component-hashes'),
  require('./metadata-author'),
  require('./metadata-timestamp'),
  require('./metadata-tools'),
  require('./dependency-coverage'),
  require('./component-description'),
  require('./component-cpe'),
  require('./component-type'),
  require('./spec-version'),
  require('./metadata-license'),
  require('./unique-purls'),
  require('./component-scope'),
  require('./valid-purl'),
  require('./component-copyright'),
  require('./metadata-component'),
  require('./component-external-refs'),
  require('./metadata-serial-number'),
  require('./component-dependencies'),
  require('./component-completeness'),
  require('./duplicate-components'),
  require('./metadata-lifecycle'),
  require('./license-expression')
];

function runAll(sbom, options = {}) {
  const exclude = options.exclude || [];
  const only = options.only || null;
  const results = [];
  for (const check of checks) {
    if (exclude.includes(check.id)) continue;
    if (only && !only.includes(check.id)) continue;
    const findings = check.run(sbom);
    results.push({
      id: check.id,
      name: check.name,
      weight: check.weight,
      findings
    });
  }
  return results;
}

function getChecks() {
  return checks.map(c => ({ id: c.id, name: c.name, description: c.description, weight: c.weight }));
}

module.exports = { runAll, getChecks };
