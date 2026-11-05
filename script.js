// ===============================
// MOBILE MENU
// ===============================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


// ===============================
// CLOSE MOBILE MENU AFTER CLICK
// ===============================

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("active");
    });
});


// ===============================
// SMOOTH SCROLLING
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// ===============================
// NAVBAR SCROLL EFFECT
// ===============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
});


// ===============================
// SCROLL REVEAL ANIMATION
// ===============================

const revealElements = document.querySelectorAll(
    ".service-card, .about-content, .project-card, .contact-content, .section-title"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    element.classList.add("hidden");
    revealObserver.observe(element);
});


// ===============================
// ACTIVE NAVIGATION LINK
// ===============================

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navItems.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});


// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.querySelector("#name")?.value.trim();
        const email = document.querySelector("#email")?.value.trim();
        const message = document.querySelector("#message")?.value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all the fields.");
            return;
        }

        alert(
            `Thank you, ${name}! Your message has been received.`
        );

        contactForm.reset();
    });
}


// ===============================
// BUTTON FEEDBACK
// ===============================

document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function () {
        this.classList.add("clicked");

        setTimeout(() => {
            this.classList.remove("clicked");
        }, 300);
    });
});


// ===============================
// CURRENT YEAR
// ===============================

const yearElement = document.querySelector("#year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ===============================
// PAGE LOADED
// ===============================

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

console.log("NexaWeb website loaded successfully!");