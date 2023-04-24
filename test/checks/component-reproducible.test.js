const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-reproducible');

describe('component-reproducible check', () => {
  it('passes with hash and version', () => {
    const sbom = { components: [{ name: 'a', version: '1.0', hashes: [{ alg: 'SHA-256', content: 'x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with purl and version', () => {
    const sbom = { components: [{ name: 'a', version: '1.0', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with neither hash nor purl', () => {
    const sbom = { components: [{ name: 'bare', version: '1.0' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('reproducibility'));
  });

  it('flags purl without version', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('pinned'));
  });

  it('skips data type', () => {
    const sbom = { components: [{ name: 'config', type: 'data' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
