const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { detectFromContent, SBOM_PATTERNS } = require('../../src/cli/autoDetect');

describe('auto-detect', () => {
  it('detects CycloneDX from object', () => {
    assert.equal(detectFromContent({ bomFormat: 'CycloneDX', specVersion: '1.4' }), 'cyclonedx');
  });

  it('detects SPDX from object', () => {
    assert.equal(detectFromContent({ spdxVersion: 'SPDX-2.3' }), 'spdx');
  });

  it('detects CycloneDX from JSON string', () => {
    assert.equal(detectFromContent(JSON.stringify({ bomFormat: 'CycloneDX' })), 'cyclonedx');
  });

  it('returns unknown for unrecognized', () => {
    assert.equal(detectFromContent({ random: true }), 'unknown');
  });

  it('returns unknown for bad string', () => {
    assert.equal(detectFromContent('not json'), 'unknown');
  });

  it('has standard SBOM file patterns', () => {
    assert.ok(SBOM_PATTERNS.includes('bom.json'));
    assert.ok(SBOM_PATTERNS.includes('sbom.json'));
    assert.ok(SBOM_PATTERNS.includes('spdx.json'));
  });
});
