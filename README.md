# Retazos · Edición CABA

**Llevate un rincón del barrio.** Papelería con los colores, las texturas y las historias de Buenos Aires.

[Visitar la web](https://retazoscaba.vercel.app/) · [Instagram @retazos_ar](https://www.instagram.com/retazos_ar/)

## El proyecto

Retazos transforma recorridos, fachadas, carteles y detalles de la ciudad en libretas, kits de retazos, totes y un pasaporte para coleccionar barrios. La web presenta la colección y conecta los recorridos de La Boca, Palermo, San Telmo y Caballito.

**Diseño e identidad visual:** [Evelin Standke](https://www.linkedin.com/in/evelin-standke-624773318/).  
**Desarrollo web:** [Juan Esteban Herrera Herrera](https://github.com/JuanEstebanHerreraH).

## Recorrer la edición

| Barrio | Recorrido |
|---|---|
| [La Boca](https://retazoscaba.vercel.app/la-boca.html) | Chapas de colores que se ven desde el puerto. |
| [Palermo](https://retazoscaba.vercel.app/palermo.html) | Jacarandás, parques y un planetario a la vuelta. |
| [San Telmo](https://retazoscaba.vercel.app/san-telmo.html) | Toldos, adoquines y casas que guardan historia. |
| [Caballito](https://retazoscaba.vercel.app/caballito.html) | El barrio del canje, la veleta y el tranvía. |

Cada botón **Ver barrio** abre su recorrido: del barrio al papel, la paleta de colores, los lugares para conocer y los productos. El pie y **Seguí recorriendo** enlazan las cuatro páginas.

## Código público y recursos visuales

Este repositorio contiene el código HTML, CSS y JavaScript y su documentación. Las fotografías, ilustraciones, vectores, logos, tipografías, archivos de diseño y vistas de referencia se conservan por separado y están excluidos mediante `.gitignore`. El README tampoco incorpora imágenes de la marca.

La web publicada mantiene sus imágenes y su diseño. Una descarga de este repositorio contiene únicamente el código: para reproducir la web completa es necesario disponer de la copia autorizada de `img/` y `fuentes/`, con sus rutas y licencias originales. No se sustituyen esas piezas por imágenes ajenas.

## Funcionalidades

- Imágenes sin arrastre nativo y menú contextual de guardado desactivado sobre ellas; los enlaces y gestos del carrusel siguen disponibles.
- Carrusel de barrios con flechas, miniaturas, teclado y gestos táctiles.
- Cuatro recorridos con proceso gráfico, paletas, lugares y productos.
- Franja continua de derecha a izquierda, sin cortes entre vueltas.
- Sección Sobre Retazos y accesos a Instagram desde el usuario, las fotografías y las consultas de productos.
- Disposición para escritorio, tablet y celular, con menú móvil.
- HTML semántico, textos alternativos, foco visible y enlace para saltar al contenido.

## Estructura

```text
Retazos/
├── index.html
├── la-boca.html
├── palermo.html
├── san-telmo.html
├── caballito.html
├── css/
│   ├── estilos.css
│   ├── recortes.css
│   ├── actualizacion.css
│   └── barrios.css
├── js/main.js
├── .gitignore
├── .vercelignore
└── vercel.json
```

**HTML5 · CSS3 · JavaScript**, sin dependencias de aplicación ni compilación. Los textos se editan en cada HTML; los estilos de los barrios se comparten en `css/barrios.css` y las interacciones en `js/main.js`.

## Trabajar con la copia completa

1. Cloná el código y obtené los recursos visuales por el canal autorizado del proyecto.
2. Colocá `img/` y `fuentes/` en la raíz, respetando los nombres existentes.
3. Abrí `index.html` o usá un servidor estático local.
4. Antes de publicar cambios, comprobá que las imágenes y las fuentes estén presentes.

Los recursos siguen en el disco local, pero Git los ignora. No uses `git add -f` sobre ellos ni subas archivos comprimidos que los contengan.

## Publicación

Los cambios de este repositorio no generan despliegues automáticos en Vercel. Para publicar, abrí el proyecto **retazoscaba**, entrá en **Deployments → Create Deployment** y elegí la revisión de código que querés publicar.

El comando `node scripts/build-static.mjs` prepara `public/`: copia el código y utiliza los recursos locales autorizados cuando están presentes. Si faltan, reutiliza los recursos que ya sirve `https://retazoscaba.vercel.app`. Si algún recurso no está disponible, la preparación falla para evitar una publicación incompleta. Las imágenes no se guardan en el repositorio ni se agregan a su historial; `public/` también está ignorado por Git.

Para incorporar imágenes nuevas se necesita la copia completa y autorizada o alojarlas previamente en un origen aprobado del proyecto. La publicación manual con Vercel CLI desde la copia completa también sigue disponible; `.vercelignore` incluye los recursos locales y excluye configuración local, credenciales y copias de seguridad.

GitHub Pages usa publicación mediante Actions; no hay un flujo automático que vuelva a publicar este código sin sus recursos. Las publicaciones existentes se conservan.

## Alcance

La tienda deriva las consultas a Instagram; no incluye pagos ni inventario conectado. El formulario de novedades valida el correo localmente y aún necesita un servicio de envío: no guarda ni transmite direcciones. Los lugares sin fotografía en la entrega original conservan sus tramas.

Con la preferencia de movimiento reducido se desactivan las transiciones y el desplazamiento suave. La franja conserva el movimiento continuo solicitado para esta versión.

El bloqueo de arrastre y del menú de imágenes dificulta la copia casual. No impide capturas de pantalla ni el acceso a recursos públicos mediante las herramientas del navegador.
