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
        // PEGAR NÚMERO DA URL
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
        // BUSCAR PEDIDO
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


    colocarTexto(
        "pedido-numero",
        "#" + pedido.numero_pedido
    );


    colocarTexto(
        "pedido-data-criacao",
        "Realizado em " +
        formatarDataHoraPedido(
            pedido.created_at
        )
    );


    colocarTexto(
        "pedido-cliente",
        pedido.nome_cliente ||
        "-"
    );


    colocarTexto(
        "pedido-telefone",
        pedido.telefone ||
        "-"
    );


    colocarTexto(
        "pedido-destinatario",
        pedido.destinatario ||
        "Não informado"
    );


    colocarTexto(
        "pedido-endereco",
        pedido.endereco ||
        "-"
    );


    colocarTexto(
        "pedido-data-entrega",
        pedido.data_entrega
            ? formatarDataPedidoDetalhe(
                pedido.data_entrega
            )
            : "Não informada"
    );


    colocarTexto(
        "pedido-horario",
        pedido.horario_entrega
            ? pedido.horario_entrega
                  .slice(0, 5)
            : "Não informado"
    );


    colocarTexto(
        "pedido-mensagem",
        pedido.mensagem ||
        "Nenhuma mensagem informada."
    );


    colocarTexto(
        "pedido-observacoes",
        pedido.observacoes ||
        "Nenhuma observação informada."
    );


    colocarTexto(
        "pedido-quantidade",
        pedido.quantidade_itens ||
        0
    );


    colocarTexto(
        "pedido-total",
        formatarPrecoPedidoDetalhe(
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
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        container.innerHTML = `

            <p>
                Nenhum produto encontrado.
            </p>

        `;

        return;
    }


    container.innerHTML =
        produtos
            .map(
                function (produto) {


                    const subtotal =
                        Number(
                            produto.preco
                        ) *
                        Number(
                            produto.quantidade
                        );


                    return `

                        <article class="pedido-produto">


                            <div class="pedido-produto-imagem">

                                ${
                                    produto.imagem
                                        ? `
                                            <img
                                                src="${produto.imagem}"
                                                alt="${produto.nome}"
                                            >
                                        `
                                        : `
                                            <i class="fa-solid fa-seedling"></i>
                                        `
                                }

                            </div>


                            <div class="pedido-produto-info">

                                <h3>
                                    ${produto.nome}
                                </h3>

                                <span>
                                    Quantidade:
                                    ${produto.quantidade}
                                </span>

                                <span>
                                    Unitário:
                                    ${formatarPrecoPedidoDetalhe(
                                        produto.preco
                                    )}
                                </span>

                            </div>


                            <strong class="pedido-produto-subtotal">

                                ${formatarPrecoPedidoDetalhe(
                                    subtotal
                                )}

                            </strong>


                        </article>

                    `;

                }
            )
            .join("");

}


// ==========================================
// STATUS
// ==========================================

function atualizarStatusPedido(
    status
) {

    const statusElemento =
        document.getElementById(
            "pedido-status"
        );


    const statusAtual =
        status ||
        "Recebido";


    if (statusElemento) {

        statusElemento.textContent =
            statusAtual;


        statusElemento.className =
            "pedido-status " +
            classeStatusPedido(
                statusAtual
            );

    }


    const ordemStatus = [
        "Recebido",
        "Em preparação",
        "Saiu para entrega",
        "Entregue"
    ];


    const indiceAtual =
        ordemStatus.findIndex(
            function (item) {

                return normalizarTextoStatus(
                    item
                ) ===
                normalizarTextoStatus(
                    statusAtual
                );

            }
        );


    document
        .querySelectorAll(
            ".timeline-etapa"
        )
        .forEach(
            function (
                etapa,
                index
            ) {

                etapa.classList.remove(
                    "concluida",
                    "atual"
                );


                if (
                    indiceAtual >= 0 &&
                    index < indiceAtual
                ) {

                    etapa.classList.add(
                        "concluida"
                    );

                }


                if (
                    indiceAtual >= 0 &&
                    index === indiceAtual
                ) {

                    etapa.classList.add(
                        "atual"
                    );

                }

            }
        );

}


// ==========================================
// CLASSE STATUS
// ==========================================

function classeStatusPedido(
    status
) {

    return (
        "status-" +
        normalizarTextoStatus(
            status
        )
            .replace(
                /\s+/g,
                "-"
            )
    );

}


// ==========================================
// NORMALIZAR
// ==========================================

function normalizarTextoStatus(
    texto
) {

    return String(
        texto ||
        ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


// ==========================================
// TEXTO
// ==========================================

function colocarTexto(
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

function formatarPrecoPedidoDetalhe(
    valor
) {

    return Number(
        valor ||
        0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
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
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// DATA DE ENTREGA
// ==========================================

function formatarDataPedidoDetalhe(
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