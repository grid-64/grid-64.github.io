"use strict";

document.querySelectorAll(".hero-gallery").forEach(gallery => {
  const track = gallery.querySelector(".hero-gallery-track");
  const controls = gallery.querySelector(".hero-gallery-controls");
  const toggle = controls.querySelector(".hero-gallery-toggle");
  const dots = [...controls.querySelectorAll(".hero-gallery-dot")];
  const captions = [...gallery.querySelectorAll("[data-gallery-caption]")];
  const count = gallery.querySelector(".gallery-count");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let playing = !motion.matches;
  let visible = false;
  let hovered = false;
  let timer;

  function show(index) {
    track.scrollTo({left: index * track.clientWidth, behavior: motion.matches ? "instant" : "smooth"});
  }

  function schedule() {
    clearTimeout(timer);
    if (playing && visible && !hovered && !document.hidden) {
      timer = setTimeout(() => {
        show((active + 1) % dots.length);
        schedule();
      }, 5000);
    }
  }

  function setPlaying(value) {
    playing = value;
    toggle.classList.toggle("is-playing", value);
    toggle.dataset.label = value ? "Pause photos" : "Play photos";
    toggle.setAttribute("aria-label", t(toggle.dataset.label));
    schedule();
  }

  track.addEventListener("scroll", () => {
    const index = Math.max(0, Math.min(dots.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    if (index === active) return;
    active = index;
    dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === active)));
    captions.forEach((caption, i) => { caption.hidden = i !== active; });
    if (count) count.textContent = `${String(active + 1).padStart(2, "0")} / ${String(dots.length).padStart(2, "0")}`;
  }, {passive: true});
  track.addEventListener("pointerdown", () => setPlaying(false));
  toggle.addEventListener("click", () => setPlaying(!playing));
  dots.forEach((dot, index) => dot.addEventListener("click", () => {
    setPlaying(false);
    show(index);
  }));
  controls.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const next = (active + (event.key === "ArrowLeft" ? -1 : 1) + dots.length) % dots.length;
    dots[next].focus();
    setPlaying(false);
    show(next);
  });
  gallery.addEventListener("focusin", event => {
    if (event.target.matches(":focus-visible")) setPlaying(false);
  });
  gallery.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    schedule();
  });
  gallery.addEventListener("pointerleave", () => {
    hovered = false;
    schedule();
  });
  motion.addEventListener("change", event => {
    if (event.matches) setPlaying(false);
  });
  document.addEventListener("visibilitychange", schedule);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }).observe(track);

  setPlaying(playing);
  controls.hidden = false;
});
