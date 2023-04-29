const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-version-conflict');

describe('dependency-version-conflict check', () => {
  it('passes unique name-version pairs', () => {
    const sbom = { components: [
      { name: 'a', version: '1.0' },
      { name: 'b', version: '2.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags conflicting versions', () => {
    const sbom = { components: [
      { name: 'lodash', version: '4.17.20' },
      { name: 'lodash', version: '4.17.21' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('conflicting'));
  });

  it('allows same name same version', () => {
    const sbom = { components: [
      { name: 'a', version: '1.0' },
      { name: 'a', version: '1.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips components without version', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
