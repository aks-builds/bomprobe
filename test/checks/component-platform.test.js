const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-platform');

describe('component-platform check', () => {
  it('passes known platform', () => {
    const sbom = { components: [{ name: 'a', properties: [{ name: 'platform', value: 'linux' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags unknown platform', () => {
    const sbom = { components: [{ name: 'a', properties: [{ name: 'platform', value: 'solaris' }] }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('solaris'));
  });

  it('checks os properties too', () => {
    const sbom = { components: [{ name: 'a', properties: [{ name: 'os', value: 'windows' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('ignores components without platform props', () => {
    const sbom = { components: [{ name: 'a', properties: [{ name: 'license', value: 'MIT' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles no properties', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
