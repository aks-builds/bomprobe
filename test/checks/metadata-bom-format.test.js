const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-bom-format');

describe('metadata-bom-format check', () => {
  it('passes valid CycloneDX 1.5', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '1.5', components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes valid SPDX 2.3', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing specVersion on CycloneDX', () => {
    const sbom = { bomFormat: 'CycloneDX', components: [] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'warning');
  });

  it('flags uncommon CycloneDX version', () => {
    const sbom = { bomFormat: 'CycloneDX', specVersion: '2.0', components: [] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('Uncommon'));
  });

  it('flags unknown format', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('Unable to determine'));
  });
});
