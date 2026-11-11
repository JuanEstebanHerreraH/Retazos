/* =========================================================
   RETAZOS · interacciones
   - Carrusel de barrios (flechas, miniaturas, teclado, deslizar)
   - Menú en celular
   - Formulario del newsletter (validación al enviar)
   Sin dependencias: JavaScript plano.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------
     Carrusel de barrios
     Orden: La Boca, Palermo, San Telmo, Caballito (en bucle).
     Cada slide tiene una posición (--pos) respecto de la activa:
     -1 izquierda, 0 centro, 1 derecha, 2 fuera de pantalla.
     --------------------------------------------------------- */
  var carrusel = document.querySelector('.carrusel');
  if (carrusel) {
    var slides = Array.prototype.slice.call(carrusel.querySelectorAll('.slide'));
    var minis = Array.prototype.slice.call(carrusel.querySelectorAll('.mini'));
    var anterior = carrusel.querySelector('.flecha-anterior');
    var siguiente = carrusel.querySelector('.flecha-siguiente');
    var total = slides.length;
    var activa = 0;
    var posiciones = slides.map(function (s) { return parseFloat(s.style.getPropertyValue('--pos')) || 0; });

    var posicionDe = function (i, a) {
      return ((i - a + 1 + total) % total) - 1; // -1, 0, 1, 2
    };

    var mostrar = function (nueva, enfocar) {
      activa = (nueva + total) % total;
      slides.forEach(function (s, i) {
        var p = posicionDe(i, activa);
        // la que da la vuelta por detrás no se anima (cruzaría la pantalla)
        if (Math.abs(p - posiciones[i]) > 1) {
          s.classList.add('sin-transicion');
          s.style.setProperty('--pos', p);
          void s.offsetWidth; // aplicar sin transición
          s.classList.remove('sin-transicion');
        } else {
          s.style.setProperty('--pos', p);
        }
        posiciones[i] = p;
        var esActual = p === 0;
        s.classList.toggle('actual', esActual);
        s.setAttribute('aria-hidden', esActual ? 'false' : 'true');
        Array.prototype.forEach.call(s.querySelectorAll('a'), function (a) {
          if (esActual) { a.removeAttribute('tabindex'); } else { a.setAttribute('tabindex', '-1'); }
        });
      });
      minis.forEach(function (m, i) {
        var esta = i === activa;
        m.classList.toggle('activa', esta);
        if (esta) { m.setAttribute('aria-current', 'true'); } else { m.removeAttribute('aria-current'); }
      });
      if (enfocar && minis[activa]) { minis[activa].focus({ preventScroll: true }); }
    };

    var irA = function (barrio) {
      for (var i = 0; i < total; i++) {
        if (slides[i].getAttribute('data-barrio') === barrio) { mostrar(i); return; }
      }
    };

    // estado inicial (sin animación) y recién después se habilitan las transiciones
    mostrar(0);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { carrusel.classList.add('anima'); });
    });

    if (anterior) { anterior.addEventListener('click', function () { mostrar(activa - 1); }); }
    if (siguiente) { siguiente.addEventListener('click', function () { mostrar(activa + 1); }); }

    minis.forEach(function (m, i) {
      m.addEventListener('click', function () { mostrar(i); });
    });

    // clic en un slide vecino: lo trae al centro (no navega)
    slides.forEach(function (s, i) {
      s.addEventListener('click', function (e) {
        if (i !== activa) { e.preventDefault(); mostrar(i); }
      });
    });

    // teclado: flechas izquierda/derecha cuando el foco está en el carrusel
    carrusel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(activa - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(activa + 1, true); }
    });

    // deslizar con el dedo (un slide por gesto)
    var ventana = carrusel.querySelector('.carrusel-ventana');
    var inicioX = null, inicioY = null;
    ventana.addEventListener('touchstart', function (e) {
      inicioX = e.touches[0].clientX; inicioY = e.touches[0].clientY;
    }, { passive: true });
    ventana.addEventListener('touchend', function (e) {
      if (inicioX === null) { return; }
      var dx = e.changedTouches[0].clientX - inicioX;
      var dy = e.changedTouches[0].clientY - inicioY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { mostrar(activa + (dx < 0 ? 1 : -1)); }
      inicioX = inicioY = null;
    }, { passive: true });

  }

  /* ---------------------------------------------------------
     Menú en celular / tablet
     --------------------------------------------------------- */
  var cabecera = document.querySelector('.cabecera');
  var botonMenu = document.querySelector('.menu-boton');
  if (cabecera && botonMenu) {
    var cerrar = function () {
      cabecera.classList.remove('menu-abierto');
      document.documentElement.classList.remove('sin-scroll');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-label', 'Abrir menú');
    };
    botonMenu.addEventListener('click', function () {
      var abierto = cabecera.classList.toggle('menu-abierto');
      document.documentElement.classList.toggle('sin-scroll', abierto);
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    Array.prototype.forEach.call(cabecera.querySelectorAll('.nav-links a'), function (a) {
      a.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cabecera.classList.contains('menu-abierto')) { cerrar(); botonMenu.focus(); }
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', cerrar);
  }

  /* ---------------------------------------------------------
     Newsletter
     La web es estática (GitHub Pages / Vercel): todavía no hay un servicio
     de newsletter conectado [A DEFINIR]. Por ahora valida el mail y muestra
     la confirmación en el mismo lugar del formulario, sin enviar datos.
     --------------------------------------------------------- */
  var form = document.querySelector('.newsletter');
  if (form) {
    var campo = form.querySelector('input[type="email"]');
    var mensaje = form.querySelector('.newsletter-mensaje');
    var valido = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = campo.value.trim();
      if (!valido(v)) {
        form.classList.add('con-error');
        campo.setAttribute('aria-invalid', 'true');
        mensaje.textContent = v ? 'Revisá el mail: parece que le falta algo.' : 'Escribí tu mail para sumarte.';
        campo.focus();
        return;
      }
      form.classList.remove('con-error');
      campo.removeAttribute('aria-invalid');
      form.classList.add('enviado');
      mensaje.textContent = '¡Listo! Te avisamos cuando salga la próxima edición.';
    });
    campo.addEventListener('input', function () {
      if (form.classList.contains('con-error')) {
        form.classList.remove('con-error');
        campo.removeAttribute('aria-invalid');
        mensaje.textContent = '';
      }
    });
  }

  /* El desplazamiento suave a las secciones lo hace el CSS (scroll-behavior),
     y se apaga solo si la persona pidió reducir el movimiento. */
  if (reduceMotion.matches) { document.documentElement.style.scrollBehavior = 'auto'; }
})();
