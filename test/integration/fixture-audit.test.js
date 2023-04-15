const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { normalize: normalizeCdx } = require('../../src/parsers/cyclonedx');
const { runAll } = require('../../src/checks');
const { evaluateCompliance } = require('../../src/compliance/profiles');

function loadFixture(name) {
  const raw = readFileSync(join(__dirname, '../fixtures', name), 'utf8');
  return JSON.parse(raw);
}

describe('realistic webapp fixture audit', () => {
  const sbom = normalizeCdx(loadFixture('realistic-webapp.json'));

  it('normalizes all 6 components', () => {
    assert.equal(sbom.components.length, 6);
  });

  it('runs all checks without errors', () => {
    const results = runAll(sbom);
    assert.ok(results.length > 60);
    for (const r of results) {
      assert.ok(Array.isArray(r.findings), `${r.id} should return array`);
    }
  });

  it('has fewer warnings than a low-quality document', () => {
    const lowQuality = normalizeCdx(loadFixture('low-quality-cdx.json'));
    const goodResults = runAll(sbom);
    const badResults = runAll(lowQuality);

    const goodWarnings = goodResults.reduce((n, r) => n + r.findings.filter(f => f.severity === 'warning').length, 0);
    const badWarnings = badResults.reduce((n, r) => n + r.findings.filter(f => f.severity === 'warning').length, 0);

    assert.ok(goodWarnings < badWarnings, `good (${goodWarnings}) should have fewer warnings than bad (${badWarnings})`);
  });

  it('passes NTIA compliance', () => {
    const results = runAll(sbom);
    const evaluation = evaluateCompliance(results, 'ntia');
    assert.ok(evaluation.score > 50, `NTIA score ${evaluation.score} should be above 50`);
  });
});

describe('low quality fixture audit', () => {
  const sbom = normalizeCdx(loadFixture('low-quality-cdx.json'));

  it('normalizes components', () => {
    assert.ok(sbom.components.length > 0);
  });

  it('produces many warnings and errors', () => {
    const results = runAll(sbom);
    const totalFindings = results.reduce((n, r) => n + r.findings.length, 0);
    assert.ok(totalFindings > 5, `expected many findings, got ${totalFindings}`);
  });

  it('detects duplicate component names', () => {
    const results = runAll(sbom);
    const dupCheck = results.find(r => r.id === 'duplicate-components');
    assert.ok(dupCheck);
    assert.ok(dupCheck.findings.length > 0, 'should flag duplicate some-lib');
  });
});
