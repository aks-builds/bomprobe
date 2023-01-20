const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { normalize } = require('../../src/parsers/cyclonedx');

const doc = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'fixtures', 'minimal-cdx.json'), 'utf8')
);

describe('cyclonedx normalizer', () => {
  const result = normalize(doc);

  it('sets format to cyclonedx', () => {
    assert.equal(result.format, 'cyclonedx');
  });

  it('extracts metadata timestamp', () => {
    assert.equal(result.metadata.timestamp, '2023-01-15T10:00:00Z');
  });

  it('extracts metadata author', () => {
    assert.equal(result.metadata.author, 'Test Author');
  });

  it('extracts tool count', () => {
    assert.equal(result.metadata.toolCount, 1);
  });

  it('normalizes all components', () => {
    assert.equal(result.components.length, 2);
  });

  it('extracts component name and version', () => {
    assert.equal(result.components[0].name, 'express');
    assert.equal(result.components[0].version, '4.18.2');
  });

  it('extracts supplier from supplier field', () => {
    assert.equal(result.components[0].supplier, 'expressjs');
  });

  it('returns null supplier when missing', () => {
    assert.equal(result.components[1].supplier, null);
  });

  it('extracts license id', () => {
    assert.equal(result.components[0].license, 'MIT');
  });

  it('returns null license when missing', () => {
    assert.equal(result.components[1].license, null);
  });

  it('extracts purl', () => {
    assert.equal(result.components[0].purl, 'pkg:npm/express@4.18.2');
  });

  it('calculates dependency graph coverage', () => {
    assert.equal(result.dependencyGraph.totalEntries, 1);
    assert.equal(result.dependencyGraph.coverage, 0.5);
  });
});
