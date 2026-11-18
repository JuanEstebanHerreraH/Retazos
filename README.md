# Retazos · Edición CABA

**Una web para recorrer Buenos Aires a través de su papelería.**

Retazos convierte fachadas, carteles y detalles de La Boca, Palermo, San Telmo y Caballito en libretas, kits, totes y un pasaporte para coleccionar barrios. La web conecta la colección con los recorridos que la inspiraron.

**[Visitar la web](https://retazoscaba.vercel.app/) · [Instagram](https://www.instagram.com/retazos_ar/)**

## Participación

**Desarrollo web:** [Juan Esteban Herrera Herrera](https://github.com/JuanEstebanHerreraH). Implementación de las páginas, adaptación a distintos tamaños de pantalla e interacciones en HTML, CSS y JavaScript.

**Diseño e identidad visual:** [Evelin Standke](https://www.linkedin.com/in/evelin-standke-624773318/). La identidad y los recursos gráficos pertenecen al proyecto; el repositorio público conserva el código y la documentación.

## Qué puedes explorar

- Inicio con carrusel de barrios, navegación con teclado y gestos táctiles.
- Cuatro recorridos con paletas, lugares de interés y productos.
- Catálogo con consultas por Instagram.
- Animaciones de entrada, parallax y transiciones entre páginas en navegadores compatibles.
- Diseño para escritorio, tablet y celular, con foco visible y enlace para saltar al contenido.

| Barrio | Recorrido |
| --- | --- |
| [La Boca](https://retazoscaba.vercel.app/la-boca.html) | Chapas, color e identidad portuaria. |
| [Palermo](https://retazoscaba.vercel.app/palermo.html) | Jacarandás, parques y el planetario. |
| [San Telmo](https://retazoscaba.vercel.app/san-telmo.html) | Toldos, adoquines e historia. |
| [Caballito](https://retazoscaba.vercel.app/caballito.html) | Canje, veleta y tranvía. |

## Una decisión de implementación

La web utiliza **HTML, CSS y JavaScript sin dependencias de aplicación**. Las páginas comparten los estilos de barrio y las interacciones, y mantienen su contenido en HTML. Esto permite ajustar cada composición sin incorporar un framework ni un servidor de aplicación.

## Alcance actual

La tienda deriva las consultas a Instagram: no integra pagos ni inventario. El formulario de novedades valida el correo localmente y aún necesita un servicio de envío; no guarda ni transmite direcciones.

La preferencia de movimiento reducido desactiva transiciones, entradas, parallax y desplazamiento suave; la franja conserva su movimiento continuo. El bloqueo de arrastre y menú de imágenes dificulta la copia casual, pero no impide capturas ni el acceso a recursos públicos.

<details>
<summary><strong>Desarrollo local, recursos y publicación</strong></summary>

### Código y recursos visuales

Las fotografías, ilustraciones, vectores, logos, tipografías, archivos de diseño y referencias se conservan por separado y están excluidos mediante `.gitignore`. El README tampoco incorpora imágenes de la marca: la vista completa está en la web publicada.

Para reproducir el sitio completo se necesita la copia autorizada de `img/` y `fuentes/`, respetando sus rutas y licencias. No uses `git add -f` ni subas archivos comprimidos con esos recursos.

### Trabajar con el proyecto

1. Clona el repositorio y consigue los recursos por el canal autorizado.
2. Coloca `img/` y `fuentes/` en la raíz.
3. Abre `index.html` o usa un servidor estático local.
4. Comprueba las cinco páginas, el menú móvil, el carrusel y los enlaces antes de publicar.

Los textos están en cada HTML; los estilos compartidos en `css/barrios.css`, y las interacciones en `js/main.js`. La escala se ajusta en `css/escala.css` y el movimiento en `js/movimiento.js`.

### Preparar la publicación

`vercel.json` configura `node scripts/build-static.mjs` como comando de construcción y `public/` como salida. El script utiliza los recursos locales autorizados o los ya servidos por el sitio publicado. Si falta un recurso requerido, la preparación falla para evitar una entrega incompleta.

La carpeta `public/` está ignorada por Git. Los cambios de documentación no requieren subir imágenes. Para incorporar recursos nuevos se necesita la copia autorizada o un origen aprobado del proyecto.

</details>
