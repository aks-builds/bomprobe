const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-license-reference');

describe('spdx-license-reference check', () => {
  it('passes well-formed LicenseRef', () => {
    const sbom = { packages: [
      { name: 'a', licenseConcluded: 'LicenseRef-custom-1.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags malformed LicenseRef in SPDX', () => {
    const sbom = { packages: [
      { name: 'a', licenseConcluded: 'LicenseRef-has spaces' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('malformed'));
  });

  it('checks CycloneDX components too', () => {
    const sbom = { components: [
      { name: 'b', licenses: [{ license: { id: 'LicenseRef-bad ref' } }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('ignores standard license ids', () => {
    const sbom = { packages: [{ name: 'a', licenseConcluded: 'MIT' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
