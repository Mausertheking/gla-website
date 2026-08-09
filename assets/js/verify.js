/* Grading Lab Agency — certificate verification lookup.
   -------------------------------------------------------------------------
   Data source: Supabase (Postgres) when configured in assets/js/config.js,
   otherwise the small bundled REGISTRY below so the page works offline. Only
   the single matched record is fetched per lookup, so the live registry can
   hold any number of certificates. See SUPABASE_SETUP.md for the table, the
   read-only policy, and how to import records.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var REGISTRY = {
    GLA0000000: {
      title: 'Doctor Fate',
      set: '2024 KKW Cosmos WB Anv · Legacy Iconic #8',
      category: 'Trading Cards',
      grade: '10',
      gradeLabel: 'Mint',
      certified: '2026-02-14',
      holder: 'GLA Premium Slab',
      subgrades: { Centering: '10', Corners: '10', Edges: '10', Surface: '10' }
    },
    GLA0001006: {
      title: 'Michael Jordan Refractor #139',
      set: '1996 Topps Chrome',
      category: 'Sports Cards',
      grade: '10',
      gradeLabel: 'Gem Mint',
      certified: '2026-01-28',
      holder: 'GLA Premium Slab',
      subgrades: { Centering: '9.5', Corners: '10', Edges: '10', Surface: '10' }
    },
    GLA0001007: {
      title: 'The Amazing Spider-Man #1',
      set: 'Marvel Comics, 1983',
      category: 'Comic Books',
      grade: '9.4',
      gradeLabel: 'Near Mint',
      certified: '2025-12-09',
      holder: 'GLA Archival Comic Case',
      subgrades: { Cover: '9.4', Spine: '9.5', Pages: 'White', Restoration: 'None' }
    },
    GLA0001012: {
      title: 'The Legend of Zelda: Ocarina of Time',
      set: 'Nintendo 64, Factory Sealed',
      category: 'Video Games',
      grade: '9.2',
      gradeLabel: 'Mint',
      certified: '2026-03-02',
      holder: 'GLA Sealed Game Case',
      subgrades: { Seal: 'A+', Box: '9.2', Corners: '9.0', Print: '9.5' }
    },
    GLA0001018: {
      title: 'Hot Wheels RLC Datsun 510',
      set: 'Red Line Club, Limited Edition',
      category: 'Diecast & Toys',
      grade: '9.6',
      gradeLabel: 'Mint',
      certified: '2026-04-11',
      holder: 'GLA Diecast Case',
      subgrades: { Card: '9.6', Blister: '9.5', Paint: '10', Presentation: '9.5' }
    },
    GLA0001024: {
      title: '1 Manat Silver Commemorative',
      set: 'Azerbaijan, 2015',
      category: 'Coins',
      grade: 'MS-66',
      gradeLabel: 'Mint State',
      certified: '2026-05-19',
      holder: 'GLA Coin Capsule',
      subgrades: { Strike: 'Sharp', Luster: 'Full', Surface: 'MS-66', Wear: 'None' }
    },
    GLA0001031: {
      title: 'Signed Photograph — Witnessed Signing',
      set: 'Baku Comic Con, 2026',
      category: 'Autograph Authentication',
      authOnly: true,
      grade: 'PASS',
      gradeLabel: 'Authentic',
      certified: '2026-06-07',
      holder: 'GLA Certificate of Authenticity',
      subgrades: { Method: 'Witnessed', Witness: 'GLA Rep.', Medium: 'Paint Pen', 'COA Issued': 'Yes' }
    }
  };

  var form = document.getElementById('verify-form');
  if (!form) return;

  var input = document.getElementById('cert-number');
  var field = input.closest('.field');
  var errorEl = document.getElementById('cert-error');
  var result = document.getElementById('verify-result');
  var submitBtn = form.querySelector('button[type="submit"]');

  /* ------------------------------------------------------------ helpers --- */
  function normalize(value) {
    var raw = String(value || '').toUpperCase().replace(/[\s\-–—_]/g, '');
    if (/^\d{7}$/.test(raw)) raw = 'GLA' + raw;   // bare digits are fine
    return raw;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function setFieldError(message) {
    if (message) {
      field.classList.add('has-error');
      errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    } else {
      field.classList.remove('has-error');
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
    }
  }

  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';
  var ICON_ALERT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>';

  /* ------------------------------------------------------------ renders --- */
  function renderLoading() {
    result.innerHTML =
      '<div class="result-state result-state--loading">Searching the GLA certification database…</div>';
  }

  function renderNotFound(cert) {
    result.innerHTML =
      '<div class="result-state result-state--error">' + ICON_ALERT +
      '<div><strong>No record found.</strong> <span class="mono">' + escapeHtml(cert) + '</span><br>' +
      'Check the number printed on the label or the QR code on the holder. If the number is correct and this item is presented as GLA-certified, ' +
      '<a href="contact.html">contact us</a> — it may be counterfeit.</div></div>';
  }

  function renderRequestError() {
    result.innerHTML =
      '<div class="result-state result-state--error">' + ICON_ALERT +
      '<div><strong>Couldn’t reach the certification database.</strong><br>' +
      'Please check your connection and try again in a moment.</div></div>';
  }

  function renderCertificate(cert, rec) {
    var subgrades = Object.keys(rec.subgrades || {}).map(function (key) {
      return '<div class="subgrade"><dt>' + escapeHtml(key) + '</dt><dd>' +
             escapeHtml(rec.subgrades[key]) + '</dd></div>';
    }).join('');

    result.innerHTML =
      '<article class="cert">' +
        '<div class="cert__top">' +
          '<span class="cert__status">' + ICON_CHECK +
            (rec.authOnly ? 'Authenticated' : 'Verified') + '</span>' +
          '<span class="cert__id">' + escapeHtml(cert) + '</span>' +
        '</div>' +
        '<div class="cert__body">' +
          '<div class="cert__grade">' +
            '<span class="cert__grade-value">' + escapeHtml(rec.grade) + '</span>' +
            '<span class="cert__grade-label">' + escapeHtml(rec.gradeLabel) + '</span>' +
            (rec.authOnly ? '' : '<span class="cert__grade-scale">GLA 10-point scale</span>') +
          '</div>' +
          '<div class="cert__details">' +
            '<div>' +
              '<h3 class="cert__title">' + escapeHtml(rec.title) + '</h3>' +
              '<p style="margin:0;color:var(--text-muted)">' + escapeHtml(rec.set) + '</p>' +
            '</div>' +
            '<dl class="cert__specs">' +
              '<div class="cert__spec"><dt>Category</dt><dd>' + escapeHtml(rec.category) + '</dd></div>' +
              '<div class="cert__spec"><dt>Certified</dt><dd>' + escapeHtml(formatDate(rec.certified)) + '</dd></div>' +
              '<div class="cert__spec"><dt>Encapsulation</dt><dd>' + escapeHtml(rec.holder) + '</dd></div>' +
            '</dl>' +
            (subgrades ? '<dl class="cert__subgrades">' + subgrades + '</dl>' : '') +
          '</div>' +
        '</div>' +
        '<div class="cert__foot">' +
          '<span>Record active in the GLA certification database.</span>' +
          '<span class="mono">' + escapeHtml(cert) + '</span>' +
        '</div>' +
      '</article>';
  }

  /* ------------------------------------------------------------- lookup ---
     Reads one record from Supabase when configured, else the bundled sample
     set. Fetching a single row keeps lookups O(1) at any registry size. */
  function mapRow(row) {
    return {
      title: row.title,
      set: row.set,
      category: row.category,
      grade: row.grade,
      gradeLabel: row.grade_label,
      certified: row.certified,
      holder: row.holder,
      authOnly: !!row.auth_only,
      subgrades: row.subgrades || {}
    };
  }

  function lookup(cert) {
    var cfg = window.GLA_CONFIG || {};
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      // Calls the locked verify_cert() function — the table itself is not
      // readable with the public key, so the registry can't be listed or
      // dumped; only an exact code returns its single record.
      var base = cfg.supabaseUrl.replace(/\/+$/, '');
      var fn = cfg.certRpc || 'verify_cert';
      return fetch(base + '/rest/v1/rpc/' + encodeURIComponent(fn), {
        method: 'POST',
        headers: {
          apikey: cfg.supabaseAnonKey,
          Authorization: 'Bearer ' + cfg.supabaseAnonKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ p_cert: cert })
      }).then(function (res) {
        if (!res.ok) throw new Error('Registry request failed (' + res.status + ')');
        return res.json();
      }).then(function (rows) {
        var row = Array.isArray(rows) ? rows[0] : rows;
        return row ? mapRow(row) : null;
      });
    }
    // Offline fallback: bundled sample dataset.
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(REGISTRY[cert] || null); }, 350);
    });
  }

  function verify(rawValue, updateUrl) {
    var cert = normalize(rawValue);

    if (!cert) {
      result.innerHTML = '';
      setFieldError('Enter a certification number to continue.');
      return;
    }
    if (!/^GLA\d{7}$/.test(cert)) {
      result.innerHTML = '';
      setFieldError('Certification numbers look like GLA0001005 — three letters followed by seven digits.');
      return;
    }

    setFieldError(null);
    input.value = cert;
    renderLoading();
    submitBtn.disabled = true;

    lookup(cert).then(function (record) {
      submitBtn.disabled = false;
      if (record) renderCertificate(cert, record);
      else renderNotFound(cert);

      if (updateUrl && window.history.replaceState) {
        window.history.replaceState(null, '', '?cert=' + cert);
      }
    }).catch(function () {
      submitBtn.disabled = false;
      renderRequestError();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    verify(input.value, true);
  });

  // Clear the error as soon as the user starts correcting the value.
  input.addEventListener('input', function () {
    if (field.classList.contains('has-error')) setFieldError(null);
  });

  // Sample-number shortcuts.
  document.querySelectorAll('[data-cert-sample]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.value = btn.getAttribute('data-cert-sample');
      verify(input.value, true);
    });
  });

  // Deep link support so QR codes can open a result directly.
  var queryCert = new URLSearchParams(window.location.search).get('cert');
  if (queryCert) {
    input.value = normalize(queryCert);
    verify(queryCert, false);
  }
})();
