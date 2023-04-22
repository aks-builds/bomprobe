const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkEuCra } = require('../../src/compliance/eucra');

describe('EU CRA compliance check', () => {
  it('scores compliant SBOM', () => {
    const sbom = {
      metadata: { properties: [{ name: 'vulnerabilityDisclosure', value: 'yes' }] },
      components: [
        { name: 'a', version: '1.0', purl: 'p', supplier: { name: 's' }, licenses: [{ license: { id: 'MIT' } }] }
      ],
      dependencies: [{ ref: 'a', dependsOn: [] }],
      externalReferences: [{ type: 'distribution', url: 'https://example.com' }]
    };
    const result = checkEuCra(sbom);
    assert.equal(result.score, 100);
  });

  it('flags missing license', () => {
    const sbom = {
      components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' } }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkEuCra(sbom);
    assert.ok(result.findings.some(f => f.field === 'license' && !f.met));
  });

  it('flags missing vulnerability disclosure', () => {
    const sbom = { components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' }, licenses: [{}] }] };
    const result = checkEuCra(sbom);
    assert.ok(result.findings.some(f => f.field === 'vulnerabilityDisclosure' && !f.met));
  });

  it('reports correct profile name', () => {
    const result = checkEuCra({ components: [] });
    assert.equal(result.profile, 'EU Cyber Resilience Act');
  });

  it('handles empty components', () => {
    const result = checkEuCra({ components: [] });
    assert.ok(result.score >= 0);
  });
});
