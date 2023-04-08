const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeRelationships, findOrphans, KNOWN_TYPES } = require('../../src/utils/spdxRelationships');

describe('SPDX relationship analysis', () => {
  it('counts relationship types', () => {
    const rels = [
      { relationshipType: 'DEPENDS_ON', spdxElementId: 'A', relatedSpdxElement: 'B' },
      { relationshipType: 'DEPENDS_ON', spdxElementId: 'A', relatedSpdxElement: 'C' },
      { relationshipType: 'CONTAINS', spdxElementId: 'D', relatedSpdxElement: 'E' }
    ];
    const result = analyzeRelationships(rels);
    assert.equal(result.total, 3);
    assert.equal(result.types['DEPENDS_ON'], 2);
    assert.equal(result.types['CONTAINS'], 1);
  });

  it('detects unknown relationship types', () => {
    const rels = [
      { relationshipType: 'MADE_UP_TYPE', spdxElementId: 'A', relatedSpdxElement: 'B' }
    ];
    const result = analyzeRelationships(rels);
    assert.ok(result.unknownTypes.includes('MADE_UP_TYPE'));
  });

  it('counts unique elements', () => {
    const rels = [
      { relationshipType: 'DEPENDS_ON', spdxElementId: 'A', relatedSpdxElement: 'B' },
      { relationshipType: 'DEPENDS_ON', spdxElementId: 'A', relatedSpdxElement: 'C' }
    ];
    const result = analyzeRelationships(rels);
    assert.equal(result.elements, 3);
  });

  it('handles null/empty input', () => {
    assert.equal(analyzeRelationships(null).total, 0);
    assert.equal(analyzeRelationships([]).total, 0);
  });

  it('finds orphaned packages', () => {
    const doc = {
      packages: [
        { SPDXID: 'SPDXRef-A', name: 'a' },
        { SPDXID: 'SPDXRef-B', name: 'b' },
        { SPDXID: 'SPDXRef-C', name: 'c' }
      ],
      relationships: [
        { spdxElementId: 'SPDXRef-A', relatedSpdxElement: 'SPDXRef-B', relationshipType: 'DEPENDS_ON' }
      ]
    };
    const orphans = findOrphans(doc);
    assert.deepEqual(orphans, ['SPDXRef-C']);
  });

  it('exports known SPDX relationship types', () => {
    assert.ok(KNOWN_TYPES.includes('DEPENDS_ON'));
    assert.ok(KNOWN_TYPES.includes('DESCRIBES'));
    assert.ok(KNOWN_TYPES.length > 20);
  });
});
