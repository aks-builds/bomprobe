const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-download-url');

describe('component-download-url check', () => {
  it('passes with purl', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with distribution reference', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'distribution', url: 'https://example.com' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with no URL or purl', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes with vcs reference', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'vcs', url: 'https://github.com/a/b' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
