const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parsePurl, isValidPurl } = require('../../src/utils/purl');

describe('purl utils', () => {
  describe('parsePurl', () => {
    it('parses a simple npm purl', () => {
      const result = parsePurl('pkg:npm/express@4.18.2');
      assert.equal(result.type, 'npm');
      assert.equal(result.namespace, null);
      assert.equal(result.name, 'express');
      assert.equal(result.version, '4.18.2');
    });

    it('parses a purl with namespace', () => {
      const result = parsePurl('pkg:npm/@angular/core@15.0.0');
      assert.equal(result.type, 'npm');
      assert.equal(result.namespace, '@angular');
      assert.equal(result.name, 'core');
      assert.equal(result.version, '15.0.0');
    });

    it('parses a maven purl', () => {
      const result = parsePurl('pkg:maven/org.apache/commons-lang3@3.12.0');
      assert.equal(result.type, 'maven');
      assert.equal(result.namespace, 'org.apache');
      assert.equal(result.name, 'commons-lang3');
    });

    it('handles purl without version', () => {
      const result = parsePurl('pkg:npm/lodash');
      assert.equal(result.name, 'lodash');
      assert.equal(result.version, null);
    });

    it('returns null for invalid purl', () => {
      assert.equal(parsePurl('not-a-purl'), null);
      assert.equal(parsePurl(null), null);
      assert.equal(parsePurl(''), null);
    });
  });

  describe('isValidPurl', () => {
    it('returns true for valid purls', () => {
      assert.equal(isValidPurl('pkg:npm/express@4.18.2'), true);
    });

    it('returns false for invalid purls', () => {
      assert.equal(isValidPurl('https://example.com'), false);
      assert.equal(isValidPurl(null), false);
    });
  });
});
