/* Frontier Barbecue — mobile menu, scroll-spy, counters, grill scroll, lightbox */
(function () {
  "use strict";

  /* Mobile menu — opens instantly (no transition on the open/close state) */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) setMenu(false);
  });

  /* Scroll-spy: highlight the nav link for the section in view */
  var navLinks = document.querySelectorAll(".site-nav a");
  var sections = ["karahi", "grill", "live-fire", "family", "gallery", "visit"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { spy.observe(s); });

  /* Animated counters — real numbers only */
  var counters = document.querySelectorAll(".count");
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObserver.unobserve(el);
      var target = parseFloat(el.getAttribute("data-target"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        el.textContent = target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        return;
      }
      var start = null, dur = 1400;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* Grill horizontal-scroll arrows */
  var grill = document.getElementById("grillScroll");
  var prev = document.querySelector(".grill-prev");
  var next = document.querySelector(".grill-next");
  if (grill && prev && next) {
    var step = function () { return Math.min(grill.clientWidth * 0.8, 380); };
    prev.addEventListener("click", function () { grill.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { grill.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* Lightbox gallery */
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox.querySelector(".lightbox-img");
  var lbCap = lightbox.querySelector(".lightbox-caption");
  var lastFocus = null;
  function openLightbox(btn) {
    lastFocus = document.activeElement;
    lbImg.src = btn.getAttribute("data-full");
    lbImg.alt = btn.getAttribute("data-alt") || "";
    lbCap.textContent = btn.getAttribute("data-alt") || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () { openLightbox(btn); });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".dish-card, .grill-card, .why-card, .gallery-item, .process li");
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }
})();
