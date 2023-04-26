const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-bom-version');

describe('metadata-bom-version check', () => {
  it('passes with valid version', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '1.4', version: 1 };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing version', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '1.4' };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags version below 1', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '1.4', version: 0 };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('ignores non-CycloneDX BOMs', () => {
    assert.equal(check.run({ spdxVersion: 'SPDX-2.3' }).length, 0);
  });
});
