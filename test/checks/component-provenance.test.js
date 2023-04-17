const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-provenance');

describe('component-provenance check', () => {
  it('passes component with pedigree', () => {
    const sbom = { components: [{ name: 'a', type: 'library', pedigree: { ancestors: [] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes component with evidence', () => {
    const sbom = { components: [{ name: 'a', type: 'library', evidence: { identity: {} } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes component with provenance property', () => {
    const sbom = { components: [{ name: 'a', type: 'library', properties: [{ name: 'provenance-url', value: 'https://example.com' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes component with build property', () => {
    const sbom = { components: [{ name: 'a', type: 'library', properties: [{ name: 'build-system', value: 'gradle' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without provenance', () => {
    const sbom = { components: [{ name: 'bare-lib', type: 'library' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('no provenance'));
  });

  it('skips data components', () => {
    const sbom = { components: [{ name: 'config', type: 'data' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
