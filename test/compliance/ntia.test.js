const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkNtia, NTIA_REQUIRED_FIELDS } = require('../../src/compliance/ntia');

describe('NTIA compliance check', () => {
  it('passes fully compliant SBOM', () => {
    const sbom = {
      metadata: { timestamp: '2023-04-22', authors: [{ name: 'Aditya' }] },
      components: [
        { name: 'a', version: '1.0', purl: 'pkg:npm/a@1.0', supplier: { name: 'Acme' } }
      ],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkNtia(sbom);
    assert.equal(result.score, 100);
    assert.equal(result.met, NTIA_REQUIRED_FIELDS.length);
  });

  it('flags missing timestamp', () => {
    const sbom = {
      metadata: { authors: [{ name: 'x' }] },
      components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' } }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkNtia(sbom);
    assert.ok(result.findings.some(f => f.field === 'timestamp' && !f.met));
  });

  it('flags missing supplier on components', () => {
    const sbom = {
      metadata: { timestamp: 'now', authors: [{ name: 'x' }] },
      components: [{ name: 'a', version: '1', purl: 'p' }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkNtia(sbom);
    assert.ok(result.findings.some(f => f.field === 'supplier' && !f.met));
  });

  it('reports correct profile name', () => {
    const result = checkNtia({ components: [] });
    assert.equal(result.profile, 'NTIA Minimum Elements');
  });

  it('handles empty SBOM', () => {
    const result = checkNtia({ components: [] });
    assert.ok(result.score >= 0 && result.score <= 100);
  });
});
