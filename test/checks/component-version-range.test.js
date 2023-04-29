const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-version-range');

describe('component-version-range check', () => {
  it('passes exact version', () => {
    const sbom = { components: [{ name: 'a', version: '1.2.3' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags tilde range', () => {
    const sbom = { components: [{ name: 'a', version: '~1.2.0' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags caret range', () => {
    const sbom = { components: [{ name: 'a', version: '^1.2.0' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags wildcard', () => {
    const sbom = { components: [{ name: 'a', version: '1.*' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without version', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
