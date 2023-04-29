const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-package-originator');

describe('spdx-package-originator check', () => {
  it('passes with real originator', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [
      { name: 'a', originator: 'Organization: Acme Corp' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags NOASSERTION originator', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [
      { name: 'a', originator: 'NOASSERTION' }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags missing originator', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('ignores non-SPDX', () => {
    assert.equal(check.run({ bomFormat: 'CycloneDX' }).length, 0);
  });
});
