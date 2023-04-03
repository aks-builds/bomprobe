const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-hash-completeness');

describe('component-hash-completeness check', () => {
  it('passes component with SHA-256 hash', () => {
    const sbom = { components: [{ name: 'a', hashes: ['abc'], hashAlgorithms: ['SHA-256'] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports component with only MD5', () => {
    const sbom = { components: [{ name: 'a', hashes: ['abc'], hashAlgorithms: ['MD5'] }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('SHA-256'));
  });

  it('skips components without hashes', () => {
    const sbom = { components: [{ name: 'a', hashes: [], hashAlgorithms: [] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes component with SHA-512', () => {
    const sbom = { components: [{ name: 'a', hashes: ['def'], hashAlgorithms: ['sha-512'] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when hashAlgorithms missing', () => {
    const sbom = { components: [{ name: 'a', hashes: ['abc'] }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
