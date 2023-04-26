const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { filterByType, filterByScope, filterByName, excludeByName } = require('../../src/utils/bomFilter');

const sbom = {
  components: [
    { name: 'lodash', type: 'library', scope: 'required' },
    { name: 'mocha', type: 'framework', scope: 'optional' },
    { name: 'node', type: 'application', scope: 'required' },
    { name: 'config.json', type: 'data' }
  ]
};

describe('bomFilter', () => {
  describe('filterByType', () => {
    it('keeps only specified types', () => {
      const result = filterByType(sbom, ['library']);
      assert.equal(result.components.length, 1);
      assert.equal(result.components[0].name, 'lodash');
    });

    it('returns all when no filter', () => {
      assert.equal(filterByType(sbom, []).components.length, 4);
    });
  });

  describe('filterByScope', () => {
    it('keeps only specified scopes', () => {
      const result = filterByScope(sbom, ['optional']);
      assert.equal(result.components.length, 1);
      assert.equal(result.components[0].name, 'mocha');
    });

    it('treats missing scope as required', () => {
      const result = filterByScope(sbom, ['required']);
      assert.equal(result.components.length, 3);
    });
  });

  describe('filterByName', () => {
    it('filters by regex pattern', () => {
      const result = filterByName(sbom, '^lo');
      assert.equal(result.components.length, 1);
    });

    it('is case insensitive', () => {
      const result = filterByName(sbom, 'LODASH');
      assert.equal(result.components.length, 1);
    });
  });

  describe('excludeByName', () => {
    it('excludes matching names', () => {
      const result = excludeByName(sbom, 'config');
      assert.equal(result.components.length, 3);
    });

    it('returns all when no pattern', () => {
      assert.equal(excludeByName(sbom, null).components.length, 4);
    });
  });
});
