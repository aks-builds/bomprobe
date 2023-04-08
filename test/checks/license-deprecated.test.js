const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/license-deprecated');

describe('license-deprecated check', () => {
  it('passes current license identifiers', () => {
    const sbom = { components: [{ name: 'a', license: 'MIT' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags deprecated license identifier', () => {
    const sbom = { components: [{ name: 'a', license: 'GPL-2.0' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles object-style license', () => {
    const sbom = { components: [{ name: 'a', license: { id: 'AGPL-3.0' } }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without license', () => {
    const sbom = { components: [{ name: 'a', license: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
