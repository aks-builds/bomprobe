const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-alternative');

describe('component-alternative check', () => {
  it('passes with name and purl', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with name and cpe', () => {
    const sbom = { components: [{ name: 'a', cpe: 'cpe:2.3:a:vendor:a:1' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with only name', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('1 identifier'));
  });

  it('passes with three identifiers', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1', cpe: 'cpe:2.3:a:v:a:1' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
