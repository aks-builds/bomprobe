const VALID_TYPES = new Set([
  'DESCRIBES', 'DESCRIBED_BY', 'CONTAINS', 'CONTAINED_BY',
  'DEPENDS_ON', 'DEPENDENCY_OF', 'GENERATES', 'GENERATED_FROM',
  'ANCESTOR_OF', 'DESCENDANT_OF', 'VARIANT_OF', 'DISTRIBUTION_ARTIFACT',
  'PATCH_FOR', 'COPY_OF', 'FILE_ADDED', 'FILE_DELETED', 'FILE_MODIFIED',
  'EXPANDED_FROM_ARCHIVE', 'DYNAMIC_LINK', 'STATIC_LINK',
  'DATA_FILE_OF', 'TEST_CASE_OF', 'BUILD_TOOL_OF', 'DEV_TOOL_OF',
  'TEST_OF', 'TEST_TOOL_OF', 'DOCUMENTATION_OF', 'OPTIONAL_COMPONENT_OF',
  'PROVIDED_DEPENDENCY_OF', 'TEST_DEPENDENCY_OF', 'RUNTIME_DEPENDENCY_OF',
  'EXAMPLE_OF', 'PREREQ_FOR', 'HAS_PREREQ', 'OTHER',
  'BUILD_DEPENDENCY_OF', 'DEV_DEPENDENCY_OF', 'OPTIONAL_DEPENDENCY_OF',
  'PACKAGE_OF', 'REQUIREMENT_DESCRIPTION_FOR', 'SPECIFICATION_FOR'
]);

module.exports = {
  id: 'spdx-relationship-types',
  name: 'SPDX Relationship Type Validation',
  description: 'SPDX relationships should use recognized type values',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const rel of (sbom.relationships || [])) {
      if (rel.relationshipType && !VALID_TYPES.has(rel.relationshipType)) {
        findings.push({
          severity: 'warning',
          message: `Unknown relationship type "${rel.relationshipType}" between ${rel.spdxElementId || '?'} and ${rel.relatedSpdxElement || '?'}`
        });
      }
    }
    return findings;
  }
};
