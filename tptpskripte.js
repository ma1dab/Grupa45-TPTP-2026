"use strict";

/*
    1. Filtriranje kartica parfemskih brendova na index.html
    2. Tamni/svijetli mod uz localStorage
    3. Validacija kontakt forme bez HTML5 required atributa
    4. Interaktivna statistika i favoriti
    5. Smooth scroll za bookmark navigaciju
    
*/

document.addEventListener("DOMContentLoaded", function () {
  pokreniTamniMod();
  pokreniFiltriranjeKartica();
  pokreniValidacijuForme();
  pokreniInteraktivnuStatistiku();
  pokreniSmoothScroll();
});

/* tamni/svjetli mod*/

function pokreniTamniMod() {
  var dugme = document.getElementById("theme-toggle");
  var sacuvanaTema = localStorage.getItem("scentifyTema");

  if (sacuvanaTema === "tamna") {
    postaviTemu(true);
  } else {
    postaviTemu(false);
  }

  if (dugme) {
    dugme.addEventListener("click", function () {
      var trenutnoTamna = document.body.classList.contains("tamni-mod");

      if (trenutnoTamna) {
        postaviTemu(false);
        localStorage.setItem("scentifyTema", "svijetla");
      } else {
        postaviTemu(true);
        localStorage.setItem("scentifyTema", "tamna");
      }
    });
  }
}

function postaviTemu(tamnaTema) {
  var dugme = document.getElementById("theme-toggle");

  if (tamnaTema) {
    document.body.classList.add("tamni-mod");

    if (dugme) {
      dugme.textContent = "☀️ Svijetli mod";
    }
  } else {
    document.body.classList.remove("tamni-mod");

    if (dugme) {
      dugme.textContent = "🌙 Tamni mod";
    }
  }
}

/* kartice filtriranje kategorija*/

function pokreniFiltriranjeKartica() {
  var kartice = document.querySelectorAll("#perfume-grid .card");

  if (kartice.length === 0) {
    return;
  }

  napraviFilterMeni(kartice);

  var filterLinkovi = document.querySelectorAll(".side-nav a[data-filter]");

  for (var i = 0; i < filterLinkovi.length; i++) {
    filterLinkovi[i].addEventListener("click", function (event) {
      event.preventDefault();

      var filter = this.getAttribute("data-filter");
      filtrirajKartice(filter);
      oznaciAktivniFilter(filter);
    });
  }

  filtrirajKartice("sve");
  oznaciAktivniFilter("sve");
}

function napraviFilterMeni(kartice) {
  var lista = document.querySelector(".side-nav ul");

  if (!lista) {
    return;
  }

  var kategorije = [];

  for (var i = 0; i < kartice.length; i++) {
    var kategorija = kartice[i].getAttribute("data-category");

    if (kategorija && kategorije.indexOf(kategorija) === -1) {
      kategorije.push(kategorija);
    }
  }

  lista.innerHTML = "";
  lista.appendChild(napraviFilterStavku("sve", "Prikaži sve"));

  for (var j = 0; j < kategorije.length; j++) {
    lista.appendChild(
      napraviFilterStavku(
        kategorije[j],
        formatirajNazivKategorije(kategorije[j]),
      ),
    );
  }
}

function napraviFilterStavku(filter, tekst) {
  var li = document.createElement("li");
  var link = document.createElement("a");

  link.href = "#";
  link.textContent = tekst;
  link.setAttribute("data-filter", filter);

  li.appendChild(link);

  return li;
}

function formatirajNazivKategorije(kategorija) {
  var nazivi = {
    chanel: "Chanel",
    dior: "Dior",
    tomford: "Tom Ford",
    creed: "Creed",
    mfk: "Maison Francis K.",
    amouage: "Amouage",
    ysl: "YSL",
    prada: "Prada",
  };

  if (nazivi[kategorija]) {
    return nazivi[kategorija];
  }

  return kategorija;
}

function filtrirajKartice(filter) {
  var kartice = document.querySelectorAll("#perfume-grid .card");
  var prikazano = 0;

  for (var i = 0; i < kartice.length; i++) {
    var kategorijaKartice = kartice[i].getAttribute("data-category");

    if (filter === "sve" || filter === kategorijaKartice) {
      kartice[i].style.display = "flex";
      prikazano++;
    } else {
      kartice[i].style.display = "none";
    }
  }

  azurirajStatistikuFiltera(prikazano, kartice.length);
}

