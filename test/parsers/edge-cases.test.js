const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const cdx = require('../../src/parsers/cyclonedx');
const spdx = require('../../src/parsers/spdx');

describe('parser edge cases', () => {
  describe('cyclonedx', () => {
    it('handles missing metadata gracefully', () => {
      const result = cdx.normalize({ components: [], dependencies: [] });
      assert.equal(result.metadata.author, null);
      assert.equal(result.metadata.timestamp, null);
      assert.equal(result.metadata.toolCount, 0);
    });

    it('handles component with no optional fields', () => {
      const result = cdx.normalize({ components: [{}], dependencies: [] });
      assert.equal(result.components[0].name, null);
      assert.equal(result.components[0].version, null);
      assert.equal(result.components[0].supplier, null);
    });

    it('extracts publisher as supplier fallback', () => {
      const result = cdx.normalize({
        components: [{ name: 'a', publisher: 'pub-co' }],
        dependencies: []
      });
      assert.equal(result.components[0].supplier, 'pub-co');
    });

    it('extracts license expression', () => {
      const result = cdx.normalize({
        components: [{ name: 'a', licenses: [{ expression: 'MIT OR Apache-2.0' }] }],
        dependencies: []
      });
      assert.equal(result.components[0].license, 'MIT OR Apache-2.0');
    });
  });

  describe('spdx', () => {
    it('handles missing creationInfo', () => {
      const result = spdx.normalize({ packages: [], relationships: [] });
      assert.equal(result.metadata.author, null);
      assert.equal(result.metadata.timestamp, null);
    });

    it('extracts Person creator', () => {
      const result = spdx.normalize({
        creationInfo: { creators: ['Person: Jane Doe'] },
        packages: [],
        relationships: []
      });
      assert.equal(result.metadata.author, 'Jane Doe');
    });

    it('handles NOASSERTION supplier', () => {
      const result = spdx.normalize({
        packages: [{ SPDXID: 'SPDXRef-a', name: 'a', supplier: 'NOASSERTION' }],
        relationships: []
      });
      assert.equal(result.components[0].supplier, null);
    });

    it('extracts CPE from externalRefs', () => {
      const result = spdx.normalize({
        packages: [{
          SPDXID: 'SPDXRef-a',
          name: 'a',
          externalRefs: [{ referenceType: 'cpe23Type', referenceLocator: 'cpe:2.3:a:vendor:a:1.0' }]
        }],
        relationships: []
      });
      assert.equal(result.components[0].cpe, 'cpe:2.3:a:vendor:a:1.0');
    });
  });
});
