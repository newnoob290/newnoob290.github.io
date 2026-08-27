/* Page-turn engine. One book per page. */
(function () {
  var book = document.querySelector('.book');
  if (!book) return;

  var spreads = Array.prototype.map.call(
    document.querySelectorAll('.spreads .spread'),
    function (s) {
      var l = s.querySelector('.side-l'), r = s.querySelector('.side-r');
      return { l: l ? l.innerHTML : '', r: r ? r.innerHTML : '' };
    }
  );
  if (!spreads.length) return;

  var pageL   = book.querySelector('.page-l');
  var pageR   = book.querySelector('.page-r');
  var turner  = book.querySelector('.turner');
  var tFront  = book.querySelector('.turner-front');
  var tBack   = book.querySelector('.turner-back');
  var cover   = book.querySelector('.cover');
  var prevBtn = document.querySelector('.pager-prev');
  var nextBtn = document.querySelector('.pager-next');
  var counter = document.querySelector('.counter');

  var idx = -1, busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function isPhone() { return window.matchMedia('(max-width: 760px)').matches; }

  function render(i) { pageL.innerHTML = spreads[i].l; pageR.innerHTML = spreads[i].r; }

  function sync() {
    book.style.setProperty('--p', idx < 0 ? 0 : 1);
    book.classList.toggle('is-open', idx >= 0);
    prevBtn.disabled = idx < 0;
    nextBtn.disabled = idx >= spreads.length - 1;
    counter.textContent = idx < 0 ? 'Cover' : (idx + 1) + ' of ' + spreads.length;
  }

  function go(dir) {
    if (busy) return;
    if (idx < 0) { if (dir > 0) { idx = 0; render(0); sync(); } return; }

    var target = idx + dir;
    if (target < 0) { idx = -1; sync(); return; }   /* back from page 1 closes it */
    if (target >= spreads.length) return;

    if (reduce || isPhone()) { idx = target; render(idx); sync(); return; }

    busy = true;
    if (dir > 0) {
      tFront.innerHTML = spreads[idx].r;
      tBack.innerHTML  = spreads[target].l;
      turner.classList.remove('is-flipped');
      turner.classList.add('is-turning');
      void turner.offsetWidth;
      idx = target; render(idx); sync();
      turner.classList.add('is-flipped');
    } else {
      tFront.innerHTML = spreads[target].r;
      tBack.innerHTML  = spreads[idx].l;
      turner.classList.add('is-flipped');
      turner.classList.remove('is-turning');
      void turner.offsetWidth;
      turner.classList.add('is-turning');
      idx = target; render(idx); sync();
      turner.classList.remove('is-flipped');
    }

    var settled = false;
    function done() {
      if (settled) return;
      settled = true;
      turner.classList.remove('is-turning', 'is-flipped');
      busy = false;
      turner.removeEventListener('transitionend', done);
    }
    turner.addEventListener('transitionend', done);
    setTimeout(done, 900);
  }

  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });
  cover.addEventListener('click', function () { if (idx < 0) go(1); });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') { go(1); }
    if (e.key === 'ArrowLeft')  { go(-1); }
  });

  render(0);
  sync();

  /* contents list jumps straight to a spread */
  Array.prototype.forEach.call(document.querySelectorAll('.toc button'), function (b) {
    b.addEventListener('click', function () {
      var t = parseInt(b.dataset.spread, 10);
      if (isNaN(t) || t < 0 || t >= spreads.length) return;
      idx = t; render(idx); sync();
      book.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* "read it all flat" toggle */
  var toggle = document.querySelector('.flatlink');
  var flat = document.querySelector('.flat');
  if (toggle && flat) {
    toggle.addEventListener('click', function () {
      var open = flat.hasAttribute('hidden');
      if (open) { flat.removeAttribute('hidden'); } else { flat.setAttribute('hidden', ''); }
      toggle.textContent = open ? toggle.dataset.close : toggle.dataset.open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) flat.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }
})();
