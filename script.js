// ============================================
// FLORES PIOLI - SCRIPT PRINCIPAL
// ============================================


// ============================================
// CARRINHO
// ============================================

let cart = [];


// Elementos
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart-btn");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalValue = document.getElementById("cart-total-value");

const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

const notification = document.getElementById("notification");


// ============================================
// CARREGAR CARRINHO
// ============================================

function loadCart() {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {

        try {
            cart = JSON.parse(savedCart);
        } catch (erro) {
            cart = [];
        }

    }

    updateCartUI();
}


// ============================================
// SALVAR CARRINHO
// ============================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ============================================
// FORMATAR PREÇO
// ============================================

function formatPrice(price) {

    return Number(price).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ============================================
// CONTAR ITENS
// ============================================

function countItems() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


// ============================================
// CALCULAR TOTAL
// ============================================

function calculateTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            (
                Number(item.price) *
                item.quantity
            ),
        0
    );
}


// ============================================
// ADICIONAR AO CARRINHO
// ============================================

function addToCart(product) {

    const existingItem =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCartUI();

    showNotification(
        "🌸 Produto adicionado ao carrinho!"
    );

    animateCartCount();
}


// ============================================
// REMOVER ITEM
// ============================================

function removeFromCart(productId) {

    cart = cart.filter(
        item =>
            String(item.id) !==
            String(productId)
    );


    saveCart();

    updateCartUI();
}


// ============================================
// ALTERAR QUANTIDADE
// ============================================

function updateQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart();

    updateCartUI();
}


// ============================================
// LIMPAR CARRINHO
// ============================================

function clearCart() {

    if (cart.length === 0) {

        showNotification(
            "Seu carrinho já está vazio."
        );

        return;
    }


    const confirmar =
        confirm(
            "Tem certeza que deseja limpar o carrinho?"
        );


    if (!confirmar) {
        return;
    }


    cart = [];

    saveCart();

    updateCartUI();

    showNotification(
        "Carrinho limpo."
    );
}


// ============================================
// ATUALIZAR CARRINHO NA TELA
// ============================================

function updateCartUI() {

    if (
        !cartItems ||
        !cartCount ||
        !cartTotalValue
    ) {
        return;
    }


    cartCount.textContent =
        countItems();


    cartTotalValue.textContent =
        formatPrice(
            calculateTotal()
        );


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="cart-empty">

                <div class="cart-empty-icon">
                    🌸
                </div>

                <p>
                    Seu carrinho está vazio
                </p>

                <p style="
                    font-size: 0.9rem;
                    margin-top: 8px;
                ">
                    Escolha suas flores
                    para começar.
                </p>

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(
            item => `

            <div
                class="cart-item"
                data-id="${item.id}"
            >

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="cart-item-details">

                    <div class="cart-item-name">

                        ${item.name}

                    </div>


                    <div class="cart-item-price">

                        ${formatPrice(item.price)}

                    </div>


                    <div class="cart-item-controls">


                        <button
                            class="quantity-btn"
                            onclick="updateQuantity('${item.id}', -1)"
                        >
                            −
                        </button>


                        <span class="item-quantity">

                            ${item.quantity}

                        </span>


                        <button
                            class="quantity-btn"
                            onclick="updateQuantity('${item.id}', 1)"
                        >
                            +
                        </button>


                        <button
                            class="remove-item-btn"
                            onclick="removeFromCart('${item.id}')"
                            title="Remover"
                        >
                            🗑️
                        </button>


                    </div>

                </div>

            </div>

        `
        ).join("");
}


// ============================================
// ABRIR CARRINHO
// ============================================

function openCart() {

    if (
        !cartSidebar ||
        !cartOverlay
    ) {
        return;
    }


    cartSidebar.classList.add(
        "active"
    );


    cartOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";
}


// ============================================
// FECHAR CARRINHO
// ============================================

function closeCart() {

    if (
        !cartSidebar ||
        !cartOverlay
    ) {
        return;
    }


    cartSidebar.classList.remove(
        "active"
    );


    cartOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";
}


// ============================================
// NOTIFICAÇÃO
// ============================================

