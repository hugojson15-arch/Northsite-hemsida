(function () {
  "use strict";

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

  /* ---------- Exempeldata (påhittad, tydligt märkt) ---------- */
  /* Detta är EXEMPELDATA för att visa hur sajten fungerar.
     Ersätt med riktiga priser/paket från riktiga trafikskolor innan lansering. */
  var PACKAGES = [
    { school: "Kiruna Trafikskola", city: "Kiruna", type: "b", package: "Bas", price: 18900, includes: "15 körlektioner (40 min) + teorimaterial", url: "#" },
    { school: "Fjällkörskolan", city: "Gällivare", type: "am", package: "Moped Start", price: 4200, includes: "10 lektioner + teori online", url: "#" },
    { school: "Bodens Trafikskola", city: "Boden", type: "skoter", package: "Snabbkurs", price: 2495, includes: "1 dags kurs, prov samma dag", url: "#" },
    { school: "Luleå Körskola Nord", city: "Luleå", type: "b", package: "Komplett", price: 22500, includes: "20 körlektioner + riskettan + halkbana", url: "#" },
    { school: "Polcirkelns Trafikskola", city: "Luleå", type: "am", package: "Moped Bas", price: 3900, includes: "8 lektioner + teoriprov", url: "#" },
    { school: "Piteå Trafikutbildning", city: "Piteå", type: "b", package: "Intensiv", price: 19900, includes: "16 lektioner, klar på 3 veckor", url: "#" },
    { school: "Skellefteå Körskola", city: "Skellefteå", type: "skoter", package: "Helgkurs", price: 2200, includes: "Lör–sön, teori + praktik", url: "#" },
    { school: "Umeå Trafikskola Ström", city: "Umeå", type: "b", package: "Bas", price: 17500, includes: "14 körlektioner + teorimaterial", url: "#" },
    { school: "Örnsköldsviks Körskola", city: "Örnsköldsvik", type: "am", package: "Moped Komplett", price: 4500, includes: "12 lektioner + halkbana", url: "#" },
    { school: "Sundsvalls Trafikcenter", city: "Sundsvall", type: "b", package: "Premium", price: 24900, includes: "24 körlektioner + halkbana + riskettan", url: "#" },
    { school: "Hudiksvalls Körskola", city: "Hudiksvall", type: "skoter", package: "Kvällskurs", price: 1995, includes: "3 kvällar, litet gruppantal", url: "#" },
    { school: "Gävle Trafikskola Nord", city: "Gävle", type: "b", package: "Studentpaket", price: 16900, includes: "12 körlektioner, studentrabatt", url: "#" }
  ];

  var LICENSE_LABELS = { b: "B-körkort", am: "AM-körkort (moped)", skoter: "Skoterkort" };

  var state = { type: "b", city: "" };

  var tabs = document.querySelectorAll(".type-tab");
  var citySelect = document.getElementById("cityFilter");
  var resultsEl = document.getElementById("results");
  var resultsCount = document.getElementById("resultsCount");

  function formatPrice(n) {
    return n.toLocaleString("sv-SE") + " kr";
  }

  function render() {
    var items = PACKAGES.filter(function (p) {
      return p.type === state.type && (!state.city || p.city === state.city);
    }).sort(function (a, b) {
      return a.price - b.price;
    });

    resultsCount.textContent = items.length
      ? items.length + " paket hittade — billigast överst"
      : "Inga paket hittades för det här filtret.";

    resultsEl.innerHTML = "";

    items.forEach(function (p, i) {
      var row = document.createElement("article");
      row.className = "result-row";
      if (i === 0) row.classList.add("result-cheapest");

      row.innerHTML =
        '<div class="result-main">' +
        (i === 0 ? '<span class="badge">Billigast</span>' : "") +
        '<h3>' + p.school + '</h3>' +
        '<p class="result-meta">' + p.city + ' · ' + p.package + '</p>' +
        '<p class="result-includes">' + p.includes + '</p>' +
        '</div>' +
        '<div class="result-side">' +
        '<span class="result-price">' + formatPrice(p.price) + '</span>' +
        '<a class="btn btn-small btn-primary" href="' + p.url + '">Se erbjudande</a>' +
        '</div>';

      resultsEl.appendChild(row);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      state.type = tab.dataset.type;
      render();
    });
  });

  citySelect.addEventListener("change", function () {
    state.city = citySelect.value;
    render();
  });

  render();

  /* ---------- Annonsörformulär ---------- */
  var BUSINESS_EMAIL = "contact.northsite@gmail.com";

  function showStatus(el, message, type) {
    el.textContent = message;
    el.classList.remove("success", "error");
    if (type) el.classList.add(type);
  }

  function buildMailto(subject, lines) {
    return "mailto:" + BUSINESS_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  var adForm = document.getElementById("adForm");
  var adStatus = document.getElementById("adStatus");

  adForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!adForm.checkValidity()) {
      adForm.reportValidity();
      showStatus(adStatus, "Fyll i de obligatoriska fälten innan du skickar.", "error");
      return;
    }
    var data = new FormData(adForm);
    var lines = [
      "Trafikskola: " + data.get("skola"),
      "Ort: " + data.get("ort"),
      "E-post: " + data.get("epost"),
      "Telefon: " + (data.get("telefon") || "-"),
      "",
      "Meddelande:",
      data.get("meddelande")
    ];
    window.location.href = buildMailto("Annonsintresse från körkortssajten – " + data.get("skola"), lines);
    showStatus(adStatus, "Tack! Ditt e-postprogram öppnas nu.", "success");
    adForm.reset();
  });
})();
