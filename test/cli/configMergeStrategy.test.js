const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mergeConfigChain, describeConfig } = require('../../src/cli/configMergeStrategy');

describe('config merge strategy', () => {
  it('CLI overrides file overrides env', () => {
    const result = mergeConfigChain(
      { format: 'text', threshold: 70 },
      { format: 'json' },
      { threshold: 90 }
    );
    assert.equal(result.format, 'json');
    assert.equal(result.threshold, 90);
  });

  it('merges nested objects', () => {
    const result = mergeConfigChain(
      {},
      { scoring: { profile: 'strict' } },
      { scoring: { threshold: 80 } }
    );
    assert.equal(result.scoring.profile, 'strict');
    assert.equal(result.scoring.threshold, 80);
  });

  it('arrays replace instead of merge', () => {
    const result = mergeConfigChain(
      { exclude: ['a', 'b'] },
      { exclude: ['c'] },
      {}
    );
    assert.deepEqual(result.exclude, ['c']);
  });

  it('skips undefined values', () => {
    const result = mergeConfigChain({}, {}, { format: undefined });
    assert.equal(result.format, undefined);
  });

  it('describes config as text', () => {
    const desc = describeConfig({ format: 'json', threshold: 80 });
    assert.ok(desc.includes('format'));
    assert.ok(desc.includes('80'));
  });
});
