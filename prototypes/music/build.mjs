import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const dir = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(dir, '../..');
const root = path.dirname(frontend);
const types = { '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp', '.mp3':'audio/mpeg', '.otf':'font/otf', '.ttf':'font/ttf', '.woff2':'font/woff2' };
async function embed(file) {
  return 'data:' + types[path.extname(file)] + ';base64,' + (await readFile(file)).toString('base64');
}
const assetDir = path.join(frontend, 'public/assets');
const projectAssets = (await readdir(assetDir)).filter((name) => /^(icon-|album-|cover-|logo-|seabed|underline|guest|host|video-poster|write-to-air-confirmation|direction-|radio-fragment|studio\.jpg$|portrait-|poster-|book-)/.test(name));
const files = projectAssets.map((name) => path.join(assetDir, name));
const assets = Object.fromEntries(await Promise.all(files.map(async (file) => [path.basename(file), await embed(file)])));
const result = await build({
  entryPoints: [path.join(dir, 'app.tsx')],
  bundle: true, write: false, minify: true, jsx: 'automatic',
  nodePaths: [path.join(frontend, 'node_modules')],
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [{
    name: 'embed-assets',
    setup(builder) {
      builder.onLoad({ filter: /[/]src[/]assets\.ts$/ }, () => ({
        contents: 'const assets=' + JSON.stringify(assets) + ';export function asset(name){return assets[name] || "";}',
        loader: 'js',
      }));
    },
  }],
});
let styles = (await Promise.all(['tokens.css', 'styles.css', 'prototype.css', 'write-to-air.css'].map((name) => readFile(path.join(frontend,'src',name), 'utf8')))).join('\n');
for (const match of [...styles.matchAll(/url\(['"]?(\/fonts\/[^)'"]+)['"]?\)/g)]) {
  styles = styles.replaceAll(match[0], 'url("' + await embed(path.join(frontend, 'public', match[1])) + '")');
}
styles += '\n' + await readFile(path.join(frontend, 'src/music/style.css'), 'utf8');
const html = '<!doctype html><html lang="ru" data-prototype-version="3"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Музыка · Риф FM</title><style>' + styles + '</style></head><body><div id="root"></div><script>' + result.outputFiles[0].text.replaceAll('</script','<\\/script') + '</script></body></html>';
const output = path.join(root, 'music-draft.html');
await writeFile(output, html);
console.log(output);
