const crypto = require('crypto');
const fs = require('fs');

// Load .env file manually (no external dependencies)
if (fs.existsSync('.env')) {
  fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx < 0) return;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  });
}

const password = process.env.DASHBOARD_PASSWORD;
if (!password) {
  console.error('ERROR: DASHBOARD_PASSWORD environment variable is not set.');
  console.error('  - Vercel: set it in Project Settings > Environment Variables');
  console.error('  - Local:  create a .env file with DASHBOARD_PASSWORD=yourpassword');
  process.exit(1);
}

// Cache version: YYYYMMDD based on build date
const now = new Date();
const cacheVersion = [
  now.getUTCFullYear(),
  String(now.getUTCMonth() + 1).padStart(2, '0'),
  String(now.getUTCDate()).padStart(2, '0'),
].join('');

const pwHash = crypto.createHash('sha256').update(password).digest('hex');

// Build index.html
const indexTpl = fs.readFileSync('index.template.html', 'utf8');
const indexOut = indexTpl.replace("'__PASSWORD_HASH__'", `'${pwHash}'`);
fs.writeFileSync('index.html', indexOut);
console.log('✓ Built index.html');

// Build sw.js
const swTpl = fs.readFileSync('sw.template.js', 'utf8');
const swOut = swTpl.replace('__CACHE_VERSION__', cacheVersion);
fs.writeFileSync('sw.js', swOut);
console.log(`✓ Built sw.js  (cache: juku-dashboard-${cacheVersion})`);
