const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-namespace');

describe('component-namespace check', () => {
  it('passes maven PURL with namespace', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:maven/org.example/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports maven PURL without namespace', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:maven/a@1.0' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('allows npm PURL without namespace', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports golang PURL without namespace', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:golang/a@1.0' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without purl', () => {
    const sbom = { components: [{ name: 'a', purl: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
