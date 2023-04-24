const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-maturity');

describe('component-maturity check', () => {
  it('passes with description', () => {
    const sbom = { components: [{ name: 'a', description: 'A library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with CPE', () => {
    const sbom = { components: [{ name: 'a', cpe: 'cpe:2.3:a:vendor:a:1.0:*:*:*:*:*:*:*' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with no maturity signals', () => {
    const sbom = { components: [{ name: 'bare', version: '1.0' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('maturity'));
  });

  it('skips data type components', () => {
    const sbom = { components: [{ name: 'config', type: 'data' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('counts pedigree as maturity signal', () => {
    const sbom = { components: [{ name: 'a', pedigree: { ancestors: [] } }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
