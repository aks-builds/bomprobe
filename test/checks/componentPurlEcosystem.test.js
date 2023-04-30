const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentPurlEcosystem');

describe('component-purl-ecosystem', () => {
  it('passes known ecosystem', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('notes unknown ecosystem', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:fakepkg/a@1.0' }] };
    assert.ok(check.run(sbom).length > 0);
  });

  it('skips components without purl', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
