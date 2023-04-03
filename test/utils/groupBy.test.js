const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { groupBy, groupBySeverity, groupByComponent } = require('../../src/utils/groupBy');

describe('groupBy utilities', () => {
  it('groups items by key function', () => {
    const items = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }];
    const groups = groupBy(items, i => i.type);
    assert.equal(groups.a.length, 2);
    assert.equal(groups.b.length, 1);
  });

  it('groups findings by severity', () => {
    const checks = [
      { id: 'x', name: 'X', findings: [{ severity: 'error', message: 'e' }, { severity: 'warning', message: 'w' }] },
      { id: 'y', name: 'Y', findings: [{ severity: 'error', message: 'e2' }] }
    ];
    const groups = groupBySeverity(checks);
    assert.equal(groups.error.length, 2);
    assert.equal(groups.warning.length, 1);
  });

  it('groups findings by component', () => {
    const checks = [
      { id: 'x', name: 'X', findings: [
        { severity: 'error', component: 'lib-a', message: 'e' },
        { severity: 'warning', component: 'lib-b', message: 'w' }
      ]},
      { id: 'y', name: 'Y', findings: [{ severity: 'info', component: 'lib-a', message: 'i' }] }
    ];
    const groups = groupByComponent(checks);
    assert.equal(groups['lib-a'].length, 2);
    assert.equal(groups['lib-b'].length, 1);
  });

  it('handles empty checks', () => {
    const groups = groupBySeverity([]);
    assert.deepEqual(groups, {});
  });
});
