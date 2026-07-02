(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }

  var toggle = document.querySelector(".theme-toggle");
  function syncToggleLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  syncToggleLabel();
  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    syncToggleLabel();
  });

  /* ---------- mobile nav ---------- */

  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  navToggle.addEventListener("click", function () {
    var open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- hero milestone rotator ---------- */

  var milestones = [
    "Shipping end to end recommender systems.",
    "Retrieval, ranking, and online experimentation.",
    "Turning raw data into features, and features into product.",
    "Deep learning, classical ML, and whatever the problem actually needs.",
    "Experiments first. If it works, the numbers will say so.",
    "Off the clock, mountains, trail miles, and neural nets that write recipes."
  ];

  var rotator = document.getElementById("rotating-text");
  if (rotator && !reduceMotion) {
    var idx = 0;
    setInterval(function () {
      rotator.classList.add("is-out");
      setTimeout(function () {
        idx = (idx + 1) % milestones.length;
        rotator.textContent = milestones[idx];
        rotator.classList.remove("is-out");
      }, 620);
    }, 5200);
  }

  /* ---------- scroll reveal ---------- */

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- hero parallax ---------- */

  var layers = document.querySelectorAll(".hero-scene [data-depth]");
  if (layers.length && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset;
        layers.forEach(function (layer) {
          var depth = parseFloat(layer.getAttribute("data-depth"));
          layer.style.transform = "translateY(" + (y * depth * 0.25) + "px)";
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- project dialogs ---------- */

  document.querySelectorAll(".card-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var dlg = document.getElementById(trigger.getAttribute("data-dialog"));
      if (dlg) dlg.showModal();
    });
  });

  document.querySelectorAll(".project-dialog").forEach(function (dlg) {
    dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      // click on the backdrop closes (the dialog itself is the target there)
      if (e.target === dlg) dlg.close();
    });
  });

  /* ---------- project filters ---------- */

  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".project-card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      var filter = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) card.classList.add("is-visible");
      });
    });
  });

  /* ---------- footer year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
