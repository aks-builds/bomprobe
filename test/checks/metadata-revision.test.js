const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-revision');

describe('metadata-revision check', () => {
  it('passes with metadata version', () => {
    const sbom = { metadata: { version: 1 }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with component version', () => {
    const sbom = { metadata: { component: { version: '2.0' } }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing revision', () => {
    const sbom = { metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });
});
