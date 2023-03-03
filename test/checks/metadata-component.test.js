const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-component');

describe('metadata-component check', () => {
  it('passes when subject is identified', () => {
    const sbom = { metadata: { subjectName: 'my-app' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when subject is missing', () => {
    const sbom = { metadata: { subjectName: null }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });
});