function showNotification(message) {

    if (!notification) {
        return;
    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(
        function () {

            notification.classList.remove(
                "show"
            );

        },
        2200
    );
}


// ============================================
// ANIMAÇÃO CONTADOR
// ============================================

function animateCartCount() {

    if (!cartCount) {
        return;
    }


    cartCount.classList.add(
        "pulse"
    );


    setTimeout(
        function () {

            cartCount.classList.remove(
                "pulse"
            );

        },
        300
    );
}


// ============================================
// FINALIZAR PEDIDO
// ============================================

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Adicione um produto primeiro."
        );

        return;
    }


    const total =
        formatPrice(
            calculateTotal()
        );


    const quantidade =
        countItems();


    alert(
        "🌸 Pedido Flores Pioli\n\n" +
        "Quantidade de itens: " +
        quantidade +
        "\n" +
        "Valor total: " +
        total +
        "\n\n" +
        "Obrigado pela preferência!"
    );


    cart = [];

    saveCart();

    updateCartUI();

    closeCart();
}


// ============================================
// EVENTOS DO CARRINHO
// ============================================

if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        function () {

            openCart();

        }
    );
}


if (closeCartBtn) {

    closeCartBtn.addEventListener(
        "click",
        function () {

            closeCart();

        }
    );
}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        function () {

            closeCart();

        }
    );
}


if (clearCartBtn) {

    clearCartBtn.addEventListener(
        "click",
        function () {

            clearCart();

        }
    );
}


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            checkout();

        }
    );
}


// ============================================
// PRODUTOS
// ============================================

document.addEventListener(
    "click",
    function (event) {


        const card =
            event.target.closest(
                ".product-card"
            );


        if (!card) {
            return;
        }


        // ------------------------------------
        // ADICIONAR AO CARRINHO
        // ------------------------------------

        const addButton =
            event.target.closest(
                ".add-to-cart-btn"
            );


        if (addButton) {

            event.preventDefault();

            event.stopPropagation();


            const imagem =
                card.querySelector(
                    "img"
                );


            const product = {

                id:
                    card.dataset.id,

                name:
                    card.dataset.name,

                price:
                    Number(
                        card.dataset.price
                    ),

                image:
                    imagem
                        ? imagem.src
                        : ""

            };


            addToCart(product);

            return;
        }


        // ------------------------------------
        // VER DETALHES
        // ------------------------------------

        const viewButton =
            event.target.closest(
                ".view-product-btn"
            );


        if (viewButton) {

            event.preventDefault();

            event.stopPropagation();


            abrirProduto(card);

        }

    }
);


// ============================================
// ABRIR PRODUTO
// ============================================

function abrirProduto(card) {

    const imagem =
        card.querySelector(
            "img"
        );


    const descricao =
        card.querySelector(
            ".product-description"
        );


    const produto = {

        id:
            card.dataset.id,

        name:
            card.dataset.name,

        price:
            Number(
                card.dataset.price
            ),

        image:
            imagem
                ? imagem.src
                : "",

        description:
            descricao
                ? descricao.innerText
                : ""

    };


    localStorage.setItem(
        "produtoSelecionado",
        JSON.stringify(produto)
    );


    window.location.href =
        "produto.html";
}


// ============================================
// MENU LATERAL
// ============================================

const menuBtn =
    document.getElementById(
        "menu-btn"
    );

const menuSidebar =
    document.getElementById(
        "menu-sidebar"
    );

const menuOverlay =
    document.getElementById(
        "menu-overlay"
    );

const closeMenuBtn =
    document.getElementById(
        "close-menu-btn"
    );


function openMenu() {

    if (
        !menuSidebar ||
        !menuOverlay
    ) {
        return;
    }


    menuSidebar.classList.add(
        "active"
    );


    menuOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";
}


function closeMenu() {

    if (
        !menuSidebar ||
        !menuOverlay
    ) {
        return;
    }


    menuSidebar.classList.remove(
        "active"
    );


    menuOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";
}


// Abrir menu
if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            openMenu();

        }
    );
}


// Fechar menu
if (closeMenuBtn) {

    closeMenuBtn.addEventListener(
        "click",
        function () {

            closeMenu();

        }
    );
}


if (menuOverlay) {

    menuOverlay.addEventListener(
        "click",
        function () {

            closeMenu();

        }
    );
}


// ============================================
// ESC FECHA MENU E CARRINHO
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCart();

            closeMenu();

        }

    }
);


// ============================================
// INICIAR SITE
// ============================================

loadCart();