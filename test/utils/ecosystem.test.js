const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { detectEcosystem } = require('../../src/utils/ecosystem');

describe('ecosystem detection', () => {
  it('detects npm as primary', () => {
    const components = [
      { purl: 'pkg:npm/a@1.0' },
      { purl: 'pkg:npm/b@2.0' },
      { purl: 'pkg:pypi/c@3.0' }
    ];
    const result = detectEcosystem(components);
    assert.equal(result.primary, 'npm');
    assert.equal(result.totalWithPurl, 3);
  });

  it('handles no purls', () => {
    const result = detectEcosystem([{ name: 'a' }]);
    assert.equal(result.primary, null);
  });

  it('sorts by frequency', () => {
    const components = [
      { purl: 'pkg:pypi/a@1' },
      { purl: 'pkg:pypi/b@1' },
      { purl: 'pkg:pypi/c@1' },
      { purl: 'pkg:npm/d@1' }
    ];
    const result = detectEcosystem(components);
    assert.equal(result.ecosystems[0].type, 'pypi');
  });
});
