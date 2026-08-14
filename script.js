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


function clearCart() {

    if (cart.length === 0) {

        showNotification(
            "Seu carrinho já está vazio."
        );

        return;
    }


    cart = [];


    saveCart();


    updateCartUI();


    showNotification(
        "Carrinho limpo com sucesso."
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
// FINALIZAR PEDIDO - ABRIR FORMULÁRIO
// ============================================

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Adicione um produto ao carrinho primeiro."
        );

        return;
    }

    abrirFormularioPedido();
}


// ============================================
// CRIAR FORMULÁRIO DE PEDIDO
// ============================================

function abrirFormularioPedido() {

    // Evita criar mais de um modal
    const existente =
        document.getElementById(
            "pedido-modal-overlay"
        );

    if (existente) {
        existente.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "pedido-modal-overlay";

    overlay.className =
        "pedido-modal-overlay";


    overlay.innerHTML = `

        <div class="pedido-modal">

            <button
                type="button"
                class="pedido-modal-fechar"
                id="pedido-modal-fechar"
            >
                ×
            </button>


            <h2>
                🌸 Finalizar Pedido
            </h2>

            <p class="pedido-modal-subtitulo">
                Preencha os dados para enviarmos
                seu pedido pelo WhatsApp.
            </p>


            <div class="pedido-form-group">

                <label>
                    Seu nome *
                </label>

                <input
                    type="text"
                    id="pedido-nome"
                    placeholder="Digite seu nome"
                >

            </div>


            <div class="pedido-form-group">

                <label>
                    Telefone *
                </label>

                <input
                    type="tel"
                    id="pedido-telefone"
                    placeholder="(34) 99999-9999"
                >

            </div>


            <div class="pedido-form-group">

                <label>
                    Nome do destinatário
                </label>

                <input
                    type="text"
                    id="pedido-destinatario"
                    placeholder="Quem irá receber?"
                >

            </div>


            <div class="pedido-form-group">

                <label>
                    Endereço de entrega *
                </label>

                <input
                    type="text"
                    id="pedido-endereco"
                    placeholder="Rua, número, bairro..."
                >

            </div>


            <div class="pedido-form-row">

                <div class="pedido-form-group">

                    <label>
                        Data da entrega
                    </label>

                    <input
                        type="date"
                        id="pedido-data"
                    >

                </div>


                <div class="pedido-form-group">

                    <label>
                        Horário
                    </label>

                    <input
                        type="time"
                        id="pedido-horario"
                    >

                </div>

            </div>


            <div class="pedido-form-group">

                <label>
                    Mensagem da faixa/cartão
                </label>

                <textarea
                    id="pedido-mensagem"
                    placeholder="Digite a mensagem que deseja enviar..."
                ></textarea>

            </div>


            <div class="pedido-form-group">

                <label>
                    Observações
                </label>

                <textarea
                    id="pedido-observacoes"
                    placeholder="Alguma observação especial?"
                ></textarea>

            </div>


            <button
                type="button"
                class="pedido-enviar-btn"
                id="pedido-enviar-btn"
            >
                <i class="fa-brands fa-whatsapp"></i>
                Enviar pedido pelo WhatsApp
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";


    const fechar =
        document.getElementById(
            "pedido-modal-fechar"
        );


    const enviar =
        document.getElementById(
            "pedido-enviar-btn"
        );


    fechar.addEventListener(
        "click",
        fecharFormularioPedido
    );


    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === overlay
            ) {

                fecharFormularioPedido();

            }

        }
    );


    enviar.addEventListener(
        "click",
        enviarPedidoWhatsApp
    );
}


// ============================================
// FECHAR FORMULÁRIO
// ============================================

function fecharFormularioPedido() {

    const overlay =
        document.getElementById(
            "pedido-modal-overlay"
        );


    if (overlay) {

        overlay.remove();

    }


    document.body.style.overflow =
        "";
}

async function enviarPedidoWhatsApp() {

    const nome = document
        .getElementById("pedido-nome")
        .value
        .trim();

    const telefone = document
        .getElementById("pedido-telefone")
        .value
        .trim();

    const destinatario = document
        .getElementById("pedido-destinatario")
        .value
        .trim();

    const endereco = document
        .getElementById("pedido-endereco")
        .value
        .trim();

    const dataEntrega = document
        .getElementById("pedido-data")
        .value;

    const horario = document
        .getElementById("pedido-horario")
        .value;

    const mensagemFaixa = document
        .getElementById("pedido-mensagem")
        .value
        .trim();

    const observacoes = document
        .getElementById("pedido-observacoes")
        .value
        .trim();


    // ============================================
    // VALIDAR CAMPOS
    // ============================================

    if (!nome || !telefone || !endereco) {

        alert(
            "Preencha seu nome, telefone e endereço de entrega."
        );

        return;
    }


    // ============================================
    // VERIFICAR LOGIN
    // ============================================

    if (typeof supabaseClient === "undefined") {

        console.error(
            "Supabase não foi encontrado."
        );

        alert(
            "Não foi possível conectar ao sistema de pedidos."
        );

        return;
    }


    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        alert(
            "Você precisa entrar na sua conta para finalizar o pedido."
        );

        window.location.href = "login.html";

        return;
    }


    // ============================================
    // GERAR NÚMERO DO PEDIDO
    // ============================================

    const numeroPedido =
        "FP-" +
        Date.now()
            .toString()
            .slice(-6) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase();


    const totalPedido =
        calculateTotal();


    const quantidadeItens =
        countItems();


    // Criamos uma cópia para salvar exatamente
    // os produtos comprados naquele momento.

    const produtosPedido =
        cart.map(item => ({
            id: item.id,
            nome: item.name,
            preco: Number(item.price),
            quantidade: item.quantity,
            imagem: item.image || ""
        }));


    // ============================================
    // SALVAR PEDIDO NO SUPABASE
    // ============================================

    const botaoEnviar =
        document.getElementById(
            "pedido-enviar-btn"
        );


    if (botaoEnviar) {

        botaoEnviar.disabled = true;

        botaoEnviar.innerHTML =
            "Salvando pedido...";

    }


    const {
        data: pedidoSalvo,
        error: pedidoError
    } = await supabaseClient
        .from("pedidos")
        .insert({

            numero_pedido:
                numeroPedido,

            user_id:
                user.id,

            nome_cliente:
                nome,

            telefone:
                telefone,

            destinatario:
                destinatario || null,

            endereco:
                endereco,

            data_entrega:
                dataEntrega || null,

            horario_entrega:
                horario || null,

            mensagem:
                mensagemFaixa || null,

            observacoes:
                observacoes || null,

            produtos:
                produtosPedido,

            quantidade_itens:
                quantidadeItens,

            total:
                totalPedido,

            status:
                "Recebido"

        })
        .select()
        .single();


    if (pedidoError) {

        console.error(
            "Erro ao salvar pedido:",
            pedidoError
        );


        alert(
            "Não foi possível registrar seu pedido. Tente novamente."
        );


        if (botaoEnviar) {

            botaoEnviar.disabled = false;

            botaoEnviar.innerHTML =
                '<i class="fa-brands fa-whatsapp"></i> Enviar pedido pelo WhatsApp';

        }

        return;
    }


    console.log(
        "Pedido salvo:",
        pedidoSalvo
    );


    // ============================================
    // MONTAR MENSAGEM DO WHATSAPP
    // ============================================

    const numeroWhatsApp =
        "5534992480848";


    let mensagem =
        "🌸 *NOVO PEDIDO - FLORES PIOLI* 🌸\n\n";


    mensagem +=
        "🧾 *PEDIDO: #" +
        numeroPedido +
        "*\n\n";


    mensagem +=
        "*DADOS DO CLIENTE*\n";


    mensagem +=
        "Nome: " +
        nome +
        "\n";


    mensagem +=
        "Telefone: " +
        telefone +
        "\n";


    if (destinatario) {

        mensagem +=
            "Destinatário: " +
            destinatario +
            "\n";

    }


    mensagem +=
        "Endereço: " +
        endereco +
        "\n";


    if (dataEntrega) {

        mensagem +=
            "Data da entrega: " +
            formatarDataPedido(
                dataEntrega
            ) +
            "\n";

    }


    if (horario) {

        mensagem +=
            "Horário: " +
            horario +
            "\n";

    }


    mensagem +=
        "\n━━━━━━━━━━━━━━━━━━━━\n\n";


    mensagem +=
        "*PRODUTOS*\n\n";


    cart.forEach(
        function (item, index) {

            const subtotal =
                Number(item.price) *
                item.quantity;


            mensagem +=
                "*" +
                (index + 1) +
                ". " +
                item.name +
                "*\n";


            mensagem +=
                "Quantidade: " +
                item.quantity +
                "\n";


            mensagem +=
                "Valor unitário: " +
                formatPrice(
                    item.price
                ) +
                "\n";


            mensagem +=
                "Subtotal: " +
                formatPrice(
                    subtotal
                ) +
                "\n\n";

        }
    );


    mensagem +=
        "━━━━━━━━━━━━━━━━━━━━\n\n";


    mensagem +=
        "🛒 *Itens:* " +
        quantidadeItens +
        "\n";


    mensagem +=
        "💰 *TOTAL: " +
        formatPrice(
            totalPedido
        ) +
        "*\n";


    if (mensagemFaixa) {

        mensagem +=
            "\n💌 *Mensagem da faixa/cartão:*\n" +
            mensagemFaixa +
            "\n";

    }


    if (observacoes) {

        mensagem +=
            "\n📝 *Observações:*\n" +
            observacoes +
            "\n";

    }


    mensagem +=
        "\nPedido registrado como #" +
        numeroPedido +
        ".";


    mensagem +=
        "\nGostaria de confirmar a disponibilidade e a entrega. 🌷";


    // ============================================
    // ABRIR WHATSAPP
    // ============================================

    const link =
        "https://api.whatsapp.com/send?phone=" +
        numeroWhatsApp +
        "&text=" +
        encodeURIComponent(
            mensagem
        );


    // Limpar carrinho somente depois
    // de o pedido ter sido salvo.

    cart = [];

    saveCart();

    updateCartUI();


    fecharFormularioPedido();

    closeCart();


    window.open(
        link,
        "_blank"
    );

}


// ============================================
// FORMATAR DATA
// ============================================

function formatarDataPedido(data) {

    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
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