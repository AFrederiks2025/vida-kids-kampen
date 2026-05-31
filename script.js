// Bijbeltekst pop-up — gedeeld over alle pagina's
(function () {
  // Bouw de modal eenmalig op en voeg toe aan de body
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
  });

  // Sluiten bij klik op achtergrond
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.classList.contains('vers-modal-close')) {
      closeVers();
    }
  });

  // Sluiten met Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeVers(); }
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
