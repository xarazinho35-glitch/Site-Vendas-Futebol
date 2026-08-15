// ==========================================
// FLORES PIOLI - DETALHES DO PEDIDO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        const loading =
            document.getElementById(
                "pedido-loading"
            );


        const erro =
            document.getElementById(
                "pedido-erro"
            );


        const conteudo =
            document.getElementById(
                "pedido-conteudo"
            );


        // ======================================
        // NÚMERO DO PEDIDO NA URL
        // ======================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const numeroPedido =
            parametros.get(
                "numero"
            );


        if (!numeroPedido) {

            mostrarErroPedido(
                loading,
                erro
            );

            return;

        }


        // ======================================
        // VERIFICAR LOGIN
        // ======================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "Supabase não encontrado."
            );

            mostrarErroPedido(
                loading,
                erro
            );

            return;

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

            return;

        }


        // ======================================
        // BUSCAR O PEDIDO
        // ======================================

        const {
            data: pedido,
            error
        } =
            await supabaseClient
                .from("pedidos")
                .select("*")
                .eq(
                    "numero_pedido",
                    numeroPedido
                )
                .eq(
                    "user_id",
                    user.id
                )
                .single();


        if (
            error ||
            !pedido
        ) {

            console.error(
                "Erro ao carregar pedido:",
                error
            );


            mostrarErroPedido(
                loading,
                erro
            );

            return;

        }


        // ======================================
        // MOSTRAR CONTEÚDO
        // ======================================

        if (loading) {

            loading.style.display =
                "none";

        }


        if (conteudo) {

            conteudo.style.display =
                "block";

        }


        preencherPedido(
            pedido
        );

        colocarTextoPedido(
    "pedido-pagamento",
    pedido.status_pagamento ||
    "Aguardando pagamento"
);

    }
);


// ==========================================
// MOSTRAR ERRO
// ==========================================

function mostrarErroPedido(
    loading,
    erro
) {

    if (loading) {

        loading.style.display =
            "none";

    }


    if (erro) {

        erro.style.display =
            "block";

    }

}


// ==========================================
// PREENCHER PEDIDO
// ==========================================

function preencherPedido(
    pedido
) {

    colocarTextoPedido(
        "pedido-numero",
        "#" + pedido.numero_pedido
    );


    colocarTextoPedido(
        "pedido-data-criacao",
        "Realizado em " +
        formatarDataHoraPedido(
            pedido.created_at
        )
    );


    colocarTextoPedido(
        "pedido-cliente",
        pedido.nome_cliente ||
        "-"
    );


    colocarTextoPedido(
        "pedido-telefone",
        pedido.telefone ||
        "-"
    );


    colocarTextoPedido(
        "pedido-destinatario",
        pedido.destinatario ||
        "Não informado"
    );


    colocarTextoPedido(
        "pedido-endereco",
        pedido.endereco ||
        "-"
    );


    colocarTextoPedido(
        "pedido-data-entrega",

        pedido.data_entrega
            ? formatarDataPedido(
                pedido.data_entrega
            )
            : "Não informada"
    );


    colocarTextoPedido(
        "pedido-horario",

        pedido.horario_entrega
            ? String(
                pedido.horario_entrega
            ).slice(
                0,
                5
            )
            : "Não informado"
    );


    colocarTextoPedido(
        "pedido-mensagem",

        pedido.mensagem ||
        "Nenhuma mensagem informada."
    );


    colocarTextoPedido(
        "pedido-observacoes",

        pedido.observacoes ||
        "Nenhuma observação informada."
    );


    colocarTextoPedido(
        "pedido-quantidade",

        pedido.quantidade_itens ||
        0
    );


    colocarTextoPedido(
        "pedido-total",

        formatarPrecoPedido(
            pedido.total
        )
    );


    atualizarStatusPedido(
        pedido.status
    );


    mostrarProdutosPedido(
        pedido.produtos
    );

}


// ==========================================
// STATUS ATUAL
// ==========================================

