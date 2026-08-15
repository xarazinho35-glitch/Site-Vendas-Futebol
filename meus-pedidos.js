// ==========================================
// FLORES PIOLI - MEUS PEDIDOS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        const lista =
            document.getElementById(
                "meus-pedidos-lista"
            );


        const loading =
            document.getElementById(
                "meus-pedidos-loading"
            );


        const vazio =
            document.getElementById(
                "meus-pedidos-vazio"
            );


        if (!lista) {
            return;
        }


        // ======================================
        // VERIFICAR USUÁRIO
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
        // BUSCAR PEDIDOS
        // ======================================

        const {
            data: pedidos,
            error
        } =
            await supabaseClient
                .from("pedidos")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
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
                "Erro ao buscar pedidos:",
                error
            );


            lista.innerHTML = `

                <div class="pedidos-erro">

                    <h3>
                        Não foi possível carregar seus pedidos.
                    </h3>

                    <p>
                        Tente atualizar a página.
                    </p>

                </div>

            `;

            return;
        }


        // ======================================
        // NENHUM PEDIDO
        // ======================================

        if (
            !pedidos ||
            pedidos.length === 0
        ) {

            if (vazio) {

                vazio.style.display =
                    "block";

            }

            return;
        }


        // ======================================
        // MOSTRAR PEDIDOS
        // ======================================

        lista.innerHTML =
            pedidos
                .map(
                    pedido =>
                        criarCardPedido(
                            pedido
                        )
                )
                .join("");

    }
);


// ==========================================
// CRIAR CARD
// ==========================================

function criarCardPedido(
    pedido
) {

    const data =
        formatarDataHora(
            pedido.created_at
        );


    const statusClass =
        normalizarStatus(
            pedido.status
        );


    return 

        <article class="pedido-card">


            <div class="pedido-card-topo">

                <div>

                    <span class="pedido-label">
                        Pedido
                    </span>

                    <h2>
                        #${pedido.numero_pedido}
                    </h2>

                </div>


                <span
                    class="pedido-status ${statusClass}"
                >
                    ${pedido.status}
                </span>

            </div>


            <div class="pedido-card-info">


                <div>

                    <span>
                        Data
                    </span>

                    <strong>
                        ${data}
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
                        Total
                    </span>

                    <strong>
                        ${formatarPrecoPedido(
                            pedido.total
                        )}
                    </strong>

                </div>


            </div>


            <button
                type="button"
                class="pedido-detalhes-btn"
                onclick="abrirDetalhesPedido('${pedido.numero_pedido}')"
            >
                Ver detalhes
            </button>


        </article>

    ;

    <div class="pedido-pagamento-resumo">
    <span>
        Pagamento
    </span>

    <strong>
        ${pedido.status_pagamento || "Aguardando pagamento"}
    </strong>
</div>
}


// ==========================================
// ABRIR DETALHES
// ==========================================

function abrirDetalhesPedido(
    numeroPedido
) {

    window.location.href =
        "pedido.html?numero=" +
        encodeURIComponent(
            numeroPedido
        );

}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPrecoPedido(
    valor
) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataHora(
    data
) {

    if (!data) {
        return "-";
    }


    return new Date(data)
        .toLocaleString(
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
// CLASSE DO STATUS
// ==========================================

function normalizarStatus(
    status
) {

    const texto =
        String(status || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            );


    return (
        "status-" +
        texto
    );

}