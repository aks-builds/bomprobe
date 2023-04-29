const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-relationship-direction');

describe('spdx-relationship-direction check', () => {
  it('passes clean relationships', () => {
    const sbom = { relationships: [
      { spdxElementId: 'A', relatedSpdxElement: 'B', relationshipType: 'DEPENDS_ON' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags redundant inverse pair', () => {
    const sbom = { relationships: [
      { spdxElementId: 'A', relatedSpdxElement: 'B', relationshipType: 'DEPENDS_ON' },
      { spdxElementId: 'B', relatedSpdxElement: 'A', relationshipType: 'DEPENDENCY_OF' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('Redundant'));
  });

  it('allows non-inverse same-direction', () => {
    const sbom = { relationships: [
      { spdxElementId: 'A', relatedSpdxElement: 'B', relationshipType: 'DEPENDS_ON' },
      { spdxElementId: 'A', relatedSpdxElement: 'C', relationshipType: 'DEPENDS_ON' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles empty relationships', () => {
    assert.equal(check.run({ relationships: [] }).length, 0);
    assert.equal(check.run({}).length, 0);
  });
});
