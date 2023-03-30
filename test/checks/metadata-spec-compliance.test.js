const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-spec-compliance');

describe('metadata-spec-compliance check', () => {
  it('passes current CycloneDX version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: '1.4' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes current SPDX version', () => {
    const sbom = { format: 'spdx', metadata: { specVersion: 'SPDX-2.3' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports outdated CycloneDX version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: '1.2' } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('outdated'));
  });

  it('reports outdated SPDX version', () => {
    const sbom = { format: 'spdx', metadata: { specVersion: 'SPDX-2.1' } };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips when no spec version', () => {
    const sbom = { format: 'cyclonedx', metadata: { specVersion: null } };
    assert.equal(check.run(sbom).length, 0);
  });
});
