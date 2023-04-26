const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-extracted-license');

describe('spdx-extracted-license check', () => {
  it('passes with standard SPDX license', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'a', licenseConcluded: 'MIT' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes when LicenseRef has extractedLicensingInfos', () => {
    const sbom = {
      spdxVersion: 'SPDX-2.3',
      packages: [{ name: 'a', licenseConcluded: 'LicenseRef-Custom' }],
      hasExtractedLicensingInfos: [{ licenseId: 'LicenseRef-Custom', extractedText: 'custom' }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing extractedLicensingInfos', () => {
    const sbom = {
      spdxVersion: 'SPDX-2.3',
      packages: [{ name: 'a', licenseConcluded: 'LicenseRef-Missing' }]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('ignores non-SPDX docs', () => {
    const sbom = { bomFormat: 'CycloneDX', packages: [] };
    assert.equal(check.run(sbom).length, 0);
  });
});
