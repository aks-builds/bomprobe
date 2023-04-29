const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-package-download');

describe('spdx-package-download check', () => {
  it('passes with real URL', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [
      { name: 'a', downloadLocation: 'https://example.com/a-1.0.tar.gz' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags NOASSERTION', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [
      { name: 'a', downloadLocation: 'NOASSERTION' }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags NONE', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [
      { name: 'a', downloadLocation: 'NONE' }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags empty downloadLocation', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('ignores non-SPDX', () => {
    assert.equal(check.run({ bomFormat: 'CycloneDX' }).length, 0);
  });
});
