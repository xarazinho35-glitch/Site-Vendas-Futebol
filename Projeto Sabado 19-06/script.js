// ===== CARRINHO DE COMPRAS =====

// Estado do carrinho
let cart = [];

// Elementos do DOM - Carrinho
const cartBtn = document.getElementById('open-cart'); // Ajustado para bater com o HTML
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart'); // Ajustado para bater com o HTML
const cartItems = document.getElementById('cart-items-container'); // Ajustado para bater com o HTML
const cartCount = document.getElementById('cart-count-val'); // Ajustado para bater com o HTML
const cartTotalValue = document.getElementById('cart-total-value');
const checkoutBtn = document.querySelector('.checkout-btn');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const notification = document.getElementById('notification');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// ===== FUNÇÕES DO CARRINHO =====

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Adicionar produto ao carrinho
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Produto adicionado ao carrinho!');
    animateCartCount();
}

// Remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Produto removido do carrinho!');
}

// Atualizar quantidade do produto
window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Remover item completamente
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Produto removido do carrinho!');
}

// Limpar carrinho
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Carrinho limpo!');
    }
}

// Calcular total do carrinho
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Contar itens no carrinho
function countItems() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Formatar preço em Real
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// ===== ATUALIZAÇÃO DA INTERFACE =====

function updateCartUI() {
    if (!cartCount || !cartTotalValue || !cartItems) return;

    // Atualizar contador
    const itemCount = countItems();
    cartCount.textContent = itemCount;
    
    // Atualizar total
    cartTotalValue.textContent = formatPrice(calculateTotal());
    
    // Atualizar lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Seu carrinho está vazio</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Adicione produtos para começar!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="Remover">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ===== ANIMAÇÕES E NOTIFICAÇÕES =====

function showNotification(message) {
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

function animateCartCount() {
    if (!cartCount) return;
    cartCount.classList.add('pulse');
    setTimeout(() => {
        cartCount.classList.remove('pulse');
    }, 300);
}

// ===== CONTROLE DO SIDEBAR DO CARRINHO =====

function openCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== FINALIZAR COMPRA =====

function checkout() {
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho primeiro!');
        return;
    }
    
    const total = formatPrice(calculateTotal());
    const itemCount = countItems();
    
    alert(`🎉 Compra finalizada com sucesso!\n\nTotal de itens: ${itemCount}\nValor total: ${total}\n\nObrigado pela preferência!`);
    
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}

// ===== EVENT LISTENERS =====

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

// Botões "Adicionar ao Carrinho" extraindo dados do botão ou do card estruturado
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Tenta pegar direto do botão (como no HTML enviado da Copa), se não conseguir busca no card
        const id = this.getAttribute('data-id') || this.closest('.product-card').dataset.id;
        const name = this.getAttribute('data-name') || this.closest('.product-card').dataset.name;
        const price = this.getAttribute('data-price') || this.closest('.product-card').dataset.price;
        
        const card = this.closest('.product-card');
        const image = card.querySelector('.product-image img').src;
        
        const product = {
            id: id,
            name: name,
            price: parseFloat(price),
            image: image
        };
        
        addToCart(product);
    });
});

// Fechar carrinho com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCart();
        fecharMenu();
    }
});

// Carregar carrinho ao iniciar
document.addEventListener('DOMContentLoaded', loadCart);


// ===== CONTROLE DO MENU LATERAL (CORRIGIDO PARA RESPONDER AOS DOIS NOMES) =====

// Procura o botão usando o id antigo ou o novo
const menuBtn = document.getElementById("open-menu") || document.getElementById("menu-btn"); 
const menuSidebar = document.getElementById("menu-sidebar");
const menuOverlay = document.getElementById("menu-overlay");
// Procura o botão de fechar usando o id antigo ou o novo
const closeMenuBtn = document.getElementById("close-menu") || document.getElementById("close-menu-btn"); 

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        if (menuSidebar && menuOverlay) {
            menuSidebar.classList.add("active");
            menuOverlay.classList.add("active");
        }
    });
}

if (closeMenuBtn) closeMenuBtn.addEventListener("click", fecharMenu);
if (menuOverlay) menuOverlay.addEventListener("click", fecharMenu);

function fecharMenu() {
    if (menuSidebar && menuOverlay) {
        menuSidebar.classList.remove("active");
        menuOverlay.classList.remove("active");
    }
}