const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-bom-identifier');

describe('metadata-bom-identifier check', () => {
  it('passes with valid serialNumber', () => {
    const sbom = { serialNumber: 'urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79' };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with documentNamespace', () => {
    const sbom = { documentNamespace: 'https://example.com/sbom/v1' };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing identifier', () => {
    const findings = check.run({});
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('warns on non-standard serial format', () => {
    const sbom = { serialNumber: 'urn:uuid:not-valid-uuid' };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('non-standard')));
  });
});
