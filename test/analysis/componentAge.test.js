const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeComponentAge, summarizeAge, formatAge, categorizeAge, parseDate } = require('../../src/analysis/componentAge');

describe('parseDate', () => {
  it('parses ISO date', () => {
    const d = parseDate('2023-01-15T00:00:00Z');
    assert.ok(d instanceof Date);
  });

  it('returns null for garbage', () => {
    assert.equal(parseDate('not-a-date'), null);
    assert.equal(parseDate(null), null);
  });
});

describe('categorizeAge', () => {
  it('recent under 90 days', () => assert.equal(categorizeAge(30), 'recent'));
  it('current under 365 days', () => assert.equal(categorizeAge(200), 'current'));
  it('aging under 730 days', () => assert.equal(categorizeAge(500), 'aging'));
  it('old under 1095 days', () => assert.equal(categorizeAge(900), 'old'));
  it('ancient over 1095 days', () => assert.equal(categorizeAge(1200), 'ancient'));
  it('unknown for null', () => assert.equal(categorizeAge(null), 'unknown'));
});

describe('analyzeComponentAge', () => {
  it('handles empty sbom', () => {
    assert.deepEqual(analyzeComponentAge(null), []);
    assert.deepEqual(analyzeComponentAge({}), []);
  });

  it('extracts release date from releaseNotes', () => {
    const sbom = {
      components: [{
        name: 'express', version: '4.18.0',
        releaseNotes: { timestamp: '2022-04-25T00:00:00Z' }
      }]
    };
    const results = analyzeComponentAge(sbom);
    assert.equal(results.length, 1);
    assert.equal(results[0].releaseDate, '2022-04-25');
    assert.ok(results[0].ageInDays > 0);
  });

  it('marks unknown when no date', () => {
    const sbom = { components: [{ name: 'lodash', version: '4.17.21' }] };
    const results = analyzeComponentAge(sbom);
    assert.equal(results[0].ageCategory, 'unknown');
    assert.equal(results[0].releaseDate, null);
  });

  it('extracts date from properties', () => {
    const sbom = {
      components: [{
        name: 'react', version: '18.0.0',
        properties: [{ name: 'release-date', value: '2022-03-29T00:00:00Z' }]
      }]
    };
    const results = analyzeComponentAge(sbom);
    assert.ok(results[0].releaseDate);
  });
});

describe('summarizeAge', () => {
  it('computes coverage', () => {
    const results = [
      { ageCategory: 'recent', ageInDays: 30, hasReleaseDate: true },
      { ageCategory: 'unknown', ageInDays: null, hasReleaseDate: false }
    ];
    const s = summarizeAge(results);
    assert.equal(s.total, 2);
    assert.equal(s.coverage, 50);
    assert.equal(s.categories.recent, 1);
    assert.equal(s.categories.unknown, 1);
  });

  it('computes stats', () => {
    const results = [
      { ageCategory: 'aging', ageInDays: 400, hasReleaseDate: true },
      { ageCategory: 'old', ageInDays: 800, hasReleaseDate: true }
    ];
    const s = summarizeAge(results);
    assert.equal(s.avgAgeDays, 600);
    assert.equal(s.maxAgeDays, 800);
    assert.equal(s.stale.length, 1);
  });
});

describe('formatAge', () => {
  it('formats readable output', () => {
    const s = summarizeAge([
      { ageCategory: 'recent', ageInDays: 10, hasReleaseDate: true },
      { ageCategory: 'ancient', ageInDays: 1500, hasReleaseDate: true, name: 'old-lib', version: '1.0' }
    ]);
    const out = formatAge(s);
    assert.ok(out.includes('Component Age'));
    assert.ok(out.includes('Ancient'));
  });
});
