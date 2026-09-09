(function () {
  "use strict";

  var BUSINESS_EMAIL = "contact.northsite@gmail.com";

  // Klistra in webhook-URL:n från n8n (se automation/n8n-workflow.json och
  // automation/README.md) här när flödet är aktiverat. Tills den är ifylld
  // faller formulären tillbaka till att öppna e-postprogrammet direkt.
  var N8N_WEBHOOK_URL = "";

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

  function setSubmitDisabled(form, disabled) {
    var button = form.querySelector("button[type=submit]");
    if (button) {
      button.disabled = disabled;
    }
  }

  function handleFormSubmit(form, statusEl, subject, buildLines, payload, successMessage) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        showStatus(statusEl, "Fyll i de obligatoriska fälten innan du skickar.", "error");
        return;
      }

      var data = new FormData(form);

      if (!N8N_WEBHOOK_URL) {
        window.location.href = buildMailto(subject, buildLines(data));
        showStatus(statusEl, "Tack! Ditt e-postprogram öppnas nu så att du kan skicka din förfrågan.", "success");
        form.reset();
        return;
      }

      setSubmitDisabled(form, true);
      showStatus(statusEl, "Skickar...", null);

      fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(data))
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Serverfel: " + response.status);
          }
          showStatus(statusEl, successMessage, "success");
          form.reset();
        })
        .catch(function () {
          showStatus(
            statusEl,
            "Kunde inte skicka just nu. Mejla mig gärna direkt på " + BUSINESS_EMAIL + " istället.",
            "error"
          );
        })
        .finally(function () {
          setSubmitDisabled(form, false);
        });
    });
  }

  /* ---------- Offert-formulär ---------- */
  var offertForm = document.getElementById("offertForm");
  var offertStatus = document.getElementById("offertStatus");

  handleFormSubmit(
    offertForm,
    offertStatus,
    "Offertförfrågan från hemsidan",
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
    function (data) {
      return {
        formType: "offert",
        namn: data.get("namn"),
        foretag: data.get("foretag") || "",
        epost: data.get("epost"),
        telefon: data.get("telefon") || "",
        problem: data.get("problem")
      };
    },
    "Tack! Jag återkommer inom kort med en offert."
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
    function (data) {
      return {
        formType: "kontakt",
        namn: data.get("namn"),
        epost: data.get("epost"),
        telefon: data.get("telefon") || "",
        meddelande: data.get("meddelande")
      };
    },
    "Tack för ditt meddelande! Jag återkommer så snart jag kan."
  );
})();
