const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/supplier-concentration');

describe('supplier-concentration check', () => {
  it('passes balanced supplier mix', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Co A' },
      { name: 'b', supplier: 'Co B' },
      { name: 'c', supplier: 'Co C' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on high concentration', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Mega Corp' },
      { name: 'b', supplier: 'Mega Corp' },
      { name: 'c', supplier: 'Mega Corp' },
      { name: 'd', supplier: 'Mega Corp' },
      { name: 'e', supplier: 'Mega Corp' },
      { name: 'f', supplier: 'Other' }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('Mega Corp')));
  });

  it('reports when most suppliers missing', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Co A' },
      { name: 'b', supplier: null },
      { name: 'c', supplier: null },
      { name: 'd', supplier: null }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('no supplier')));
  });

  it('skips small SBOMs', () => {
    const sbom = { components: [{ name: 'a', supplier: 'X' }, { name: 'b', supplier: 'X' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
