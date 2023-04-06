const { parsePurl } = require('./purl');

const REGISTRY_URLS = {
  npm: name => `https://www.npmjs.com/package/${name}`,
  pypi: name => `https://pypi.org/project/${name}`,
  maven: (name, ns) => ns ? `https://mvnrepository.com/artifact/${ns}/${name}` : null,
  gem: name => `https://rubygems.org/gems/${name}`,
  nuget: name => `https://www.nuget.org/packages/${name}`,
  cargo: name => `https://crates.io/crates/${name}`,
  golang: (name, ns) => ns ? `https://pkg.go.dev/${ns}/${name}` : null,
  composer: (name, ns) => ns ? `https://packagist.org/packages/${ns}/${name}` : null
};

function enrichPurl(purl) {
  const parsed = parsePurl(purl);
  if (!parsed) return null;

  const urlFn = REGISTRY_URLS[parsed.type];
  const registryUrl = urlFn ? urlFn(parsed.name, parsed.namespace) : null;

  return {
    ...parsed,
    registryUrl,
    qualifiedName: parsed.namespace ? `${parsed.namespace}/${parsed.name}` : parsed.name
  };
}

function enrichComponents(components) {
  return components.map(c => {
    if (!c.purl) return { ...c, enriched: null };
    return { ...c, enriched: enrichPurl(c.purl) };
  });
}

module.exports = { enrichPurl, enrichComponents, REGISTRY_URLS };
