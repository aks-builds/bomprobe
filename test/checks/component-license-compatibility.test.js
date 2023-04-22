const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-license-compatibility');

describe('component-license-compatibility check', () => {
  it('passes compatible licenses', () => {
    const sbom = {
      components: [
        { name: 'app', purl: 'a', licenses: [{ license: { id: 'MIT' } }] },
        { name: 'lib', purl: 'b', licenses: [{ license: { id: 'Apache-2.0' } }] }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags permissive depending on copyleft', () => {
    const sbom = {
      components: [
        { name: 'app', purl: 'a', licenses: [{ license: { id: 'MIT' } }] },
        { name: 'gplLib', purl: 'b', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('copyleft'));
  });

  it('allows copyleft depending on permissive', () => {
    const sbom = {
      components: [
        { name: 'gplApp', purl: 'a', licenses: [{ license: { id: 'GPL-3.0-only' } }] },
        { name: 'mitLib', purl: 'b', licenses: [{ license: { id: 'MIT' } }] }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles no dependencies', () => {
    const sbom = {
      components: [{ name: 'a', licenses: [{ license: { id: 'MIT' } }] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
