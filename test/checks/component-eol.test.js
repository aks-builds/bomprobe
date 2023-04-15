const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-eol');

describe('component-eol check', () => {
  it('passes clean component', () => {
    const sbom = { components: [{ name: 'a', properties: [{ name: 'status', value: 'active' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags eol property value', () => {
    const sbom = { components: [{ name: 'old-lib', properties: [{ name: 'lifecycle', value: 'end-of-life' }] }] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'warning');
  });

  it('flags deprecated property name', () => {
    const sbom = { components: [{ name: 'old-lib', properties: [{ name: 'deprecated', value: 'true' }] }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags eol in pedigree notes', () => {
    const sbom = { components: [{ name: 'old-lib', pedigree: { notes: 'This component is EOL since 2022' } }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without properties', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
