const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeSuppliers } = require('../../src/utils/supplierAnalysis');

describe('supplier analysis', () => {
  it('counts unique suppliers', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Acme Inc' },
      { name: 'b', supplier: 'Acme Inc' },
      { name: 'c', supplier: 'Other Corp' }
    ]};
    const result = analyzeSuppliers(sbom);
    assert.equal(result.unique, 2);
    assert.equal(result.missing, 0);
  });

  it('counts missing suppliers', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Acme Inc' },
      { name: 'b', supplier: null }
    ]};
    const result = analyzeSuppliers(sbom);
    assert.equal(result.missing, 1);
  });

  it('calculates concentration percentage', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Acme Inc' },
      { name: 'b', supplier: 'Acme Inc' },
      { name: 'c', supplier: 'Acme Inc' },
      { name: 'd', supplier: 'Other Corp' }
    ]};
    const result = analyzeSuppliers(sbom);
    assert.equal(result.concentration, 75);
  });

  it('sorts suppliers by component count', () => {
    const sbom = { components: [
      { name: 'a', supplier: 'Small Co' },
      { name: 'b', supplier: 'Big Co' },
      { name: 'c', supplier: 'Big Co' }
    ]};
    const result = analyzeSuppliers(sbom);
    assert.equal(result.suppliers[0].name, 'Big Co');
  });

  it('handles empty SBOM', () => {
    const result = analyzeSuppliers({ components: [] });
    assert.equal(result.total, 0);
    assert.equal(result.unique, 0);
    assert.equal(result.concentration, 0);
  });
});
