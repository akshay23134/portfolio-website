/* =========================================================
   NOVAÉ — MODERN ONLINE STORE
   Complete JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const body = document.body;

    // Navigation
    const mainNav = document.getElementById("mainNav");
    const menuToggle = document.getElementById("menuToggle");

    // Search
    const searchToggle = document.getElementById("searchToggle");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    // Products
    const productsGrid = document.getElementById("productsGrid");
    const productCards = Array.from(
        document.querySelectorAll(".product-card")
    );
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sortSelect");
    const noProducts = document.getElementById("noProducts");

    // Cart
    const cartToggle = document.getElementById("cartToggle");
    const cartDrawer = document.getElementById("cartDrawer");
    const closeCart = document.getElementById("closeCart");
    const overlay = document.getElementById("overlay");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const startShopping = document.getElementById("startShopping");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // Wishlist
    const wishlistBtn = document.getElementById("wishlistBtn");
    const wishlistCount = document.getElementById("wishlistCount");

    // Quick View
    const quickViewModal = document.getElementById("quickViewModal");
    const quickViewContent = document.getElementById("quickViewContent");
    const closeQuickView = document.getElementById("closeQuickView");

    // Toast
    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const closeToast = document.getElementById("closeToast");

    // Newsletter
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterMessage = document.getElementById("newsletterMessage");


    /* =====================================================
       DATA
    ====================================================== */

    const products = productCards.map(card => {

        const image = card.querySelector("img");
        const title = card.querySelector("h3");
        const description = card.querySelector(".product-description");
        const category = card.querySelector(".product-category");
        const ratingText = card.querySelector(".product-rating span");
        const priceElement = card.querySelector(".price");
        const oldPriceElement = card.querySelector(".price del");

        return {
            id: Number(card.dataset.id),
            name: card.dataset.name || title?.textContent.trim() || "",
            category: card.dataset.category || "",
            price: Number(card.dataset.price) || 0,
            rating: Number(card.dataset.rating) || 0,
            date: Number(card.dataset.date) || 0,

            image: image ? image.src : "",
            alt: image ? image.alt : "",

            description: description
                ? description.textContent.trim()
                : "",

            categoryLabel: category
                ? category.textContent.trim()
                : "",

            ratingText: ratingText
                ? ratingText.textContent.trim()
                : `(${Number(card.dataset.rating) || 0})`,

            oldPrice: oldPriceElement
                ? oldPriceElement.textContent.trim()
                : ""
        };
    });


    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    let cart = loadStorage("novaeCart", []);
    let wishlist = loadStorage("novaeWishlist", []);


    function loadStorage(key, fallback) {
        try {
            const saved = localStorage.getItem(key);

            if (!saved) {
                return fallback;
            }

            const parsed = JSON.parse(saved);

            return parsed;
        } catch (error) {
            console.error(`Unable to load ${key}:`, error);
            return fallback;
        }
    }


    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Unable to save ${key}:`, error);
        }
    }


    /* =====================================================
       HELPERS
    ====================================================== */

    function formatPrice(value) {
        return `₹${Number(value).toLocaleString("en-IN")}`;
    }


    function getProduct(id) {
        return products.find(product => product.id === Number(id));
    }


    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       TOAST
    ====================================================== */

    let toastTimer;

    function showToast(title, message) {

        if (!toast) {
            return;
        }

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    if (closeToast) {
        closeToast.addEventListener("click", () => {
            toast.classList.remove("show");
        });
    }


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("active");

            const isOpen = mainNav.classList.contains("active");

            menuToggle.textContent = isOpen ? "✕" : "☰";
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        });


        document.querySelectorAll(".nav-link").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("active");

                menuToggle.textContent = "☰";

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );
            });

        });
    }


    /* =====================================================
       SEARCH PANEL
    ====================================================== */

    if (searchToggle && searchPanel) {

        searchToggle.addEventListener("click", () => {

            searchPanel.classList.toggle("active");

            if (searchPanel.classList.contains("active")) {

                setTimeout(() => {
                    searchInput?.focus();
                }, 100);

            } else {

                if (searchInput) {
                    searchInput.value = "";
                }

                applyFilters();
            }
        });
    }


    if (closeSearch) {

        closeSearch.addEventListener("click", () => {

            searchPanel.classList.remove("active");

            if (searchInput) {
                searchInput.value = "";
            }

            applyFilters();
        });
    }


    /* =====================================================
       FILTER + SEARCH
    ====================================================== */

    let currentFilter = "All";


    function applyFilters() {

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        productCards.forEach(card => {

            const category = card.dataset.category || "";
            const name = card.dataset.name || "";

            const categoryMatch =
                currentFilter === "All" ||
                category.toLowerCase() === currentFilter.toLowerCase();

            const searchMatch =
                searchTerm === "" ||
                name.toLowerCase().includes(searchTerm) ||
                category.toLowerCase().includes(searchTerm);

            const shouldShow =
                categoryMatch && searchMatch;

            card.classList.toggle("hidden", !shouldShow);

            if (shouldShow) {
                visibleCount++;
            }
        });


        if (noProducts) {
            noProducts.hidden = visibleCount !== 0;
        }
    }


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.dataset.filter || "All";

            applyFilters();

            document.getElementById("products")?.scrollIntoView({
                behavior: "smooth"
            });
        });

    });


    if (searchInput) {

        searchInput.addEventListener("input", () => {
            applyFilters();
        });

    }


    /* =====================================================
       CATEGORY LINKS
    ====================================================== */

    document.querySelectorAll(".category-link").forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const selectedCategory =
                link.dataset.filter || "All";

            currentFilter = selectedCategory;

            filterButtons.forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter === selectedCategory
                );

            });

            applyFilters();

            document.getElementById("products")?.scrollIntoView({
                behavior: "smooth"
            });
        });

    });


    /* =====================================================
       SORT PRODUCTS
    ====================================================== */

    if (sortSelect) {

        sortSelect.addEventListener("change", () => {

            const value = sortSelect.value;

            const sortedCards = [...productCards];

            if (value === "low") {

                sortedCards.sort((a, b) => {
                    return Number(a.dataset.price) -
                        Number(b.dataset.price);
                });

            } else if (value === "high") {

                sortedCards.sort((a, b) => {
                    return Number(b.dataset.price) -
                        Number(a.dataset.price);
                });

            } else if (value === "rating") {

                sortedCards.sort((a, b) => {
                    return Number(b.dataset.rating) -
                        Number(a.dataset.rating);
                });

            } else if (value === "newest") {

                sortedCards.sort((a, b) => {
                    return Number(b.dataset.date) -
                        Number(a.dataset.date);
                });

            } else {

                sortedCards.sort((a, b) => {
                    return Number(a.dataset.id) -
                        Number(b.dataset.id);
                });
            }


            sortedCards.forEach(card => {
                productsGrid.appendChild(card);
            });

            applyFilters();
        });
    }


    /* =====================================================
       CART DRAWER
    ====================================================== */

    function openCart() {

        cartDrawer?.classList.add("active");
        overlay?.classList.add("active");

        body.classList.add("no-scroll");
    }


    function closeCartDrawer() {

        cartDrawer?.classList.remove("active");
        overlay?.classList.remove("active");

        body.classList.remove("no-scroll");
    }


    if (cartToggle) {
        cartToggle.addEventListener("click", openCart);
    }


    if (closeCart) {
        closeCart.addEventListener("click", closeCartDrawer);
    }


    if (overlay) {
        overlay.addEventListener("click", closeCartDrawer);
    }


    /* =====================================================
       ADD TO CART
    ====================================================== */

    function addToCart(productId) {

        const id = Number(productId);

        const existingItem = cart.find(
            item => item.id === id
        );

        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({
                id: id,
                quantity: 1
            });
        }


        saveStorage("novaeCart", cart);

        updateCart();

        const product = getProduct(id);

        if (product) {

            showToast(
                "Added to cart",
                `${product.name} added successfully.`
            );
        }
    }


    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            addToCart(id);
        });

    });


    /* =====================================================
       UPDATE CART
    ====================================================== */

    function updateCart() {

        if (!cartItemsContainer) {
            return;
        }


        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );


        const subtotal = cart.reduce((total, item) => {

            const product = getProduct(item.id);

            if (!product) {
                return total;
            }

            return total + product.price * item.quantity;

        }, 0);


        if (cartCount) {
            cartCount.textContent = totalItems;
        }


        if (cartSubtotal) {
            cartSubtotal.textContent = formatPrice(subtotal);
        }


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add something you love.
                    </p>

                    <button
                        class="btn btn-primary"
                        id="startShopping">
                        Start Shopping
                    </button>
                </div>
            `;

            const newStartShopping =
                document.getElementById("startShopping");

            newStartShopping?.addEventListener(
                "click",
                closeCartDrawer
            );

            return;
        }


        cartItemsContainer.innerHTML = cart.map(item => {

            const product = getProduct(item.id);

            if (!product) {
                return "";
            }


            return `
                <div
                    class="cart-item"
                    data-id="${product.id}">

                    <div class="cart-item-image">
                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.alt || product.name)}">
                    </div>

                    <div>
                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <div class="cart-item-price">
                            ${formatPrice(product.price)}
                        </div>

                        <div class="cart-quantity">

                            <button
                                class="quantity-decrease"
                                data-id="${product.id}">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                class="quantity-increase"
                                data-id="${product.id}">
                                +
                            </button>

                        </div>
                    </div>

                    <button
                        class="remove-cart-item"
                        data-id="${product.id}"
                        aria-label="Remove ${escapeHTML(product.name)}">
                        ×
                    </button>

                </div>
            `;

        }).join("");


        attachCartEvents();
    }


    /* =====================================================
       CART QUANTITY EVENTS
    ====================================================== */

    function attachCartEvents() {

        document.querySelectorAll(".quantity-increase")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = Number(button.dataset.id);

                    const item = cart.find(
                        cartItem => cartItem.id === id
                    );

                    if (item) {
                        item.quantity += 1;
                    }

                    saveStorage("novaeCart", cart);

                    updateCart();
                });

            });


        document.querySelectorAll(".quantity-decrease")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = Number(button.dataset.id);

                    const item = cart.find(
                        cartItem => cartItem.id === id
                    );

                    if (!item) {
                        return;
                    }

                    item.quantity -= 1;

                    if (item.quantity <= 0) {

                        cart = cart.filter(
                            cartItem => cartItem.id !== id
                        );
                    }

                    saveStorage("novaeCart", cart);

                    updateCart();
                });

            });


        document.querySelectorAll(".remove-cart-item")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = Number(button.dataset.id);

                    const product = getProduct(id);

                    cart = cart.filter(
                        item => item.id !== id
                    );

                    saveStorage("novaeCart", cart);

                    updateCart();

                    if (product) {

                        showToast(
                            "Removed from cart",
                            `${product.name} removed from your cart.`
                        );
                    }
                });

            });
    }


    /* =====================================================
       WISHLIST
    ====================================================== */

    function updateWishlist() {

        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }


        document.querySelectorAll(".wishlist-product")
            .forEach(button => {

                const id = Number(button.dataset.id);

                const isSaved =
                    wishlist.includes(id);

                button.classList.toggle(
                    "active",
                    isSaved
                );

                button.textContent =
                    isSaved ? "♥" : "♡";

                button.setAttribute(
                    "aria-label",
                    isSaved
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                );
            });
    }


    document.querySelectorAll(".wishlist-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(button.dataset.id);

                const product = getProduct(id);

                const index = wishlist.indexOf(id);


                if (index === -1) {

                    wishlist.push(id);

                    showToast(
                        "Added to wishlist",
                        `${product?.name || "Product"} saved.`
                    );

                } else {

                    wishlist.splice(index, 1);

                    showToast(
                        "Removed from wishlist",
                        `${product?.name || "Product"} removed.`
                    );
                }


                saveStorage(
                    "novaeWishlist",
                    wishlist
                );

                updateWishlist();
            });

        });


    if (wishlistBtn) {

        wishlistBtn.addEventListener("click", () => {

            if (wishlist.length === 0) {

                showToast(
                    "Wishlist is empty",
                    "Add products to your wishlist first."
                );

                return;
            }


            const names = wishlist
                .map(id => getProduct(id)?.name)
                .filter(Boolean);


            showToast(
                `${wishlist.length} item${wishlist.length > 1 ? "s" : ""} saved`,
                names.slice(0, 2).join(", ")
            );
        });
    }


    /* =====================================================
       QUICK VIEW
    ====================================================== */

    function openQuickView(productId) {

        const product = getProduct(productId);

        if (!product || !quickViewModal || !quickViewContent) {
            return;
        }


        quickViewContent.innerHTML = `
            <div>
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.alt || product.name)}">
            </div>

            <div class="quick-view-info">

                <span class="eyebrow">
                    ${escapeHTML(product.categoryLabel)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <div class="product-rating">
                    ★★★★★
                    <span>
                        ${escapeHTML(product.ratingText)}
                    </span>
                </div>

                <div class="quick-view-price">
                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                            ? `<del>${escapeHTML(product.oldPrice)}</del>`
                            : ""
                    }
                </div>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <button
                    class="btn btn-primary modal-add-cart"
                    data-id="${product.id}">
                    Add to Cart
                </button>

            </div>
        `;


        quickViewModal.classList.add("active");

        body.classList.add("no-scroll");


        const modalAddCart =
            quickViewContent.querySelector(
                ".modal-add-cart"
            );


        modalAddCart?.addEventListener(
            "click",
            () => {

                addToCart(product.id);

                closeQuickViewModal();
                openCart();
            }
        );
    }


    function closeQuickViewModal() {

        quickViewModal?.classList.remove("active");

        body.classList.remove("no-scroll");
    }


    document.querySelectorAll(".quick-view-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                openQuickView(
                    Number(button.dataset.id)
                );
            });

        });


    closeQuickView?.addEventListener(
        "click",
        closeQuickViewModal
    );


    if (quickViewModal) {

        quickViewModal.addEventListener("click", event => {

            if (event.target === quickViewModal) {
                closeQuickViewModal();
            }
        });
    }


    /* =====================================================
       KEYBOARD ESCAPE
    ====================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") {
            return;
        }

        closeCartDrawer();
        closeQuickViewModal();

        searchPanel?.classList.remove("active");

        mainNav?.classList.remove("active");

        if (menuToggle) {
            menuToggle.textContent = "☰";
        }
    });


    /* =====================================================
       START SHOPPING
    ====================================================== */

    if (startShopping) {

        startShopping.addEventListener(
            "click",
            closeCartDrawer
        );
    }


    /* =====================================================
       CHECKOUT
    ====================================================== */

    if (checkoutBtn) {

        checkoutBtn.addEventListener("click", () => {

            if (cart.length === 0) {

                showToast(
                    "Cart is empty",
                    "Add a product before checkout."
                );

                return;
            }


            showToast(
                "Checkout coming soon",
                "Payment integration can be added later."
            );
        });
    }


    /* =====================================================
       NEWSLETTER
    ====================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", event => {

            event.preventDefault();

            const email =
                newsletterEmail?.value.trim() || "";


            if (!email) {
                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                if (newsletterMessage) {

                    newsletterMessage.textContent =
                        "Please enter a valid email address.";

                    newsletterMessage.style.color =
                        "#b84c43";
                }

                return;
            }


            if (newsletterMessage) {

                newsletterMessage.textContent =
                    "You're subscribed successfully!";

                newsletterMessage.style.color =
                    "#3f7657";
            }


            newsletterForm.reset();


            showToast(
                "Subscription successful",
                "Thanks for joining NOVAÉ."
            );
        });
    }


    /* =====================================================
       COUNTER ANIMATION
    ====================================================== */

    const counters =
        document.querySelectorAll(".counter");

    let countersStarted = false;


    function animateCounters() {

        if (countersStarted) {
            return;
        }

        countersStarted = true;


        counters.forEach(counter => {

            const target =
                Number(counter.dataset.target) || 0;

            const duration = 1500;

            const startTime =
                performance.now();


            function updateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;

                const progress =
                    Math.min(elapsed / duration, 1);

                const eased =
                    1 - Math.pow(1 - progress, 3);

                const current =
                    Math.floor(target * eased);


                counter.textContent =
                    current.toLocaleString("en-IN");


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                } else {

                    counter.textContent =
                        target.toLocaleString("en-IN");
                }
            }


            requestAnimationFrame(
                updateCounter
            );
        });
    }


    /* =====================================================
       COUNTER OBSERVER
    ====================================================== */

    if ("IntersectionObserver" in window) {

        const statsSection =
            document.querySelector(".stats-section");


        if (statsSection) {

            const observer =
                new IntersectionObserver(
                    entries => {

                        if (entries[0].isIntersecting) {

                            animateCounters();

                            observer.disconnect();
                        }

                    },
                    {
                        threshold: 0.25
                    }
                );


            observer.observe(statsSection);
        }

    } else {

        animateCounters();
    }


    /* =====================================================
       NAV ACTIVE LINK ON SCROLL
    ====================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    if ("IntersectionObserver" in window) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const id =
                            entry.target.getAttribute("id");


                        navLinks.forEach(link => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") === `#${id}`
                            );
                        });

                    });

                },
                {
                    rootMargin: "-30% 0px -60% 0px"
                }
            );


        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    updateCart();

    updateWishlist();

    applyFilters();


    console.log(
        "NOVAÉ store initialized successfully."
    );

});