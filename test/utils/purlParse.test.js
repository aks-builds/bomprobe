const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parsePurl, purlToString } = require('../../src/utils/purlParse');

describe('purl parser', () => {
  it('parses simple npm purl', () => {
    const p = parsePurl('pkg:npm/express@4.18.2');
    assert.equal(p.type, 'npm');
    assert.equal(p.name, 'express');
    assert.equal(p.version, '4.18.2');
    assert.equal(p.namespace, null);
  });

  it('parses purl with namespace', () => {
    const p = parsePurl('pkg:maven/org.apache/commons@1.0');
    assert.equal(p.type, 'maven');
    assert.equal(p.namespace, 'org.apache');
    assert.equal(p.name, 'commons');
  });

  it('parses purl with qualifiers', () => {
    const p = parsePurl('pkg:npm/lodash@4.17.21?vcs_url=https://github.com/lodash/lodash');
    assert.equal(p.qualifiers.vcs_url, 'https://github.com/lodash/lodash');
  });

  it('parses purl with subpath', () => {
    const p = parsePurl('pkg:npm/lib@1.0#src/main');
    assert.equal(p.subpath, 'src/main');
  });

  it('returns null for invalid purl', () => {
    assert.equal(parsePurl('not-a-purl'), null);
    assert.equal(parsePurl(null), null);
    assert.equal(parsePurl(''), null);
  });

  it('round-trips through purlToString', () => {
    const original = 'pkg:npm/express@4.18.2';
    const parsed = parsePurl(original);
    assert.equal(purlToString(parsed), original);
  });

  it('round-trips with namespace', () => {
    const original = 'pkg:maven/org.apache/commons@1.0';
    const parsed = parsePurl(original);
    assert.equal(purlToString(parsed), original);
  });
});
