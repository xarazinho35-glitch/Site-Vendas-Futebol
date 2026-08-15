// ==========================================
// FLORES PIOLI - PAINEL ADMIN
// ==========================================

let adminPedidos = [];


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const autorizado =
            await verificarAdministrador();

        if (!autorizado) {
            return;
        }

        configurarEventosAdmin();

        await carregarPedidosAdmin();

    }
);


// ==========================================
// VERIFICAR ADMIN
// ==========================================

async function verificarAdministrador() {

    const loading =
        document.getElementById(
            "admin-loading"
        );

    const negado =
        document.getElementById(
            "admin-negado"
        );


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase não carregado."
        );

        if (loading) {
            loading.style.display =
                "none";
        }

        if (negado) {
            negado.style.display =
                "block";
        }

        return false;
    }


    const {
        data: { user },
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !user
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    const {
        data: admin,
        error
    } =
        await supabaseClient
            .from("admins")
            .select("user_id")
            .eq(
                "user_id",
                user.id
            )
            .maybeSingle();


    if (
        error ||
        !admin
    ) {

        console.error(
            "Acesso admin negado:",
            error
        );

        if (loading) {
            loading.style.display =
                "none";
        }

        if (negado) {
            negado.style.display =
                "block";
        }

        return false;
    }


    return true;

}


// ==========================================
// CARREGAR PEDIDOS
// ==========================================

