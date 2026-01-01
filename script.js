document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
        gsap.registerPlugin(ScrollToPlugin);
    }

    const themeToggle = document.getElementById("theme-toggle");
    const themeIconContainer = document.getElementById("theme-icon-container");
    const langToggle = document.getElementById("lang-toggle");
    const langFlagContainer = document.getElementById("lang-flag-container");
    const body = document.body;
    const scrollHint = document.getElementById("scroll-hint");
    const backToTopBtn = document.getElementById("back-to-top");

    const themeIcons = {
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
    };

    const flags = {
        es: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="170.7" height="512" fill="#006847"/><rect x="170.7" width="170.6" height="512" fill="#fff"/><rect x="341.3" width="170.7" height="512" fill="#ce1126"/><circle cx="256" cy="256" r="40" fill="#9ca168"/></svg>`,
        en: `<svg viewBox="0 0 741 390" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="741" height="390" fill="#b22234"/><path d="M0,30H741M0,90H741M0,150H741M0,210H741M0,270H741M0,330H741" stroke="#fff" stroke-width="30"/><rect width="296.4" height="210" fill="#3c3b6e"/><g fill="#fff"><g id="s18"><g id="s9"><g id="s5"><g id="s"><polygon points="0,-10 5.88,8.09 -9.51,-3.09 9.51,-3.09 -5.88,8.09"/></g><use xlink:href="#s" x="49.4"/><use xlink:href="#s" x="98.8"/><use xlink:href="#s" x="148.2"/><use xlink:href="#s" x="197.6"/></g><use xlink:href="#s5" x="24.7" y="17.5"/></g><use xlink:href="#s9" y="35"/><use xlink:href="#s9" y="70"/><use xlink:href="#s9" y="105"/><use xlink:href="#s9" y="140"/></g></svg>`,
    };

    let currentLang = localStorage.getItem("preferredLang") || "es";
    function updateLanguage(lang) {
        if (langFlagContainer) langFlagContainer.innerHTML = lang === "es" ? flags.en : flags.es;
        document.querySelectorAll(".translate").forEach((el) => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.textContent = text;
        });
        localStorage.setItem("preferredLang", lang);
    }
    updateLanguage(currentLang);

    langToggle?.addEventListener("click", () => {
        currentLang = currentLang === "es" ? "en" : "es";
        updateLanguage(currentLang);
    });

    const applyTheme = (theme) => {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            document.documentElement.classList.add("dark");
            if (themeIconContainer) themeIconContainer.innerHTML = themeIcons.sun;
        } else {
            body.classList.remove("dark-theme");
            document.documentElement.classList.remove("dark");
            if (themeIconContainer) themeIconContainer.innerHTML = themeIcons.moon;
        }
        localStorage.setItem("theme", theme);
    };

    applyTheme(localStorage.getItem("theme") || "light");

    themeToggle?.addEventListener("click", () => {
        applyTheme(body.classList.contains("dark-theme") ? "light" : "dark");
    });

    const sections = gsap.utils.toArray(".section-page");
    let currentSection = 0;
    let isAnimating = false;

    window.goToSection = function (index) {
        if (isAnimating || index < 0 || index >= sections.length) return;
        isAnimating = true;
        currentSection = index;

        if (currentSection === sections.length - 1) {
            scrollHint?.classList.add("hidden");
            backToTopBtn?.classList.remove("hidden");
        } else {
            scrollHint?.classList.remove("hidden");
            backToTopBtn?.classList.add("hidden");
        }

        gsap.to(window, {
            scrollTo: { y: sections[currentSection], autoKill: false },
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => (isAnimating = false),
        });
    };

    window.addEventListener(
        "wheel",
        (e) => {
            if (isAnimating) return;
            if (e.deltaY > 20) goToSection(currentSection + 1);
            else if (e.deltaY < -20) goToSection(currentSection - 1);
        },
        { passive: true }
    );

    let ts;
    window.addEventListener("touchstart", (e) => (ts = e.touches[0].clientY), { passive: true });
    window.addEventListener(
        "touchend",
        (e) => {
            let te = e.changedTouches[0].clientY;
            if (ts - te > 50) goToSection(currentSection + 1);
            else if (te - ts > 50) goToSection(currentSection - 1);
        },
        { passive: true }
    );

    backToTopBtn?.addEventListener("click", () => goToSection(0));
});
