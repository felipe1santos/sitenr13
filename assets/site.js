/* NR13 AutoDocs — JS compartilhado das páginas internas.
   Modal "Fale Conosco" (mesmo Formspree do index) + accordion de FAQ. */
(function () {
    var overlay = document.getElementById('contactModalOverlay');
    var form = document.getElementById('contactForm');
    var success = document.getElementById('contactFormSuccess');
    var submitBtn = document.getElementById('contactSubmitBtn');
    var closeBtn = document.getElementById('closeContactModal');

    function openContactModal() {
        if (!overlay) return;
        overlay.style.display = 'flex';
        setTimeout(function () { overlay.classList.add('active'); }, 10);
    }
    function closeContactModal() {
        if (!overlay) return;
        overlay.classList.remove('active');
        setTimeout(function () {
            overlay.style.display = 'none';
            if (form) { form.reset(); form.style.display = 'flex'; }
            if (success) success.style.display = 'none';
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar'; }
        }, 300);
    }
    window.openContactModal = openContactModal;

    // Qualquer elemento com [data-open-contato] abre o modal
    document.querySelectorAll('[data-open-contato]').forEach(function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); openContactModal(); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeContactModal(); });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            fetch('https://formspree.io/f/xvznaowy', {
                method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
            }).then(function (r) {
                if (r.ok) { form.style.display = 'none'; success.style.display = 'block'; }
                else throw new Error('fail');
            }).catch(function () {
                submitBtn.disabled = false; submitBtn.textContent = 'Enviar';
                alert('Não foi possível enviar agora. Tente novamente em instantes.');
            });
        });
    }

    // FAQ accordion (se existir na página)
    var qs = document.querySelectorAll('.faq-question');
    qs.forEach(function (q) {
        q.addEventListener('click', function () {
            var ans = this.nextElementSibling;
            var open = this.getAttribute('aria-expanded') === 'true';
            qs.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); o.nextElementSibling.style.maxHeight = null; });
            if (!open) { this.setAttribute('aria-expanded', 'true'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
        });
    });
})();
