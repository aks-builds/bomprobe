const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { stripFindings, addProperty, removeComponents, sortComponents } = require('../../src/utils/bomTransform');

describe('bomTransform', () => {
  it('strips _findings from components', () => {
    const sbom = { components: [{ name: 'a', _findings: [1, 2] }] };
    const result = stripFindings(sbom);
    assert.ok(!result.components[0]._findings);
    assert.equal(result.components[0].name, 'a');
  });

  it('adds metadata property', () => {
    const sbom = { metadata: {} };
    const result = addProperty(sbom, 'bomprobe.score', 85);
    assert.equal(result.metadata.properties[0].name, 'bomprobe.score');
    assert.equal(result.metadata.properties[0].value, '85');
  });

  it('removes named components', () => {
    const sbom = { components: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] };
    const result = removeComponents(sbom, ['b']);
    assert.equal(result.components.length, 2);
    assert.ok(!result.components.find(c => c.name === 'b'));
  });

  it('sorts components by name', () => {
    const sbom = { components: [{ name: 'zlib' }, { name: 'axios' }, { name: 'lodash' }] };
    const result = sortComponents(sbom);
    assert.equal(result.components[0].name, 'axios');
    assert.equal(result.components[2].name, 'zlib');
  });

  it('sorts by custom field', () => {
    const sbom = { components: [{ name: 'a', version: '2.0' }, { name: 'b', version: '1.0' }] };
    const result = sortComponents(sbom, 'version');
    assert.equal(result.components[0].version, '1.0');
  });

  it('does not mutate original', () => {
    const sbom = { components: [{ name: 'a' }] };
    removeComponents(sbom, ['a']);
    assert.equal(sbom.components.length, 1);
  });
});
