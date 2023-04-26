const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-commit-hash');

describe('component-commit-hash check', () => {
  it('passes valid SHA-1', () => {
    const sbom = { components: [{ name: 'a', pedigree: { commits: [{ uid: 'a'.repeat(40) }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags invalid hash', () => {
    const sbom = { components: [{ name: 'a', pedigree: { commits: [{ uid: 'not-a-hash' }] } }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without pedigree', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });

  it('skips empty uid', () => {
    const sbom = { components: [{ name: 'a', pedigree: { commits: [{ uid: '' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
