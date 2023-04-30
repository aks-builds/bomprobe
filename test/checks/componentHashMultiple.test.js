const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentHashMultiple');

describe('component-hash-multiple', () => {
  it('passes with multiple algorithms', () => {
    const sbom = { components: [{ name: 'a', hashes: [
      { alg: 'SHA-256', content: 'x' }, { alg: 'SHA-512', content: 'y' }
    ]}] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('notes single algorithm', () => {
    const sbom = { components: [{ name: 'a', hashes: [{ alg: 'SHA-256', content: 'x' }] }] };
    assert.ok(check.run(sbom).length > 0);
  });

  it('skips components without hashes', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
