const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-package-verification');

describe('spdx-package-verification check', () => {
  it('skips non-SPDX documents', () => {
    const sbom = { format: 'cyclonedx', components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes package with verification code', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'a', packageVerificationCode: { value: 'abc' } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes package with checksums', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'a', checksums: [{ algorithm: 'SHA256', value: 'abc' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags package without any verification', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', packages: [{ name: 'bare-pkg' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('no verification'));
  });

  it('handles SPDX with components array', () => {
    const sbom = { format: 'spdx', components: [{ name: 'a', hashes: [{ alg: 'SHA-256', content: 'x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
