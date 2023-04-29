const { writeFileSync } = require('node:fs');

function writeOutput(content, options = {}) {
  const { output, quiet } = options;

  if (output) {
    writeFileSync(output, content);
    if (!quiet) {
      process.stderr.write(`Report written to ${output}\n`);
    }
    return;
  }

  if (!quiet) {
    process.stdout.write(content);
    if (!content.endsWith('\n')) {
      process.stdout.write('\n');
    }
  }
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const sec = (ms / 1000).toFixed(1);
  return `${sec}s`;
}

function formatCount(n, singular, plural) {
  plural = plural || `${singular}s`;
  return `${n} ${n === 1 ? singular : plural}`;
}

module.exports = { writeOutput, formatDuration, formatCount };
