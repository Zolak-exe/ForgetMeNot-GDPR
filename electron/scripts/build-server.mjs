import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const electronDir = path.resolve(__dirname, '..');
const projectRoot = path.resolve(electronDir, '..');

await rm(path.join(electronDir, 'server.bundle.cjs'), { force: true });
await rm(path.join(electronDir, 'public'), { recursive: true, force: true });

await build({
  entryPoints: [path.join(projectRoot, 'src', 'server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: path.join(electronDir, 'server.bundle.cjs'),
  external: ['electron'],
  banner: { js: '// auto-generated bundle — do not edit' },
  logLevel: 'info',
  minify: false,
});

await mkdir(path.join(electronDir, 'public'), { recursive: true });
await cp(path.join(projectRoot, 'public'), path.join(electronDir, 'public'), { recursive: true });

console.log('\n✓ Server bundled to electron/server.bundle.cjs');
console.log('✓ public/ copied to electron/public/');
