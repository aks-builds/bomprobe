const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-external-refs');

describe('component-external-refs check', () => {
  it('passes when component has purl', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1', cpe: null }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes when component has cpe', () => {
    const sbom = { components: [{ name: 'a', purl: null, cpe: 'cpe:2.3:a:v:a:1' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when no external refs', () => {
    const sbom = { components: [{ name: 'a', purl: null, cpe: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
