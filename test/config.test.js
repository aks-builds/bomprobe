const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { findConfig, loadConfig, getConfig } = require('../src/config');

describe('config', () => {
  it('returns null when no config file exists', () => {
    const result = findConfig(os.tmpdir());
    assert.equal(result, null);
  });

  it('loads a valid JSON config', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bomprobe-'));
    const configPath = path.join(dir, '.bomproberc');
    fs.writeFileSync(configPath, JSON.stringify({ exclude: ['component-cpe'] }));
    const config = loadConfig(configPath);
    assert.deepEqual(config.exclude, ['component-cpe']);
    fs.rmSync(dir, { recursive: true });
  });

  it('returns empty object for invalid JSON', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bomprobe-'));
    const configPath = path.join(dir, '.bomproberc');
    fs.writeFileSync(configPath, 'not json');
    const config = loadConfig(configPath);
    assert.deepEqual(config, {});
    fs.rmSync(dir, { recursive: true });
  });

  it('finds config in ancestor directory', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bomprobe-'));
    const sub = path.join(dir, 'a', 'b');
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(dir, '.bomproberc'), '{}');
    const found = findConfig(sub);
    assert.equal(found, path.join(dir, '.bomproberc'));
    fs.rmSync(dir, { recursive: true });
  });

  it('getConfig returns empty object when nothing found', () => {
    const config = getConfig(os.tmpdir());
    assert.deepEqual(config, {});
  });
});
