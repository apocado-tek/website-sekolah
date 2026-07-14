/* Main JS — navbar scroll, scroll animations, hero slider, dark mode FAB, dropdown chevron, forms */

document.addEventListener("DOMContentLoaded", function () {
  /* --- Navbar shrink/color on scroll --- */
  const header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    const back = document.getElementById("back-to-top");
    if (back) {
      if (window.scrollY > 400) back.classList.add("show");
      else back.classList.remove("show");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Back to top --- */
  document.body.addEventListener("click", function (e) {
    if (e.target.closest("#back-to-top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  /* --- Dark mode toggle (floating FAB) --- */
  document.body.addEventListener("click", function (e) {
    const fab = e.target.closest("#theme-toggle-fab");
    if (!fab) return;
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  });

  /* --- Intersection Observer for fade/slide animations --- */
  const animEls = document.querySelectorAll(
    ".fade-in-up, .fade-in, .slide-in-left, .slide-in-right",
  );
  if ("IntersectionObserver" in window && animEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    animEls.forEach((el) => io.observe(el));
  } else {
    animEls.forEach((el) => el.classList.add("visible"));
  }

  /* --- Hero carousel: auto-play 5s + arrows + dots --- */
  const hero = document.getElementById("heroCarousel");
  if (hero && typeof bootstrap !== "undefined") {
    const carousel = bootstrap.Carousel.getOrCreateInstance(hero, {
      interval: 5000,
      ride: "carousel",
      pause: false,
      wrap: true,
    });
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.querySelector(".hero-arrow.prev");
    const nextBtn = document.querySelector(".hero-arrow.next");

    hero.addEventListener("slid.bs.carousel", function (e) {
      dots.forEach((d, i) => d.classList.toggle("active", i === e.to));
    });
    if (prevBtn)
      prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        carousel.prev();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        carousel.next();
      });
    dots.forEach((dot, i) => {
      dot.addEventListener("click", function () {
        carousel.to(i);
      });
    });
  }

  /* --- Contact form validation --- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest(".mb-3");
        const fb = wrap ? wrap.querySelector(".invalid-feedback") : null;
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          if (fb) fb.style.display = "block";
          valid = false;
        } else if (
          field.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
        ) {
          field.classList.add("is-invalid");
          if (fb) fb.style.display = "block";
          valid = false;
        } else {
          field.classList.remove("is-invalid");
          if (fb) fb.style.display = "none";
        }
      });
      const successAlert = document.getElementById("formSuccess");
      if (valid) {
        if (successAlert) {
          successAlert.style.display = "block";
          successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        contactForm.reset();
      }
    });
    contactForm.querySelectorAll("[required]").forEach((field) => {
      field.addEventListener("input", function () {
        field.classList.remove("is-invalid");
        const fb = field.closest(".mb-3");
        if (fb) {
          const f = fb.querySelector(".invalid-feedback");
          if (f) f.style.display = "none";
        }
      });
    });
  }

  /* --- Active nav highlight --- */
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      (href === currentPath || (href !== "/" && currentPath.endsWith(href)))
    ) {
      link.classList.add("active");
    }
  });

  /* --- Detail Prestasi pagination (in-page content swap) --- */
  const prestasiPagination = document.getElementById("prestasiPagination");
  if (prestasiPagination) {
    const pages = document.querySelectorAll(".prestasi-detail-page");
    function showPrestasiPage(idx) {
      pages.forEach((p, i) => {
        p.style.display = i === idx ? "" : "none";
      });
      prestasiPagination.querySelectorAll(".page-item").forEach((item) => {
        const link = item.querySelector(".page-link");
        if (link.dataset.page) {
          item.classList.toggle(
            "active",
            parseInt(link.dataset.page) === idx + 1,
          );
        }
        if (link.dataset.action === "prev") {
          item.classList.toggle("disabled", idx === 0);
        }
        if (link.dataset.action === "next") {
          item.classList.toggle("disabled", idx === pages.length - 1);
        }
      });
      const section = document.querySelector(".section-white");
      window.scrollTo({
        top: section ? section.offsetTop - 80 : 0,
        behavior: "smooth",
      });
    }
    prestasiPagination.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".page-link");
      if (!link) return;
      const action = link.dataset.action;
      const pageAttr = link.dataset.page;
      const current = Array.from(pages).findIndex(
        (p) => p.style.display !== "none",
      );
      let target = current < 0 ? 0 : current;
      if (pageAttr !== undefined) target = parseInt(pageAttr) - 1;
      else if (action === "prev") target = Math.max(0, current - 1);
      else if (action === "next")
        target = Math.min(pages.length - 1, current + 1);
      if (target >= 0 && target < pages.length) showPrestasiPage(target);
    });
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get("page")) || 1;
    const validPage =
      initialPage >= 1 && initialPage <= pages.length ? initialPage : 1;
    showPrestasiPage(validPage - 1);
  }
  /* --- Prestasi LIST pagination (grouping cards by data-page) --- */
  const prestasiListRow = document.getElementById("prestasiListRow");
  const prestasiPaginationList = document.getElementById(
    "prestasiPaginationList",
  );
  if (prestasiListRow && prestasiPaginationList) {
    const listCards = Array.from(prestasiListRow.children);
    const totalPages = Math.max(
      ...listCards.map((c) => parseInt(c.dataset.page || "1")),
    );

    function showListPage(page) {
      listCards.forEach((card) => {
        card.style.display =
          parseInt(card.dataset.page || "1") === page ? "" : "none";
      });
      prestasiPaginationList.querySelectorAll(".page-item").forEach((item) => {
        const link = item.querySelector(".page-link");
        if (link.dataset.page) {
          item.classList.toggle("active", parseInt(link.dataset.page) === page);
        }
        if (link.dataset.action === "prev") {
          item.classList.toggle("disabled", page === 1);
        }
        if (link.dataset.action === "next") {
          item.classList.toggle("disabled", page === totalPages);
        }
      });
      window.scrollTo({
        top: prestasiListRow.offsetTop - 100,
        behavior: "smooth",
      });
    }

    prestasiPaginationList.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".page-link");
      if (!link) return;
      const current =
        parseInt(
          prestasiPaginationList.querySelector(".page-item.active .page-link")
            ?.dataset.page,
        ) || 1;
      let target = current;
      if (link.dataset.page) target = parseInt(link.dataset.page);
      else if (link.dataset.action === "prev")
        target = Math.max(1, current - 1);
      else if (link.dataset.action === "next")
        target = Math.min(totalPages, current + 1);
      showListPage(target);
    });

    showListPage(1);
  }
  /* --- Prestasi search filter --- */
  const prestasiSearchInput = document.getElementById("prestasiSearchInput");
  if (prestasiSearchInput && prestasiListRow) {
    prestasiSearchInput.addEventListener("input", function () {
      const keyword = this.value.trim().toLowerCase();
      const listCards = Array.from(prestasiListRow.children);
      listCards.forEach((card) => {
        const title =
          card.querySelector(".card-title-custom")?.textContent.toLowerCase() ||
          "";
        const text =
          card.querySelector(".card-text-custom")?.textContent.toLowerCase() ||
          "";
        const match = title.includes(keyword) || text.includes(keyword);
        card.style.display = keyword === "" ? "" : match ? "" : "none";
      });
      // Sembunyikan pagination saat sedang mencari (karena hasil filter tidak dibagi per halaman)
      const paginationRow = document
        .querySelector(".prestasi-pagination")
        ?.closest(".row");
      if (paginationRow) {
        paginationRow.style.display = keyword === "" ? "" : "none";
      }
      if (keyword === "") {
        showListPage(1); // reset ke halaman 1 saat search dikosongkan
      }
    });
  }
  /* --- Berita LIST pagination (grouping cards by data-page) --- */
  const beritaListRow = document.getElementById("beritaListRow");
  const beritaPaginationList = document.getElementById("beritaPaginationList");
  if (beritaListRow && beritaPaginationList) {
    const beritaCards = Array.from(beritaListRow.children);
    const beritaTotalPages = Math.max(
      ...beritaCards.map((c) => parseInt(c.dataset.page || "1")),
    );

    function showBeritaPage(page) {
      beritaCards.forEach((card) => {
        card.style.display =
          parseInt(card.dataset.page || "1") === page ? "" : "none";
      });
      beritaPaginationList.querySelectorAll(".page-item").forEach((item) => {
        const link = item.querySelector(".page-link");
        if (link.dataset.page) {
          item.classList.toggle("active", parseInt(link.dataset.page) === page);
        }
        if (link.dataset.action === "prev") {
          item.classList.toggle("disabled", page === 1);
        }
        if (link.dataset.action === "next") {
          item.classList.toggle("disabled", page === beritaTotalPages);
        }
      });
      window.scrollTo({
        top: beritaListRow.offsetTop - 100,
        behavior: "smooth",
      });
    }

    beritaPaginationList.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".page-link");
      if (!link) return;
      const current =
        parseInt(
          beritaPaginationList.querySelector(".page-item.active .page-link")
            ?.dataset.page,
        ) || 1;
      let target = current;
      if (link.dataset.page) target = parseInt(link.dataset.page);
      else if (link.dataset.action === "prev")
        target = Math.max(1, current - 1);
      else if (link.dataset.action === "next")
        target = Math.min(beritaTotalPages, current + 1);
      showBeritaPage(target);
    });

    showBeritaPage(1);
  }
  /* --- Detail Berita pagination (in-page content swap, mirrors Prestasi) --- */
  const beritaDetailPagination = document.getElementById(
    "beritaDetailPagination",
  );
  if (beritaDetailPagination) {
    const beritaPages = document.querySelectorAll(".berita-detail-page");
    function showBeritaDetailPage(idx) {
      beritaPages.forEach((p, i) => {
        p.style.display = i === idx ? "" : "none";
      });
      beritaDetailPagination.querySelectorAll(".page-item").forEach((item) => {
        const link = item.querySelector(".page-link");
        if (link.dataset.page) {
          item.classList.toggle(
            "active",
            parseInt(link.dataset.page) === idx + 1,
          );
        }
        if (link.dataset.action === "prev") {
          item.classList.toggle("disabled", idx === 0);
        }
        if (link.dataset.action === "next") {
          item.classList.toggle("disabled", idx === beritaPages.length - 1);
        }
      });
      const section = document.querySelector(".section-white");
      window.scrollTo({
        top: section ? section.offsetTop - 80 : 0,
        behavior: "smooth",
      });
    }
    beritaDetailPagination.addEventListener("click", function (e) {
      e.preventDefault();
      const link = e.target.closest(".page-link");
      if (!link) return;
      const action = link.dataset.action;
      const pageAttr = link.dataset.page;
      const current = Array.from(beritaPages).findIndex(
        (p) => p.style.display !== "none",
      );
      let target = current < 0 ? 0 : current;
      if (pageAttr !== undefined) target = parseInt(pageAttr) - 1;
      else if (action === "prev") target = Math.max(0, current - 1);
      else if (action === "next")
        target = Math.min(beritaPages.length - 1, current + 1);
      if (target >= 0 && target < beritaPages.length)
        showBeritaDetailPage(target);
    });

    const beritaUrlParams = new URLSearchParams(window.location.search);
    const beritaInitialPage = parseInt(beritaUrlParams.get("page")) || 1;
    const beritaValidPage =
      beritaInitialPage >= 1 && beritaInitialPage <= beritaPages.length
        ? beritaInitialPage
        : 1;
    showBeritaDetailPage(beritaValidPage - 1);
  }
  /* --- Berita search filter --- */
  const beritaSearchInput = document.getElementById("beritaSearchInput");
  if (beritaSearchInput && beritaListRow) {
    beritaSearchInput.addEventListener("input", function () {
      const keyword = this.value.trim().toLowerCase();
      const beritaCardsSearch = Array.from(beritaListRow.children);
      beritaCardsSearch.forEach((card) => {
        const title =
          card.querySelector(".news-title")?.textContent.toLowerCase() || "";
        const text =
          card.querySelector(".news-excerpt")?.textContent.toLowerCase() || "";
        const match = title.includes(keyword) || text.includes(keyword);
        card.style.display = keyword === "" ? "" : match ? "" : "none";
      });
      const beritaPaginationRow = beritaPaginationList?.closest(".row");
      if (beritaPaginationRow) {
        beritaPaginationRow.style.display = keyword === "" ? "" : "none";
      }
      if (keyword === "") {
        showBeritaPage(1);
      }
    });
  }
  /* ===========================
   SHARE BUTTON
=========================== */

  document.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.dataset.share;

      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      switch (type) {
        case "whatsapp":
          window.open(`https://wa.me/?text=${title}%20${url}`, "_blank");
          break;

        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            "_blank",
          );
          break;

        case "telegram":
          window.open(
            `https://t.me/share/url?url=${url}&text=${title}`,
            "_blank",
          );
          break;

        case "x":
          window.open(
            `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            "_blank",
          );
          break;

        case "copy":
          navigator.clipboard.writeText(window.location.href);
          alert("Link berhasil disalin.");
          break;

        case "instagram":
          window.open("https://www.instagram.com/smkwksby/", "_blank");
          break;

        case "tiktok":
          window.open("https://www.tiktok.com/@skaways", "_blank");
          break;
      }
    });
  });
});
