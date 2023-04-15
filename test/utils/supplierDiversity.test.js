const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeSupplierDiversity } = require('../../src/utils/supplierDiversity');

describe('supplier diversity', () => {
  it('counts unique suppliers', () => {
    const components = [
      { name: 'a', supplier: { name: 'Acme' } },
      { name: 'b', supplier: { name: 'Acme' } },
      { name: 'c', supplier: { name: 'Other Corp' } }
    ];
    const result = analyzeSupplierDiversity(components);
    assert.equal(result.totalSuppliers, 2);
    assert.equal(result.topSupplier, 'Acme');
    assert.equal(result.concentration, 67);
  });

  it('tracks components without supplier', () => {
    const components = [
      { name: 'a', supplier: { name: 'Acme' } },
      { name: 'b' }
    ];
    const result = analyzeSupplierDiversity(components);
    assert.equal(result.noSupplier, 1);
  });

  it('falls back to author', () => {
    const components = [{ name: 'a', author: 'John' }];
    const result = analyzeSupplierDiversity(components);
    assert.equal(result.totalSuppliers, 1);
    assert.equal(result.topSupplier, 'John');
  });

  it('handles empty list', () => {
    const result = analyzeSupplierDiversity([]);
    assert.equal(result.totalSuppliers, 0);
    assert.equal(result.concentration, 0);
  });

  it('sorts by count descending', () => {
    const components = [
      { name: 'a', supplier: { name: 'Big Corp' } },
      { name: 'b', supplier: { name: 'Big Corp' } },
      { name: 'c', supplier: { name: 'Big Corp' } },
      { name: 'd', supplier: { name: 'Small Co' } }
    ];
    const result = analyzeSupplierDiversity(components);
    assert.equal(result.suppliers[0].name, 'Big Corp');
    assert.equal(result.suppliers[0].count, 3);
  });
});