function atualizarStatusPedido(
    status
) {

    const statusAtual =
        status ||
        "Recebido";


    const statusElemento =
        document.getElementById(
            "pedido-status"
        );


    if (statusElemento) {

        statusElemento.textContent =
            statusAtual;


        statusElemento.className =
            "pedido-status " +
            classeStatusPedido(
                statusAtual
            );

    }


    const titulo =
        document.getElementById(
            "status-atual-titulo"
        );


    const descricao =
        document.getElementById(
            "status-atual-descricao"
        );


    const icon =
        document.getElementById(
            "status-atual-icon"
        );


    const card =
        document.getElementById(
            "status-atual-card"
        );


    const statusNormalizado =
        normalizarStatusPedido(
            statusAtual
        );


    let tituloStatus =
        statusAtual;


    let descricaoStatus =
        "Acompanhe as atualizações do seu pedido.";


    let iconeStatus =
        "fa-box";


    let classe =
        "recebido";


    // RECEBIDO

    if (
        statusNormalizado ===
        "recebido"
    ) {

        tituloStatus =
            "Pedido recebido";


        descricaoStatus =
            "Seu pedido foi registrado e já está em nosso sistema.";


        iconeStatus =
            "fa-check";


        classe =
            "recebido";

    }


    // PREPARAÇÃO

    if (
        statusNormalizado ===
        "em preparacao"
    ) {

        tituloStatus =
            "Em preparação";


        descricaoStatus =
            "Estamos preparando sua homenagem com todo cuidado.";


        iconeStatus =
            "fa-seedling";


        classe =
            "preparacao";

    }


    // ENTREGA

    if (
        statusNormalizado ===
        "saiu para entrega"
    ) {

        tituloStatus =
            "Saiu para entrega";


        descricaoStatus =
            "Seu pedido está a caminho do endereço informado.";


        iconeStatus =
            "fa-truck-fast";


        classe =
            "entrega";

    }


    // ENTREGUE

    if (
        statusNormalizado ===
        "entregue"
    ) {

        tituloStatus =
            "Pedido entregue";


        descricaoStatus =
            "Sua entrega foi concluída com sucesso.";


        iconeStatus =
            "fa-circle-check";


        classe =
            "entregue";

    }


    // CANCELADO

    if (
        statusNormalizado ===
        "cancelado"
    ) {

        tituloStatus =
            "Pedido cancelado";


        descricaoStatus =
            "Este pedido foi cancelado. Entre em contato conosco caso precise de ajuda.";


        iconeStatus =
            "fa-circle-xmark";


        classe =
            "cancelado";

    }


    if (titulo) {

        titulo.textContent =
            tituloStatus;

    }


    if (descricao) {

        descricao.textContent =
            descricaoStatus;

    }


    if (icon) {

        icon.innerHTML =
            '<i class="fa-solid ' +
            iconeStatus +
            '"></i>';

    }


    if (card) {

        card.className =
            "status-atual-card " +
            "status-card-" +
            classe;

    }

}


// ==========================================
// PRODUTOS
// ==========================================

function mostrarProdutosPedido(
    produtos
) {

    const container =
        document.getElementById(
            "pedido-produtos"
        );


    if (!container) {

        return;

    }


    if (
        !Array.isArray(
            produtos
        ) ||
        produtos.length === 0
    ) {

        container.innerHTML = `

            <div class="pedido-sem-produto">
                Nenhum produto encontrado.
            </div>

        `;

        return;

    }


    container.innerHTML =
        produtos
            .map(
                function (
                    produto
                ) {

                    const preco =
                        Number(
                            produto.preco ||
                            0
                        );


                    const quantidade =
                        Number(
                            produto.quantidade ||
                            1
                        );


                    const subtotal =
                        preco *
                        quantidade;


                    return `

                        <article class="pedido-produto">


                            <div class="pedido-produto-imagem">

                                ${
                                    produto.imagem
                                        ? `
                                            <img
                                                src="${produto.imagem}"
                                                alt="${produto.nome || "Produto"}"
                                            >
                                        `
                                        : `
                                            <i class="fa-solid fa-seedling"></i>
                                        `
                                }

                            </div>


                            <div class="pedido-produto-info">

                                <h3>
                                    ${produto.nome || "Produto"}
                                </h3>


                                <div class="pedido-produto-meta">

                                    <span>
                                        Quantidade:
                                        <strong>
                                            ${quantidade}
                                        </strong>
                                    </span>


                                    <span>
                                        Unitário:
                                        <strong>
                                            ${formatarPrecoPedido(preco)}
                                        </strong>
                                    </span>

                                </div>

                            </div>


                            <div class="pedido-produto-preco">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ${formatarPrecoPedido(subtotal)}
                                </strong>

                            </div>


                        </article>

                    `;

                }
            )
            .join("");

}


// ==========================================
// CLASSE DO STATUS
// ==========================================

function classeStatusPedido(
    status
) {

    return (
        "status-" +
        normalizarStatusPedido(
            status
        ).replace(
            /\s+/g,
            "-"
        )
    );

}


// ==========================================
// NORMALIZAR STATUS
// ==========================================

function normalizarStatusPedido(
    texto
) {

    return String(
        texto ||
        ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


// ==========================================
// COLOCAR TEXTO
// ==========================================

function colocarTextoPedido(
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


// ==========================================
// PREÇO
// ==========================================

function formatarPrecoPedido(
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
// DATA/HORA
// ==========================================

function formatarDataHoraPedido(
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
// DATA
// ==========================================

function formatarDataPedido(
    data
) {

    if (!data) {

        return "-";

    }


    const partes =
        String(
            data
        ).split(
            "-"
        );


    if (
        partes.length !==
        3
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