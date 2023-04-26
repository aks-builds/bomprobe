const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-annotation-info');

describe('spdx-annotation-info check', () => {
  it('passes complete annotation', () => {
    const sbom = { annotations: [{
      annotator: 'Tool: bomprobe',
      annotationDate: '2023-04-26T00:00:00Z',
      annotationType: 'REVIEW',
      comment: 'Reviewed by bomprobe'
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing annotator', () => {
    const sbom = { annotations: [{ annotationDate: '2023-01-01', annotationType: 'REVIEW', comment: 'x' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('annotator')));
  });

  it('flags missing type as warning', () => {
    const sbom = { annotations: [{ annotator: 'a', annotationDate: 'd', comment: 'c' }] };
    const f = check.run(sbom).find(r => r.message.includes('type'));
    assert.equal(f.severity, 'warning');
  });

  it('handles no annotations', () => {
    assert.equal(check.run({}).length, 0);
  });

  it('flags multiple missing fields', () => {
    const sbom = { annotations: [{}] };
    assert.ok(check.run(sbom).length >= 3);
  });
});
