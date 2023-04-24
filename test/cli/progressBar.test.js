const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createProgressBar } = require('../../src/cli/progressBar');

describe('progress bar', () => {
  it('renders initial state', () => {
    const bar = createProgressBar(10);
    const output = bar.render();
    assert.ok(output.includes('0%'));
    assert.ok(output.includes('0/10'));
  });

  it('increments correctly', () => {
    const bar = createProgressBar(4);
    bar.increment();
    const output = bar.render();
    assert.ok(output.includes('25%'));
    assert.ok(output.includes('1/4'));
  });

  it('updates to specific step', () => {
    const bar = createProgressBar(10);
    bar.update(5);
    assert.ok(bar.render().includes('50%'));
  });

  it('completes at 100%', () => {
    const bar = createProgressBar(10);
    const output = bar.complete();
    assert.ok(output.includes('100%'));
    assert.ok(output.includes('10/10'));
  });

  it('clamps to total', () => {
    const bar = createProgressBar(5);
    bar.update(999);
    assert.ok(bar.render().includes('5/5'));
  });

  it('uses custom prefix', () => {
    const bar = createProgressBar(1, { prefix: 'Scanning' });
    assert.ok(bar.render().includes('Scanning'));
  });

  it('handles zero total', () => {
    const bar = createProgressBar(0);
    assert.ok(bar.render().includes('100%'));
  });
});
