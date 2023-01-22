const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-version');

describe('component-version check', () => {
  it('passes when all components have versions', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing versions', () => {
    const sbom = { components: [{ name: 'a', version: null }, { name: 'b', version: '2.0' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /no version/);
  });

  it('uses unnamed for components without name or version', () => {
    const sbom = { components: [{ name: null, version: null }] };
    const findings = check.run(sbom);
    assert.match(findings[0].message, /Unnamed/);
  });
});
