(function () {
  var LANG_KEY = 'amirsoy_lang';
  var flags  = { en: 'https://flagcdn.com/w20/gb.png', ru: 'https://flagcdn.com/w20/ru.png', uz: 'https://flagcdn.com/w20/uz.png' };
  var labels = { en: 'EN', ru: 'RU', uz: 'UZ' };

  function getLang() { return localStorage.getItem(LANG_KEY) || 'en'; }

  function applyTranslations(lang) {
    if (!window.translations || !window.translations[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      var val = window.translations[lang][key];
      if (val === undefined) return;
      if (el.children.length > 0) {
        // Has child elements (SVG icons etc) — update only the first text node
        for (var i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
            el.childNodes[i].textContent = val + ' ';
            return;
          }
        }
      } else {
        el.textContent = val;
      }
    });
    document.documentElement.lang = lang;
  }

  function autoTagNav() {
    var map = {
      'about.html':       'nav_about',
      'activities.html':  'nav_activities',
      'rooms.html':       'nav_rooms',
      'restaurants.html': 'nav_restaurants',
      'contact.html':     'nav_contact'
    };
    document.querySelectorAll('nav a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (map[href] && !a.dataset.i18n) a.dataset.i18n = map[href];
    });
    document.querySelectorAll('a[href="https://tickets.amirsoy.com"]').forEach(function (a) {
      if (!a.dataset.i18n) a.dataset.i18n = 'page_book_now';
    });
  }

  function autoTagByText() {
    var textToKey = {
      // Nav / common buttons
      'Book Now':                           'page_book_now',
      'Back to Home':                       'page_back_home_lnk',
      'All Rooms':                          'page_all_rooms',
      // About-Us dropdown items
      'Resort Info':                        'nav_resort_info',
      'Businesses':                         'nav_businesses',
      // Footer columns
      'Navigation':                         'page_footer_nav',
      'Public Offer':                       'page_footer_offer_lnk',
      'Privacy Policy':                     'page_footer_privacy_lnk',
      'Safety Rules':                       'page_footer_safety_lnk',
      'Accommodation':                      'page_footer_rooms_lnk',
      'Business':                           'page_footer_biz_lnk',
      // Footer tagline & copyright
      'Amirsoy Mountain Resort — an all-season destination 65 km from Tashkent in the Tian Shan Mountains.': 'page_footer_tagline',
      '© 2026 Amirsoy Mountain Resort. All rights reserved.': 'page_footer_copy',
      // Page h1 headings
      'Contact Us':                         'page_contact_title',
      'Business\nOpportunities':            'page_biz_title',
      'Business Opportunities':             'page_biz_title',
      // About page
      'Who We Are':                         'page_about_who_label',
      'World-class all-season mountain resort in Uzbekistan': 'page_about_headline',
      'Infrastructure':                     'page_about_infra_label',
      'Everything you need on the mountain':'page_about_infra_title',
      'Location':                           'page_about_loc_label',
      'Chimgan, Tian Shan Mountains':       'page_about_loc_title',
      // Activities page
      'Gondola Lifts':                      'page_act_lifts_title',
      'Ski & Snowboard':                    'page_act_ski_title',
      'Passes & Tickets':                   'page_act_tickets_title',
      'Rope Park — Yeti Park':              'page_act_rope_title',
      'Quad Riding':                        'page_act_quad_title',
      'Red Rock Hammom & SPA':              'page_act_spa_title',
      // Section labels on activities page
      'Winter season · 100–120 days/year':  'page_act_ski_label',
      'Pricing':                            'page_act_tickets_label',
      'Summer & year-round':                'page_act_rope_label',
      'Guided experience':                  'page_act_quad_label',
      'Wellness · Recently renovated':      'page_act_spa_label',
      // Businesses page
      'Corporate Events':                   'page_biz_events_title',
      'Advertising Opportunities':          'page_biz_ads_title',
      'Supplier Partnerships':              'page_biz_sup_title',
      'Business Services':                  'page_biz_events_label',
      'Marketing':                          'page_biz_ads_label',
      'Supply Chain':                       'page_biz_sup_label',
      // Rooms page
      'on request':                         'page_rooms_onreq',
      'More Details →':                     'page_rooms_more',
      'Included with every stay':           'page_rooms_facility',
      'Ready to book?':                     'page_rooms_book_q',
      'Check-in 15:00 · Check-out 12:00':  'page_rooms_checkin',
      'Breakfast included':                 'page_rooms_breakfast',
      'Ski-in / Ski-out access':            'page_rooms_skiinout',
      // Contact page
      'For quick responses, reach us directly via social networks or call the numbers below.': 'page_contact_sub',
    };

    document.querySelectorAll('h1, h2, h3, h4, p, span, a, button').forEach(function (el) {
      if (el.dataset.i18n) return;
      if (el.children.length > 0) return; // only tag leaf nodes
      var text = el.textContent.trim();
      if (textToKey[text]) el.dataset.i18n = textToKey[text];
    });
  }

  /* Runtime translation of remaining body text */
  var SKIP_TAGS = { SCRIPT:1, STYLE:1, NOSCRIPT:1, CODE:1, PRE:1, TEXTAREA:1 };
  var _pairs = null; // [{node, en}] captured once

  function collectTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var t = n.nodeValue;
        if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
        // need at least one letter (latin or cyrillic); skip pure numbers/symbols
        if (!/[A-Za-zЀ-ӿ]/.test(t)) return NodeFilter.FILTER_REJECT;
        // skip emails / urls
        if (/@|https?:|www\./.test(t)) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        while (p) {
          if (SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute && (p.hasAttribute('data-i18n') || p.hasAttribute('data-no-translate'))) return NodeFilter.FILTER_REJECT;
          if (p.id === 'page-lang-switcher') return NodeFilter.FILTER_REJECT;
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function ensurePairs() {
    if (_pairs) return _pairs;
    _pairs = collectTextNodes().map(function (n) { return { node: n, en: n.nodeValue }; });
    return _pairs;
  }

  function keepWs(orig, translated) {
    var lead  = orig.match(/^\s*/)[0];
    var trail = orig.match(/\s*$/)[0];
    return lead + translated + trail;
  }

  function loadCache(lang) {
    try { return JSON.parse(localStorage.getItem('mt_' + lang) || '{}'); } catch (e) { return {}; }
  }
  function saveCache(lang, obj) {
    try { localStorage.setItem('mt_' + lang, JSON.stringify(obj)); } catch (e) {}
  }

  function translateOne(text, lang, cb) {
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
              lang + '&dt=t&q=' + encodeURIComponent(text);
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      var out = '';
      if (d && d[0]) for (var i = 0; i < d[0].length; i++) if (d[0][i][0]) out += d[0][i][0];
      cb(out || text);
    }).catch(function () { cb(text); });
  }

  // Group strings into few requests (≤40 strings or ≤1400 chars each)
  function chunkKeys(keys) {
    var chunks = [], cur = [], len = 0;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (cur.length && (cur.length >= 40 || len + k.length > 1400)) { chunks.push(cur); cur = []; len = 0; }
      cur.push(k); len += k.length + 1;
    }
    if (cur.length) chunks.push(cur);
    return chunks;
  }

  function translateChunk(chunk, lang, cb) {
    translateOne(chunk.join('\n'), lang, function (res) {
      var parts = res.split('\n'), map = {};
      if (parts.length === chunk.length) {
        for (var i = 0; i < chunk.length; i++) map[chunk[i]] = parts[i];
        cb(map);
      } else {
        // line count mismatch — fall back to per-string for this chunk
        var done = 0;
        chunk.forEach(function (k) {
          translateOne(k, lang, function (r) { map[k] = r; if (++done === chunk.length) cb(map); });
        });
      }
    });
  }

  function autoTranslatePage(lang) {
    var pairs = ensurePairs();
    if (lang === 'en') {
      pairs.forEach(function (p) { p.node.nodeValue = p.en; });
      return;
    }
    var cache = loadCache(lang);
    var pending = {};
    pairs.forEach(function (p) {
      var key = p.en.trim();
      if (cache[key] !== undefined) p.node.nodeValue = keepWs(p.en, cache[key]);
      else pending[key] = true;
    });
    var keys = Object.keys(pending);
    if (!keys.length) return;

    var chunks = chunkKeys(keys), remaining = chunks.length;
    function applyMap(m) {
      pairs.forEach(function (p) {
        var key = p.en.trim();
        if (m[key] !== undefined) p.node.nodeValue = keepWs(p.en, m[key]);
      });
    }
    chunks.forEach(function (chunk) {
      translateChunk(chunk, lang, function (m) {
        Object.keys(m).forEach(function (k) { cache[k] = m[k]; });
        applyMap(m);                       // fill in this chunk immediately
        if (--remaining === 0) saveCache(lang, cache);
      });
    });
  }

  window._pageLangSelect = function (lang) {
    localStorage.setItem(LANG_KEY, lang);
    var menu = document.getElementById('page-lang-menu');
    if (menu) menu.classList.add('hidden');
    var flag = document.getElementById('page-lang-flag');
    var lbl  = document.getElementById('page-lang-label');
    if (flag) flag.src   = flags[lang];
    if (lbl)  lbl.textContent = labels[lang];
    autoTagNav();
    autoTagByText();
    applyTranslations(lang);
    autoTranslatePage(lang);
  };

  window._pageLangToggle = function () {
    var menu = document.getElementById('page-lang-menu');
    if (menu) menu.classList.toggle('hidden');
  };

  function buildWidget(lang) {
    var wrap = document.createElement('div');
    wrap.id = 'page-lang-switcher';
    wrap.style.cssText = 'position:relative;';
    wrap.innerHTML =
      '<div style="position:relative;">' +
        '<button onclick="_pageLangToggle()" style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:9999px;padding:5px 13px;color:#fff;font-size:12px;letter-spacing:0.05em;cursor:pointer;font-family:inherit;">' +
          '<img id="page-lang-flag" src="' + flags[lang] + '" style="width:16px;height:11px;object-fit:cover;border-radius:2px;"/>' +
          '<span id="page-lang-label">' + labels[lang] + '</span>' +
          '<svg style="width:10px;height:10px;color:#c4c7c8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>' +
        '</button>' +
        '<div id="page-lang-menu" class="hidden" style="position:absolute;right:0;top:calc(100% + 6px);background:rgba(31,31,31,0.96);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;min-width:90px;z-index:100;">' +
          '<button onclick="_pageLangSelect(\'en\')" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 14px;font-size:12px;cursor:pointer;background:none;border:none;color:#c4c7c8;font-family:inherit;"><img src="' + flags.en + '" style="width:16px;height:11px;object-fit:cover;border-radius:2px;"/><span>EN</span></button>' +
          '<button onclick="_pageLangSelect(\'ru\')" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 14px;font-size:12px;cursor:pointer;background:none;border:none;color:#c4c7c8;font-family:inherit;"><img src="' + flags.ru + '" style="width:16px;height:11px;object-fit:cover;border-radius:2px;"/><span>RU</span></button>' +
          '<button onclick="_pageLangSelect(\'uz\')" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 14px;font-size:12px;cursor:pointer;background:none;border:none;color:#c4c7c8;font-family:inherit;"><img src="' + flags.uz + '" style="width:16px;height:11px;object-fit:cover;border-radius:2px;"/><span>UZ</span></button>' +
        '</div>' +
      '</div>';

    // Insert into nav's right-side button group (before Book Now / hamburger)
    var navRight = document.querySelector('nav .flex.items-center.gap-3');
    if (navRight) {
      navRight.insertBefore(wrap, navRight.firstChild);
    } else {
      // fallback: fixed top-right
      wrap.style.cssText = 'position:fixed;top:12px;right:24px;z-index:9999;';
      document.body.appendChild(wrap);
    }

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        var menu = document.getElementById('page-lang-menu');
        if (menu) menu.classList.add('hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lang = getLang();
    buildWidget(lang);
    autoTagNav();
    autoTagByText();
    applyTranslations(lang);
    if (lang !== 'en') autoTranslatePage(lang);
  });
})();
