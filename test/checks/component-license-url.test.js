const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-license-url');

describe('component-license-url check', () => {
  it('passes with license id and url', () => {
    const sbom = { components: [{
      name: 'a',
      licenses: [{ license: { id: 'MIT', url: 'https://opensource.org/licenses/MIT' } }]
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags license id without url', () => {
    const sbom = { components: [{
      name: 'a',
      licenses: [{ license: { id: 'MIT' } }]
    }]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without licenses', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });

  it('handles flat license format', () => {
    const sbom = { components: [{
      name: 'a',
      licenses: [{ id: 'Apache-2.0' }]
    }]};
    assert.equal(check.run(sbom).length, 1);
  });
});
