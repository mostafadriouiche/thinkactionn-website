(function () {
  // Reduced motion is handled in CSS (fades instead of movement); the product demo still plays for everyone.
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (n) { return n ? n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''; };

  /* ---------- Mobile menu ---------- */
  var navToggle = $('.nav__toggle');
  var navMenu = $('#nav-menu');
  if (navToggle && navMenu) {
    var setMenu = function (open) {
      navMenu.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? 'Fermer' : 'Menu';
    };
    navToggle.addEventListener('click', function () { setMenu(!navMenu.classList.contains('is-open')); });
    navMenu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) { setMenu(false); navToggle.focus(); }
    });
    var wide = window.matchMedia('(min-width: 1061px)');
    var onWide = function (m) { if (m.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- Scroll reveal + counters ---------- */
  $$('.flow__band').forEach(function (band, b) {
    band.style.setProperty('--b', b);
    $$('.flow__steps li', band).forEach(function (li) {
      li.style.setProperty('--i', parseInt($('.flow__n', li).textContent, 10) - 1);
    });
  });

  function countUp(el) {
    var target = +el.dataset.count, total = el.dataset.total, start = null, dur = 1600;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + ' / ' + total;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var revealTargets = $$('[data-reveal], [data-flow]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        $$('.prog b[data-count]', entry.target).forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Journal data (real OWL output) and the tax tables built from it ---------- */
  // [code, date, n° facture, compte général, n° compte tiers, libellé, débit, crédit, compte tiers]
  var MS = 'MICROSOFT-F E0200Z6YTH (16,00 USD × 9,1244)';
  var JOURNAL = [
    ['AC', '02/04/2026', '000101', '6143600000', '', 'AFRQ D-OASISII-000101', 1185, 0, ''],
    ['AC', '02/04/2026', '000101', '4411000000', '', 'AFRQ D-OASISII-000101', 0, 1185, 'AFRQ D-OASISII'],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '6126300000', '612630001', MS, 145.99, 0, ''],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '6126380000', '', MS + ' RAS', 16.22, 0, ''],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '3455202000', '', MS + ' TVA', 32.44, 0, ''],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '4411E00000', '4411M0001', MS, 0, 145.99, 'MICROSOFT'],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '4457100000', '', MS, 0, 16.22, ''],
    ['ACE', '12/05/2026', 'E0200Z6YTH', '4457200000', '', MS, 0, 32.44, ''],
    ['AC', '03/04/2026', '2026040001', '6125300000', '', 'ID MAROC — F 2026040001', 1353.76, 0, ''],
    ['AC', '03/04/2026', '2026040001', '3455220000', '', 'ID MAROC — F 2026040001', 270.75, 0, ''],
    ['AC', '03/04/2026', '2026040001', '4411000000', '44111002', 'ID MAROC — F 2026040001', 0, 1624.51, 'ID MAROC'],
    ['AC', '03/04/2026', '1613813788', '6125100000', '', 'SRM-CS — F 1613813788 Électricité', 2783.13, 0, ''],
    ['AC', '03/04/2026', '1613813788', '3455220000', '', 'SRM-CS — F 1613813788 Électricité', 668.53, 0, ''],
    ['AC', '03/04/2026', '1613813788', '4411000000', '4411L001', 'SRM-CS — F 1613813788 Électricité', 0, 3451.66, 'SRM-CS'],
    ['AC', '03/04/2026', '1613717255', '6125100000', '', 'SRM-CS — F 1613717255 Eau', 82, 0, ''],
    ['AC', '03/04/2026', '1613717255', '3455220000', '', 'SRM-CS — F 1613717255 Eau', 8.43, 0, ''],
    ['AC', '03/04/2026', '1613717255', '4411000000', '4411L001', 'SRM-CS — F 1613717255 Eau', 0, 90.43, 'SRM-CS'],
    ['AC', '03/05/2026', '1616820806', '6125100000', '', 'SRM-CS — F 1616820806 Électricité', 2912.09, 0, ''],
    ['AC', '03/05/2026', '1616820806', '3455220000', '', 'SRM-CS — F 1616820806 Électricité', 694.71, 0, ''],
    ['AC', '03/05/2026', '1616820806', '4411000000', '4411L001', 'SRM-CS — F 1616820806 Électricité', 0, 3606.80, 'SRM-CS'],
    ['AC', '03/05/2026', '1616736391', '6125100000', '', 'SRM-CS — F 1616736391 Eau', 95.40, 0, ''],
    ['AC', '03/05/2026', '1616736391', '3455220000', '', 'SRM-CS — F 1616736391 Eau', 9.80, 0, ''],
    ['AC', '03/05/2026', '1616736391', '4411000000', '4411L001', 'SRM-CS — F 1616736391 Eau', 0, 105.20, 'SRM-CS'],
    ['AC', '03/05/2026', '1616820803', '6125100000', '', 'SRM-CS — F 1616820803 Électricité', 582.67, 0, ''],
    ['AC', '03/05/2026', '1616820803', '3455220000', '', 'SRM-CS — F 1616820803 Électricité', 176.32, 0, ''],
    ['AC', '03/05/2026', '1616820803', '4411000000', '4411L001', 'SRM-CS — F 1616820803 Électricité', 0, 758.99, 'SRM-CS'],
    ['AC', '03/05/2026', '1616736394', '6125100000', '', 'SRM-CS — F 1616736394 Eau', 149, 0, ''],
    ['AC', '03/05/2026', '1616736394', '3455220000', '', 'SRM-CS — F 1616736394 Eau', 15.31, 0, ''],
    ['AC', '03/05/2026', '1616736394', '4411000000', '4411L001', 'SRM-CS — F 1616736394 Eau', 0, 164.31, 'SRM-CS'],
    ['AC', '04/02/2026', '432563', '6126300000', '', 'GENIOUS COMMUNICATIONS — F 432563', 3000, 0, ''],
    ['AC', '04/02/2026', '432563', '4411000000', '', 'GENIOUS COMMUNICATIONS — F 432563', 0, 3000, 'GENIOUS COMMUNICATIONS'],
    ['AC', '04/03/2026', '001/032026', '2327000000', '', 'BATILOU-F 001/032026', 108333.34, 0, ''],
    ['AC', '04/03/2026', '001/032026', '3455100000', '', 'BATILOU-F 001/032026', 21666.66, 0, ''],
    ['AC', '04/03/2026', '001/032026', '4411000000', '4411B014', 'BATILOU-F 001/032026', 0, 108333.34, 'BATILOU'],
    ['AC', '04/03/2026', '001/032026', '4458000000', '', 'BATILOU-F 001/032026', 0, 21666.66, ''],
    ['AC', '04/05/2026', 'F202604562', '6143100000', '', 'VISIT MOROCCO — F F202604562', 1420, 0, ''],
    ['AC', '04/05/2026', 'F202604562', '4411000000', '4411V', 'VISIT MOROCCO — F F202604562', 0, 1420, 'VISIT MOROCCO'],
    ['AC', '05/01/2026', 'FA2601-0636', '6133100000', '', 'MWOOD MAROC — F FA2601-0636', 2000, 0, ''],
    ['AC', '05/01/2026', 'FA2601-0636', '3455220000', '', 'MWOOD MAROC — F FA2601-0636', 400, 0, ''],
    ['AC', '05/01/2026', 'FA2601-0636', '4411000000', '4411M021', 'MWOOD MAROC — F FA2601-0636', 0, 2400, 'MWOOD MAROC']
  ];

  // one source document per invoice, spread over the 10-page PDF
  var DOCS = {
    '000101': { page: 1, ticket: true },
    'E0200Z6YTH': { page: 2, supplier: 'MICROSOFT', total: '16,00 USD', lines: [['Microsoft 365, abonnement', '16,00 USD']] },
    '2026040001': { page: 3, supplier: 'ID MAROC', total: '1 624,51', lines: [['Montant HT', '1 353,76'], ['TVA 20 %', '270,75']] },
    '1613813788': { page: 4, supplier: 'SRM-CS', total: '3 451,66', lines: [['Électricité, avril', '2 783,13'], ['TVA', '668,53']] },
    '1613717255': { page: 4, supplier: 'SRM-CS', total: '90,43', lines: [['Eau, avril', '82,00'], ['TVA', '8,43']] },
    '1616820806': { page: 5, supplier: 'SRM-CS', total: '3 606,80', lines: [['Électricité, mai', '2 912,09'], ['TVA', '694,71']] },
    '1616736391': { page: 5, supplier: 'SRM-CS', total: '105,20', lines: [['Eau, mai', '95,40'], ['TVA', '9,80']] },
    '1616820803': { page: 6, supplier: 'SRM-CS', total: '758,99', lines: [['Électricité, mai', '582,67'], ['TVA', '176,32']] },
    '1616736394': { page: 6, supplier: 'SRM-CS', total: '164,31', lines: [['Eau, mai', '149,00'], ['TVA', '15,31']] },
    '432563': { page: 7, supplier: 'GENIOUS COMMUNICATIONS', total: '3 000,00', lines: [['Prestation de communication', '3 000,00']] },
    '001/032026': { page: 8, supplier: 'BATILOU', total: '130 000,00', lines: [['Travaux d’aménagement', '108 333,34'], ['TVA 20 %', '21 666,66']] },
    'F202604562': { page: 9, supplier: 'VISIT MOROCCO', total: '1 420,00', lines: [['Frais de déplacement', '1 420,00']] },
    'FA2601-0636': { page: 10, supplier: 'MWOOD MAROC', total: '2 400,00', lines: [['Entretien mobilier', '2 000,00'], ['TVA 20 %', '400,00']] }
  };

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var sum = function (arr, i, filter) { return arr.reduce(function (a, r) { return a + ((!filter || filter(r)) ? r[i] : 0); }, 0); };
  /* ---------- Hero: the OWL dashboard, replayed ---------- */
  var viewport = $('[data-viewport]');
  var dash = $('[data-dash]');
  if (viewport && dash) {
    var W = 1280;
    var fit = function () { viewport.style.setProperty('--s', viewport.clientWidth / W); };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(viewport);
    else window.addEventListener('resize', fit);

    var el = {
      cursor: $('[data-cursor]', dash), rows: $('[data-rows]', dash), content: $('[data-content]', dash),
      slot: $('.dash__upslot', dash), dd: $('[data-dd]', dash), tiersPop: $('[data-tierspop]', dash),
      paper: $('[data-docpaper]', dash), page: $('[data-page]', dash), scan: $('[data-scan]', dash),
      analyse: $('[data-analyse]', dash), debit: $('[data-tdebit]', dash), credit: $('[data-tcredit]', dash),
      balanced: $('[data-balanced]', dash), exp: $('[data-export]', dash), crumb: $('[data-crumb]', dash),
      jsel: $('[data-jsel]', dash), jv: $('[data-view="journal"]', dash), body: $('.dt__body', dash)
    };
    dash.appendChild(el.cursor); // the cursor travels over the sidebar too
    var target = function (name) { return $('[data-target="' + name + '"]', dash); };
    var stepsBar = $$('[data-stepsbar] li');
    var ROWH = 30;

    // one grid row per journal line, plus empty lines like the real app
    var slots = [];
    for (var i = 0; i < JOURNAL.length + 8; i++) {
      var r = document.createElement('div');
      r.className = 'dt__row';
      r.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span class="r"></span><span class="r"></span>';
      el.rows.appendChild(r);
      slots.push(r);
    }
    var fillRow = function (k, animate) {
      var j = JOURNAL[k], cells = slots[k].children;
      var vals = [j[0], j[1], j[3], j[4], j[5], j[8], j[2], money(j[6]), money(j[7])];
      for (var c = 0; c < 9; c++) cells[c].textContent = vals[c];
      slots[k].classList.add('is-filled');
      if (animate) { slots[k].classList.remove('is-new'); void slots[k].offsetWidth; slots[k].classList.add('is-new'); }
    };
    var scrollRows = function (y) { el.rows.style.transform = 'translateY(' + (-y) + 'px)'; };

    var renderPaper = function (num) {
      var d = DOCS[num];
      if (d.ticket) {
        el.paper.className = 'docpaper docpaper--ticket';
        el.paper.innerHTML = '<div class="dp-logo">AP</div><div class="dp-c">Attijari Payment</div><div class="dp-c" style="margin:6px 0 8px">ACHAT</div>' +
          '<div>02/04/2026</div><div><b>AFRQ D-OASISII</b></div><div>Casablanca</div><div class="dp-line"></div>' +
          '<div class="dp-row"><span>CARTE LOCALE</span><span>VISA</span></div><div class="dp-total"><span>MONTANT :</span><span>1 185,00 MAD</span></div>' +
          '<div class="dp-line"></div><div class="dp-line" style="width:60%"></div><div class="dp-c" style="margin-top:8px">TICKET CLIENT</div>';
      } else {
        el.paper.className = 'docpaper';
        el.paper.innerHTML = '<h5>' + esc(d.supplier) + '</h5><div class="dp-sub">Facture N° ' + esc(num) + '</div>' +
          '<div class="dp-line" style="width:70%"></div><div class="dp-line" style="width:45%"></div><div style="height:10px"></div>' +
          d.lines.map(function (l) { return '<div class="dp-row"><span>' + esc(l[0]) + '</span><span>' + esc(l[1]) + '</span></div>'; }).join('') +
          '<div class="dp-total"><span>Total TTC</span><span>' + esc(d.total) + '</span></div>' +
          '<div style="height:14px"></div><div class="dp-line"></div><div class="dp-line" style="width:80%"></div><div class="dp-line" style="width:55%"></div>';
      }
      el.page.textContent = d.page;
    };

    var totals = { d: 0, c: 0 };
    var setTotals = function (d, c, animate) {
      var fromD = totals.d, fromC = totals.c;
      totals.d = d; totals.c = c;
      clearInterval(setTotals.timer);
      if (!animate) { el.debit.textContent = money(d) || '0,00'; el.credit.textContent = money(c) || '0,00'; return; }
      var start = Date.now();
      setTotals.timer = setInterval(function () {
        var p = Math.min(1, (Date.now() - start) / 260), e = 1 - Math.pow(1 - p, 3);
        el.debit.textContent = money(fromD + (d - fromD) * e) || '0,00';
        el.credit.textContent = money(fromC + (c - fromC) * e) || '0,00';
        if (p >= 1) clearInterval(setTotals.timer);
      }, 30);
    };

    if (!window.Promise || !('IntersectionObserver' in window)) {
      JOURNAL.forEach(function (j, k) { fillRow(k, false); });
      setTotals(sum(JOURNAL, 6), sum(JOURNAL, 7), false);
      el.balanced.classList.add('is-show');
      el.exp.classList.add('is-on');
      el.slot.classList.add('is-loaded');
      el.cursor.style.display = 'none';
    } else {
      var visible = true;
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(viewport);
      var sleep = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
      var wait = function (ms) {
        var left = ms;
        var loop = function () {
          if (left <= 0) return Promise.resolve();
          return sleep(100).then(function () { if (visible && !document.hidden) left -= 100; return loop(); });
        };
        return loop();
      };
      var sc = function () { return viewport.clientWidth / W; };
      var moveTo = function (node, fx, fy) {
        var m = dash.getBoundingClientRect(), r = node.getBoundingClientRect(), s = sc();
        var x = (r.left - m.left + r.width * (fx || .55)) / s;
        var y = (r.top - m.top + r.height * (fy || .6)) / s;
        el.cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        return wait(850);
      };
      var press = function (node) {
        node.classList.add('is-focus', 'is-press');
        return wait(180).then(function () { node.classList.remove('is-press'); });
      };
      var unfocus = function (node) { node.classList.remove('is-focus'); };
      var click = function (node, fx, fy) {
        return moveTo(node, fx, fy).then(function () { return press(node); });
      };
      var setStep = function (n) {
        stepsBar.forEach(function (li, idx) {
          li.classList.toggle('is-done', idx + 1 < n);
          li.classList.toggle('is-active', idx + 1 === n);
        });
      };
      var chain = function (items, fn) {
        return items.reduce(function (p, item, idx) { return p.then(function () { return fn(item, idx); }); }, Promise.resolve());
      };

      var run = function () {
        var sector = target('sector'), exo = target('exo'), tiers = target('tiers'), upload = target('upload');
        return Promise.resolve()
          // 1. tax settings: sector and exemption
          .then(function () { setStep(1); return click(sector); })
          .then(function () { return wait(400); })
          .then(function () { unfocus(sector); return click(exo); })
          .then(function () { el.dd.classList.add('is-open'); return wait(1100); })
          .then(function () { el.dd.classList.remove('is-open'); unfocus(exo); return wait(300); })
          // 2. supplier third-party accounts
          .then(function () { setStep(2); return click(tiers); })
          .then(function () {
            el.tiersPop.style.left = tiers.offsetLeft + 'px';
            el.tiersPop.classList.add('is-show');
            return wait(2000);
          })
          .then(function () { el.tiersPop.classList.remove('is-show'); unfocus(tiers); return wait(300); })
          // 3. Doc / Photo: the PDF opens in the source panel
          .then(function () { setStep(3); return click(upload); })
          .then(function () {
            unfocus(upload);
            el.slot.classList.add('is-loaded');
            renderPaper('000101');
            el.content.classList.add('is-docopen');
            return wait(1300);
          })
          // 4. ANALYSE: journal lines stream in while the pages turn
          .then(function () { setStep(4); return click(target('analyse')); })
          .then(function () {
            el.scan.classList.add('is-on');
            el.analyse.classList.add('is-show');
            var lis = $$('li', el.analyse);
            lis.forEach(function (li) { li.classList.remove('is-working', 'is-done'); });
            return chain(lis, function (li) {
              li.classList.add('is-working');
              return wait(380).then(function () { li.classList.remove('is-working'); li.classList.add('is-done'); });
            });
          })
          .then(function () { unfocus(target('analyse')); el.analyse.classList.remove('is-show'); return wait(300); })
          .then(function () {
            var bodyH = el.body.offsetHeight, lastDoc = '000101';
            return chain(JOURNAL, function (j, k) {
              if (j[2] !== lastDoc) {
                lastDoc = j[2];
                el.paper.classList.add('is-turning');
                setTimeout(function () { renderPaper(lastDoc); el.paper.classList.remove('is-turning'); }, 180);
              }
              fillRow(k, true);
              setTotals(totals.d + j[6], totals.c + j[7], true);
              var over = (k + 2) * ROWH - bodyH;
              if (over > 0) scrollRows(over);
              return wait(150);
            });
          })
          .then(function () {
            el.scan.classList.remove('is-on');
            el.balanced.classList.add('is-show');
            el.exp.classList.add('is-on');
            return wait(1200);
          })
          .then(function () { return click(target('closedoc'), .5, .5); })
          .then(function () { unfocus(target('closedoc')); el.content.classList.remove('is-docopen'); return wait(900); })
          .then(function () { scrollRows(0); return wait(2200); })
          .then(function () { return click(target('clear')); })
          .then(function () {
            slots.forEach(function (s) { s.classList.add('is-clearing'); });
            return wait(400);
          })
          .then(function () {
            slots.forEach(function (s) {
              s.classList.remove('is-clearing', 'is-filled', 'is-new');
              $$('span', s).forEach(function (c) { c.textContent = ''; });
            });
            scrollRows(0);
            setTotals(0, 0, true);
            el.balanced.classList.remove('is-show');
            el.exp.classList.remove('is-on');
            el.slot.classList.remove('is-loaded');
            unfocus(target('clear'));
            setStep(0);
            return wait(1200);
          });
      };

      var forever = function () { return run().then(forever); };
      sleep(1400).then(forever);
    }
  }

  /* ---------- Interactive demo: activity × VAT deduction right ---------- */
  var demo = $('[data-demo]');
  if (demo) {
    var acc = $('[data-acc]', demo), lab = $('[data-lab]', demo), amt = $('[data-amt]', demo);
    var tvaRow = $('[data-row="tva"]', demo);
    var whyA = $('[data-why="activite"]', demo), whyT = $('[data-why="tva"]', demo);
    var auto = $('[data-auto]', demo), bar = $('.demo__bar i', demo);
    var CYCLE = 3600;
    demo.style.setProperty('--cycle', CYCLE + 'ms');

    var ACT = {
      revente: { acc: '6111', lab: 'Achats de marchandises',
        why: 'Les fournitures sont achetées pour être revendues : elles sont comptabilisées en achats de marchandises.' },
      services: { acc: '6125', lab: 'Achats non stockés de matières et fournitures',
        why: 'Les fournitures sont consommées par l’entreprise : elles sont comptabilisées en achats non stockés.' }
    };
    var TVA = {
      avec: { amt: '4 250,00', why: 'La TVA est déductible : elle est portée au compte de TVA récupérable.' },
      sans: { amt: '5 100,00', why: 'La TVA n’est pas déductible : elle s’ajoute au coût de l’achat, TTC en charge.' }
    };

    var flash = function (node) { node.classList.remove('flash'); void node.offsetWidth; node.classList.add('flash'); };
    var swapText = function (node, text) {
      if (node.textContent === text) return;
      if (!window.Promise) { node.textContent = text; return; }
      node.classList.add('is-swapping');
      setTimeout(function () { node.textContent = text; node.classList.remove('is-swapping'); }, 250);
    };
    var value = function (name) { return $('input[name="' + name + '"]:checked', demo).value; };

    var render = function () {
      var a = ACT[value('activite')], t = TVA[value('tva')];
      if (acc.textContent !== a.acc) { acc.textContent = a.acc; flash(acc); }
      if (amt.textContent !== t.amt) { amt.textContent = t.amt; flash(amt); }
      lab.textContent = a.lab + (value('tva') === 'sans' ? ', TVA incluse' : '');
      tvaRow.classList.toggle('is-collapsed', value('tva') === 'sans');
      swapText(whyA, a.why);
      swapText(whyT, t.why);
    };

    var STEPS = [['revente', 'avec'], ['revente', 'sans'], ['services', 'sans'], ['services', 'avec']];
    var step = 0, autoTimer = null, playing = true, demoVisible = false;
    var restartBar = function () { bar.classList.remove('is-running'); void bar.offsetWidth; bar.classList.add('is-running'); };
    var tick = function () {
      if (!playing) return;
      if (demoVisible && !document.hidden) {
        step = (step + 1) % STEPS.length;
        $('input[name="activite"][value="' + STEPS[step][0] + '"]', demo).checked = true;
        $('input[name="tva"][value="' + STEPS[step][1] + '"]', demo).checked = true;
        render();
        restartBar();
      }
      autoTimer = setTimeout(tick, CYCLE);
    };
    var stop = function () { playing = false; clearTimeout(autoTimer); auto.classList.add('is-off'); };

    demo.addEventListener('change', function (e) { if (e.isTrusted) stop(); render(); });

    if (playing && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var was = demoVisible;
        demoVisible = e[0].isIntersecting;
        if (demoVisible && !was && playing) { clearTimeout(autoTimer); restartBar(); autoTimer = setTimeout(tick, CYCLE); }
      }, { threshold: 0.35 }).observe(demo);
    } else {
      auto.classList.add('is-off');
    }
    render();
  }

  /* ---------- Contact form → n8n webhook (JSON, with fallbacks) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var error = document.getElementById('form-error');
    var done = document.getElementById('form-done');
    var submit = $('[data-submit]', form);
    var submitLabel = submit.textContent;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^\+?[\d\s().-]{8,20}$/;

    var showError = function (msg, field) {
      error.textContent = msg;
      error.hidden = false;
      if (field) field.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      $$('[required]', form).forEach(function (field) {
        var v = field.value.trim();
        var bad = !v ||
          (field.type === 'email' && !emailPattern.test(v)) ||
          (field.type === 'tel' && !phonePattern.test(v));
        field.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) missing.push(field);
      });

      if (missing.length) {
        var label = $('label[for="' + missing[0].id + '"]', form).textContent.trim();
        showError(missing.length === 1
          ? 'Vérifiez le champ « ' + label + ' » avant d’envoyer.'
          : 'Renseignez le nom, l’e-mail, le téléphone, le cabinet ou l’entreprise et votre profil avant d’envoyer.', missing[0]);
        return;
      }

      error.hidden = true;
      var val = function (n) { return form.elements[n].value.trim(); };
      var payload = {
        name: val('name'),
        email: val('email'),
        phone: val('phone'),
        organisation: val('organisation'),
        type: val('type'),
        volume: val('volume'),
        message: val('message'),
        source: 'site-think-actionn',
        page: window.location.href,
        submittedAt: new Date().toISOString()
      };

      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;
      submit.textContent = 'Envoi en cours…';

      var endpoint = form.dataset.endpoint;

      // 1. JSON with CORS: the normal path, confirms n8n answered 2xx
      var sendJson = function () {
        return fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); });
      };
      // 2. Simple form-encoded request: no CORS preflight, survives stricter browsers and proxies
      var sendSimple = function (err) {
        if (window.console) console.warn('Webhook JSON en échec, nouvel essai en simple POST :', err);
        return fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(payload) });
      };
      // 3. Classic hidden form post: works even where scripts may not open connections
      var framed = window.self !== window.top;
      var sendFormPost = function (err) {
        if (window.console) console.warn('Simple POST en échec, envoi par formulaire :', err);
        // inside a preview frame (claude.ai), outgoing requests are blocked and delivery can’t be confirmed
        if (framed) return Promise.reject(new Error('preview'));
        return new Promise(function (resolve) {
          var name = 'ta-webhook-' + Date.now();
          var frame = document.createElement('iframe');
          frame.name = name; frame.hidden = true; frame.setAttribute('aria-hidden', 'true');
          var f = document.createElement('form');
          f.method = 'POST'; f.action = endpoint; f.target = name; f.hidden = true;
          Object.keys(payload).forEach(function (k) {
            var input = document.createElement('input');
            input.type = 'hidden'; input.name = k; input.value = payload[k];
            f.appendChild(input);
          });
          document.body.appendChild(frame);
          document.body.appendChild(f);
          var finish = function () { resolve(); setTimeout(function () { f.remove(); frame.remove(); }, 1000); };
          frame.addEventListener('load', finish);
          setTimeout(finish, 4000);
          f.submit();
        });
      };

      sendJson()
        .catch(sendSimple)
        .catch(sendFormPost)
        .then(function () {
          $('[data-done-email]', done).textContent = payload.email;
          $('[data-done-phone]', done).textContent = payload.phone;
          form.classList.add('is-sent');
          done.hidden = false;
          done.focus();
        })
        .catch(function (err) {
          showError(err && err.message === 'preview'
            ? 'Cet aperçu bloque l’envoi vers l’extérieur. Le formulaire fonctionne une fois le site mis en ligne sur votre domaine.'
            : 'L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.');
        })
        .then(function () {
          submit.removeAttribute('aria-busy');
          submit.disabled = false;
          submit.textContent = submitLabel;
        });
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
  window.__owlReady = true;
})();
