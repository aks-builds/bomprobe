const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-serial-format');

describe('metadata-serial-format check', () => {
  it('passes valid urn:uuid format', () => {
    const sbom = { serialNumber: 'urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79' };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags invalid format', () => {
    const sbom = { serialNumber: 'not-a-uuid' };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('urn:uuid'));
  });

  it('ignores missing serial number', () => {
    assert.equal(check.run({}).length, 0);
  });

  it('flags uuid without urn prefix', () => {
    const sbom = { serialNumber: '3e671687-395b-41f5-a30f-a58921a69b79' };
    assert.equal(check.run(sbom).length, 1);
  });
});
