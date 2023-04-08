const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-document-namespace');

describe('spdx-document-namespace check', () => {
  it('skips non-SPDX', () => {
    assert.equal(check.run({ format: 'cyclonedx', components: [] }).length, 0);
  });

  it('passes with valid namespace', () => {
    const sbom = { format: 'spdx', documentNamespace: 'https://example.com/doc', components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing namespace', () => {
    const sbom = { format: 'spdx', metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags non-URI namespace', () => {
    const sbom = { format: 'spdx', documentNamespace: 'not-a-uri', components: [] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'info');
  });
});
