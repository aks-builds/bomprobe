const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-deprecated-license');

describe('component-deprecated-license check', () => {
  it('passes current license identifiers', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'MIT' } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags deprecated GPL-2.0', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'GPL-2.0' } }] }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('deprecated'));
  });

  it('flags deprecated AGPL-3.0', () => {
    const sbom = { components: [{ name: 'b', licenses: [{ license: { id: 'AGPL-3.0' } }] }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles no licenses', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });

  it('handles flat id format', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ id: 'LGPL-2.1' }] }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
