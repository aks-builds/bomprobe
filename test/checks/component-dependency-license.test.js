const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-dependency-license');

describe('component-dependency-license check', () => {
  it('passes permissive licenses', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags GPL in required scope', () => {
    const sbom = { components: [
      { name: 'lib', scope: 'required', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('copyleft'));
  });

  it('flags default scope (no scope set)', () => {
    const sbom = { components: [
      { name: 'lib', licenses: [{ license: { id: 'AGPL-3.0-only' } }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips optional scope copyleft', () => {
    const sbom = { components: [
      { name: 'lib', scope: 'optional', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles flat license id format', () => {
    const sbom = { components: [
      { name: 'lib', licenses: [{ id: 'MPL-2.0' }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
  });
});
