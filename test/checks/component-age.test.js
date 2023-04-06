const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-age');

describe('component-age check', () => {
  it('passes recently updated component', () => {
    const sbom = { components: [{ name: 'a', modified: new Date().toISOString() }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports old component', () => {
    const old = new Date();
    old.setFullYear(old.getFullYear() - 3);
    const sbom = { components: [{ name: 'a', modified: old.toISOString() }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('years ago'));
  });

  it('skips components without timestamps', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles invalid date strings', () => {
    const sbom = { components: [{ name: 'a', modified: 'not-a-date' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('uses timestamp field as fallback', () => {
    const old = new Date();
    old.setFullYear(old.getFullYear() - 4);
    const sbom = { components: [{ name: 'a', timestamp: old.toISOString() }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
