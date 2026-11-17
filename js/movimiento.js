/* =========================================================
   RETAZOS · movimiento
   - Las piezas entran cuando su sección aparece en pantalla
     (títulos palabra por palabra, textos línea por línea, papeles que se
     pegan, sellos que se estampan, flechas que se dibujan).
   - Parallax suave en el hero (scroll y mouse) y en los círculos.
   - La franja se acelera con el scroll y retrocede si subís.
   - Costura de progreso, menú que marca la sección y botón para volver arriba.
   - El nombre del barrio se vuelve a escribir al cambiar de slide.
   Con "reducir movimiento" solo quedan la costura y el botón.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var escritorio = window.matchMedia('(min-width: 1200px)');
  var listo = function () { root.classList.remove('rv-cargando'); };

  /* ---------- Escala: cuánto estirar las bandas para llegar a los bordes ---------- */
  var pagina = document.querySelector('.pagina');
  var seccion = document.querySelector('.pagina > .seccion, .pagina .seccion');
  var estirar = function () {
    if (!pagina || !seccion) { return; }
    var caja = seccion.getBoundingClientRect().width;
    var k = escritorio.matches && caja ? pagina.clientWidth / caja : 1;
    pagina.style.setProperty('--estirar', (k * 1.004).toFixed(4));
  };
  estirar();
  window.addEventListener('resize', estirar);

  /* ---------- Costura de progreso y volver arriba (siempre) ---------- */
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

  if (reduce || !('IntersectionObserver' in window)) {
    listo();
    window.addEventListener('scroll', function () {
      var max = root.scrollHeight - window.innerHeight;
      costura.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      arriba.classList.toggle('visible', window.scrollY > window.innerHeight * 1.2);
      arriba.tabIndex = window.scrollY > window.innerHeight * 1.2 ? 0 : -1;
    }, { passive: true });
    return;
  }

  root.classList.add('con-movimiento');

  /* ---------- Partir títulos en palabras o letras ---------- */
  var partir = function (el, modo) {
    if (el.getAttribute('data-rv-partido') || el.children.length) { return false; }
    var texto = el.textContent;
    if (!texto.trim()) { return false; }
    el.setAttribute('data-rv-partido', '1');
    var lector = document.createElement('span');
    lector.className = 'sr-only';
    lector.textContent = texto;
    var visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    var i = 0;
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
    return true;
  };

  /* ---------- Qué entra y cómo ---------- */
  var GRUPOS = [
    // [selector, efecto]; el primero que toma una pieza se la queda
    ['.t-hero, .t-gigante', 'letras'],
    ['.t-barrios, .t-metodo, .t-tienda, .t-pasaporte, .t-ferias, .t-sobre, .t-instagram, .t-pie, .t-slide,' +
     '.b-hero-tarjeta h1, .b-seccion h2, .b-paleta-titulo, .b-otro h3', 'palabras'],
    ['.sello', 'sello'],
    ['.metodo-flecha', 'trazo'],
    ['.hero-retazo-rosa, .hero-retazo-celeste', 'izq'],
    ['.hero-retazo-amarillo, .hero-retazo-marron', 'der'],
    ['.hero-foto > img, .ferias-foto > img', 'zoom'],
    [escritorio.matches ? '.cabecera .logo, .cabecera .t-nav, .cabecera .icono, .cabecera .t-barra' : '.cabecera .logo', 'bajar'],
    ['.t-bajada, .linea, .t-paso-n, .t-paso, .t-nota, .t-producto, .t-info, .t-precio, .t-link:not(.newsletter-mensaje), .t-etiqueta,' +
     '.t-dato, .t-col, .t-item, .campo-mail, .boton, .t-ver,' +
     '.b-migas, .b-bajada, .b-hero-tarjeta p, .b-boton, .b-tienda-link, .b-pasos li > p, .b-paleta li,' +
     '.b-producto, .b-otro', 'subir'],
    ['.hero-tarjeta, .hero-cinta, .hero-libreta, .hero-libreta-sombra, .hero-circulo, .producto-visual,' +
     '.pasaporte-libro, .estampilla, .ferias-cartel, .ferias-afiche, .ferias-ficha, .ferias-circulo,' +
     '.postal, .mosaico-item, .ig-circulo, .ig-papel, .paso-img, .carrusel-ventana, .mini, .flecha,' +
     '.b-paso-imagen, .b-estampilla, .b-hero-circulo, .b-hero-tarjeta', 'pegar']
  ];
  var EXTRA = { sello: 380, trazo: 250, izq: 150, der: 250, zoom: 0 };

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
    Array.prototype.forEach.call(document.querySelectorAll(g[0]), function (el) {
      if (tomadas.has(el)) { return; }
      tomadas.add(el);
      var efecto = g[1];
      var u = { efecto: efecto, els: [] };
      if (efecto === 'letras' || efecto === 'palabras') {
        if (!partir(el, efecto === 'letras' ? 'letra' : 'palabra')) {
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
      if (u.titulo) { p.classList.add('rv-t-on'); return; }
      p.classList.add('rv-on');
      p.classList.remove('rv');
      var fin = function (e) {
        if (e.target !== p || e.animationName === 'rv-aparecer') { return; }
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

  // Si alguien llega con un ancla, o algo queda sin revelar, que no falte nada
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

  /* ---------- El nombre del barrio se reescribe al cambiar de slide ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.slide'), function (slide) {
    var nombre = slide.querySelector('.rv-t');
    if (!nombre) { return; }
    new MutationObserver(function () {
      if (!slide.classList.contains('actual')) { return; }
      // lo que quedó esperando en un slide que estaba fuera de pantalla
      Array.prototype.forEach.call(slide.querySelectorAll('.rv'), function (p) {
        var u = unidadDe.get(p);
        if (u) { revelar(u, 150); }
      });
      if (!nombre.classList.contains('rv-t-on')) { return; }
      nombre.classList.remove('rv-t-on');
      nombre.style.setProperty('--rv-d', '120ms');
      void nombre.offsetWidth;
      nombre.classList.add('rv-t-on');
    }).observe(slide, { attributes: true, attributeFilter: ['class'] });
  });

  /* ---------- Parallax, franja y progreso (un solo bucle) ---------- */
  var PARALLAX = [
    ['.hero-retazo-rosa', .22, 26], ['.hero-retazo-celeste', .12, 18],
    ['.hero-retazo-amarillo', .18, 24], ['.hero-retazo-marron', .1, 16],
    ['.hero-libreta', -.07, 12], ['.hero-libreta-sombra', -.07, 12],
    ['.hero-circulo', .1, 8], ['.hero-cinta', 0, 5], ['.hero-tarjeta', 0, 4],
    ['.sobre-circulos', .08, 0], ['.ferias-circulo', -.1, 0], ['.ig-circulo-1', .12, 0], ['.ig-circulo-2', -.08, 0]
  ];
  var capas = [];
  PARALLAX.forEach(function (p) {
    Array.prototype.forEach.call(document.querySelectorAll(p[0]), function (el) {
      capas.push({ el: el, vel: p[1], mouse: p[2], sec: el.closest('.seccion') || el });
    });
  });

  var franjas = [];
  var buscarFranjas = function () {
    franjas = [];
    Array.prototype.forEach.call(document.querySelectorAll('.franja-pista'), function (f) {
      if (f.getAnimations) { franjas = franjas.concat(f.getAnimations()); }
    });
  };
  buscarFranjas();

  var mx = 0, my = 0, mxs = 0, mys = 0;
  var hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      mx = e.clientX / window.innerWidth - .5;
      my = e.clientY / window.innerHeight - .5;
    });
    hero.addEventListener('pointerleave', function () { mx = my = 0; });
  }

  var ultimoY = window.scrollY, velocidad = 1, alturaVentana = window.innerHeight;
  window.addEventListener('resize', function () { alturaVentana = window.innerHeight; });

  var paso = function () {
    var y = window.scrollY;
    var max = root.scrollHeight - alturaVentana;
    costura.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    var mostrarArriba = y > alturaVentana * 1.2;
    if (mostrarArriba !== arriba.classList.contains('visible')) {
      arriba.classList.toggle('visible', mostrarArriba);
      arriba.tabIndex = mostrarArriba ? 0 : -1;
    }

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

    // parallax (solo con la composición de escritorio)
    mxs += (mx - mxs) * .06;
    mys += (my - mys) * .06;
    if (escritorio.matches) {
      for (var i = 0; i < capas.length; i++) {
        var c = capas[i];
        var r = c.sec.getBoundingClientRect();
        if (r.bottom < -200 || r.top > alturaVentana + 200) { continue; }
        var centro = (r.top + r.height / 2) - alturaVentana / 2;
        var ty = -centro * c.vel + mys * c.mouse;
        var tx = mxs * c.mouse;
        var t = tx.toFixed(1) + 'px ' + ty.toFixed(1) + 'px';
        if (t !== c.ultimo) { c.el.style.translate = t; c.ultimo = t; }
      }
    } else if (capas.length && capas[0].el.style.translate) {
      capas.forEach(function (c) { c.el.style.translate = ''; c.ultimo = ''; });
    }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
})();
