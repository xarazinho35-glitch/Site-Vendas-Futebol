const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

const produto = produtos[id];

document.getElementById("titulo").textContent = produto.nome;

document.getElementById("tituloPagina").textContent = produto.nome;

document.getElementById("descricao").textContent = produto.descricao;

document.getElementById("imagemProduto").src = produto.imagem;

document.getElementById("preco").textContent =
produto.preco.toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
});