/* Aatasam Farooq portfolio: nav, Calendly popup, lightbox, scroll reveal, audit form */
(function () {
  "use strict";

  // Your Calendly booking page. Change this one line if the link ever changes.
  var CALENDLY_URL = "https://calendly.com/aatasamq/discovery-audit-call";

  document.documentElement.classList.add("js");

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav state + mobile menu ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  /* ---------- Calendly popup ---------- */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-calendly]");
    if (!trigger) return;
    e.preventDefault();
    closeMenu();
    if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Widget script blocked or still loading: open the booking page directly.
      window.open(CALENDLY_URL, "_blank", "noopener");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el) {
      // Stagger siblings slightly for a softer cascade
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("reveal");
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
      io.observe(el);
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("figcaption");
  var lbCount = lb.querySelector(".lightbox__count");
  var lbClose = lb.querySelector(".lightbox__close");
  var group = [];
  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var item = group[index];
    lbImg.src = item.dataset.src;
    lbImg.alt = item.querySelector("img").alt;
    lbCap.textContent = item.dataset.caption || "";
    lbCount.textContent = group.length > 1 ? (index + 1) + " of " + group.length : "";
  }

  function openLightbox(trigger) {
    var name = trigger.dataset.lightbox;
    group = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + name + '"]'));
    lastFocus = trigger;
    lb.classList.toggle("is-single", group.length < 2);
    show(group.indexOf(trigger));
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    lbClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    lb.hidden = true;
    lbImg.src = "";
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () { openLightbox(el); });
  });
  lbClose.addEventListener("click", closeLightbox);
  lb.querySelector(".lightbox__nav--prev").addEventListener("click", function () { show(index - 1); });
  lb.querySelector(".lightbox__nav--next").addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft" && group.length > 1) show(index - 1);
    else if (e.key === "ArrowRight" && group.length > 1) show(index + 1);
    else if (e.key === "Tab") {
      // Keep focus inside the dialog
      var focusables = Array.prototype.filter.call(lb.querySelectorAll("button"), function (b) {
        return b.offsetParent !== null;
      });
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Audit form (Formspree) ---------- */
  var form = document.getElementById("audit-form");
  var statusEl = form.querySelector(".form__status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "form__status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var invalid = [];
    form.querySelectorAll("[required]").forEach(function (field) {
      var bad = !field.value.trim() || (field.type === "email" && !field.checkValidity());
      field.classList.toggle("is-invalid", bad);
      if (bad) invalid.push(field);
    });
    if (invalid.length) {
      setStatus("Please fill in your name, clinic, a valid email and your main goal.", "error");
      invalid[0].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    setStatus("");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        setStatus("Thanks, I'll get back to you within a day.", "success");
      })
      .catch(function () {
        // Fields are left as typed so the visitor can simply try again
        setStatus("Sorry, that didn't send. Please try again, or email me at aatasamq@gmail.com.", "error");
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Get my free ad audit";
      });
  });

  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("is-invalid")) e.target.classList.remove("is-invalid");
  });
})();
