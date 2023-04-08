const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-modified');

describe('component-modified check', () => {
  it('passes unmodified components', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags patched component', () => {
    const sbom = { components: [{ name: 'a', pedigree: { patches: [{ type: 'unofficial' }] } }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('patch'));
  });

  it('flags modified component', () => {
    const sbom = { components: [{ name: 'a', modified: true }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags both patches and modified flag', () => {
    const sbom = { components: [{ name: 'a', modified: true, pedigree: { patches: [{ type: 'backport' }] } }] };
    assert.equal(check.run(sbom).length, 2);
  });

  it('ignores modified=false', () => {
    const sbom = { components: [{ name: 'a', modified: false }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
