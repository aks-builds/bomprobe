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
  require('./license-expression'),
  require('./purl-type'),
  require('./version-consistency'),
  require('./supplier-url'),
  require('./hash-algorithm'),
  require('./metadata-spec-compliance'),
  require('./component-namespace'),
  require('./component-hash-completeness'),
  require('./metadata-document-namespace'),
  require('./license-compatibility'),
  require('./dependency-depth'),
  require('./component-age'),
  require('./supplier-concentration'),
  require('./component-prerelease'),
  require('./license-deprecated'),
  require('./component-download-url'),
  require('./metadata-properties'),
  require('./component-evidence'),
  require('./component-modified'),
  require('./metadata-manufacture'),
  require('./bom-freshness'),
  require('./dependency-completeness'),
  require('./component-swid'),
  require('./component-bomref'),
  require('./metadata-supplier'),
  require('./composition-completeness'),
  require('./vulnerability-refs'),
  require('./service-data'),
  require('./component-patch-diff'),
  require('./component-group'),
  require('./metadata-revision'),
  require('./component-crypto'),
  require('./component-author'),
  require('./spdx-creator-info'),
  require('./spdx-document-namespace'),
  require('./spdx-relationship-completeness'),
  require('./component-mime'),
  require('./component-release-notes'),
  require('./component-eol'),
  require('./spdx-license-list'),
  require('./component-provenance'),
  require('./metadata-lifecyclephase'),
  require('./dependency-license-conflict'),
  require('./component-patch-status'),
  require('./spdx-package-verification'),
  require('./component-build-env'),
  require('./metadata-bom-format'),
  require('./dependency-cycle'),
  require('./component-identity'),
  require('./metadata-tool-version'),
  require('./spdx-external-document-refs'),
  require('./component-dependency-count'),
  require('./component-license-compatibility'),
  require('./spdx-snippet-info'),
  require('./component-source-url'),
  require('./metadata-composition'),
  require('./spdx-data-license'),
  require('./component-nested-bom'),
  require('./component-maturity'),
  require('./dependency-orphan'),
  require('./spdx-file-info'),
  require('./component-reproducible'),
  require('./metadata-serial-format'),
  require('./component-platform'),
  require('./component-deprecated-license'),
  require('./spdx-annotation-info')
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
