const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { diffSboms } = require('../../src/utils/bomDiff');

describe('bomDiff', () => {
  it('detects added components', () => {
    const before = { components: [{ name: 'a', version: '1.0' }] };
    const after = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '1.0' }] };
    const diff = diffSboms(before, after);
    assert.equal(diff.added.length, 1);
    assert.equal(diff.added[0].name, 'b');
  });

  it('detects removed components', () => {
    const before = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '1.0' }] };
    const after = { components: [{ name: 'a', version: '1.0' }] };
    const diff = diffSboms(before, after);
    assert.equal(diff.removed.length, 1);
    assert.equal(diff.removed[0].name, 'b');
  });

  it('detects field changes', () => {
    const before = { components: [{ name: 'a', version: '1.0', scope: 'required' }] };
    const after = { components: [{ name: 'a', version: '1.0', scope: 'optional' }] };
    const diff = diffSboms(before, after);
    assert.equal(diff.changed.length, 1);
    assert.equal(diff.changed[0].changes[0].field, 'scope');
  });

  it('detects license changes', () => {
    const before = { components: [{ name: 'a', version: '1.0', licenses: [{ license: { id: 'MIT' } }] }] };
    const after = { components: [{ name: 'a', version: '1.0', licenses: [{ license: { id: 'Apache-2.0' } }] }] };
    const diff = diffSboms(before, after);
    assert.equal(diff.changed.length, 1);
    assert.ok(diff.changed[0].changes.some(c => c.field === 'license'));
  });

  it('reports unchanged components', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }] };
    const diff = diffSboms(sbom, sbom);
    assert.equal(diff.unchanged.length, 1);
    assert.equal(diff.added.length, 0);
  });

  it('handles empty SBOMs', () => {
    const diff = diffSboms({ components: [] }, { components: [] });
    assert.equal(diff.added.length, 0);
    assert.equal(diff.removed.length, 0);
  });
});
