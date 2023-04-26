const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-trust-boundary');

describe('component-trust-boundary check', () => {
  it('passes third-party with supplier', () => {
    const sbom = { metadata: {}, components: [
      { name: 'lib', scope: 'optional', supplier: { name: 'Vendor' } }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes third-party with hash', () => {
    const sbom = { metadata: {}, components: [
      { name: 'lib', scope: 'optional', hashes: [{ alg: 'SHA-256', content: 'x' }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags third-party without supplier or hash', () => {
    const sbom = { metadata: {}, components: [
      { name: 'lib', scope: 'optional' }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips data type', () => {
    const sbom = { metadata: {}, components: [{ name: 'x', type: 'data', scope: 'optional' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
