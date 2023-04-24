function createProgressBar(total, options = {}) {
  const width = options.width || 30;
  const prefix = options.prefix || 'Checking';
  let current = 0;

  function update(step) {
    current = Math.min(step, total);
    return render();
  }

  function increment() {
    return update(current + 1);
  }

  function render() {
    const pct = total === 0 ? 100 : Math.round((current / total) * 100);
    const filled = total === 0 ? width : Math.round((current / total) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${prefix} [${bar}] ${pct}% (${current}/${total})`;
  }

  function complete() {
    current = total;
    return render();
  }

  return { update, increment, render, complete };
}

module.exports = { createProgressBar };
