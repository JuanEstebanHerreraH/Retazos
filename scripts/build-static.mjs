/* Publica el código y reutiliza los recursos visuales de la web existente.
   Los recursos y el directorio generado permanecen fuera de Git. */
import { readdir, readFile, writeFile, mkdir, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, 'public');
const assetOrigin = 'https://retazoscaba.vercel.app';
const remoteOnly = process.argv.includes('--remote-assets');
if (path.dirname(output) !== root || path.basename(output) !== 'public') {
  throw new Error('El directorio de publicación debe estar dentro de este proyecto.');
}
try {
  if ((await lstat(output)).isSymbolicLink()) throw new Error('public no puede ser un enlace simbólico.');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
// Únicamente se limpia el directorio generado y verificado arriba.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const sourceFiles = (await readdir(root)).filter(name => name.endsWith('.html'));
for (const folder of ['css', 'js']) {
  for (const name of await readdir(path.join(root, folder))) {
    if (name.endsWith(folder === 'css' ? '.css' : '.js')) sourceFiles.push(`${folder}/${name}`);
  }
}
const assets = new Set(['fuentes/cairo-OFL.txt']);
function inspectAsset(raw, sourceFile) {
  if (/^(?:data:|https?:|\/\/|#)/i.test(raw)) return;
  const url = new URL(raw, `https://retazos.invalid/${sourceFile}`);
  const relative = decodeURIComponent(url.pathname).replace(/^\//, '');
  if (!/^(?:img|fuentes)\//.test(relative)) return;
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(root + path.sep)) throw new Error(`Ruta fuera del proyecto: ${relative}`);
  assets.add(relative);
}
for (const relative of sourceFiles) {
  const text = await readFile(path.join(root, relative), 'utf8');
  for (const match of text.matchAll(/(?:src|href|content)\s*=\s*["']([^"']+)["']/gi)) {
    inspectAsset(match[1], relative);
  }
  for (const match of text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) {
    inspectAsset(match[1], relative);
  }
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, text);
}

async function getAsset(relative) {
  if (!remoteOnly) {
    try { return await readFile(path.join(root, relative)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const url = new URL(relative, assetOrigin + '/');
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${relative}: HTTP ${response.status}`);
  if (new URL(response.url).origin !== assetOrigin) throw new Error(`Destino inesperado para ${relative}`);
  return Buffer.from(await response.arrayBuffer());
}
function validateAsset(relative, bytes) {
  if (!bytes.length) throw new Error(`${relative}: recurso vacío`);
  const start = bytes.subarray(0, 4096).toString('utf8');
  if (/^\s*(?:<!doctype html|<html\b)/i.test(start)) throw new Error(`${relative}: se recibió una página HTML`);
  const ext = path.extname(relative).toLowerCase();
  if (ext === '.svg' && !/<svg(?:\s|>)/i.test(start)) throw new Error(`${relative}: SVG inválido`);
  if (ext === '.webp' && (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP')) {
    throw new Error(`${relative}: WebP inválido`);
  }
  if (ext === '.woff2' && bytes.toString('ascii', 0, 4) !== 'wOF2') throw new Error(`${relative}: fuente inválida`);
}
const pending = [...assets].sort();
const errors = [];
let cursor = 0;
let totalBytes = 0;
async function worker() {
  while (cursor < pending.length) {
    const relative = pending[cursor++];
    try {
      const bytes = await getAsset(relative);
      validateAsset(relative, bytes);
      const destination = path.join(output, relative);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
      totalBytes += bytes.length;
    } catch (error) { errors.push(error.message); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
if (errors.length) {
  throw new Error(`No se publica una web incompleta:\n${errors.join('\n')}`);
}
console.log(`Publicación preparada: ${sourceFiles.length} archivos de código, ${pending.length} recursos y ${totalBytes} bytes de recursos.`);
