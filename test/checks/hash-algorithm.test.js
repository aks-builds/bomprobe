const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/hash-algorithm');

describe('hash-algorithm check', () => {
  it('passes strong algorithms', () => {
    const sbom = { components: [{ name: 'a', hashAlgorithms: ['SHA-256'] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports MD5', () => {
    const sbom = { components: [{ name: 'a', hashAlgorithms: ['MD5'] }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('reports SHA-1', () => {
    const sbom = { components: [{ name: 'a', hashAlgorithms: ['SHA-1'] }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without hash info', () => {
    const sbom = { components: [{ name: 'a', hashAlgorithms: [] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips when hashAlgorithms missing', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
