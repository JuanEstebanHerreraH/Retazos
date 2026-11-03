# Retazos · Edición CABA — página web

Web de una sola página armada a partir de la maqueta final **"RETAZOS - Página Web"** (mesa de 1440 × 8454 px).
Está hecha con **HTML, CSS y JavaScript sin dependencias**: no hay que instalar nada ni compilar. Sirve tal cual para **GitHub Pages** o **Vercel**.

- **Escritorio (1200 px o más):** es la maqueta exacta. Se comparó píxel a píxel contra el JPG de referencia a 1440 px: todos los elementos caen en el mismo lugar (diferencias de 0 a 1 px). En pantallas más chicas o más grandes la composición se escala entera, así que se ve igual en 1280, 1440 o 1920.
- **Tablet y celular (menos de 1200 px):** las secciones se reordenan en columna siguiendo la propuesta responsive de la entrega (`02_responsive.md`). No se esconde contenido; solo se reducen decorativos.

---

## Verla en tu computadora

Doble clic en `index.html`. Funciona en Chrome, Safari, Firefox y Edge actualizados.

> Si abrís la consola del navegador vas a ver un aviso sobre la "precarga" de las fuentes: pasa solo al abrir el archivo directo desde la compu. Publicada no aparece y la página se ve igual.

---

## Publicar en GitHub Pages

