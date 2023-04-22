const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { writeFileSync, unlinkSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { createWatcher, formatWatchHeader } = require('../../src/cli/watch');

describe('watch mode', () => {
  const tmpDir = join(__dirname, '..', '..', 'tmp-test-watch');

  it('calls back with parsed SBOM on creation', (t, done) => {
    mkdirSync(tmpDir, { recursive: true });
    const file = join(tmpDir, 'test.json');
    writeFileSync(file, JSON.stringify({ specVersion: '1.5', components: [] }));

    const watcher = createWatcher(file, (err, sbom) => {
      watcher.close();
      assert.equal(err, null);
      assert.equal(sbom.specVersion, '1.5');
      unlinkSync(file);
      done();
    });
  });

  it('calls back with error for invalid JSON', (t, done) => {
    mkdirSync(tmpDir, { recursive: true });
    const file = join(tmpDir, 'bad.json');
    writeFileSync(file, 'not json');

    const watcher = createWatcher(file, (err) => {
      watcher.close();
      assert.ok(err);
      unlinkSync(file);
      done();
    });
  });

  it('formats watch header with timestamp', () => {
    const header = formatWatchHeader('/path/to/sbom.json', '12:00:00');
    assert.ok(header.includes('12:00:00'));
    assert.ok(header.includes('/path/to/sbom.json'));
  });

  it('formats watch header with current time', () => {
    const header = formatWatchHeader('test.json');
    assert.ok(header.includes('test.json'));
    assert.ok(header.startsWith('['));
  });
});
