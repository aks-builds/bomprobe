const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-creation-info');

describe('spdx-creation-info check', () => {
  it('passes complete creation info', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', creationInfo: {
      creators: ['Tool: bomprobe'],
      created: '2023-04-26T00:00:00Z',
      licenseListVersion: '3.19'
    }};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing creationInfo on SPDX doc', () => {
    const sbom = { spdxVersion: 'SPDX-2.3' };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags missing creators', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', creationInfo: { created: '2023-01-01', licenseListVersion: '3.19' } };
    assert.ok(check.run(sbom).some(f => f.message.includes('creators')));
  });

  it('flags missing date', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', creationInfo: { creators: ['Tool: x'] } };
    assert.ok(check.run(sbom).some(f => f.message.includes('date')));
  });

  it('ignores non-SPDX without creationInfo', () => {
    assert.equal(check.run({ bomFormat: 'CycloneDX' }).length, 0);
  });
});
