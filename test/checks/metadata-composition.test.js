const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-composition');

describe('metadata-composition check', () => {
  it('passes with valid aggregate', () => {
    const sbom = { compositions: [{ aggregate: 'complete', assemblies: ['ref-a'] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing compositions', () => {
    assert.equal(check.run({}).length, 1);
    assert.ok(check.run({})[0].message.includes('No composition'));
  });

  it('flags missing aggregate type', () => {
    const sbom = { compositions: [{ assemblies: ['ref-a'] }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('missing aggregate')));
  });

  it('flags unknown aggregate', () => {
    const sbom = { compositions: [{ aggregate: 'bogus' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('Unknown')));
  });

  it('accepts all valid aggregates', () => {
    for (const agg of ['complete', 'incomplete', 'unknown', 'not_specified']) {
      assert.equal(check.run({ compositions: [{ aggregate: agg }] }).length, 0);
    }
  });
});
