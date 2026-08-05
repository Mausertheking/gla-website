/* Grading Lab Agency — interactive grading desk.
   The SVG illustration is decorative to assistive tech (role="img"); the chip
   row below it is the real, keyboard-accessible control. Both drive select(). */
(function () {
  'use strict';

  var scene = document.getElementById('desk-scene');
  var panel = document.getElementById('tool-info');
  if (!scene || !panel) return;

  var TOOLS = {
    gloves: {
      step: 1,
      name: 'Lint-free cotton gloves',
      role: 'Worn before anything is touched',
      why: 'Skin transfers oil, salt and moisture that no cleaning process can reverse. Every item is handled with fresh gloves from the moment the parcel is opened until the holder is sealed.',
      listLabel: 'What it prevents',
      items: [
        'Fingerprint etching in coin luster',
        'Oil haze on foil, holo and refractor surfaces',
        'Long-term discolouration on comic pages',
        'Residue trapped under the seal at encapsulation',
        'Transfer between items in a bulk submission'
      ]
    },
    loupe: {
      step: 2,
      name: '10× loupe and magnifier',
      role: 'The first condition pass',
      why: 'Every assessment starts here. A hand loupe is quick enough to work across a whole submission and sharp enough to separate a Mint card from a Near Mint one.',
      listLabel: 'What it checks',
      items: [
        'Corner sharpness and whitening',
        'Edge chipping along the border',
        'Print lines, roller marks and dimples',
        'Surface scratches under raking light',
        'Where the centering measurement should be taken'
      ]
    },
    microscope: {
      step: 3,
      name: 'Stereo microscope',
      role: 'Detail beyond the naked eye',
      why: 'At 20–60× the material tells the truth. This is where authentication questions are settled, and where damage too small to see becomes obvious.',
      listLabel: 'What it reveals',
      items: [
        'Genuine print rosettes versus a reprinted scan',
        'Disturbed paper fibres left behind by trimming',
        'Ink sitting on top of a surface — a real signature — rather than printed into it',
        'Micro-abrasion and hairlines across coin fields',
        'Re-glued blister edges on carded diecast'
      ]
    },
    uv: {
      step: 4,
      name: 'UV inspection lamp',
      role: 'Finding what was meant to stay hidden',
      why: 'Restoration, adhesives and modern papers fluoresce differently to original material. Under ultraviolet light an invisible repair announces itself in seconds.',
      listLabel: 'What it exposes',
      items: [
        'Colour touch and restored areas on comic covers',
        'Glue, tape and re-backed spines',
        'Optical brighteners in paper that should not contain them',
        'Replaced or resealed factory wrap',
        'Bleaching and chemical cleaning on banknotes'
      ]
    },
    calipers: {
      step: 5,
      name: 'Digital calipers',
      role: 'Measurement, not opinion',
      why: 'A grade should never rest on how something feels in the hand. Dimensions are recorded to a hundredth of a millimetre and compared against factory specification.',
      listLabel: 'What it measures',
      items: [
        'Card height and width against issued spec — the trimming check',
        'Coin diameter and thickness',
        'Comic trim size versus the printing standard',
        'Holder tolerance before the slab is sealed',
        'Thickness of thick-stock, patch and relic cards'
      ]
    }
  };

  var CHECK = 'M20 6 9 17l-5-5';

  var groups = scene.querySelectorAll('[data-tool]');
  var chips = document.querySelectorAll('.tool-chip[data-tool]');

  var el = {
    step: panel.querySelector('[data-tool-step]'),
    name: panel.querySelector('[data-tool-name]'),
    role: panel.querySelector('[data-tool-role]'),
    why: panel.querySelector('[data-tool-why]'),
    label: panel.querySelector('[data-tool-list-label]'),
    list: panel.querySelector('[data-tool-list]')
  };

  function buildItem(text) {
    var li = document.createElement('li');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.4');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', CHECK);
    svg.appendChild(path);
    li.appendChild(svg);
    li.appendChild(document.createTextNode(' ' + text));
    return li;
  }

  function select(id) {
    var tool = TOOLS[id];
    if (!tool) return;

    groups.forEach(function (g) {
      g.classList.toggle('is-active', g.getAttribute('data-tool') === id);
    });
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-tool') === id));
    });
    scene.classList.toggle('is-uv', id === 'uv');

    el.step.textContent = 'Step ' + tool.step + ' of 5';
    el.name.textContent = tool.name;
    el.role.textContent = tool.role;
    el.why.textContent = tool.why;
    el.label.textContent = tool.listLabel;

    el.list.textContent = '';
    tool.items.forEach(function (text) { el.list.appendChild(buildItem(text)); });
  }

  groups.forEach(function (g) {
    g.addEventListener('click', function () { select(g.getAttribute('data-tool')); });
  });

  chips.forEach(function (c) {
    c.addEventListener('click', function () { select(c.getAttribute('data-tool')); });
  });

  // The markup ships with tool 1 rendered, so no work is needed on load.
})();
