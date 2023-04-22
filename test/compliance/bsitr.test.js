const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkBsiTr, BSI_REQUIREMENTS } = require('../../src/compliance/bsitr');

describe('BSI TR-03183 compliance check', () => {
  it('passes fully compliant SBOM', () => {
    const sbom = {
      metadata: { timestamp: '2023-04-22', tools: [{ name: 'syft', version: '0.70' }] },
      components: [{
        name: 'a', version: '1.0', purl: 'pkg:npm/a@1.0',
        supplier: { name: 'Acme' }, licenses: [{ license: { id: 'MIT' } }],
        hashes: [{ alg: 'SHA-256', content: 'abc123' }]
      }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkBsiTr(sbom);
    assert.equal(result.score, 100);
    assert.equal(result.met, BSI_REQUIREMENTS.length);
  });

  it('flags missing hash integrity', () => {
    const sbom = {
      metadata: { timestamp: 'now', tools: [{ name: 't' }] },
      components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' }, licenses: [{}] }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkBsiTr(sbom);
    assert.ok(result.findings.some(f => f.field === 'hashIntegrity' && !f.met));
  });

  it('flags missing tool info', () => {
    const sbom = {
      metadata: { timestamp: 'now' },
      components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' }, licenses: [{}], hashes: [{}] }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    const result = checkBsiTr(sbom);
    assert.ok(result.findings.some(f => f.field === 'toolInfo' && !f.met));
  });

  it('reports correct profile name', () => {
    assert.equal(checkBsiTr({ components: [] }).profile, 'BSI TR-03183');
  });

  it('handles empty SBOM', () => {
    const result = checkBsiTr({ components: [] });
    assert.ok(result.score >= 0 && result.score <= 100);
  });
});
