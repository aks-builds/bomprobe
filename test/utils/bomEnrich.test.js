const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { enrichWithDefaults, enrichWithScores } = require('../../src/utils/bomEnrich');

describe('bomEnrich', () => {
  it('adds default type and scope', () => {
    const sbom = { components: [{ name: 'a' }] };
    const result = enrichWithDefaults(sbom);
    assert.equal(result.components[0].type, 'library');
    assert.equal(result.components[0].scope, 'required');
  });

  it('preserves existing type', () => {
    const sbom = { components: [{ name: 'a', type: 'framework' }] };
    const result = enrichWithDefaults(sbom);
    assert.equal(result.components[0].type, 'framework');
  });

  it('adds timestamp to metadata', () => {
    const result = enrichWithDefaults({ components: [] });
    assert.ok(result.metadata.timestamp);
  });

  it('enriches with scores from results', () => {
    const sbom = { components: [{ name: 'lodash' }] };
    const results = [
      { id: 'check-1', findings: [{ severity: 'error', component: 'lodash', message: 'x' }] }
    ];
    const result = enrichWithScores(sbom, results);
    const props = result.components[0].properties;
    assert.ok(props.find(p => p.name === 'bomprobe:errors' && p.value === '1'));
  });

  it('leaves unflagged components unchanged', () => {
    const sbom = { components: [{ name: 'clean' }] };
    const results = [{ id: 'check-1', findings: [] }];
    const result = enrichWithScores(sbom, results);
    assert.ok(!result.components[0].properties);
  });
});
