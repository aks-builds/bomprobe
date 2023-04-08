const KNOWN_TYPES = [
  'DESCRIBES', 'DESCRIBED_BY', 'CONTAINS', 'CONTAINED_BY',
  'DEPENDS_ON', 'DEPENDENCY_OF', 'GENERATES', 'GENERATED_FROM',
  'ANCESTOR_OF', 'DESCENDANT_OF', 'VARIANT_OF', 'BUILD_TOOL_OF',
  'DEV_TOOL_OF', 'TEST_TOOL_OF', 'DOCUMENTATION_OF', 'OPTIONAL_COMPONENT_OF',
  'PROVIDED_DEPENDENCY_OF', 'TEST_DEPENDENCY_OF', 'RUNTIME_DEPENDENCY_OF',
  'EXAMPLE_OF', 'VARIANT_OF', 'PACKAGE_OF', 'FILE_ADDED', 'FILE_DELETED',
  'FILE_MODIFIED', 'EXPANDED_FROM_ARCHIVE', 'DYNAMIC_LINK', 'STATIC_LINK',
  'DATA_FILE_OF', 'TEST_CASE_OF', 'COPY_OF', 'PATCH_APPLIED', 'PATCH_FOR',
  'PREREQUISITE_FOR', 'HAS_PREREQUISITE', 'OTHER'
];

function analyzeRelationships(relationships) {
  if (!relationships || !Array.isArray(relationships)) {
    return { total: 0, types: {}, unknownTypes: [], elements: new Set() };
  }

  const types = {};
  const unknownTypes = [];
  const elements = new Set();

  for (const rel of relationships) {
    const type = rel.relationshipType || 'UNKNOWN';
    types[type] = (types[type] || 0) + 1;

    if (!KNOWN_TYPES.includes(type)) {
      unknownTypes.push(type);
    }

    if (rel.spdxElementId) elements.add(rel.spdxElementId);
    if (rel.relatedSpdxElement) elements.add(rel.relatedSpdxElement);
  }

  return {
    total: relationships.length,
    types,
    unknownTypes: [...new Set(unknownTypes)],
    elements: elements.size
  };
}

function findOrphans(doc) {
  if (!doc.packages || !doc.relationships) return [];

  const referenced = new Set();
  for (const rel of doc.relationships) {
    if (rel.spdxElementId) referenced.add(rel.spdxElementId);
    if (rel.relatedSpdxElement) referenced.add(rel.relatedSpdxElement);
  }

  return doc.packages
    .filter(p => p.SPDXID && !referenced.has(p.SPDXID))
    .map(p => p.SPDXID);
}

module.exports = { analyzeRelationships, findOrphans, KNOWN_TYPES };