function oznaciAktivniFilter(filter) {
  var linkovi = document.querySelectorAll(".side-nav a[data-filter]");

  for (var i = 0; i < linkovi.length; i++) {
    linkovi[i].classList.remove("aktivni-filter");

    if (linkovi[i].getAttribute("data-filter") === filter) {
      linkovi[i].classList.add("aktivni-filter");
    }
  }
}

function azurirajStatistikuFiltera(prikazano, ukupno) {
  var statistika = document.getElementById("filter-statistika");
  var sideNav = document.querySelector(".side-nav");

  if (!statistika && sideNav) {
    statistika = document.createElement("p");
    statistika.id = "filter-statistika";
    sideNav.appendChild(statistika);
  }

  if (statistika) {
    statistika.textContent =
      "Prikazano: " + prikazano + " od " + ukupno + " brendova.";
  }
}

/* forma validacija */

function pokreniValidacijuForme() {
  var forma = document.querySelector(".main-form");

  if (!forma) {
    return;
  }

  forma.setAttribute("novalidate", "novalidate");

  var elementiSaRequired = forma.querySelectorAll("[required]");

  for (var i = 0; i < elementiSaRequired.length; i++) {
    elementiSaRequired[i].removeAttribute("required");
  }

  forma.addEventListener("submit", function (event) {
    event.preventDefault();

    ocistiGreske();

    var ime = document.getElementById("ime");
    var prezime = document.getElementById("prezime");
    var email = document.getElementById("email");
    var telefon = document.getElementById("telefon");
    var temaUpita = document.getElementById("temaUpita");
    var poruka = document.getElementById("poruka");

    var ispravnaForma = true;

    if (!ime || ime.value.trim() === "") {
      prikaziGresku(ime, "Unesite ime.");
      ispravnaForma = false;
    } else if (ime.value.trim().length < 2) {
      prikaziGresku(ime, "Ime mora imati najmanje 2 slova.");
      ispravnaForma = false;
    }

    if (!prezime || prezime.value.trim() === "") {
      prikaziGresku(prezime, "Unesite prezime.");
      ispravnaForma = false;
    } else if (prezime.value.trim().length < 2) {
      prikaziGresku(prezime, "Prezime mora imati najmanje 2 slova.");
      ispravnaForma = false;
    }

    var emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    if (!email || email.value.trim() === "") {
      prikaziGresku(email, "Unesite email adresu.");
      ispravnaForma = false;
    } else if (!emailRegex.test(email.value.trim())) {
      prikaziGresku(email, "Email nije u ispravnom formatu.");
      ispravnaForma = false;
    }

    //validacija sta smije sadrziti
    var telefonRegex = /^[0-9\s-]+$/;

    if (!telefon || telefon.value.trim() === "") {
      prikaziGresku(telefon, "Unesite broj telefona.");
      ispravnaForma = false;
    } else if (!telefonRegex.test(telefon.value.trim())) {
      prikaziGresku(
        telefon,
        "Telefon smije sadržavati samo cifre, razmake i crtice.",
      );
      ispravnaForma = false;
    } else if (telefon.value.replace(/\D/g, "").length < 6) {
      prikaziGresku(telefon, "Telefon je prekratak.");
      ispravnaForma = false;
    }

    if (!temaUpita || temaUpita.value.trim() === "") {
      prikaziGresku(temaUpita, "Odaberite temu upita.");
      ispravnaForma = false;
    }

    if (!poruka || poruka.value.trim() === "") {
      prikaziGresku(poruka, "Unesite poruku.");
      ispravnaForma = false;
    } else if (poruka.value.trim().length < 10) {
      prikaziGresku(poruka, "Poruka mora imati najmanje 10 znakova.");
      ispravnaForma = false;
    }

    if (ispravnaForma) {
      var imeKorisnika = ime.value.trim();

      forma.reset();
      ocistiGreske();

      prikaziUspjesnuPoruku(imeKorisnika);
    }
  });

  forma.addEventListener("reset", function () {
    ocistiGreske();

    var uspjesnaPoruka = document.getElementById("poruka-uspjeha");

    if (uspjesnaPoruka) {
      uspjesnaPoruka.textContent = "";
      uspjesnaPoruka.style.display = "none";
    }
  });
}

function prikaziGresku(polje, poruka) {
  if (!polje) {
    return;
  }

  polje.classList.add("polje-greska");

  var grupa =
    polje.closest(".form-grupa") ||
    polje.closest(".form-group") ||
    polje.parentElement;

  var tekstGreske = grupa.querySelector(".tekst-greske");

  if (!tekstGreske) {
    tekstGreske = document.createElement("small");
    tekstGreske.className = "tekst-greske";
    grupa.appendChild(tekstGreske);
  }

  tekstGreske.textContent = poruka;
  tekstGreske.style.display = "block";
}

