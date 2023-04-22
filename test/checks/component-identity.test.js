const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-identity');

describe('component-identity check', () => {
  it('passes with name and version', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with name and purl', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with only name', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('1 identifier'));
  });

  it('flags component with no identifiers', () => {
    const sbom = { components: [{}] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('counts bom-ref as identifier', () => {
    const sbom = { components: [{ name: 'a', 'bom-ref': 'ref-a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
