const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/purl-type');

describe('purl-type check', () => {
  it('passes known types', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes maven type', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:maven/org.example/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports unknown type', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:unknown/a@1.0' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('unknown'));
  });

  it('skips components without purl', () => {
    const sbom = { components: [{ name: 'a', purl: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
