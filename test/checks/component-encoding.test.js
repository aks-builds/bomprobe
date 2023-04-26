const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-encoding');

describe('component-encoding check', () => {
  it('passes clean component', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags distribution hash without URL', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'distribution', hashes: [{ alg: 'SHA-256', content: 'x' }] }] }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes distribution with URL', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'distribution', url: 'https://x', hashes: [{}] }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags inline data without encoding', () => {
    const sbom = { components: [{ name: 'a', data: [{ contents: 'base64data' }] }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes data with encoding', () => {
    const sbom = { components: [{ name: 'a', data: [{ contents: 'base64data', encoding: 'base64' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
