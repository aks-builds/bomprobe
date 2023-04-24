const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { summarize, formatSummaryText } = require('../../src/utils/bomSummary');

describe('bom summary', () => {
  it('summarizes CycloneDX SBOM', () => {
    const sbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      metadata: { timestamp: '2023-04-24', tools: [{ name: 'syft' }] },
      components: [
        { name: 'a', type: 'library', purl: 'p', licenses: [{}], hashes: [{}] },
        { name: 'b', type: 'library', purl: 'p' }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    const s = summarize(sbom);
    assert.equal(s.format, 'CycloneDX');
    assert.equal(s.componentCount, 2);
    assert.equal(s.coverage.license, 50);
    assert.equal(s.coverage.purl, 100);
    assert.equal(s.types.library, 2);
  });

  it('detects SPDX format', () => {
    const sbom = { spdxVersion: 'SPDX-2.3', components: [] };
    assert.equal(summarize(sbom).format, 'SPDX');
  });

  it('handles empty SBOM', () => {
    const s = summarize({ components: [] });
    assert.equal(s.componentCount, 0);
    assert.equal(s.coverage.license, 0);
  });

  it('formats text summary', () => {
    const s = summarize({
      bomFormat: 'CycloneDX', specVersion: '1.5',
      components: [{ name: 'a', type: 'library', purl: 'p' }],
      dependencies: []
    });
    const text = formatSummaryText(s);
    assert.ok(text.includes('CycloneDX'));
    assert.ok(text.includes('Components: 1'));
    assert.ok(text.includes('PURL:    100%'));
  });

  it('sorts types by count', () => {
    const sbom = {
      components: [
        { name: 'a', type: 'library' },
        { name: 'b', type: 'library' },
        { name: 'c', type: 'framework' }
      ]
    };
    const text = formatSummaryText(summarize(sbom));
    assert.ok(text.indexOf('library') < text.indexOf('framework'));
  });
});
