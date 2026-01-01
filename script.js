let currentSection = 0;
const totalSections = 5;
let isScrolling = false;
let touchStartY = 0;
let touchEndY = 0;

const flags = {
    // Círculo café central: r="40" y fill="#5D4037"
    es: `<svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice"><path fill="#006847" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/><circle fill="#5D4037" cx="320" cy="240" r="40" opacity="0.8"/></svg>`,
    en: `<svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice"><path fill="#002868" d="M0 0h640v480H0z"/><path fill="#FFF" d="M0 0h640v36.9H0zm0 73.8h640v37H0zm0 73.9h640v36.9H0zm0 73.8h640v37H0zm0 73.9h640v36.9H0zm0 73.8h640v37H0z"/><path fill="#BF0A30" d="M0 37h640v36.9H0zm0 73.8h640v37H0zm0 73.9h640v36.9H0zm0 73.8h640v37H0zm0 73.9h640v36.9H0zm0 73.8h640v37H0z"/><path fill="#002868" d="M0 0h256v221.5H0z"/><path fill="#FFF" d="M25.6 18.5l3.5 10.7h11.2l-9.1 6.6 3.5 10.7-9.1-6.6-9.1 6.6 3.5-10.7-9.1-6.6h11.2z"/></svg>`,
};

const icons = {
    light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    dark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
};

function updateUI() {
    const lang = localStorage.getItem("lang") || "es";
    const isDark = document.body.classList.contains("dark-theme");
    document.getElementById("lang-flag-container").innerHTML = lang === "es" ? flags.en : flags.es;
    document.getElementById("theme-icon-container").innerHTML = isDark ? icons.light : icons.dark;
    document.querySelectorAll(".translate").forEach((el) => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

function goToSection(index) {
    if (index < 0 || index >= totalSections || isScrolling) return;
    isScrolling = true;
    currentSection = index;
    gsap.to(window, {
        duration: 0.8,
        scrollTo: `#section-${index}`,
        ease: "power2.inOut",
        onComplete: () => {
            isScrolling = false;
        },
    });
}

window.addEventListener(
    "wheel",
    (e) => {
        if (!isScrolling) {
            if (e.deltaY > 0) goToSection(currentSection + 1);
            else goToSection(currentSection - 1);
        }
    },
    { passive: true }
);

window.addEventListener(
    "touchstart",
    (e) => {
        touchStartY = e.touches[0].clientY;
    },
    { passive: true }
);
window.addEventListener(
    "touchend",
    (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleTouch();
    },
    { passive: true }
);

function handleTouch() {
    const swipeDistance = touchStartY - touchEndY;
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) goToSection(currentSection + 1);
        else goToSection(currentSection - 1);
    }
}

document.getElementById("lang-toggle").addEventListener("click", () => {
    localStorage.setItem("lang", (localStorage.getItem("lang") || "es") === "es" ? "en" : "es");
    updateUI();
});

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    updateUI();
});

updateUI();
