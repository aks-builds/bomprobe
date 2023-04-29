const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-package-supplier');

describe('spdx-package-supplier check', () => {
  it('passes with supplier', () => {
    const sbom = { packages: [{ name: 'a', supplier: 'Organization: Acme' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags NOASSERTION supplier', () => {
    const sbom = { packages: [{ name: 'a', supplier: 'NOASSERTION' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags missing supplier', () => {
    const sbom = { packages: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles empty packages', () => {
    assert.equal(check.run({ packages: [] }).length, 0);
    assert.equal(check.run({}).length, 0);
  });
});
