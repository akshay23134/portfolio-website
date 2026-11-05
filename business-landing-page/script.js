/* =========================================================
   VELORA - BUSINESS LANDING PAGE
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");

            const isOpen = navMenu.classList.contains("active");

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close Menu" : "Open Menu"
            );

            menuToggle.innerHTML = isOpen ? "✕" : "☰";
        });

        // Close mobile menu after clicking a navigation link
        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.innerHTML = "☰";
                menuToggle.setAttribute("aria-label", "Open Menu");
            });
        });
    }


    /* =====================================================
       2. SMOOTH SCROLLING
       ===================================================== */

    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    allAnchorLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                const navbar = document.querySelector(".navbar");
                const navbarHeight = navbar
                    ? navbar.offsetHeight
                    : 0;

                const targetPosition =
                    targetSection.getBoundingClientRect().top +
                    window.pageYOffset -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });

    });


    /* =====================================================
       3. NAVBAR SHADOW ON SCROLL
       ===================================================== */

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar);
    updateNavbar();


    /* =====================================================
       4. ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-menu a");

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });

        navigationLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }

        });
    }

    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav();


    /* =====================================================
       5. SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".about-image, " +
        ".about-content, " +
        ".product-card, " +
        ".feature-card, " +
        ".review-card, " +
        ".contact-info, " +
        ".contact-form-wrapper"
    );

    revealElements.forEach(element => {
        element.classList.add("js-reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       6. PRODUCT CARD INTERACTION
       ===================================================== */

    const productCards = document.querySelectorAll(".product-card");
    const productButtons = document.querySelectorAll(".product-btn");

    productCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
        });

    });


    /* =====================================================
       7. PRODUCT DETAILS MODAL
       ===================================================== */

    const productData = [

        {
            name: "Classic Cotton Tee",
            category: "T-SHIRTS",
            price: "₹899",
            description:
                "Minimal everyday t-shirt crafted for comfort."
        },

        {
            name: "Oversized Linen Shirt",
            category: "SHIRTS",
            price: "₹1,499",
            description:
                "Relaxed fit with a clean modern silhouette."
        },

        {
            name: "Urban Denim Jacket",
            category: "JACKETS",
            price: "₹2,199",
            description:
                "A versatile layer made for everyday adventures."
        },

        {
            name: "Everyday Essential",
            category: "TOPS",
            price: "₹1,099",
            description:
                "Simple, versatile and easy to style."
        },

        {
            name: "Essential Comfort Hoodie",
            category: "HOODIES",
            price: "₹1,799",
            description:
                "Soft everyday comfort with a modern fit."
        },

        {
            name: "Relaxed Fit Pants",
            category: "BOTTOMS",
            price: "₹1,599",
            description:
                "Comfortable everyday pants with a clean finish."
        }

    ];


    function createProductModal(product) {

        const oldModal = document.querySelector(".product-modal");

        if (oldModal) {
            oldModal.remove();
        }

        const modal = document.createElement("div");

        modal.className = "product-modal";

        modal.innerHTML = `
            <div class="product-modal-overlay"></div>

            <div class="product-modal-box">

                <button class="product-modal-close"
                        aria-label="Close Product Details">
                    ✕
                </button>

                <span class="modal-category">
                    ${product.category}
                </span>

                <h2>${product.name}</h2>

                <p class="modal-description">
                    ${product.description}
                </p>

                <div class="modal-price">
                    ${product.price}
                </div>

                <button class="btn btn-primary modal-shop-btn">
                    Shop This Product
                </button>

            </div>
        `;

        document.body.appendChild(modal);

        // Small styling so modal works even without extra CSS
        const style = document.createElement("style");

        style.className = "product-modal-style";

        style.textContent = `
            .product-modal {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .product-modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(20, 16, 18, 0.65);
                backdrop-filter: blur(5px);
            }

            .product-modal-box {
                position: relative;
                z-index: 2;
                width: min(460px, 100%);
                background: #fffaf7;
                padding: 40px;
                border-radius: 22px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.25);
                animation: modalOpen 0.25s ease;
            }

            .product-modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 50%;
                background: #f1e4df;
                cursor: pointer;
                font-size: 16px;
            }

            .modal-category {
                display: inline-block;
                margin-bottom: 12px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1.5px;
                color: #a94f51;
            }

            .product-modal-box h2 {
                margin: 0 0 12px;
                font-size: 30px;
                color: #27232b;
            }

            .modal-description {
                color: #6f6870;
                line-height: 1.7;
                margin-bottom: 20px;
            }

            .modal-price {
                font-size: 25px;
                font-weight: 800;
                color: #a94f51;
                margin-bottom: 25px;
            }

            .modal-shop-btn {
                border: none;
                cursor: pointer;
            }

            body.modal-open {
                overflow: hidden;
            }

            @keyframes modalOpen {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.96);
                }

                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 600px) {

                .product-modal-box {
                    padding: 30px 24px;
                }

                .product-modal-box h2 {
                    font-size: 25px;
                }
            }
        `;

        document.head.appendChild(style);

        document.body.classList.add("modal-open");


        const closeModal = () => {

            modal.remove();

            document.body.classList.remove("modal-open");

        };


        const closeButton =
            modal.querySelector(".product-modal-close");

        const overlay =
            modal.querySelector(".product-modal-overlay");

        closeButton.addEventListener("click", closeModal);
        overlay.addEventListener("click", closeModal);


        // ESC key closes modal
        document.addEventListener(
            "keydown",
            function escapeHandler(event) {

                if (event.key === "Escape") {

                    closeModal();

                    document.removeEventListener(
                        "keydown",
                        escapeHandler
                    );
                }

            }
        );


        const shopButton =
            modal.querySelector(".modal-shop-btn");

        shopButton.addEventListener("click", () => {

            closeModal();

            const contactSection =
                document.querySelector("#contact");

            if (contactSection) {

                contactSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }


    productButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            const product =
                productData[index];

            if (product) {
                createProductModal(product);
            }

        });

    });


    /* =====================================================
       8. CONTACT FORM VALIDATION
       ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const subject =
                document.getElementById("subject");

            const message =
                document.getElementById("message");


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {
                return;
            }


            const nameValue =
                name.value.trim();

            const emailValue =
                email.value.trim();

            const subjectValue =
                subject.value.trim();

            const messageValue =
                message.value.trim();


            if (nameValue.length < 2) {

                showFormMessage(
                    "Please enter a valid name.",
                    "error"
                );

                name.focus();

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(emailValue)) {

                showFormMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;
            }


            if (subjectValue.length < 3) {

                showFormMessage(
                    "Please enter a subject.",
                    "error"
                );

                subject.focus();

                return;
            }


            if (messageValue.length < 10) {

                showFormMessage(
                    "Message should contain at least 10 characters.",
                    "error"
                );

                message.focus();

                return;
            }


            showFormMessage(
                "Thank you! Your message has been received.",
                "success"
            );


            contactForm.reset();

        });

    }


    function showFormMessage(message, type) {

        const existing =
            document.querySelector(".form-message");

        if (existing) {
            existing.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            `form-message ${type}`;

        messageBox.textContent = message;


        const formButton =
            document.querySelector(".form-submit");


        if (formButton) {

            formButton.insertAdjacentElement(
                "afterend",
                messageBox
            );

        } else {

            contactForm.appendChild(messageBox);

        }


        messageBox.style.marginTop = "15px";
        messageBox.style.padding = "12px 15px";
        messageBox.style.borderRadius = "10px";
        messageBox.style.fontSize = "14px";

        if (type === "success") {

            messageBox.style.background =
                "#e9f7ef";

            messageBox.style.color =
                "#216e45";

        } else {

            messageBox.style.background =
                "#fdecec";

            messageBox.style.color =
                "#a33a3a";

        }


        setTimeout(() => {

            messageBox.remove();

        }, 4000);

    }


    /* =====================================================
       9. BUTTON LOADING EFFECT
       ===================================================== */

    const formSubmit =
        document.querySelector(".form-submit");

    if (formSubmit && contactForm) {

        contactForm.addEventListener("submit", () => {

            setTimeout(() => {

                formSubmit.textContent =
                    "Send Message →";

                formSubmit.disabled = false;

            }, 500);

        });

    }


    /* =====================================================
       10. COUNTER ANIMATION
       ===================================================== */

    const statItems =
        document.querySelectorAll(".stats .stat-item");

    let countersStarted = false;


    function startCounters() {

        if (countersStarted) return;

        countersStarted = true;


        statItems.forEach(item => {

            const strong =
                item.querySelector("strong");

            if (!strong) return;


            const originalText =
                strong.textContent.trim();


            const numberMatch =
                originalText.match(/[\d.]+/);


            if (!numberMatch) return;


            const target =
                parseFloat(numberMatch[0]);


            const suffix =
                originalText.substring(
                    numberMatch[0].length
                );


            let current = 0;

            const duration = 1200;

            const startTime =
                performance.now();


            function animateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;


                const progress =
                    Math.min(elapsed / duration, 1);


                const easedProgress =
                    1 - Math.pow(
                        1 - progress,
                        3
                    );


                current =
                    target * easedProgress;


                if (target % 1 === 0) {

                    strong.textContent =
                        Math.floor(current) +
                        suffix;

                } else {

                    strong.textContent =
                        current.toFixed(1) +
                        suffix;

                }


                if (progress < 1) {

                    requestAnimationFrame(
                        animateCounter
                    );

                } else {

                    strong.textContent =
                        originalText;

                }

            }


            requestAnimationFrame(
                animateCounter
            );

        });

    }


    const statsSection =
        document.querySelector(".stats");


    if (statsSection) {

        const statsObserver =
            new IntersectionObserver(
                entries => {

                    if (entries[0].isIntersecting) {

                        startCounters();

                        statsObserver.disconnect();

                    }

                },
                {
                    threshold: 0.3
                }
            );


        statsObserver.observe(statsSection);

    }


    /* =====================================================
       11. BACK TO TOP BUTTON
       ===================================================== */

    const backToTop =
        document.createElement("button");

    backToTop.className =
        "back-to-top";

    backToTop.innerHTML = "↑";

    backToTop.setAttribute(
        "aria-label",
        "Back to Top"
    );


    backToTop.style.position = "fixed";
    backToTop.style.right = "22px";
    backToTop.style.bottom = "22px";
    backToTop.style.width = "45px";
    backToTop.style.height = "45px";
    backToTop.style.border = "none";
    backToTop.style.borderRadius = "50%";
    backToTop.style.background = "#a94f51";
    backToTop.style.color = "#ffffff";
    backToTop.style.fontSize = "22px";
    backToTop.style.cursor = "pointer";
    backToTop.style.zIndex = "1000";
    backToTop.style.display = "none";
    backToTop.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";


    document.body.appendChild(backToTop);


    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backToTop.style.display = "block";

        } else {

            backToTop.style.display = "none";

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =====================================================
       12. IMAGE LAZY LOADING
       ===================================================== */

    const images =
        document.querySelectorAll("img");


    images.forEach(img => {

        img.setAttribute(
            "loading",
            "lazy"
        );

    });


    /* =====================================================
       13. IMAGE ERROR HANDLING
       ===================================================== */

    images.forEach(img => {

        img.addEventListener("error", () => {

            img.style.background =
                "#eee5e0";

            img.style.objectFit =
                "contain";

            img.alt =
                "VELORA image unavailable";

        });

    });


    /* =====================================================
       14. CURRENT YEAR IN FOOTER
       ===================================================== */

    const year =
        new Date().getFullYear();

    const footer =
        document.querySelector(".footer");

    if (footer) {

        const copyright =
            footer.querySelector(".copyright");

        if (copyright) {

            copyright.textContent =
                `© ${year} VELORA. All rights reserved.`;

        }

    }


    /* =====================================================
       15. PAGE LOADED
       ===================================================== */

    document.body.classList.add("page-loaded");

    console.log(
        "VELORA website JavaScript loaded successfully."
    );

});