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
  require('./dependency-coverage')
];

function runAll(sbom) {
  const results = [];
  for (const check of checks) {
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