function ocistiGreske() {
  var polja = document.querySelectorAll(".polje-greska");
  var greske = document.querySelectorAll(".tekst-greske");

  for (var i = 0; i < polja.length; i++) {
    polja[i].classList.remove("polje-greska");
  }

  for (var j = 0; j < greske.length; j++) {
    greske[j].textContent = "";
    greske[j].style.display = "none";
  }
}

function prikaziUspjesnuPoruku(imeKorisnika) {
  var uspjesnaPoruka = document.getElementById("poruka-uspjeha");

  if (!uspjesnaPoruka) {
    return;
  }

  uspjesnaPoruka.textContent =
    "Hvala, " + imeKorisnika + "! Vaša poruka je uspješno poslana.";
  uspjesnaPoruka.style.display = "block";
}

// statistika favoriti

function pokreniInteraktivnuStatistiku() {
  var mjesto =
    document.querySelector(".aside-content") ||
    document.querySelector(".online-info") ||
    document.querySelector(".info-kutija");

  var kartice = document.querySelectorAll("#perfume-grid .card");

  var listaFavorita = JSON.parse(
    localStorage.getItem("scentifyListaFavorita") || "[]",
  );

  var brojOtvaranja = Number(
    localStorage.getItem("scentifyBrojOtvaranja") || 0,
  );

  brojOtvaranja++;

  localStorage.setItem("scentifyBrojOtvaranja", brojOtvaranja);

  if (mjesto && !document.getElementById("js-interaktivna-statistika")) {
    var statistika = document.createElement("div");
    statistika.id = "js-interaktivna-statistika";
    statistika.className = "js-statistika";

    var naslov = document.createElement("h3");
    naslov.textContent = "📊 Statistika";

    var posjete = document.createElement("p");
    posjete.textContent =
      "Ovu web lokaciju ste otvorili " +
      brojOtvaranja +
      " puta u ovom browseru.";

    var brojBrendova = document.createElement("p");

    if (kartice.length > 0) {
      brojBrendova.textContent =
        "U katalogu je trenutno " + kartice.length + " parfemskih brendova.";
    } else {
      brojBrendova.textContent = "Istražite naš katalog luksuznih parfema.";
    }

    var brojacFavorita = document.createElement("p");
    brojacFavorita.id = "brojac-favorita";
    brojacFavorita.textContent =
      "Broj sačuvanih favorita: " + listaFavorita.length;

    statistika.appendChild(naslov);
    statistika.appendChild(posjete);
    statistika.appendChild(brojBrendova);
    statistika.appendChild(brojacFavorita);

    mjesto.appendChild(statistika);
  }

  poveziFavorite();
}

function poveziFavorite() {
  var dugmad = document.querySelectorAll(".favorite-btn");

  if (dugmad.length === 0) {
    return;
  }

  var listaFavorita = JSON.parse(
    localStorage.getItem("scentifyListaFavorita") || "[]",
  );

  for (var i = 0; i < dugmad.length; i++) {
    var dugme = dugmad[i];
    var kartica = dugme.closest(".card");

    if (!kartica) {
      continue;
    }

    var kategorija = kartica.getAttribute("data-category");

    if (!kategorija) {
      continue;
    }

    if (listaFavorita.indexOf(kategorija) !== -1) {
      dugme.textContent = "✔ Dodano u favorite";
      dugme.disabled = true;
    }

    dugme.addEventListener("click", function () {
      var karticaKliknuta = this.closest(".card");
      var kategorijaKliknuta = karticaKliknuta.getAttribute("data-category");

      var novaLista = JSON.parse(
        localStorage.getItem("scentifyListaFavorita") || "[]",
      );

      if (novaLista.indexOf(kategorijaKliknuta) === -1) {
        novaLista.push(kategorijaKliknuta);
      }

      localStorage.setItem("scentifyListaFavorita", JSON.stringify(novaLista));

      this.textContent = "✔ Dodano u favorite";
      this.disabled = true;

      var brojac = document.getElementById("brojac-favorita");

      if (brojac) {
        brojac.textContent = "Broj sačuvanih favorita: " + novaLista.length;
      }
    });
  }
}

//smooth scroll

function pokreniSmoothScroll() {
  var linkovi = document.querySelectorAll('a[href^="#"]');

  for (var i = 0; i < linkovi.length; i++) {
    linkovi[i].addEventListener("click", function (event) {
      var href = this.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      var idElementa = href.substring(1);
      var cilj = document.getElementById(idElementa);

      if (cilj) {
        event.preventDefault();

        cilj.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }
}
