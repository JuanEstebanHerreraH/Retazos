# Retazos · Edición CABA — página web

**Diseño:** Evelin Standke · **Programación:** Esteban Herrera

Web de una sola página armada a partir de la maqueta final **"RETAZOS - Página Web"** (mesa de 1440 × 8454 px).
Está hecha con **HTML, CSS y JavaScript sin dependencias**: no hay que instalar nada ni compilar. Sirve tal cual para **GitHub Pages** o **Vercel**.

- **Escritorio (1200 px o más):** es la maqueta exacta. Se comparó píxel a píxel contra el JPG de referencia a 1440 px: todos los elementos caen en el mismo lugar (diferencias de 0 a 1 px). En pantallas más chicas o más grandes la composición se escala entera, así que se ve igual en 1280, 1440 o 1920.
- **Tablet y celular (menos de 1200 px):** las secciones se reordenan en columna siguiendo la propuesta responsive de la entrega (`02_responsive.md`). No se esconde contenido; solo se reducen decorativos.

---

## Verla en tu computadora

Doble clic en `index.html`. Funciona en Chrome, Safari, Firefox y Edge actualizados.

> Si abrís la consola del navegador vas a ver un aviso sobre la "precarga" de las fuentes: pasa solo al abrir el archivo directo desde la compu. Publicada no aparece y la página se ve igual.


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
- **Franja "llevate un rincón del barrio" (solo PC):** corre despacio hacia la izquierda, en bucle sin cortes (un ciclo cada 40 s). Se frena al pasar el mouse por encima. La velocidad se cambia en `css/estilos.css` (la animación `franja-scroll`, en el bloque de escritorio).
- **Libretas del hero (solo PC):** las de La Boca y Palermo se levantan y se inclinan un poco al pasar el cursor. Se ajusta en `css/estilos.css`, en las reglas `.hero-libreta`.
- **Newsletter:** valida el mail al enviar y muestra la confirmación en el lugar del formulario. **Todavía no envía datos a ningún lado** (ver "A definir").
- **Movimiento reducido:** si la persona lo pide en su sistema (ajuste del navegador o del teléfono), se apagan todas las animaciones, incluida la franja y el movimiento de las libretas.

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

