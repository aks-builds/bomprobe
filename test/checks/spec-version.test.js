const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spec-version');

describe('spec-version check', () => {
  it('passes for known CycloneDX version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: '1.5' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes for known SPDX version', () => {
    const sbom = { format: 'spdx', metadata: { specVersion: 'SPDX-2.3' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports unknown version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: '9.9' }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /Unknown spec version/);
  });

  it('reports missing version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: null }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });
});