1. Entrá a [github.com](https://github.com) y creá un repositorio nuevo, **público**, por ejemplo `retazos-web`.
2. En el repositorio: **Add file → Upload files** y arrastrá **todo lo que está adentro de esta carpeta** (`index.html`, `css`, `js`, `img`, `fuentes`, `README.md`). Tiene que quedar `index.html` en la raíz del repositorio, no adentro de otra carpeta. Confirmá con **Commit changes**.
3. Andá a **Settings → Pages**. En *Build and deployment* elegí **Source: Deploy from a branch**, **Branch: main** y carpeta **/ (root)**. Guardá.
4. En uno o dos minutos la web queda en `https://TU-USUARIO.github.io/retazos-web/`.

El archivo oculto `.nojekyll` es opcional (le indica a GitHub que no procese la carpeta). Si no se sube porque tu compu no muestra archivos ocultos, no pasa nada.

## Publicar en Vercel

1. Subí la carpeta a un repositorio de GitHub (pasos 1 y 2 de arriba).
2. En [vercel.com](https://vercel.com): **Add New → Project**, importá el repositorio.
3. *Framework Preset*: **Other**. No hace falta comando de build ni carpeta de salida. **Deploy**.

Todas las rutas son relativas, así que funciona igual en la raíz de un dominio o en una subcarpeta.

**Después de publicar (opcional):** en `index.html`, cambiá `content="img/comun/og-retazos.jpg"` de la etiqueta `og:image` por la dirección completa (por ejemplo `https://TU-USUARIO.github.io/retazos-web/img/comun/og-retazos.jpg`). Es la imagen que aparece al compartir el link por WhatsApp o redes.

---

## Cómo está hecha (para editar)

```
index.html          estructura y textos de toda la página
css/estilos.css     colores, tipografías, desktop y responsive
css/recortes.css    bordes rasgados de las fotos (generado desde las máscaras de la maqueta)
js/main.js          carrusel, menú del celular y formulario
img/                imágenes por sección (WebP y SVG)
fuentes/            Cairo (licencia OFL) y Brasilero 2018 Free
```

- **Textos:** se editan directo en `index.html`. Cada texto tiene en su `style` la posición de la maqueta (`--x`, `--y`, en px de la mesa de 1440). Si un texto cambia de largo, en escritorio queda en el mismo punto de partida; en celular fluye solo.
- **Posiciones:** `--x`, `--y`, `--w`, `--h` y `--r` (giro en grados) son las medidas de la maqueta, relativas al borde superior de cada sección. Mover algo 10 px en la maqueta = sumarle 10 al número.
- **Colores:** variables al principio de `css/estilos.css` (`--rosa`, `--amarillo`, `--marron`, etc.), iguales a `tokens.css` de la entrega.
- **Fotos:** son las que están incrustadas en la maqueta, con el mismo tratamiento, exportadas a WebP. Las máscaras de retazo están en `css/recortes.css`; no hace falta tocarlas.

### Interacciones

- **Carrusel de barrios:** flechas, clic en las miniaturas, clic en un slide vecino, teclas ← → y deslizar con el dedo. Da la vuelta (de Caballito pasa a La Boca). Sin autoplay.
- **Links del pie "La Boca / Palermo / San Telmo / Caballito":** bajan al carrusel y muestran ese barrio.
- **Menú del celular:** botón de tres líneas, se cierra con Esc o al elegir una sección.
- **Newsletter:** valida el mail al enviar y muestra la confirmación en el lugar del formulario. **Todavía no envía datos a ningún lado** (ver "A definir").
- **Movimiento reducido:** si la persona lo pide en su sistema, se apagan las animaciones.

---

## Lo que agregué porque faltaba en la maqueta

La entrega marcaba estas piezas como faltantes. Las completé con el mismo sistema para que el carrusel funcione con los cuatro barrios:

| Qué | Cómo lo resolví |
|---|---|
| **Slide de San Telmo** | Misma estructura que La Boca (el borde blanco rasgado y la máscara están girados 180° para que no se repita el dibujo). Foto: esquina de Plaza Dorrego, con el tratamiento "película" recreado a partir de las otras fotos tratadas. |
| **Color del slide de San Telmo** | Terracota de la tapa de San Telmo (es el 53 % de la tapa). Ver abajo. |
| **Elemento de Palermo y de San Telmo** | Puntos (Palermo) y toldo (San Telmo) de la propuesta anterior del sistema, que venían en la entrega como opción. Solo se ven al pasar a esos barrios. |
| **Nombre del slide de Caballito** | Agregado "caballito" en Brasilero, blanco, igual que los otros. |
| **Mensajes del formulario** | Error: "Revisá el mail: parece que le falta algo." Confirmación: "¡Listo! Te avisamos cuando salga la próxima edición." Se cambian en `js/main.js`. |

### Color nuevo: San Telmo · fondo slide

| Formato | Valor |
|---|---|
| HEX | **#A54C24** |
| RGB | 165, 76, 36 |
| HSB | 19°, 78 %, 65 % |
| CMYK | 7, 73, 92, 36 (Coated FOGRA39, la misma conversión que dan La Boca, Palermo y Caballito en la paleta de la entrega) |
| Contraste con texto blanco | 5,7 : 1 (pasa AA) |

Colores de los elementos agregados (vienen de la propuesta anterior): puntos de Palermo **#AD67A0** (RGB 173, 103, 160 · CMYK 30, 67, 0, 13) y toldo de San Telmo **#A9BCAF** (RGB 169, 188, 175 · CMYK 40, 17, 33, 2).

Si preferís sacar los elementos agregados de Palermo y San Telmo, borrá en `index.html` las dos líneas `<img ... src="img/barrios/elemento-palermo.svg">` y `elemento-san-telmo.svg`.

---

## A definir (no está en la maqueta)

| Elemento | Hoy lleva a | Falta |
|---|---|---|
| Navegación y botón "Ver la edición" | anclas a cada sección | páginas propias, si se diseñan |
| "Ver barrio" | al carrusel | páginas de barrio |
| Fichas de la tienda, "Ver toda la tienda", buscar y bolsa | a la sección Tienda | tienda, producto, carrito y buscador |
| Precios | "[precio]" | los valores |
| "Cómo funciona" | queda en Pasaporte | explicación del pasaporte |
| "Cómo llegar" | queda en Ferias | dirección del Galpón La Costura (por ejemplo, link a Google Maps) |
| "@retazos", Instagram y TikTok | sin destino | URLs de las cuentas |
| Newsletter | solo valida | servicio de envío (Mailchimp, Brevo, Buttondown, etc.) |
| Envíos, Cambios, Contacto | sin destino | páginas de ayuda |

---

## Tipografía Brasilero 2018 Free: revisar la licencia antes de publicar

El archivo de la fuente dice *"Copyright 2017 Crystian Cruz. All rights reserved."* y no trae licencia adjunta. Al publicar la web en GitHub, el archivo `fuentes/brasilero-2018-free.woff2` queda descargable por cualquiera. Antes de hacerla pública conviene confirmar con el autor (crystiancruz.com) que la versión Free permite uso web; si no, hay que comprar la licencia web de la familia Brasilêro o reemplazarla. Para cambiarla alcanza con reemplazar el archivo y el `@font-face` del principio de `css/estilos.css`.

Cairo tiene licencia SIL Open Font License (`fuentes/cairo-OFL.txt`): se puede usar y publicar sin problema.

---

## Notas

- Las fotos son las de la maqueta: algunas ya se ven por debajo de 1x en escritorio (hero, Caballito, Sobre Retazos), como avisaba la entrega. Con fotos de más resolución se verían más nítidas en pantallas retina; para cambiarlas hay que respetar el mismo recorte.
- Decisiones que la entrega dejaba abiertas y quedaron como en la maqueta: Cairo en Regular 400 en todo el texto, botones con texto de 17 px (contraste 4,0 sobre rosa) y la franja quieta.
