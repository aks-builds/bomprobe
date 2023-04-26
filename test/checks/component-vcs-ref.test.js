const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-vcs-ref');

describe('component-vcs-ref check', () => {
  it('passes with VCS external reference', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'vcs', url: 'https://github.com/x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with pedigree commits', () => {
    const sbom = { components: [{ name: 'a', pedigree: { commits: [{ uid: 'abc123' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without VCS or pedigree', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('VCS'));
  });

  it('skips data type', () => {
    assert.equal(check.run({ components: [{ name: 'x', type: 'data' }] }).length, 0);
  });
});
