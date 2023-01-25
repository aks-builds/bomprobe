const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { audit } = require('../src');

const fixtures = path.join(__dirname, 'fixtures');

describe('audit', () => {
  it('audits a CycloneDX file', () => {
    const result = audit(path.join(fixtures, 'minimal-cdx.json'));
    assert.equal(result.format, 'cyclonedx');
    assert.ok(result.score.overall > 0);
    assert.equal(result.componentCount, 2);
    assert.ok(result.checks.length > 0);
  });

  it('audits an SPDX file', () => {
    const result = audit(path.join(fixtures, 'minimal-spdx.json'));
    assert.equal(result.format, 'spdx');
    assert.ok(result.score.overall > 0);
  });

  it('returns error for invalid file', () => {
    const result = audit('/nonexistent/file.json');
    assert.ok(result.error);
  });

  it('includes NTIA compliance when profile is set', () => {
    const result = audit(path.join(fixtures, 'minimal-cdx.json'), { profile: 'ntia' });
    assert.ok(result.compliance);
    assert.equal(result.compliance.profile, 'ntia');
  });

  it('omits compliance when no profile is set', () => {
    const result = audit(path.join(fixtures, 'minimal-cdx.json'));
    assert.equal(result.compliance, undefined);
  });
});
