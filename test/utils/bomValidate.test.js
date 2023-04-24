const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateStructure } = require('../../src/utils/bomValidate');

describe('bom structure validation', () => {
  it('validates CycloneDX SBOM', () => {
    const result = validateStructure({ bomFormat: 'CycloneDX', specVersion: '1.5', components: [] });
    assert.equal(result.valid, true);
    assert.equal(result.format, 'CycloneDX');
  });

  it('validates SPDX document', () => {
    const result = validateStructure({ spdxVersion: 'SPDX-2.3', SPDXID: 'SPDXRef-DOCUMENT', name: 'test' });
    assert.equal(result.valid, true);
    assert.equal(result.format, 'SPDX');
  });

  it('flags unknown format', () => {
    const result = validateStructure({});
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('Cannot detect')));
  });

  it('flags missing CycloneDX specVersion', () => {
    const result = validateStructure({ bomFormat: 'CycloneDX', components: [] });
    assert.ok(result.errors.some(e => e.includes('specVersion')));
  });

  it('flags non-array components', () => {
    const result = validateStructure({ specVersion: '1.5', components: 'not-array' });
    assert.ok(result.errors.some(e => e.includes('components must be an array')));
  });

  it('flags missing SPDX fields', () => {
    const result = validateStructure({ spdxVersion: 'SPDX-2.3' });
    assert.ok(result.errors.some(e => e.includes('SPDXID')));
    assert.ok(result.errors.some(e => e.includes('document name')));
  });

  it('rejects null input', () => {
    const result = validateStructure(null);
    assert.equal(result.valid, false);
  });
});
