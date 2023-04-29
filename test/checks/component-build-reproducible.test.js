const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-build-reproducible');

describe('component-build-reproducible check', () => {
  it('passes with source and hash alongside build meta', () => {
    const sbom = { components: [{
      name: 'a',
      hashes: [{ alg: 'SHA-256', content: 'abc' }],
      externalReferences: [
        { type: 'build-system', url: 'https://ci' },
        { type: 'vcs', url: 'https://git' }
      ]
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags build meta without source', () => {
    const sbom = { components: [{
      name: 'a',
      hashes: [{ alg: 'SHA-256', content: 'abc' }],
      externalReferences: [{ type: 'build-system', url: 'https://ci' }]
    }]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags build meta without hash', () => {
    const sbom = { components: [{
      name: 'a',
      externalReferences: [
        { type: 'build-meta', url: 'https://ci' },
        { type: 'vcs', url: 'https://git' }
      ]
    }]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without build refs', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
