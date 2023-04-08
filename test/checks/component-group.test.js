const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-group');

describe('component-group check', () => {
  it('passes with group', () => {
    const sbom = { components: [{ name: 'a', type: 'library', group: 'org.example' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with namespace', () => {
    const sbom = { components: [{ name: 'a', type: 'library', namespace: '@scope' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags library without group', () => {
    const sbom = { components: [{ name: 'a', type: 'library' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips non-library types', () => {
    const sbom = { components: [{ name: 'a', type: 'framework' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
