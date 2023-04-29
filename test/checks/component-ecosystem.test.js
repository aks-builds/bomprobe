const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-ecosystem');

describe('component-ecosystem check', () => {
  it('passes known ecosystems', () => {
    const sbom = { components: [
      { name: 'lodash', purl: 'pkg:npm/lodash@4.17.21' },
      { name: 'requests', purl: 'pkg:pypi/requests@2.28.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags unknown ecosystem', () => {
    const sbom = { components: [
      { name: 'custom', purl: 'pkg:unknown/custom@1.0' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('unknown'));
  });

  it('skips components without purl', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles all known types', () => {
    const sbom = { components: [
      { name: 'a', purl: 'pkg:maven/org.example/a@1.0' },
      { name: 'b', purl: 'pkg:cargo/b@0.1' },
      { name: 'c', purl: 'pkg:nuget/c@2.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });
});
