(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  var narrow = window.matchMedia('(max-width: 760px)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;

  function scrollRig() {
    return !narrow.matches && !calm.matches;
  }

  function update() {
    ticking = false;
    if (!scrollRig()) return;
    var travel = stage.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    var p = (stage.getBoundingClientRect().top * -1) / travel;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    stage.style.setProperty('--p', p.toFixed(4));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function setMode() {
    if (scrollRig()) {
      stage.classList.remove('static');
      update();
    } else {
      stage.classList.add('static');
      stage.style.removeProperty('--p');
    }
  }

  setMode();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', setMode);
  narrow.addEventListener('change', setMode);
  calm.addEventListener('change', setMode);
})();
