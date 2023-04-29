function parseArgs(argv) {
  const args = {
    files: [],
    flags: {}
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === '--' ) {
      args.files.push(...argv.slice(i + 1));
      break;
    }

    if (arg.startsWith('--no-')) {
      args.flags[camelCase(arg.slice(5))] = false;
      i++;
      continue;
    }

    if (arg.startsWith('--')) {
      const key = camelCase(arg.slice(2));
      const next = argv[i + 1];
      if (!next || next.startsWith('-')) {
        args.flags[key] = true;
      } else {
        args.flags[key] = next;
        i++;
      }
      i++;
      continue;
    }

    if (arg.startsWith('-') && arg.length === 2) {
      const next = argv[i + 1];
      if (!next || next.startsWith('-')) {
        args.flags[arg[1]] = true;
      } else {
        args.flags[arg[1]] = next;
        i++;
      }
      i++;
      continue;
    }

    args.files.push(arg);
    i++;
  }

  return args;
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

module.exports = { parseArgs };
