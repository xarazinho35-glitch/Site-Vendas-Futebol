// ==========================================
// FLORES PIOLI - ACOMPANHAR PEDIDO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "acompanhar-form"
            );

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            consultarPedido
        );

    }
);


// ==========================================
// CONSULTAR
// ==========================================

async function consultarPedido(
    event
) {

    event.preventDefault();


    const numero =
        document
            .getElementById(
                "acompanhar-numero"
            )
            .value
            .trim();


    const telefone =
        document
            .getElementById(
                "acompanhar-telefone"
            )
            .value
            .trim();


    const botao =
        document.getElementById(
            "acompanhar-btn"
        );


    esconderResultado();


    mostrarMensagem(
        "Consultando pedido...",
        "info"
    );


    if (botao) {

        botao.disabled =
            true;

        botao.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...';

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "consultar_pedido",
                {
                    p_numero_pedido:
                        numero,

                    p_telefone:
                        telefone
                }
            );


    if (botao) {

        botao.disabled =
            false;

        botao.innerHTML =
            '<i class="fa-solid fa-magnifying-glass"></i> Consultar pedido';

    }


    if (error) {

        console.error(
            "Erro ao consultar pedido:",
            error
        );


        mostrarMensagem(
            "Não foi possível consultar o pedido. Tente novamente.",
            "erro"
        );

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        mostrarMensagem(
            "Pedido não encontrado. Confira o número do pedido e o telefone informado.",
            "erro"
        );

        return;

    }


    esconderMensagem();


    preencherResultado(
        data[0]
    );

}


// ==========================================
// PREENCHER RESULTADO
// ==========================================

function preencherResultado(
    pedido
) {

    const resultado =
        document.getElementById(
            "acompanhar-resultado"
        );


    colocarTexto(
        "resultado-numero",
        "#" + pedido.numero_pedido
    );


    colocarTexto(
        "resultado-cliente",
        pedido.nome_cliente ||
        "-"
    );


    colocarTexto(
        "resultado-itens",
        pedido.quantidade_itens ||
        0
    );


    colocarTexto(
        "resultado-total",
        formatarPreco(
            pedido.total
        )
    );


    colocarTexto(
        "resultado-pagamento",
        pedido.status_pagamento ||
        "Aguardando pagamento"
    );


    colocarTexto(
        "resultado-data-entrega",

        pedido.data_entrega
            ? formatarDataEntrega(
                pedido.data_entrega
            )
            : "Não informada"
    );


    colocarTexto(
        "resultado-horario",

        pedido.horario_entrega
            ? String(
                pedido.horario_entrega
            ).slice(
                0,
                5
            )
            : "Não informado"
    );


    colocarTexto(
        "resultado-data",

        pedido.created_at
            ? "Realizado em " +
              formatarDataHora(
                  pedido.created_at
              )
            : ""
    );


    atualizarStatus(
        pedido.status
    );


    if (resultado) {

        resultado.style.display =
            "block";

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================
// STATUS
// ==========================================

function atualizarStatus(
    status
) {

    const statusAtual =
        status ||
        "Recebido";


    const badge =
        document.getElementById(
            "resultado-status"
        );


    const titulo =
        document.getElementById(
            "resultado-status-titulo"
        );


    const descricao =
        document.getElementById(
            "resultado-status-descricao"
        );


    const icon =
        document.getElementById(
            "resultado-status-icon"
        );


    const normalizado =
        normalizarStatus(
            statusAtual
        );


    if (badge) {

        badge.textContent =
            statusAtual;

        badge.className =
            "resultado-status status-" +
            normalizado.replace(
                /\s+/g,
                "-"
            );

    }


    let tituloStatus =
        statusAtual;

    let descricaoStatus =
        "Acompanhe as atualizações do seu pedido.";

    let iconeStatus =
        "fa-box";


    if (
        normalizado ===
        "recebido"
    ) {

        tituloStatus =
            "Pedido recebido";

        descricaoStatus =
            "Seu pedido foi registrado e já está em nosso sistema.";

        iconeStatus =
            "fa-check";

    }


    if (
        normalizado ===
        "em preparacao"
    ) {

        tituloStatus =
            "Em preparação";

        descricaoStatus =
            "Estamos preparando sua homenagem com todo cuidado.";

        iconeStatus =
            "fa-seedling";

    }


    if (
        normalizado ===
        "saiu para entrega"
    ) {

        tituloStatus =
            "Saiu para entrega";

        descricaoStatus =
            "Seu pedido está a caminho do endereço informado.";

        iconeStatus =
            "fa-truck-fast";

    }


    if (
        normalizado ===
        "entregue"
    ) {

        tituloStatus =
            "Pedido entregue";

        descricaoStatus =
            "A entrega foi concluída com sucesso.";

        iconeStatus =
            "fa-circle-check";

    }


    if (
        normalizado ===
        "cancelado"
    ) {

        tituloStatus =
            "Pedido cancelado";

        descricaoStatus =
            "Este pedido foi cancelado. Entre em contato conosco caso precise de ajuda.";

        iconeStatus =
            "fa-circle-xmark";

    }


    colocarTexto(
        "resultado-status-titulo",
        tituloStatus
    );


    colocarTexto(
        "resultado-status-descricao",
        descricaoStatus
    );


    if (icon) {

        icon.innerHTML =
            '<i class="fa-solid ' +
            iconeStatus +
            '"></i>';

    }

}


// ==========================================
// MENSAGENS
// ==========================================

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "acompanhar-mensagem"
        );


    if (!mensagem) {
        return;
    }


    mensagem.style.display =
        "block";


    mensagem.className =
        "acompanhar-mensagem " +
        tipo;


    mensagem.textContent =
        texto;

}


function esconderMensagem() {

    const mensagem =
        document.getElementById(
            "acompanhar-mensagem"
        );


    if (mensagem) {

        mensagem.style.display =
            "none";

    }

}


function esconderResultado() {

    const resultado =
        document.getElementById(
            "acompanhar-resultado"
        );


    if (resultado) {

        resultado.style.display =
            "none";

    }

}


// ==========================================
// UTILIDADES
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


function normalizarStatus(
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


function formatarPreco(
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


function formatarDataHora(
    data
) {

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


function formatarDataEntrega(
    data
) {

    const partes =
        String(data)
            .split("-");


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