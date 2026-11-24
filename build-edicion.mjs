import { get } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { gunzipSync } from 'node:zlib';

// Solo se extraen las versiones para pantalla. El paquete no va al directorio público.
if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
  const blob = await get('retazos-web-2411.json.gz', { access: 'private' });
  if (blob?.statusCode !== 200) throw new Error('No se pudo leer el paquete privado de la edición.');
  const bytes = Buffer.from(await new Response(blob.stream).arrayBuffer());
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== 'ab8c1a5f1fc9e7f7e3559bda7dc46d5f8fef825b8d7127d1ca4db7b0d4a3c31c') {
    throw new Error('El paquete no coincide con la edición del 24 de noviembre.');
  }
  const images = JSON.parse(gunzipSync(bytes));
  for (const [file, contents] of Object.entries(images)) {
    if (!/^img\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:webp|jpg)$/.test(file)) {
      throw new Error('Ruta de imagen inesperada.');
    }
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(contents, 'base64'));
  }
}

await import('./scripts/build-static.mjs');
await copyFile('fotos.css', 'public/fotos.css');
// Los metadatos sociales usan URL absolutas y quedan fuera del rastreo de rutas locales.
await mkdir('public/img/og', { recursive: true });
for (const page of ['inicio', 'la-boca', 'palermo', 'san-telmo', 'caballito']) {
  const file = `img/og/og_${page}_1200x630.jpg`;
  await copyFile(file, `public/${file}`);
}
