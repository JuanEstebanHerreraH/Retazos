/* =========================================================
   RETAZOS · movimiento
   - Las piezas entran cuando su sección aparece en pantalla:
     títulos palabra por palabra (o letra por letra), textos corridos palabra
     por palabra, papeles que se pegan, sellos que se estampan, flechas que
     se dibujan y círculos que brotan uno por uno.
   - Todo sigue moviéndose un poco: libretas, retazos y círculos flotan,
     siguen al mouse y tienen parallax al hacer scroll.
   - La franja se acelera con el scroll y retrocede si subís.
   - El carrusel avanza solo mientras lo mirás (se frena si lo tocás).
   - Cursor con un retazo rosa, botones magnéticos, costura de progreso,
     menú que marca la sección y botón para volver arriba.
   Con "reducir movimiento" solo quedan los fundidos de entrada, la costura
   y el botón: nada flota, se desplaza ni sigue al mouse.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var escritorio = window.matchMedia('(min-width: 1200px)');
  var conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var listo = function () { root.classList.remove('rv-cargando'); };
  var cada = function (sel, fn, base) { Array.prototype.forEach.call((base || document).querySelectorAll(sel), fn); };

  /* ---------- Escala: cuánto estirar las bandas para llegar a los bordes ---------- */
  var pagina = document.querySelector('.pagina');
  var seccion = document.querySelector('.pagina .seccion');
  var estirar = function () {
    if (!pagina || !seccion) { return; }
    var caja = seccion.getBoundingClientRect().width;
    var k = escritorio.matches && caja ? pagina.clientWidth / caja : 1;
    pagina.style.setProperty('--estirar', (k * 1.004).toFixed(4));
  };
  estirar();
  window.addEventListener('resize', estirar);

  /* ---------- Costura de progreso y volver arriba ---------- */
  var costura = document.createElement('div');
  costura.className = 'rv-costura';
  costura.setAttribute('aria-hidden', 'true');
  document.body.appendChild(costura);

  var arriba = document.createElement('button');
  arriba.type = 'button';
  arriba.className = 'rv-arriba';
  arriba.setAttribute('aria-label', 'Volver arriba');
  arriba.innerHTML = '<span aria-hidden="true">↑</span>';
  arriba.tabIndex = -1;
  arriba.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  document.body.appendChild(arriba);

  /* ---------- Menú: marca la sección en la que estás ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var porId = {};
    navLinks.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });
    var ioNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var link = porId[e.target.id];
        if (!link) { return; }
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('activo', a === link); });
        } else if (link.classList.contains('activo')) {
          link.classList.remove('activo');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(porId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) { ioNav.observe(s); }
    });
  }

  if (!('IntersectionObserver' in window)) {
    listo();
    return;
  }

  root.classList.add('con-movimiento');

  /* ---------- Partir textos en palabras o letras ---------- */
  // Devuelve el índice siguiente, para que un párrafo hecho de varias líneas
  // numere sus palabras de corrido.
  var partir = function (el, modo, inicio) {
    var i = inicio || 0;
    if (el.getAttribute('data-rv-partido') || el.children.length) { return -1; }
    var texto = el.textContent;
    if (!texto.trim()) { return -1; }
    el.setAttribute('data-rv-partido', '1');
    var lector = document.createElement('span');
    lector.className = 'sr-only';
    lector.textContent = texto;
    var visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    texto.split(/(\s+)/).forEach(function (trozo) {
      if (!trozo) { return; }
      if (/^\s+$/.test(trozo)) { visible.appendChild(document.createTextNode(trozo)); return; }
      var palabra = document.createElement('span');
      if (modo === 'letra') {
        palabra.className = 'rv-pal-l';
        Array.from(trozo).forEach(function (letra) {
          var l = document.createElement('span');
          l.className = 'rv-letra';
          l.textContent = letra;
          l.style.setProperty('--i', i++);
          l.style.setProperty('--rr', (Math.random() * 36 - 18).toFixed(1) + 'deg');
          palabra.appendChild(l);
        });
      } else {
        palabra.className = 'rv-palabra';
        palabra.textContent = trozo;
        palabra.style.setProperty('--i', i++);
      }
      visible.appendChild(palabra);
    });
    el.textContent = '';
    el.appendChild(lector);
    el.appendChild(visible);
    el.classList.add('rv-t');
    if (modo === 'suave') { el.classList.add('rv-t-suave'); }
    return i;
  };

  /* ---------- Qué entra y cómo ---------- */
  var GRUPOS = [
    // [selector, efecto]; el primero que toma una pieza se la queda
    ['.t-hero, .t-gigante, .b-hero-tarjeta h1', 'letras'],
    ['.t-barrios, .t-metodo, .t-tienda, .t-pasaporte, .t-ferias, .t-sobre, .t-instagram, .t-pie, .t-slide,' +
     '.b-seccion h2, .b-paleta-titulo, .b-otro h3', 'palabras'],
    // párrafos: todas sus líneas entran juntas, palabra por palabra
    ['.pasaporte-texto, .sobre-texto, .ig-texto', 'parrafo'],
    ['.t-bajada, .t-paso, .t-producto, .t-info, .t-dato, .b-bajada, .b-hero-tarjeta p, .b-pasos li > p,' +
     '.b-producto h3, .b-producto > p', 'texto'],
    ['.sello', 'sello'],
    ['.burbuja', 'burbuja'],
    ['.metodo-flecha', 'trazo'],
    ['.hero-retazo-rosa, .hero-retazo-celeste', 'izq'],
    ['.hero-retazo-amarillo, .hero-retazo-marron', 'der'],
    ['.hero-foto > img, .ferias-foto > img', 'zoom'],
    [escritorio.matches ? '.cabecera .logo, .cabecera .t-nav, .cabecera .icono, .cabecera .t-barra' : '.cabecera .logo', 'bajar'],
    ['.t-paso-n, .t-nota, .t-precio, .t-link:not(.newsletter-mensaje), .t-etiqueta,' +
     '.t-col, .t-item, .campo-mail, .boton, .t-ver,' +
     '.b-migas, .b-boton, .b-tienda-link, .b-paleta li, .b-consultar, .b-producto img, .b-otro', 'subir'],
    ['.hero-tarjeta, .hero-cinta, .hero-libreta, .hero-libreta-sombra, .hero-circulo, .producto-visual,' +
     '.pasaporte-libro, .estampilla, .ferias-cartel, .ferias-afiche, .ferias-ficha, .ferias-circulo,' +
     '.postal, .mosaico-item, .ig-circulo, .ig-papel, .paso-img, .carrusel-ventana, .mini, .flecha,' +
     '.b-paso-imagen, .b-estampilla, .b-hero-circulo, .b-hero-tarjeta', 'pegar']
  ];
  var EXTRA = { sello: 380, trazo: 250, izq: 150, der: 250, zoom: 0, burbuja: 200 };

  var tomadas = new Set();
  var unidades = [];
  var unidadDe = new Map();

  // En escritorio la mayoría de los grupos (.isla, <li>, <figure>) no tienen caja propia:
  // sus piezas están ubicadas respecto de la sección. Ahí se animan las piezas.
  var piezasDe = function (el) {
    if (!escritorio.matches || el.classList.contains('a') || el.closest('.pagina-barrio .b-contenido')) {
      return [el];
    }
    var piezas = Array.prototype.filter.call(el.querySelectorAll('.a'), function (p) {
      var padre = p.parentElement.closest('.a');
      return !(padre && el.contains(padre)) && !tomadas.has(p);
    });
    return piezas.length ? piezas : [el];
  };

  GRUPOS.forEach(function (g) {
    cada(g[0], function (el) {
      if (tomadas.has(el)) { return; }
      tomadas.add(el);
      var efecto = g[1];
      var u = { efecto: efecto, els: [] };

      if (efecto === 'parrafo') {
        var lineas = el.querySelectorAll('.linea');
        var n = 0;
        if (lineas.length) {
          Array.prototype.forEach.call(lineas, function (l) {
            var sig = partir(l, 'suave', n);
            if (sig >= 0) { n = sig; u.els.push(l); tomadas.add(l); }
          });
        } else if (partir(el, 'suave', 0) >= 0) {
          u.els.push(el);
        }
        if (!u.els.length) { return; }
        u.titulo = true;
      } else if (efecto === 'letras' || efecto === 'palabras' || efecto === 'texto') {
        var modo = efecto === 'letras' ? 'letra' : efecto === 'texto' ? 'suave' : 'palabra';
        if (partir(el, modo, 0) < 0) {
          u.efecto = efecto = 'subir';
        } else {
          u.els = [el];
          u.titulo = true;
        }
      }
      if (!u.titulo) {
        u.els = piezasDe(el);
        u.els.forEach(function (p) { tomadas.add(p); p.classList.add('rv', 'rv-' + efecto); });
      }
      unidades.push(u);
      u.els.forEach(function (p) { unidadDe.set(p, u); });
    });
  });

  var revelar = function (u, demora) {
    if (u.hecha) { return; }
    u.hecha = true;
    var d = demora + (EXTRA[u.efecto] || 0);
    u.els.forEach(function (p) {
      p.style.setProperty('--rv-d', d + 'ms');
      if (u.titulo) {
        p.classList.add('rv-t-on');
        if (p.classList.contains('t-gigante')) {
          setTimeout(function () { p.classList.add('rv-vivo'); }, d + 1500);
        }
        return;
      }
      p.classList.add('rv-on');
      p.classList.remove('rv');
      var fin = function (e) {
        if (e.target !== p || (!reduce && e.animationName === 'rv-aparecer')) { return; }
        p.classList.remove('rv-on', 'rv-' + u.efecto);
        p.removeEventListener('animationend', fin);
      };
      p.addEventListener('animationend', fin);
    });
  };

  var io = new IntersectionObserver(function (entradas) {
    var nuevas = [];
    entradas.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      var u = unidadDe.get(e.target);
      if (u && !u.hecha && nuevas.indexOf(u) < 0) {
        u.r = e.boundingClientRect;
        nuevas.push(u);
      }
    });
    nuevas.sort(function (a, b) { return (a.r.top - b.r.top) || (a.r.left - b.r.left); });
    nuevas.forEach(function (u, i) {
      revelar(u, Math.min(i * 75, 900));
      u.els.forEach(function (p) { io.unobserve(p); });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  unidades.forEach(function (u) { u.els.forEach(function (p) { io.observe(p); }); });

  // Si alguien llega con un ancla, lo que quedó arriba no queda invisible
  window.addEventListener('load', function () {
    setTimeout(function () {
      unidades.forEach(function (u) {
        if (u.hecha) { return; }
        var r = u.els[0].getBoundingClientRect();
        if (r.bottom < 0) { revelar(u, 0); }
      });
    }, 400);
  });

  requestAnimationFrame(listo);

  // Si cambia la composición (escritorio ↔ celular), se muestra todo de una
  escritorio.addEventListener('change', function () {
    unidades.forEach(function (u) { revelar(u, 0); });
  });

  /* ---------- Carrusel: el nombre se reescribe y avanza solo ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  slides.forEach(function (slide) {
    var nombre = slide.querySelector('.rv-t');
    new MutationObserver(function () {
      if (!slide.classList.contains('actual')) { return; }
      cada('.rv', function (p) {
        var u = unidadDe.get(p);
        if (u) { revelar(u, 150); }
      }, slide);
      if (!nombre || !nombre.classList.contains('rv-t-on')) { return; }
      nombre.classList.remove('rv-t-on');
      nombre.style.setProperty('--rv-d', '120ms');
      void nombre.offsetWidth;
      nombre.classList.add('rv-t-on');
    }).observe(slide, { attributes: true, attributeFilter: ['class'] });
  });

  var carrusel = document.querySelector('.carrusel');
  var siguiente = document.querySelector('.flecha-siguiente');
  if (carrusel && siguiente && !reduce) {
    var enPantalla = false, encima = false, tocado = false;
    new IntersectionObserver(function (e) { enPantalla = e[0].isIntersecting; }, { threshold: .5 }).observe(carrusel);
    carrusel.addEventListener('pointerenter', function () { encima = true; });
    carrusel.addEventListener('pointerleave', function () { encima = false; });
    carrusel.addEventListener('focusin', function () { encima = true; });
    carrusel.addEventListener('focusout', function () { encima = false; });
    // si la persona lo usa, deja de avanzar solo
    carrusel.addEventListener('pointerdown', function () { tocado = true; });
    carrusel.addEventListener('keydown', function () { tocado = true; });
    setInterval(function () {
      if (enPantalla && !encima && !tocado && !document.hidden) { siguiente.click(); }
    }, 5500);
  }

  if (reduce) {
    window.addEventListener('scroll', function () {
      var max = root.scrollHeight - window.innerHeight;
      var mostrar = window.scrollY > window.innerHeight * 1.2;
      costura.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      arriba.classList.toggle('visible', mostrar);
      arriba.tabIndex = mostrar ? 0 : -1;
    }, { passive: true });
    return;
  }

  /* ---------- Cursor y botones magnéticos ---------- */
  var mx = 0, my = 0, mxs = 0, mys = 0, px = -100, py = -100;
  var cursor = null;
  if (conMouse) {
    cursor = document.createElement('div');
    cursor.className = 'rv-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    var CLICK = 'a, button, input, .slide:not(.actual), .burbuja';
    document.addEventListener('pointerover', function (e) {
      cursor.classList.toggle('sobre-link', !!(e.target.closest && e.target.closest(CLICK)));
    });
    document.addEventListener('pointerdown', function () { cursor.classList.add('apretado'); });
    document.addEventListener('pointerup', function () { cursor.classList.remove('apretado'); });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('visible'); });
  }
  window.addEventListener('pointermove', function (e) {
    px = e.clientX; py = e.clientY;
    mx = e.clientX / window.innerWidth - .5;
    my = e.clientY / window.innerHeight - .5;
    if (cursor && !cursor.classList.contains('visible')) { cursor.classList.add('visible'); }
  }, { passive: true });

  var botones = [];
  if (conMouse) {
    cada('.boton, .b-boton', function (b) { b.classList.add('rv-iman'); botones.push(b); });
  }
  var iman = function () {
    if (!escritorio.matches) { return; }
    for (var i = 0; i < botones.length; i++) {
      var b = botones[i], r = b.getBoundingClientRect();
      var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
      var dist = Math.sqrt(dx * dx + dy * dy), alcance = Math.max(r.width, 120);
      var f = dist < alcance ? (1 - dist / alcance) * .35 : 0;
      var v = (dx * f).toFixed(1) + '|' + (dy * f).toFixed(1);
      if (v !== b.rvUltimo) {
        b.rvUltimo = v;
        b.style.setProperty('--mx', (dx * f).toFixed(1) + 'px');
        b.style.setProperty('--my', (dy * f).toFixed(1) + 'px');
      }
    }
  };

  /* ---------- Capas vivas: parallax, mouse y flotación ---------- */
  // [selector, velocidad de scroll, cuánto sigue al mouse (px), cuánto flota (px), segundos por vuelta]
  var CAPAS = [
    ['.hero-retazo-rosa', .22, 26, 6, 7], ['.hero-retazo-celeste', .12, 18, 5, 8],
    ['.hero-retazo-amarillo', .18, 24, 6, 6.5], ['.hero-retazo-marron', .1, 16, 4, 9],
    ['.hero-libreta, .hero-libreta-sombra', -.07, 12, 7, 5.5],
    ['.hero-circulo', .1, 8, 5, 6], ['.hero-cinta', 0, 5, 0, 0], ['.hero-tarjeta', 0, 4, 0, 0],
    ['.burbuja', .06, 14, 7, 5],
    ['.ferias-circulo', -.1, 8, 6, 6], ['.ig-circulo-1', .12, 10, 6, 5.5], ['.ig-circulo-2', -.08, 10, 6, 6.5],
    ['.metodo-flecha', 0, 4, 3, 4],
    ['.b-hero-circulo', .1, 10, 6, 6]
  ];
  var capas = [];
  CAPAS.forEach(function (c) {
    cada(c[0], function (el, n) {
      capas.push({
        el: el, vel: c[1], mouse: c[2] * (.7 + (n % 3) * .25), flota: c[3], vuelta: c[4],
        fase: Math.random() * Math.PI * 2,
        sec: el.closest('.seccion, .b-hero') || el
      });
    });
  });

  var franjas = [];
  var buscarFranjas = function () {
    franjas = [];
    cada('.franja-pista', function (f) {
      if (f.getAnimations) { franjas = franjas.concat(f.getAnimations()); }
    });
  };
  buscarFranjas();

  var ultimoY = window.scrollY, velocidad = 1, alturaVentana = window.innerHeight;
  window.addEventListener('resize', function () { alturaVentana = window.innerHeight; });

  var paso = function (t) {
    var y = window.scrollY;
    var max = root.scrollHeight - alturaVentana;
    costura.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    var mostrarArriba = y > alturaVentana * 1.2;
    if (mostrarArriba !== arriba.classList.contains('visible')) {
      arriba.classList.toggle('visible', mostrarArriba);
      arriba.tabIndex = mostrarArriba ? 0 : -1;
    }

    // cursor
    if (cursor) { cursor.style.transform = 'translate(' + px + 'px,' + py + 'px)'; }

    // franja: se acelera al bajar, retrocede al subir, y vuelve a su ritmo
    var dy = y - ultimoY;
    ultimoY = y;
    var objetivo = 1 + Math.max(-5, Math.min(7, dy * .12));
    velocidad += (objetivo - velocidad) * .08;
    if (franjas.length) {
      if (Math.abs(franjas[0].playbackRate - velocidad) > .02) {
        for (var f = 0; f < franjas.length; f++) { franjas[f].playbackRate = velocidad; }
      }
    } else if (Math.random() < .02) { buscarFranjas(); }

    // capas (solo con la composición de escritorio)
    mxs += (mx - mxs) * .06;
    mys += (my - mys) * .06;
    var seg = (t || 0) / 1000;
    if (escritorio.matches) {
      for (var i = 0; i < capas.length; i++) {
        var c = capas[i];
        var r = c.sec.getBoundingClientRect();
        if (r.bottom < -200 || r.top > alturaVentana + 200) { continue; }
        var centro = (r.top + r.height / 2) - alturaVentana / 2;
        var ola = c.vuelta ? Math.sin(seg / c.vuelta * Math.PI * 2 + c.fase) * c.flota : 0;
        var ty = -centro * c.vel + mys * c.mouse + ola;
        var tx = mxs * c.mouse + (c.vuelta ? Math.cos(seg / (c.vuelta * 1.3) * Math.PI * 2 + c.fase) * c.flota * .4 : 0);
        var v = tx.toFixed(1) + 'px ' + ty.toFixed(1) + 'px';
        if (v !== c.ultimo) { c.el.style.translate = v; c.ultimo = v; }
      }
      iman();
    } else if (capas.length && capas[0].ultimo) {
      capas.forEach(function (c) { c.el.style.translate = ''; c.ultimo = ''; });
    }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
})();
