const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { scoreCompleteness, formatCompleteness, hasField } = require('../../src/scoring/completeness');

describe('hasField', () => {
  it('detects name', () => assert.ok(hasField({ name: 'x' }, 'name')));
  it('rejects empty name', () => assert.ok(!hasField({ name: '' }, 'name')));
  it('detects purl', () => assert.ok(hasField({ purl: 'pkg:npm/x@1' }, 'purl')));
  it('detects licenses', () => assert.ok(hasField({ licenses: [{ license: { id: 'MIT' } }] }, 'licenses')));
  it('rejects empty licenses', () => assert.ok(!hasField({ licenses: [] }, 'licenses')));
  it('detects supplier name', () => assert.ok(hasField({ supplier: { name: 'Acme' } }, 'supplier')));
  it('detects hashes', () => assert.ok(hasField({ hashes: [{ alg: 'SHA-256', content: 'abc' }] }, 'hashes')));
  it('rejects version 0.0.0', () => assert.ok(!hasField({ version: '0.0.0' }, 'version')));
});

describe('scoreCompleteness', () => {
  it('returns 0 for empty', () => {
    const r = scoreCompleteness({});
    assert.equal(r.overall, 0);
    assert.equal(r.components, 0);
  });

  it('scores complete component high', () => {
    const sbom = {
      components: [{
        name: 'express', version: '4.18.2', purl: 'pkg:npm/express@4.18.2',
        type: 'library', supplier: { name: 'TJ' },
        licenses: [{ license: { id: 'MIT' } }],
        hashes: [{ alg: 'SHA-256', content: 'abc' }],
        description: 'Web framework', copyright: '2024',
        externalReferences: [{ type: 'website', url: 'https://example.com' }],
        scope: 'required', group: 'express'
      }]
    };
    const r = scoreCompleteness(sbom);
    assert.equal(r.overall, 100);
    assert.equal(r.perComponent[0].score, 100);
  });

  it('scores sparse component low', () => {
    const sbom = { components: [{ name: 'x' }] };
    const r = scoreCompleteness(sbom);
    assert.ok(r.overall < 20);
  });

  it('computes per-field coverage', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0', purl: 'pkg:npm/a@1' },
        { name: 'b', version: '2.0' }
      ]
    };
    const r = scoreCompleteness(sbom);
    assert.equal(r.perField.name.coverage, 100);
    assert.equal(r.perField.purl.coverage, 50);
  });
});

describe('formatCompleteness', () => {
  it('produces readable output', () => {
    const r = scoreCompleteness({
      components: [
        { name: 'a', version: '1.0', purl: 'pkg:npm/a@1' },
        { name: 'b' }
      ]
    });
    const out = formatCompleteness(r);
    assert.ok(out.includes('Completeness Score'));
    assert.ok(out.includes('Field coverage'));
  });
});
