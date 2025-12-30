document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
        gsap.registerPlugin(ScrollToPlugin);
    }

    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const scrollHint = document.getElementById("scroll-hint");
    const backToTopBtn = document.getElementById("back-to-top");

    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            body.classList.remove("light-theme");
        } else {
            body.classList.add("light-theme");
            body.classList.remove("dark-theme");
        }
        localStorage.setItem("theme", theme);
        body.setAttribute("data-theme", theme);
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = body.classList.contains("dark-theme");
            applyTheme(isDark ? "light" : "dark");
        });
    }

    const sections = gsap.utils.toArray(".section-page");
    let currentSection = 0;
    let isAnimating = false;

    function goToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length) return;
        isAnimating = true;
        currentSection = index;

        if (currentSection === sections.length - 1) {
            scrollHint.classList.replace("is-visible", "is-hidden");
            backToTopBtn.classList.replace("is-hidden", "is-visible");
        } else {
            scrollHint.classList.replace("is-hidden", "is-visible");
            backToTopBtn.classList.replace("is-visible", "is-hidden");
        }

        gsap.to(window, {
            scrollTo: { y: sections[currentSection], autoKill: false },
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating = false;
            },
        });
    }

    window.addEventListener(
        "wheel",
        (e) => {
            if (isAnimating) return;
            if (e.deltaY > 5) goToSection(currentSection + 1);
            if (e.deltaY < -5) goToSection(currentSection - 1);
        },
        { passive: true }
    );

    window.addEventListener("keydown", (e) => {
        if (isAnimating) return;
        if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
            goToSection(currentSection + 1);
        }
        if (e.key === "ArrowUp" || e.key === "PageUp") {
            e.preventDefault();
            goToSection(currentSection - 1);
        }
    });

    let touchStartY = 0;
    let touchEndY = 0;
    window.addEventListener(
        "touchstart",
        (e) => {
            touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
    );
    window.addEventListener(
        "touchend",
        (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const threshold = 50;
            if (isAnimating) return;
            if (touchStartY - touchEndY > threshold) goToSection(currentSection + 1);
            else if (touchEndY - touchStartY > threshold) goToSection(currentSection - 1);
        },
        { passive: true }
    );

    const exploreBtn = document.querySelector('a[href="#section-1"]');
    if (exploreBtn)
        exploreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            goToSection(1);
        });

    if (backToTopBtn) backToTopBtn.addEventListener("click", () => goToSection(0));

    window.addEventListener("resize", () => {
        gsap.set(window, { scrollTo: { y: sections[currentSection] } });
    });
});
