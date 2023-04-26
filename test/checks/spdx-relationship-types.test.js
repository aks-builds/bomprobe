const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-relationship-types');

describe('spdx-relationship-types check', () => {
  it('passes known types', () => {
    const sbom = { relationships: [
      { spdxElementId: 'A', relatedSpdxElement: 'B', relationshipType: 'DEPENDS_ON' },
      { spdxElementId: 'A', relatedSpdxElement: 'C', relationshipType: 'CONTAINS' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags unknown type', () => {
    const sbom = { relationships: [
      { spdxElementId: 'A', relatedSpdxElement: 'B', relationshipType: 'INVENTED_TYPE' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('INVENTED_TYPE'));
  });

  it('handles empty relationships', () => {
    assert.equal(check.run({ relationships: [] }).length, 0);
    assert.equal(check.run({}).length, 0);
  });

  it('handles missing type gracefully', () => {
    const sbom = { relationships: [{ spdxElementId: 'A', relatedSpdxElement: 'B' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
