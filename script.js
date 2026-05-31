// Gedeelde site-scripts: bijbelvers pop-up, hamburger menu, now-bar + highlight
(function () {
  // ---------- Bijbeltekst pop-up ----------
  var overlay = document.createElement('div');
  overlay.className = 'vers-modal-overlay';
  overlay.id = 'vers-overlay';
  overlay.innerHTML =
    '<div class="vers-modal">' +
      '<button class="vers-modal-close" aria-label="Sluiten">&times;</button>' +
      '<div class="vers-modal-ref" id="vers-modal-ref"></div>' +
      '<div class="vers-modal-tekst" id="vers-modal-tekst"></div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);

    // Hamburger toggle
    var hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        var isOpen = document.body.classList.toggle('mobile-menu-open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('mobile-menu-open');
      });
    });

    // Now-bar + highlight (alleen als er een .now-bar op de pagina staat)
    if (document.querySelector('.now-bar')) {
      updateNow();
      setInterval(updateNow, 30 * 1000); // ververs elke 30 sec
    }
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.classList.contains('vers-modal-close')) {
      closeVers();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVers();
      document.body.classList.remove('mobile-menu-open');
    }
  });

  window.openVers = function (ref, tekst) {
    document.getElementById('vers-modal-ref').textContent = ref;
    document.getElementById('vers-modal-tekst').textContent = tekst;
    overlay.classList.add('open');
  };
  window.closeVers = function () { overlay.classList.remove('open'); };

  // ---------- Now-bar + highlight ----------
  function updateNow() {
    var now = new Date();
    var datum = now.toLocaleDateString('nl-NL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    datum = datum.charAt(0).toUpperCase() + datum.slice(1);
    var tijd = pad(now.getHours()) + ':' + pad(now.getMinutes());

    var dEl = document.getElementById('now-bar-datum');
    var tEl = document.getElementById('now-bar-tijd');
    if (dEl) dEl.textContent = datum;
    if (tEl) tEl.textContent = tijd;

    highlightProgramma(now);
    highlightRooster(now);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function parseTijd(s) {
    var p = s.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function highlightProgramma(now) {
    var blokken = document.querySelectorAll('.tijdblok[data-start]');
    if (!blokken.length) return;

    blokken.forEach(function (b) {
      b.classList.remove('actief');
      var bestaand = b.querySelector('.nu-badge');
      if (bestaand) bestaand.remove();
    });

    // Alleen highlighten op zondag (getDay() === 0)
    if (now.getDay() !== 0) return;

    var nowMin = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < blokken.length; i++) {
      var start = parseTijd(blokken[i].getAttribute('data-start'));
      var end = parseTijd(blokken[i].getAttribute('data-end'));
      if (nowMin >= start && nowMin < end) {
        blokken[i].classList.add('actief');
        var titel = blokken[i].querySelector('.tijdblok-titel');
        if (titel) {
          var badge = document.createElement('span');
          badge.className = 'nu-badge';
          badge.textContent = 'Nu';
          titel.appendChild(badge);
        }
        break;
      }
    }
  }

  function highlightRooster(now) {
    var rijen = document.querySelectorAll('.rooster-rij[data-date]');
    if (!rijen.length) return;

    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Reset
    rijen.forEach(function (r) {
      r.classList.remove('geweest', 'vandaag', 'volgende');
      var s = r.querySelector('.rooster-status');
      if (s) s.remove();
    });

    // Eerste rij die ≥ vandaag is wordt 'vandaag' (als gelijk) of 'volgende' (als later)
    var volgendeIndex = -1;
    for (var i = 0; i < rijen.length; i++) {
      var d = parseDate(rijen[i].getAttribute('data-date'));
      if (d.getTime() >= today) { volgendeIndex = i; break; }
    }

    for (var j = 0; j < rijen.length; j++) {
      var rij = rijen[j];
      var dd = parseDate(rij.getAttribute('data-date'));
      if (dd.getTime() < today) {
        rij.classList.add('geweest');
        appendStatus(rij, 'geweest', 'Geweest');
      } else if (dd.getTime() === today) {
        rij.classList.add('vandaag');
        appendStatus(rij, 'vandaag', 'Vandaag');
      } else if (j === volgendeIndex) {
        rij.classList.add('volgende');
        appendStatus(rij, 'volgende', 'Volgende');
      }
    }
  }

  function parseDate(iso) {
    var p = iso.split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }

  function appendStatus(el, cls, text) {
    var s = document.createElement('div');
    s.className = 'rooster-status ' + cls;
    s.textContent = text;
    el.appendChild(s);
  }
})();
