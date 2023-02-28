const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-copyright');

describe('component-copyright check', () => {
  it('passes when components have copyright', () => {
    const sbom = { components: [{ name: 'a', copyright: 'Copyright 2023 Acme' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing copyright', () => {
    const sbom = { components: [{ name: 'a', copyright: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
