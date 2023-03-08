function formatResult(result) {
  const rules = [];
  const results = [];

  for (const check of result.checks) {
    rules.push({
      id: check.id,
      name: check.name,
      shortDescription: { text: check.name },
      defaultConfiguration: { level: 'note' }
    });

    for (const f of check.findings) {
      results.push({
        ruleId: check.id,
        level: sarifLevel(f.severity),
        message: { text: f.message },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: result.file }
          }
        }]
      });
    }
  }

  const sarif = {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'bomprobe',
          version: require('../../package.json').version,
          rules
        }
      },
      results
    }]
  };

  return JSON.stringify(sarif, null, 2);
}

function sarifLevel(severity) {
  if (severity === 'error') return 'error';
  if (severity === 'warning') return 'warning';
  return 'note';
}

module.exports = { formatResult };
