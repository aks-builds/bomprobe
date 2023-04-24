const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-source-url');

describe('component-source-url check', () => {
  it('passes with vcs reference', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'vcs', url: 'https://github.com/x/a' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with purl as fallback', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without source or purl', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('traceability'));
  });

  it('passes with source-distribution ref', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'source-distribution', url: 'https://x.com/a.tar.gz' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
