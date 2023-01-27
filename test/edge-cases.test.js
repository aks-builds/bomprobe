const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { audit } = require('../src');

const fixtures = path.join(__dirname, 'fixtures');

describe('edge cases', () => {
  it('handles empty SBOM with no components', () => {
    const result = audit(path.join(fixtures, 'empty-cdx.json'));
    assert.equal(result.componentCount, 0);
    assert.equal(result.score.overall, 0);
    assert.equal(result.score.components.count, 0);
  });

  it('scores a perfect SBOM at 10', () => {
    const result = audit(path.join(fixtures, 'perfect-cdx.json'));
    assert.equal(result.score.overall, 10);
    assert.equal(result.score.components.average, 10);
    assert.equal(result.score.metadata, 10);
  });

  it('perfect SBOM passes NTIA compliance', () => {
    const result = audit(path.join(fixtures, 'perfect-cdx.json'), { profile: 'ntia' });
    assert.equal(result.compliance.compliant, true);
    assert.equal(result.compliance.failed.length, 0);
  });

  it('empty SBOM fails NTIA compliance', () => {
    const result = audit(path.join(fixtures, 'empty-cdx.json'), { profile: 'ntia' });
    assert.equal(result.compliance.compliant, false);
  });
});
