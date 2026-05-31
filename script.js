// Bijbeltekst pop-up + hamburger menu — gedeeld over alle pagina's
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

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('mobile-menu-open');
      });
    });
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

  window.closeVers = function () {
    overlay.classList.remove('open');
  };
})();
