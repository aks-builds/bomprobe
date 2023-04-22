const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-tool-version');

describe('metadata-tool-version check', () => {
  it('passes tool with version', () => {
    const sbom = { metadata: { tools: [{ name: 'cdxgen', version: '9.0.0' }] } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags tool without version', () => {
    const sbom = { metadata: { tools: [{ name: 'syft' }] } };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('syft'));
  });

  it('flags missing tools array', () => {
    const sbom = { metadata: {} };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('No SBOM generation tools'));
  });

  it('skips string tools', () => {
    const sbom = { metadata: { tools: ['trivy'] } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles no metadata', () => {
    const sbom = {};
    assert.equal(check.run(sbom).length, 0);
  });
});
