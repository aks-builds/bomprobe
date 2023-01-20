const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { normalize } = require('../../src/parsers/spdx');

const doc = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'fixtures', 'minimal-spdx.json'), 'utf8')
);

describe('spdx normalizer', () => {
  const result = normalize(doc);

  it('sets format to spdx', () => {
    assert.equal(result.format, 'spdx');
  });

  it('filters out the document package', () => {
    assert.equal(result.components.length, 2);
    const names = result.components.map(c => c.name);
    assert.ok(!names.includes('test-sbom'));
  });

  it('extracts metadata timestamp', () => {
    assert.equal(result.metadata.timestamp, '2023-01-15T10:00:00Z');
  });

  it('extracts metadata author from Organization creator', () => {
    assert.equal(result.metadata.author, 'Test Org');
  });

  it('extracts tool count', () => {
    assert.equal(result.metadata.toolCount, 1);
  });

  it('extracts component name and version', () => {
    assert.equal(result.components[0].name, 'express');
    assert.equal(result.components[0].version, '4.18.2');
  });

  it('extracts supplier', () => {
    assert.equal(result.components[0].supplier, 'expressjs');
  });

  it('extracts declared license', () => {
    assert.equal(result.components[0].license, 'MIT');
  });

  it('returns null license for NOASSERTION', () => {
    assert.equal(result.components[1].license, null);
  });

  it('extracts purl from externalRefs', () => {
    assert.equal(result.components[0].purl, 'pkg:npm/express@4.18.2');
  });

  it('returns null purl when no externalRefs', () => {
    assert.equal(result.components[1].purl, null);
  });

  it('counts checksums as hashes', () => {
    assert.equal(result.components[0].hashes, 1);
  });

  it('calculates dependency coverage', () => {
    assert.equal(result.dependencyGraph.totalEntries, 1);
    assert.equal(result.dependencyGraph.coverage, 0.5);
  });
});
