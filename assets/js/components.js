/* Shared Navbar + Footer — injected into every page for consistency */
(function () {
  const NAV_ITEMS = [
    { label: "Beranda", href: "/" },
    {
      label: "Profil Sekolah",
      dropdown: [
        { label: "Identitas Sekolah", href: "/identitas.html" },
        { label: "Visi & Misi", href: "/visi-misi.html" },
        { label: "Struktur Organisasi", href: "/struktur-organisasi.html" },
      ],
    },
    {
      label: "Konsentrasi Keahlian",
      dropdown: [
        { label: "DKV (Desain Komunikasi Visual)", href: "/dkv.html" },
        { label: "TPM (Teknik Pemesinan)", href: "/tpm.html" },
      ],
    },
    {
      label: "Kesiswaan",
      dropdown: [
        { label: "Ekstrakurikuler", href: "/ekstrakurikuler.html" },
        { label: "Prestasi", href: "/prestasi.html" },
      ],
    },
    {
      label: "Akademik & Informasi",
      dropdown: [
        { label: "Kalender Akademik", href: "/kalender.html" },
        { label: "Berita & Artikel", href: "/berita.html" },
        { label: "PPDB (Pendaftaran)", href: "/ppdb.html" },
      ],
    },
    { label: "Hubungi Kami", href: "/kontak.html" },
  ];

  function activePath(href) {
    const p = window.location.pathname;
    if (href === "/" && (p === "/" || p === "/index.html")) return true;
    return p === href || p.endsWith(href);
  }

  function renderNav() {
    const items = NAV_ITEMS.map((item) => {
      if (item.dropdown) {
        const ddId = "dd-" + item.label.replace(/\s+/g, "-").toLowerCase();
        const links = item.dropdown
          .map(
            (d) =>
              `<li><a class="dropdown-item${activePath(d.href) ? " active" : ""}" href="${d.href}">${d.label}</a></li>`,
          )
          .join("");
        const parentActive = item.dropdown.some((d) => activePath(d.href));
        return `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle${parentActive ? " active" : ""}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" id="${ddId}">
            ${item.label}<i class="bi bi-chevron-down dd-chevron ms-1" style="font-size:10px"></i>
          </a>
          <ul class="dropdown-menu" aria-labelledby="${ddId}">${links}</ul>
        </li>`;
      }
      const isContact = item.label === "Hubungi Kami";
      return `
    <li class="nav-item${isContact ? " nav-item-contact" : ""}">
      <a class="nav-link${activePath(item.href) ? " active" : ""}" href="${item.href}">${item.label}</a>
    </li>`;
    }).join("");

    return `
      <a class="navbar-brand d-flex align-items-center gap-2" href="/">
        <img src="/img/logosmkwk.png" alt="Logo SMK Wahana Karya" style="margin-left: 80px" class="logo-img">
        <span class="navbar-brand-text">SMK WAHANA KARYA<br>SURABAYA</span>
      </a>
      <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">${items}</ul>
      </div>`;
  }

  function renderFooter() {
    return `
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-5">
            <div class="d-flex align-items-start gap-3">
              <img src="/img/logosmkwk.png" alt="Logo SMK WK" class="logo-img" style="height:140px;width:140px">
              <div class="footer-info">
                <h3 class="footer-logo-text mb-1">SMK Wahana Karya<br>Surabaya</h3>
                <div class="info-row mt-3"><i class="bi bi-geo-alt-fill info-icon"></i><p class="mb-0">Jl. Mbah Wongso I, Dk. Karang Ploso Bangkingan, Surabaya</p></div>
                <div class="info-row"><i class="bi bi-telephone-fill info-icon"></i><p class="mb-0">031-99017261</p></div>
                <div class="info-row"><i class="bi bi-envelope-fill info-icon"></i><p class="mb-0">info.wahanakarya@sch.id</p></div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <h4 class="footer-heading">Quick Links</h4>
            <a class="footer-link" href="/">Beranda</a>
            <a class="footer-link" href="/identitas.html">Identitas Sekolah</a>
            <a class="footer-link" href="/dkv.html">Jurusan DKV</a>
            <a class="footer-link" href="/tpm.html">Jurusan TPM</a>
            <a class="footer-link" href="/ppdb.html">PPDB 2026</a>
          </div>
          <div class="col-lg-4">
            <h4 class="footer-heading">Ikuti Kami</h4>
            <div class="footer-social">
              <a href="https://www.instagram.com/smkwksby/" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="https://www.facebook.com/groups/617402491622892/" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="https://www.youtube.com/@smkwahanakaryasurabaya8768" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              <a href="https://www.tiktok.com/@skaways" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
            </div>
            <h4 class="footer-heading mt-4">Lokasi Sekolah</h4>
            <div class="footer-map">
              <iframe src="https://www.google.com/maps?q=SMK+Wahana+Karya+Surabaya,-7.3235073,112.6575073&z=17&output=embed" loading="lazy" title="Lokasi SMK Wahana Karya"></iframe>
            </div>
          </div>
        </div>
        <div class="footer-bottom">Copyright &copy; 2026 SMK Wahana Karya Surabaya</div>
      </div>`;
  }

  function inject() {
    const headerEl = document.getElementById("site-header");
    if (headerEl) {
      headerEl.className = "navbar navbar-expand-lg sticky-top";
      headerEl.innerHTML = renderNav();
    }
    const footerEl = document.getElementById("site-footer");
    if (footerEl) footerEl.innerHTML = renderFooter();
    const back = document.createElement("button");
    back.id = "back-to-top";
    back.innerHTML = '<i class="bi bi-arrow-up"></i>';
    back.setAttribute("aria-label", "Kembali ke atas");
    document.body.appendChild(back);

    /* Floating dark mode toggle — bottom-left */
    if (!document.getElementById("theme-toggle-fab")) {
      const fab = document.createElement("button");
      fab.id = "theme-toggle-fab";
      fab.type = "button";
      fab.setAttribute("aria-label", "Toggle dark mode");
      fab.innerHTML =
        '<i class="bi bi-sun-fill theme-icon-light"></i><i class="bi bi-moon-stars-fill theme-icon-dark"></i>';
      document.body.appendChild(fab);
    }
  }

  document.addEventListener("DOMContentLoaded", inject);
})();
