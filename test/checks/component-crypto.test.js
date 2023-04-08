const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-crypto');

describe('component-crypto check', () => {
  it('passes for non-crypto component', () => {
    const sbom = { components: [{ name: 'lodash' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags crypto component without properties', () => {
    const sbom = { components: [{ name: 'node-crypto-utils' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes crypto component with cryptoProperties', () => {
    const sbom = { components: [{ name: 'openssl', cryptoProperties: {} }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('detects ssl-related names', () => {
    const sbom = { components: [{ name: 'ssl-checker' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
