const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-evidence');

describe('component-evidence check', () => {
  it('passes with identity evidence', () => {
    const sbom = { components: [{ name: 'a', evidence: { identity: { field: 'purl' } } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with occurrences evidence', () => {
    const sbom = { components: [{ name: 'a', evidence: { occurrences: [{ location: '/lib/a.js' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without evidence', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags empty evidence object', () => {
    const sbom = { components: [{ name: 'a', evidence: {} }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
