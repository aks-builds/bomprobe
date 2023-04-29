const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-ownership');

describe('component-ownership check', () => {
  it('passes with supplier', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'org' } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with author string', () => {
    const sbom = { components: [{ name: 'a', author: 'dev' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with publisher', () => {
    const sbom = { components: [{ name: 'a', publisher: 'pub' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags no ownership', () => {
    const sbom = { components: [{ name: 'orphan', version: '1.0' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('no ownership'));
  });

  it('passes with authors array', () => {
    const sbom = { components: [{ name: 'a', authors: [{ name: 'dev' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
