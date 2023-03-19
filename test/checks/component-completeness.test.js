const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-completeness');

describe('component-completeness check', () => {
  it('passes when all NTIA fields are present', () => {
    const sbom = {
      components: [{ name: 'a', version: '1.0', supplier: 'x', purl: 'pkg:npm/a@1' }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports info when one field is missing', () => {
    const sbom = {
      components: [{ name: 'a', version: '1.0', supplier: 'x', purl: null }]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
    assert.ok(findings[0].message.includes('75%'));
  });

  it('reports warning when two fields missing', () => {
    const sbom = {
      components: [{ name: 'a', version: null, supplier: null, purl: 'pkg:npm/a@1' }]
    };
    const findings = check.run(sbom);
    assert.equal(findings[0].severity, 'warning');
  });

  it('reports error when three or more fields missing', () => {
    const sbom = {
      components: [{ name: 'a', version: null, supplier: null, purl: null }]
    };
    const findings = check.run(sbom);
    assert.equal(findings[0].severity, 'error');
  });

  it('handles empty components', () => {
    assert.equal(check.run({ components: [] }).length, 0);
  });
});
