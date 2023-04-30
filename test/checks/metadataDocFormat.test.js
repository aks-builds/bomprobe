const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadataDocFormat');

describe('metadata-doc-format', () => {
  it('passes with bomFormat and specVersion', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '1.5' };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with spdxVersion', () => {
    const sbom = { spdxVersion: 'SPDX-2.3' };
    assert.equal(check.run(sbom).length, 0);
  });

  it('errors on missing format', () => {
    const findings = check.run({});
    assert.ok(findings.some(f => f.severity === 'error'));
  });
});
