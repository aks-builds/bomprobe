const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentDuplicate');

describe('component-duplicate', () => {
  it('flags exact duplicate components', () => {
    const sbom = {
      components: [
        { name: 'lodash', version: '4.17.21', type: 'library' },
        { name: 'lodash', version: '4.17.21', type: 'library' },
        { name: 'express', version: '4.18.0', type: 'library' }
      ]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('lodash'));
  });

  it('allows same name with different versions', () => {
    const sbom = {
      components: [
        { name: 'lodash', version: '4.17.20', type: 'library' },
        { name: 'lodash', version: '4.17.21', type: 'library' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with no duplicates', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0' },
        { name: 'b', version: '1.0' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles empty components', () => {
    assert.equal(check.run({ components: [] }).length, 0);
  });
});
