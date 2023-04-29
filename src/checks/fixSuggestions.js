const suggestions = {
  'component-name': {
    fix: 'Add a "name" field to each component in your SBOM.',
    tool: 'Most generators populate this automatically. If missing, check your build config.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#components_items_name'
  },
  'component-version': {
    fix: 'Add a "version" field to each component.',
    tool: 'Lock files (package-lock.json, go.sum) are the best source for exact versions.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#components_items_version'
  },
  'component-purl': {
    fix: 'Add a Package URL (purl) to each component.',
    tool: 'Generators like Syft and cdxgen produce purls by default. Trivy requires --format cyclonedx.',
    docs: 'https://github.com/package-url/purl-spec'
  },
  'component-license': {
    fix: 'Add license information using SPDX expressions.',
    tool: 'scancode-toolkit or licensee can detect licenses from source files.',
    docs: 'https://spdx.org/licenses/'
  },
  'component-supplier': {
    fix: 'Add supplier info (name, url) to each component.',
    tool: 'cdxgen populates supplier from npm registry metadata.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#components_items_supplier'
  },
  'component-hash': {
    fix: 'Include SHA-256 hashes for each component.',
    tool: 'Syft and Trivy compute hashes from downloaded artifacts.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#components_items_hashes'
  },
  'component-type': {
    fix: 'Set the component type (library, framework, application, etc).',
    tool: 'Most generators set type to "library" by default.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#components_items_type'
  },
  'dependency-graph': {
    fix: 'Include a dependencies section mapping component refs to their dependencies.',
    tool: 'cdxgen and Syft produce dependency graphs. Some generators require a flag.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#dependencies'
  },
  'metadata-timestamp': {
    fix: 'Add a timestamp to the metadata section.',
    tool: 'All major generators set this automatically.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#metadata_timestamp'
  },
  'metadata-tools': {
    fix: 'Include tool information in metadata showing which generator produced this SBOM.',
    tool: 'All major generators include themselves in the tools section.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#metadata_tools'
  },
  'metadata-author': {
    fix: 'Add author or manufacture info to the metadata section.',
    tool: 'Set the --author flag in your generator or add it post-generation.',
    docs: 'https://cyclonedx.org/docs/1.5/json/#metadata_authors'
  }
};

function getSuggestion(checkId) {
  return suggestions[checkId] || null;
}

function getSuggestions(checkIds) {
  const result = {};
  for (const id of checkIds) {
    const s = suggestions[id];
    if (s) result[id] = s;
  }
  return result;
}

function formatSuggestions(findings) {
  const lines = [];
  const seen = new Set();

  for (const f of findings) {
    const id = f.checkId || f.check;
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const s = suggestions[id];
    if (!s) continue;

    lines.push(`\n${id}:`);
    lines.push(`  Fix: ${s.fix}`);
    lines.push(`  Tip: ${s.tool}`);
    if (s.docs) lines.push(`  Docs: ${s.docs}`);
  }

  return lines.length ? 'Fix suggestions:\n' + lines.join('\n') : '';
}

module.exports = { getSuggestion, getSuggestions, formatSuggestions };
