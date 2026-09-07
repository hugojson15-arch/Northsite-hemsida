(function () {
  "use strict";

  var BUSINESS_EMAIL = "northsite@gmail.com";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Form helpers ---------- */
  function showStatus(el, message, type) {
    el.textContent = message;
    el.classList.remove("success", "error");
    if (type) {
      el.classList.add(type);
    }
  }

  function buildMailto(subject, lines) {
    var body = lines.join("\n");
    return (
      "mailto:" +
      BUSINESS_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function handleFormSubmit(form, statusEl, subject, buildLines, successMessage) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        showStatus(statusEl, "Fyll i de obligatoriska fälten innan du skickar.", "error");
        return;
      }

      var data = new FormData(form);
      var mailtoLink = buildMailto(subject, buildLines(data));

      window.location.href = mailtoLink;
      showStatus(statusEl, successMessage, "success");
      form.reset();
    });
  }

  /* ---------- Offert-formulär ---------- */
  var offertForm = document.getElementById("offertForm");
  var offertStatus = document.getElementById("offertStatus");

  handleFormSubmit(
    offertForm,
    offertStatus,
    "Offertförfrågan från " + "hemsidan",
    function (data) {
      return [
        "Namn: " + data.get("namn"),
        "Företag: " + (data.get("foretag") || "-"),
        "E-post: " + data.get("epost"),
        "Telefon: " + (data.get("telefon") || "-"),
        "",
        "Problem med nuvarande webbplats:",
        data.get("problem")
      ];
    },
    "Tack! Ditt e-postprogram öppnas nu så att du kan skicka din förfrågan."
  );

  /* ---------- Kontaktformulär ---------- */
  var kontaktForm = document.getElementById("kontaktForm");
  var kontaktStatus = document.getElementById("kontaktStatus");

  handleFormSubmit(
    kontaktForm,
    kontaktStatus,
    "Meddelande från hemsidan",
    function (data) {
      return [
        "Namn: " + data.get("namn"),
        "E-post: " + data.get("epost"),
        "Telefon: " + (data.get("telefon") || "-"),
        "",
        "Meddelande:",
        data.get("meddelande")
      ];
    },
    "Tack för ditt meddelande! Ditt e-postprogram öppnas nu."
  );
})();
