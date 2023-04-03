let enabled = !process.env.NO_COLOR && process.stdout.isTTY !== false;

function disable() { enabled = false; }
function enable() { enabled = true; }

function red(s) { return enabled ? `\x1b[31m${s}\x1b[0m` : s; }
function yellow(s) { return enabled ? `\x1b[33m${s}\x1b[0m` : s; }
function green(s) { return enabled ? `\x1b[32m${s}\x1b[0m` : s; }
function blue(s) { return enabled ? `\x1b[34m${s}\x1b[0m` : s; }
function dim(s) { return enabled ? `\x1b[2m${s}\x1b[0m` : s; }
function bold(s) { return enabled ? `\x1b[1m${s}\x1b[0m` : s; }

module.exports = { red, yellow, green, blue, dim, bold, disable, enable };
