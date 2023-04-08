const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateSbomStructure } = require('../../src/utils/validate');

describe('SBOM structure validation', () => {
  it('validates minimal valid SBOM', () => {
    assert.ok(validateSbomStructure({ components: [] }).valid);
  });

  it('validates SPDX-style with packages', () => {
    assert.ok(validateSbomStructure({ packages: [] }).valid);
  });

  it('rejects null input', () => {
    assert.ok(!validateSbomStructure(null).valid);
  });

  it('rejects non-object input', () => {
    assert.ok(!validateSbomStructure('string').valid);
  });

  it('rejects missing components and packages', () => {
    const result = validateSbomStructure({ metadata: {} });
    assert.ok(!result.valid);
  });

  it('rejects non-array components', () => {
    const result = validateSbomStructure({ components: 'not-array' });
    assert.ok(!result.valid);
  });

  it('validates with metadata', () => {
    assert.ok(validateSbomStructure({ components: [], metadata: {} }).valid);
  });
});
