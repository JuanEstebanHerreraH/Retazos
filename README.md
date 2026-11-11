<p align="center">
  <img src="img/comun/logo-retazos.svg" width="240" alt="Retazos">
</p>

<h1 align="center">Llevate un rincón del barrio</h1>

<p align="center">Papelería con los colores, las texturas y las historias de Buenos Aires.<br>Edición CABA · La Boca · Palermo · San Telmo · Caballito</p>

<p align="center">
  <a href="https://retazoscaba.vercel.app/">Ver la web</a> ·
  <a href="https://www.instagram.com/retazos_ar/">@retazos_ar</a> ·
  <a href="#recorrer-los-barrios">Recorrer los barrios</a> ·
  <a href="#abrir-el-proyecto">Abrir el proyecto</a>
</p>

![Identidad visual de Retazos: papeles rasgados, casas de colores y libretas de barrio](img/v2-preview-inicio.webp)

## Una ciudad, cuatro formas de llevarla con vos

Retazos transforma recorridos, fachadas, carteles y detalles de la ciudad en libretas, kits de retazos, totes y un pasaporte para coleccionar barrios. La web conserva esa identidad de collage con fotografías, sellos, cintas y bordes de papel.

**Diseño e identidad visual:** Evelin Standke.  
**Desarrollo web:** Juan Esteban Herrera Herrera — [GitHub](https://github.com/JuanEstebanHerreraH).

## Recorrer los barrios

Cada botón **Ver barrio** abre una página con su historia visual: de la calle a la trama y a la tapa, su paleta de colores, tres lugares para recorrer y los productos de la colección. El pie de página y la sección **Seguí recorriendo** conectan los cuatro recorridos.

| La Boca | Palermo |
|:---:|:---:|
| [![La Boca](img/v2-preview-la-boca.webp)](https://retazoscaba.vercel.app/la-boca.html) | [![Palermo](img/v2-preview-palermo.webp)](https://retazoscaba.vercel.app/palermo.html) |
| Chapas de colores que se ven desde el puerto. | Jacarandás, parques y un planetario a la vuelta. |
| **San Telmo** | **Caballito** |
| [![San Telmo](img/v2-preview-san-telmo.webp)](https://retazoscaba.vercel.app/san-telmo.html) | [![Caballito](img/v2-preview-caballito.webp)](https://retazoscaba.vercel.app/caballito.html) |
| Toldos, adoquines y casas que guardan historia. | El barrio del canje, la veleta y el tranvía. |

*Las imágenes de esta documentación son vistas del diseño V2 suministrado por el proyecto.*

## Lo que podés explorar

- **Carrusel de barrios:** flechas, miniaturas, teclado y gestos táctiles; sin avance automático.
- **Cuatro páginas de barrio:** fotografías, proceso gráfico, paletas, lugares y productos.
- **Franja en movimiento:** recorrido continuo de derecha a izquierda, con dos bloques idénticos que forman un bucle sin cortes.
- **Sobre Retazos:** composición renovada con las postales y los recortes del diseño V2.
- **Instagram conectado:** el usuario, las fotos del mosaico, el pie y las consultas de productos abren **@retazos_ar**.
- **Diseño adaptable:** composición de escritorio y disposición específica para tablet y celular, con navegación móvil y lugares que se pueden deslizar.
- **Accesibilidad:** HTML semántico, textos alternativos, foco visible, enlace para saltar al contenido y menú con estado anunciado.

## Hecho con

**HTML5 · CSS3 · JavaScript**. Sin dependencias, instalación ni compilación. Imágenes WebP y SVG; tipografías Cairo y Brasilero 2018 Free incluidas en el proyecto.

```text
Retazos/
├── index.html              Inicio y Edición CABA
├── la-boca.html            Recorrido de La Boca
├── palermo.html            Recorrido de Palermo
├── san-telmo.html          Recorrido de San Telmo
├── caballito.html          Recorrido de Caballito
├── css/
│   ├── estilos.css         Identidad, inicio y navegación
│   ├── recortes.css        Máscaras de papel rasgado
│   ├── actualizacion.css   Ajustes del inicio V2
│   └── barrios.css         Componentes de los cuatro recorridos
├── js/main.js              Carrusel, menú y validación del formulario
├── img/                    Recursos visuales y piezas V2 en WebP
└── fuentes/                Fuentes locales y sus archivos de licencia
```

## Abrir el proyecto

1. Descargá el repositorio o clonalo.
2. Abrí **index.html** en un navegador actualizado.
3. Para publicarlo, usá la raíz del repositorio como sitio estático en Vercel o GitHub Pages. No requiere comando de construcción.

Los textos se editan en cada HTML. Los estilos de los barrios están centralizados en **css/barrios.css**; el menú, el carrusel y el formulario comparten **js/main.js**. La duración de la franja se ajusta en la animación **franja-scroll** de **css/estilos.css**.

## Alcance de esta versión

La tienda presenta la colección y deriva las consultas a Instagram. No incluye carrito, pagos ni inventario conectado. El formulario de novedades valida el correo localmente y aún necesita un servicio de envío; no guarda ni transmite direcciones. Algunas fotografías de lugares están pendientes en la entrega de diseño y se representan con sus tramas, sin sustituirlas por fotos ajenas.

Con la preferencia de movimiento reducido se desactivan las transiciones y el desplazamiento suave. La franja conserva el movimiento continuo solicitado para esta versión.

---

<p align="center"><a href="https://retazoscaba.vercel.app/">Recorré Retazos</a> · <a href="https://www.instagram.com/retazos_ar/">Encontranos en Instagram</a><br><em>Un barrio también se puede llevar en papel.</em></p>
