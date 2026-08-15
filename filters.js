// ==========================================
// FLORES PIOLI - BUSCA, FILTROS E ORDENAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const productsGrid =
            document.getElementById(
                "products-grid"
            );


        if (!productsGrid) {
            return;
        }


        const cards =
            Array.from(
                productsGrid.querySelectorAll(
                    ".product-card"
                )
            );


        if (cards.length === 0) {
            return;
        }


        // ======================================
        // CRIAR ÁREA DE BUSCA
        // ======================================

        const tools =
            document.createElement(
                "div"
            );


        tools.className =
            "catalog-tools";


        tools.innerHTML = `

            <div class="catalog-search">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="search"
                    id="catalog-search-input"
                    placeholder="Buscar produtos..."
                    autocomplete="off"
                >

            </div>


            <div class="catalog-sort">

                <select
                    id="catalog-sort-select"
                    aria-label="Ordenar produtos"
                >

                    <option value="default">
                        Mais relevantes
                    </option>

                    <option value="price-asc">
                        Menor preço
                    </option>

                    <option value="price-desc">
                        Maior preço
                    </option>

                    <option value="name-asc">
                        Nome A-Z
                    </option>

                </select>

            </div>


            <div class="catalog-filters">

                <button
                    type="button"
                    class="catalog-filter-btn active"
                    data-filter="all"
                >
                    Todos
                </button>

                <button
                    type="button"
                    class="catalog-filter-btn"
                    data-filter="under-300"
                >
                    Até R$ 300
                </button>

                <button
                    type="button"
                    class="catalog-filter-btn"
                    data-filter="300-500"
                >
                    R$ 300 a R$ 500
                </button>

                <button
                    type="button"
                    class="catalog-filter-btn"
                    data-filter="over-500"
                >
                    Acima de R$ 500
                </button>


                <span
                    class="catalog-results-count"
                    id="catalog-results-count"
                ></span>

            </div>

        `;


        productsGrid.parentNode.insertBefore(
            tools,
            productsGrid
        );


        // ======================================
        // MENSAGEM SEM RESULTADOS
        // ======================================

        const emptyState =
            document.createElement(
                "div"
            );


        emptyState.className =
            "catalog-empty";


        emptyState.innerHTML = `

            <i class="fa-regular fa-face-frown"></i>

            <h3>
                Nenhum produto encontrado
            </h3>

            <p>
                Tente pesquisar outro termo
                ou alterar os filtros.
            </p>

        `;


        productsGrid.insertAdjacentElement(
            "afterend",
            emptyState
        );


        // ======================================
        // ELEMENTOS
        // ======================================

        const searchInput =
            document.getElementById(
                "catalog-search-input"
            );


        const sortSelect =
            document.getElementById(
                "catalog-sort-select"
            );


        const resultCount =
            document.getElementById(
                "catalog-results-count"
            );


        const filterButtons =
            document.querySelectorAll(
                ".catalog-filter-btn"
            );


        let activeFilter =
            "all";


        // ======================================
        // NORMALIZAR TEXTO
        // ======================================

        function normalizeText(text) {

            return String(text)
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .toLowerCase()
                .trim();

        }


        // ======================================
        // VERIFICAR FILTRO DE PREÇO
        // ======================================

        function matchesPriceFilter(
            price
        ) {

            switch (
                activeFilter
            ) {

                case "under-300":

                    return price <= 300;


                case "300-500":

                    return (
                        price > 300 &&
                        price <= 500
                    );


                case "over-500":

                    return price > 500;


                default:

                    return true;
            }

        }


        // ======================================
        // APLICAR BUSCA E FILTRO
        // ======================================

        function applyFilters() {

            const term =
                normalizeText(
                    searchInput.value
                );


            let visibleCount =
                0;


            cards.forEach(
                function (card) {

                    const name =
                        normalizeText(
                            card.dataset.name ||
                            ""
                        );


                    const description =
                        normalizeText(
                            card
                                .querySelector(
                                    ".product-description"
                                )
                                ?.innerText ||
                            ""
                        );


                    const category =
                        normalizeText(
                            card
                                .querySelector(
                                    ".product-category-label"
                                )
                                ?.innerText ||
                            ""
                        );


                    const price =
                        Number(
                            card.dataset.price
                        );


                    const matchesSearch =
                        !term ||
                        name.includes(term) ||
                        description.includes(term) ||
                        category.includes(term);


                    const matchesPrice =
                        matchesPriceFilter(
                            price
                        );


                    if (
                        matchesSearch &&
                        matchesPrice
                    ) {

                        card.classList.remove(
                            "catalog-hidden"
                        );


                        card.classList.add(
                            "catalog-visible"
                        );


                        visibleCount++;

                    } else {

                        card.classList.add(
                            "catalog-hidden"
                        );


                        card.classList.remove(
                            "catalog-visible"
                        );

                    }

                }
            );


            resultCount.textContent =
                visibleCount === 1
                    ? "1 produto"
                    : visibleCount +
                      " produtos";


            if (
                visibleCount === 0
            ) {

                emptyState.classList.add(
                    "show"
                );

            } else {

                emptyState.classList.remove(
                    "show"
                );

            }

        }


        // ======================================
        // ORDENAR
        // ======================================

        function sortProducts() {

            const option =
                sortSelect.value;


            const orderedCards =
                [...cards];


            if (
                option ===
                "price-asc"
            ) {

                orderedCards.sort(
                    function (a, b) {

                        return (
                            Number(
                                a.dataset.price
                            ) -
                            Number(
                                b.dataset.price
                            )
                        );

                    }
                );

            }


            if (
                option ===
                "price-desc"
            ) {

                orderedCards.sort(
                    function (a, b) {

                        return (
                            Number(
                                b.dataset.price
                            ) -
                            Number(
                                a.dataset.price
                            )
                        );

                    }
                );

            }


            if (
                option ===
                "name-asc"
            ) {

                orderedCards.sort(
                    function (a, b) {

                        return (
                            a.dataset.name ||
                            ""
                        ).localeCompare(
                            b.dataset.name ||
                            "",
                            "pt-BR"
                        );

                    }
                );

            }


            if (
                option ===
                "default"
            ) {

                orderedCards.splice(
                    0,
                    orderedCards.length,
                    ...cards
                );

            }


            orderedCards.forEach(
                function (card) {

                    productsGrid.appendChild(
                        card
                    );

                }
            );

        }


        // ======================================
        // EVENTOS
        // ======================================

        searchInput.addEventListener(
            "input",
            applyFilters
        );


        filterButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        filterButtons.forEach(
                            function (
                                otherButton
                            ) {

                                otherButton
                                    .classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        activeFilter =
                            button.dataset
                                .filter;


                        applyFilters();

                    }
                );

            }
        );


        sortSelect.addEventListener(
            "change",
            function () {

                sortProducts();

                applyFilters();

            }
        );


        // ======================================
        // INICIAR
        // ======================================

        applyFilters();

    }
);