async function carregarPedidosAdmin() {

    const loading =
        document.getElementById(
            "admin-loading"
        );

    const lista =
        document.getElementById(
            "admin-pedidos-lista"
        );

    const vazio =
        document.getElementById(
            "admin-vazio"
        );


    if (loading) {
        loading.style.display =
            "flex";
    }


    if (lista) {
        lista.innerHTML =
            "";
    }


    if (vazio) {
        vazio.style.display =
            "none";
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("pedidos")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (loading) {
        loading.style.display =
            "none";
    }


    if (error) {

        console.error(
            "Erro ao carregar pedidos:",
            error
        );

        if (lista) {

            lista.innerHTML = `

                <div class="admin-error-card">

                    Não foi possível carregar os pedidos.

                </div>

            `;

        }

        return;
    }


    adminPedidos =
        data || [];


    atualizarEstatisticas();

    aplicarFiltrosAdmin();

}


// ==========================================
// FILTROS
// ==========================================

function aplicarFiltrosAdmin() {

    const pesquisa =
        document
            .getElementById(
                "admin-search-input"
            )
            ?.value
            .toLowerCase()
            .trim() || "";


    const status =
        document
            .getElementById(
                "admin-status-filter"
            )
            ?.value || "todos";


    const filtrados =
        adminPedidos.filter(
            function (pedido) {

                const numero =
                    String(
                        pedido.numero_pedido ||
                        ""
                    ).toLowerCase();


                const nome =
                    String(
                        pedido.nome_cliente ||
                        ""
                    ).toLowerCase();


                const telefone =
                    String(
                        pedido.telefone ||
                        ""
                    ).toLowerCase();


                const correspondeBusca =
                    !pesquisa ||
                    numero.includes(
                        pesquisa
                    ) ||
                    nome.includes(
                        pesquisa
                    ) ||
                    telefone.includes(
                        pesquisa
                    );


                const correspondeStatus =
                    status === "todos" ||
                    pedido.status ===
                        status;


                return (
                    correspondeBusca &&
                    correspondeStatus
                );

            }
        );


    renderizarPedidosAdmin(
        filtrados
    );

}


// ==========================================
// RENDERIZAR
// ==========================================

function renderizarPedidosAdmin(
    pedidos
) {

    const lista =
        document.getElementById(
            "admin-pedidos-lista"
        );

    const vazio =
        document.getElementById(
            "admin-vazio"
        );


    if (!lista) {
        return;
    }


    if (
        pedidos.length ===
        0
    ) {

        lista.innerHTML =
            "";

        if (vazio) {
            vazio.style.display =
                "block";
        }

        return;
    }


    if (vazio) {
        vazio.style.display =
            "none";
    }


    lista.innerHTML =
        pedidos
            .map(
                criarCardAdmin
            )
            .join("");

}


// ==========================================
// CARD ADMIN
// ==========================================

function criarCardAdmin(
    pedido
) {

    const produtos =
        Array.isArray(
            pedido.produtos
        )
            ? pedido.produtos
            : [];


    const resumoProdutos =
        produtos
            .map(
                function (produto) {

                    return (
                        produto.quantidade +
                        "x " +
                        produto.nome
                    );

                }
            )
            .join(", ");


    return `

        <article
            class="admin-pedido-card"
            data-id="${pedido.id}"
        >


            <div class="admin-pedido-header">


                <div>

                    <span class="admin-pedido-label">
                        Pedido
                    </span>

                    <h2>
                        #${pedido.numero_pedido}
                    </h2>

                    <p>
                        ${formatarDataAdmin(
                            pedido.created_at
                        )}
                    </p>

                </div>


                <span
                    class="
                        admin-status-badge
                        ${classeStatusAdmin(
                            pedido.status
                        )}
                    "
                >

                    ${pedido.status}

                </span>


            </div>



            <div class="admin-pedido-grid">


                <div>

                    <span>
                        Cliente
                    </span>

                    <strong>
                        ${pedido.nome_cliente}
                    </strong>

                </div>


                <div>

                    <span>
                        Telefone
                    </span>

                    <strong>
                        ${pedido.telefone}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatarPrecoAdmin(
                            pedido.total
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Itens
                    </span>

                    <strong>
                        ${pedido.quantidade_itens}
                    </strong>

                </div>

                <div>

    <span>
        Pagamento
    </span>

    <strong class="admin-pagamento-texto">
        ${pedido.status_pagamento || "Aguardando pagamento"}
    </strong>

</div>


            </div>



            <div class="admin-produtos-resumo">

                <span>
                    Produtos
                </span>

                <p>
                    ${
                        resumoProdutos ||
                        "Nenhum produto"
                    }
                </p>

            </div>



            <div class="admin-endereco">

                <i class="fa-solid fa-location-dot"></i>

                <span>
                    ${pedido.endereco}
                </span>

            </div>



            <div class="admin-status-area">

                <span>
                    Atualizar status
                </span>


                <div class="admin-status-buttons">


                    ${criarBotaoStatus(
                        pedido,
                        "Recebido"
                    )}


                    ${criarBotaoStatus(
                        pedido,
                        "Em preparação"
                    )}


                    ${criarBotaoStatus(
                        pedido,
                        "Saiu para entrega"
                    )}


                    ${criarBotaoStatus(
                        pedido,
                        "Entregue"
                    )}


                    ${criarBotaoStatus(
                        pedido,
                        "Cancelado"
                    )}


                </div>

            </div>

            <div class="admin-pagamento-area">

    <span>
        Status do pagamento
    </span>


    <div class="admin-pagamento-buttons">

        ${criarBotaoPagamento(
            pedido,
            "Aguardando pagamento"
        )}

        ${criarBotaoPagamento(
            pedido,
            "Pago"
        )}

        ${criarBotaoPagamento(
            pedido,
            "Cancelado"
        )}

    </div>

</div>



            <div class="admin-card-actions">

    <button
        type="button"
        class="admin-detalhes-btn"
        onclick="toggleDetalhesAdmin('${pedido.id}')"
    >
        <i class="fa-regular fa-eye"></i>
        Ver detalhes
    </button>

    <a
        href="https://wa.me/55${limparTelefoneAdmin(
            pedido.telefone
        )}"
        target="_blank"
        class="admin-whatsapp-link"
    >
        <i class="fa-brands fa-whatsapp"></i>
        Falar com cliente
    </a>

</div>


<div
    class="admin-pedido-detalhes"
    id="detalhes-${pedido.id}"
>


    <div class="admin-detalhes-grid">


        <div>

            <span>
                Destinatário
            </span>

            <strong>
                ${pedido.destinatario || "Não informado"}
            </strong>

        </div>


        <div>

            <span>
                Data da entrega
            </span>

            <strong>
                ${
                    pedido.data_entrega
                        ? formatarDataEntregaAdmin(
                            pedido.data_entrega
                        )
                        : "Não informada"
                }
            </strong>

        </div>


        <div>

            <span>
                Horário
            </span>

            <strong>
                ${
                    pedido.horario_entrega
                        ? String(
                            pedido.horario_entrega
                        ).slice(0, 5)
                        : "Não informado"
                }
            </strong>

        </div>


        <div>

            <span>
                Endereço
            </span>

            <strong>
                ${pedido.endereco || "-"}
            </strong>

        </div>


    </div>


    <div class="admin-detalhes-texto">

        <span>
            Mensagem da faixa/cartão
        </span>

        <p>
            ${
                pedido.mensagem ||
                "Nenhuma mensagem informada."
            }
        </p>

    </div>


    <div class="admin-detalhes-texto">

        <span>
            Observações
        </span>

        <p>
            ${
                pedido.observacoes ||
                "Nenhuma observação informada."
            }
        </p>

    </div>


    <div class="admin-detalhes-produtos">

        <span>
            Produtos completos
        </span>

        ${
            produtos.length > 0
                ? produtos
                    .map(
                        function (produto) {

                            return `

                                <div class="admin-detalhe-produto">

                                    <div>

                                        <strong>
                                            ${produto.quantidade}x
                                            ${produto.nome}
                                        </strong>

                                        <span>
                                            ${formatarPrecoAdmin(
                                                produto.preco
                                            )} cada
                                        </span>

                                    </div>

                                    <strong>
                                        ${formatarPrecoAdmin(
                                            Number(
                                                produto.preco
                                            ) *
                                            Number(
                                                produto.quantidade
                                            )
                                        )}
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("")
                : "Nenhum produto encontrado."
        }

    </div>


</div>


        </article>

    `;

}


// ==========================================
// BOTÃO DE STATUS
// ==========================================

function criarBotaoStatus(
    pedido,
    status
) {

    const ativo =
        pedido.status ===
        status;


    return `

        <button
            type="button"
            class="
                admin-status-btn
                ${
                    ativo
                        ? "ativo"
                        : ""
                }
            "
            onclick="alterarStatusPedidoAdmin(
                '${pedido.id}',
                '${status}'
            )"
            ${
                ativo
                    ? "disabled"
                    : ""
            }
        >

            ${status}

        </button>

    `;

}

function criarBotaoPagamento(
    pedido,
    status
) {

    const ativo =
        pedido.status_pagamento ===
        status;


    return `

        <button
            type="button"
            class="
                admin-pagamento-btn
                ${
                    ativo
                        ? "ativo"
                        : ""
                }
            "
            onclick="alterarPagamentoAdmin(
                '${pedido.id}',
                '${status}'
            )"
            ${
                ativo
                    ? "disabled"
                    : ""
            }
        >

            ${status}

        </button>

    `;

}

async function alterarPagamentoAdmin(
    pedidoId,
    novoStatus
) {

    const pedido =
        adminPedidos.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    pedidoId
                );

            }
        );


    if (!pedido) {
        return;
    }


    const confirmar =
        window.confirm(
            "Alterar o pagamento do pedido #" +
            pedido.numero_pedido +
            " para \"" +
            novoStatus +
            "\"?"
        );


    if (!confirmar) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("pedidos")
            .update({
                status_pagamento:
                    novoStatus
            })
            .eq(
                "id",
                pedidoId
            );


    if (error) {

        console.error(
            "Erro ao atualizar pagamento:",
            error
        );


        alert(
            "Não foi possível atualizar o pagamento."
        );

        return;
    }


    pedido.status_pagamento =
        novoStatus;


    aplicarFiltrosAdmin();


    mostrarNotificacaoAdmin(
        "Pagamento atualizado para " +
        novoStatus +
        "."
    );

}


// ==========================================
// ALTERAR STATUS
// ==========================================

async function alterarStatusPedidoAdmin(
    pedidoId,
    novoStatus
) {

    const pedido =
        adminPedidos.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    pedidoId
                );

            }
        );


    if (!pedido) {
        return;
    }


    const confirmar =
        window.confirm(
            "Alterar o pedido #" +
            pedido.numero_pedido +
            " para \"" +
            novoStatus +
            "\"?"
        );


    if (!confirmar) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("pedidos")
            .update({
                status:
                    novoStatus
            })
            .eq(
                "id",
                pedidoId
            );


    if (error) {

        console.error(
            "Erro ao atualizar status:",
            error
        );

        alert(
            "Não foi possível atualizar o status."
        );

        return;
    }


    pedido.status =
        novoStatus;


    atualizarEstatisticas();

    aplicarFiltrosAdmin();


    mostrarNotificacaoAdmin(
        "Status atualizado para " +
        novoStatus +
        "."
    );

}


// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas() {

    colocarTextoAdmin(
        "stat-total",
        adminPedidos.length
    );


    colocarTextoAdmin(
        "stat-recebidos",
        contarStatusAdmin(
            "Recebido"
        )
    );


    colocarTextoAdmin(
        "stat-preparacao",
        contarStatusAdmin(
            "Em preparação"
        )
    );


    colocarTextoAdmin(
        "stat-entrega",
        contarStatusAdmin(
            "Saiu para entrega"
        )
    );

}


// ==========================================
// CONTAR STATUS
// ==========================================

function contarStatusAdmin(
    status
) {

    return adminPedidos
        .filter(
            function (pedido) {

                return (
                    pedido.status ===
                    status
                );

            }
        )
        .length;

}


// ==========================================
// EVENTOS
// ==========================================

function configurarEventosAdmin() {

    const search =
        document.getElementById(
            "admin-search-input"
        );


    const filter =
        document.getElementById(
            "admin-status-filter"
        );


    const refresh =
        document.getElementById(
            "admin-refresh-btn"
        );


    const logout =
        document.getElementById(
            "admin-logout-btn"
        );


    if (search) {

        search.addEventListener(
            "input",
            aplicarFiltrosAdmin
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            aplicarFiltrosAdmin
        );

    }


    if (refresh) {

        refresh.addEventListener(
            "click",
            carregarPedidosAdmin
        );

    }


    if (logout) {

        logout.addEventListener(
            "click",
            async function () {

                await supabaseClient
                    .auth
                    .signOut();


                window.location.href =
                    "login.html";

            }
        );

    }

}


// ==========================================
// NOTIFICAÇÃO
// ==========================================

function mostrarNotificacaoAdmin(
    mensagem
) {

    const antiga =
        document.querySelector(
            ".admin-toast"
        );


    if (antiga) {
        antiga.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "admin-toast";


    toast.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>
            ${mensagem}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "show"
            );

        },
        20
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                function () {

                    toast.remove();

                },
                250
            );

        },
        3000
    );

}


// ==========================================
// STATUS CSS
// ==========================================

function classeStatusAdmin(
    status
) {

    return (
        "admin-status-" +
        String(
            status ||
            ""
        )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            )
    );

}


// ==========================================
// PREÇO
// ==========================================

function formatarPrecoAdmin(
    valor
) {

    return Number(
        valor ||
        0
    ).toLocaleString(
        "pt-BR",
        {
            style:
                "currency",

            currency:
                "BRL"
        }
    );

}


// ==========================================
// DATA
// ==========================================

function formatarDataAdmin(
    data
) {

    if (!data) {
        return "-";
    }


    return new Date(
        data
    ).toLocaleString(
        "pt-BR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


// ==========================================
// TELEFONE
// ==========================================

function limparTelefoneAdmin(
    telefone
) {

    let numero =
        String(
            telefone ||
            ""
        ).replace(
            /\D/g,
            ""
        );


    if (
        numero.startsWith(
            "55"
        )
    ) {

        numero =
            numero.substring(
                2
            );

    }


    return numero;

}


// ==========================================
// TEXTO
// ==========================================

function colocarTextoAdmin(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}

function toggleDetalhesAdmin(
    pedidoId
) {

    const detalhes =
        document.getElementById(
            "detalhes-" +
            pedidoId
        );


    if (!detalhes) {
        return;
    }


    detalhes.classList.toggle(
        "aberto"
    );

}


function formatarDataEntregaAdmin(
    data
) {

    if (!data) {
        return "-";
    }


    const partes =
        String(data)
            .split("-");


    if (
        partes.length !== 3
    ) {
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