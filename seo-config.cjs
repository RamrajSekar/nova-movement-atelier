const PRODUCTION_ORIGIN = 'https://novamovementatelier.com.au';
const isProductionHost = hostname => ['novamovementatelier.com.au', 'www.novamovementatelier.com.au'].includes(hostname.toLowerCase());

function indexingPolicy(env = process.env) {
  const context = env.CONTEXT;
  const deploymentUrl = context === 'production'
    ? (env.SITE_URL || env.URL || PRODUCTION_ORIGIN)
    : (env.DEPLOY_PRIME_URL || env.URL || env.SITE_URL || PRODUCTION_ORIGIN);
  let productionHost = false;
  try { productionHost = isProductionHost(new URL(deploymentUrl).hostname); } catch {}
  if (env.INDEXING_ENABLED !== undefined && !['true', 'false'].includes(env.INDEXING_ENABLED)) {
    throw Error('INDEXING_ENABLED must be true or false');
  }
  const production = (!context || context === 'production') && productionHost;
  const indexing = production && env.INDEXING_ENABLED !== 'false';
  return { origin: PRODUCTION_ORIGIN, indexing, production };
}

module.exports = { PRODUCTION_ORIGIN, isProductionHost, indexingPolicy };
