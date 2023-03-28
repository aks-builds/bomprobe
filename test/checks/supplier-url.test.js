const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/supplier-url');

describe('supplier-url check', () => {
  it('passes normal supplier names', () => {
    const sbom = { components: [{ name: 'a', supplier: 'Acme Corp' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes valid http URLs', () => {
    const sbom = { components: [{ name: 'a', supplier: 'https://acme.com' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports malformed http supplier', () => {
    const sbom = { components: [{ name: 'a', supplier: 'http://' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('skips components without supplier', () => {
    const sbom = { components: [{ name: 'a', supplier: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
