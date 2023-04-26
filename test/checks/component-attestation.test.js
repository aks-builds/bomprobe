const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-attestation');

describe('component-attestation check', () => {
  it('passes with evidence', () => {
    const sbom = { components: [{ name: 'a', evidence: { identity: [{ field: 'purl' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with SHA hash', () => {
    const sbom = { components: [{ name: 'a', hashes: [{ alg: 'SHA-256', content: 'x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with pedigree commits', () => {
    const sbom = { components: [{ name: 'a', pedigree: { commits: [{ uid: '123' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without any attestation', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips data type', () => {
    assert.equal(check.run({ components: [{ name: 'x', type: 'data' }] }).length, 0);
  });
});
