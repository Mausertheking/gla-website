/* Grading Lab Agency — submission / contact form.
   -------------------------------------------------------------------------
   No backend is wired up yet. Two modes:
     1. Set data-endpoint="https://…" on the <form> (Formspree, Basin, your own
        API) and the form POSTs the fields as JSON.
     2. Without an endpoint it falls back to opening the visitor's mail client
        with the message pre-filled, so nothing is silently lost.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var CONTACT_EMAIL = (window.GLA_CONFIG && window.GLA_CONFIG.contactEmail) ||
    form.getAttribute('data-fallback-email') || 'info.gradinglabagency@gmail.com';

  function fieldOf(el) { return el.closest('.field'); }

  function showError(el, message) {
    var wrap = fieldOf(el);
    wrap.classList.add('has-error');
    wrap.querySelector('.field__error').textContent = message;
    el.setAttribute('aria-invalid', 'true');
  }

  function clearError(el) {
    var wrap = fieldOf(el);
    wrap.classList.remove('has-error');
    wrap.querySelector('.field__error').textContent = '';
    el.removeAttribute('aria-invalid');
  }

  function validate(el) {
    var value = el.value.trim();

    if (el.hasAttribute('required') && !value) {
      showError(el, 'This field is required.');
      return false;
    }
    if (el.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      showError(el, 'Enter a valid email address, e.g. name@example.com.');
      return false;
    }
    if (el.name === 'message' && value && value.length < 12) {
      showError(el, 'Please add a little more detail so we can help properly.');
      return false;
    }
    clearError(el);
    return true;
  }

  var fields = Array.prototype.slice.call(
    form.querySelectorAll('input[name], select[name], textarea[name]')
  );

  // Validate on blur, not on every keystroke.
  fields.forEach(function (el) {
    el.addEventListener('blur', function () { validate(el); });
    el.addEventListener('input', function () {
      if (fieldOf(el).classList.contains('has-error')) validate(el);
    });
  });

  function setStatus(message, tone) {
    status.textContent = message;
    status.className = 'result-state' + (tone ? ' result-state--' + tone : '');
    status.style.display = message ? 'flex' : 'none';
  }

  function mailtoFallback(data) {
    var body = [
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + (data.phone || '—'),
      'Service: ' + data.service,
      'Items: ' + (data.quantity || '—'),
      '',
      data.message
    ].join('\n');

    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent('Submission enquiry — ' + data.service) +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var invalid = fields.filter(function (el) { return !validate(el); });
    if (invalid.length) {
      setStatus(invalid.length + ' field' + (invalid.length > 1 ? 's need' : ' needs') +
        ' attention before you can send this.', 'error');
      invalid[0].focus();
      return;
    }

    var data = {};
    fields.forEach(function (el) { data[el.name] = el.value.trim(); });

    // Open the visitor's email app (Gmail, Mail, Outlook…) with the enquiry
    // pre-filled and addressed to us. No backend — works on static hosting.
    mailtoFallback(data);
    setStatus('Your email app is opening with your enquiry ready to send — just press Send. ' +
      'If nothing opens, email ' + CONTACT_EMAIL + ' directly.', null);
  });
})();
