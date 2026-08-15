// ==========================================
// FLORES PIOLI - ANIMAÇÕES
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ======================================
        // ELEMENTOS QUE APARECEM AO ROLAR
        // ======================================

        const revealElements = [
            ".benefits-bar",
            ".products-heading",
            ".product-card",
            ".products-support",
            ".about-copy",
            ".about-highlight",
            ".contact-card",
            ".footer-top"
        ];


        revealElements.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(
                        function (element) {

                            element.classList.add(
                                "reveal"
                            );

                        }
                    );

            }
        );


        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "reveal-visible"
                                    );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12
                }

            );


        document
            .querySelectorAll(
                ".reveal, .reveal-left, .reveal-right"
            )
            .forEach(
                function (element) {

                    observer.observe(
                        element
                    );

                }
            );


        // ======================================
        // HEADER AO ROLAR
        // ======================================

        const header =
            document.querySelector(
                ".main-header"
            );


        function atualizarHeader() {

            if (!header) return;


            if (
                window.scrollY > 30
            ) {

                header.classList.add(
                    "header-scrolled"
                );

            } else {

                header.classList.remove(
                    "header-scrolled"
                );

            }

        }


        window.addEventListener(
            "scroll",
            atualizarHeader,
            {
                passive: true
            }
        );


        atualizarHeader();


        // ======================================
        // BOTÃO VOLTAR AO TOPO
        // ======================================

        const backToTop =
            document.createElement(
                "button"
            );


        backToTop.type =
            "button";


        backToTop.className =
            "back-to-top";


        backToTop.setAttribute(
            "aria-label",
            "Voltar ao topo"
        );


        backToTop.innerHTML =
            '<i class="fa-solid fa-arrow-up"></i>';


        document.body.appendChild(
            backToTop
        );


        function atualizarBotaoTopo() {

            if (
                window.scrollY > 500
            ) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );

            }

        }


        window.addEventListener(
            "scroll",
            atualizarBotaoTopo,
            {
                passive: true
            }
        );


        atualizarBotaoTopo();


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        // ======================================
        // ANIMAÇÃO DO CONTADOR DO CARRINHO
        // ======================================

        const cartCount =
            document.getElementById(
                "cart-count"
            );


        if (cartCount) {

            const observerCart =
                new MutationObserver(
                    function () {

                        cartCount.classList.remove(
                            "cart-bump"
                        );


                        void cartCount.offsetWidth;


                        cartCount.classList.add(
                            "cart-bump"
                        );

                    }
                );


            observerCart.observe(
                cartCount,
                {
                    childList: true,
                    characterData: true,
                    subtree: true
                }
            );

        }


        // ======================================
        // FEEDBACK AO ADICIONAR AO CARRINHO
        // ======================================

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".add-to-cart-btn"
                    );


                if (!button) return;


                button.classList.add(
                    "cart-success"
                );


                setTimeout(
                    function () {

                        button.classList.remove(
                            "cart-success"
                        );

                    },
                    650
                );

            }
        );

    }
);