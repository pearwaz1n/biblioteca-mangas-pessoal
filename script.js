const modalAdicionar = document.getElementById("modalAdicionar");
const botaoAdicionar = document.querySelector(".adicionar");
const botaoFecharModal = document.querySelector(".fechar-modal");
const formManga = document.getElementById("formManga");
const titulo = document.getElementById("titulo");
const autor = document.getElementById("autor");
const genero = document.getElementById("genero");
const status = document.getElementById("status");
const capitulos = document.getElementById("capitulo");
const foto = document.getElementById("foto");
const estante = document.querySelector(".estante-mangas");
const remover = document.querySelector(".btn-remover");

//criacao do local storage
let mangasSalvos;
try {
    mangasSalvos = JSON.parse(localStorage.getItem("meusMangas"));
    
    // Se a memória estiver corrompida ele zera para não travar o site
    if (!Array.isArray(mangasSalvos)) {
        mangasSalvos = [];
        localStorage.setItem("meusMangas", JSON.stringify(mangasSalvos)); 
    }
} catch (err) {
    console.warn("Erro ao ler o Local Storage, iniciando estante vazia:", err);
    mangasSalvos = [];
}

let idEditando = null; // iD do mangá que está sendo editado

// abre e fecha o modaL
botaoAdicionar.addEventListener("click", () => modalAdicionar.style.display = "flex");
botaoFecharModal.addEventListener("click", () => {
    modalAdicionar.style.display = "none";
    idEditando = null; //se clicar no xzinho fecha
    formManga.reset();
});

// monta o html do card com as infos novas
function criarConteudoCard(data) {
    return `
        <img src="${data.foto}" alt="${data.titulo}">
        <div class="info-livro">
            <h2>${data.titulo}</h2>
            <span class="genero">${data.genero}</span>
            <p>Autor: ${data.autor}</p>
            <p>Status: ${data.status}</p>
            <p>Capítulo: ${data.capitulo}</p>
        </div>
        <div class="botoes-info">
            <button class="btn-editar" data-id="${data.id}">Editar</button>
            <button class="btn-mais1" data-id="${data.id}">+1</button>
            <button class="btn-remover" data-id="${data.id}">Remover</button>
        </div>
    `;
}
//le oq foi escrito no forms
function lerFormulario() {
    return {
        titulo: titulo.value,
        autor: autor.value,
        genero: genero.value,
        status: status.value,
        capitulo: parseInt(capitulos.value) || 0, // garante que capítulo é um numero (wur dur)
        foto: foto.value,
    };
}

//redesenha os cards
function atualizarTela() {
    estante.innerHTML = ""; // limpa os cards atuais
    mangasSalvos.forEach(manga => {
        const novo = document.createElement("div");
        novo.className = "Container";
        novo.innerHTML = criarConteudoCard(manga);
        estante.appendChild(novo);
    });
}

//adiciona novo ou edita
formManga.addEventListener("submit", e => {
    e.preventDefault();
    const data = lerFormulario();

    if (idEditando) {
        // acha o mangá pelo ID e muda
        const index = mangasSalvos.findIndex(m => m.id === idEditando);
        data.id = idEditando; // mantém o ID original
        mangasSalvos[index] = data;
        idEditando = null;
    } else {
        // Cria um ID único baseado na data (?)
        data.id = Date.now();
        mangasSalvos.push(data);
    }

    // salva a lista inteira atualizada
    localStorage.setItem("meusMangas", JSON.stringify(mangasSalvos));
    
    atualizarTela();
    modalAdicionar.style.display = "none"; // fecha modal
    formManga.reset(); // limpa form
});

// botao +1 e editar eventos
estante.addEventListener("click", e => {
    // Se não clicou em um botão, não faz nada
    if (e.target.tagName !== "BUTTON") return;

    // pega o ID do que foi clicado
    const idClicado = parseInt(e.target.getAttribute("data-id"));
    const manga = mangasSalvos.find(m => m.id === idClicado);
    
    if (!manga) return; // Se por acaso não achar, encerra a função

    // Botão +1
    if (e.target.classList.contains("btn-mais1") || e.target.textContent === "+1") {
        manga.capitulo += 1; // Soma 1
        localStorage.setItem("meusMangas", JSON.stringify(mangasSalvos)); // Salva
        atualizarTela();
    }

    // Botão Editar
    if (e.target.classList.contains("btn-editar") || e.target.textContent === "Editar") {
        // preenche o formulário diretamente com os dados salvos na memória
        titulo.value = manga.titulo;
        autor.value = manga.autor;
        genero.value = manga.genero;
        status.value = manga.status;
        capitulos.value = manga.capitulo;
        foto.value = manga.foto;
        
        idEditando = manga.id; // avisa o sistema que estamos editando esta obra
        modalAdicionar.style.display = "flex"; // abre o modal
    }
    // Botão Remover
    if (e.target.classList.contains("btn-remover") || e.target.textContent === "Remover") {
        mangasSalvos = mangasSalvos.filter(m => m.id !== idClicado);
        localStorage.setItem("meusMangas", JSON.stringify(mangasSalvos));
        atualizarTela();
    if (e.target.classList.contains("btn-remover") || e.target.textContent === "Remover") {
        // cnofirmacao de excluir
        const confirmacao = confirm("Tem certeza que deseja excluir esta obra da sua estante?");
        
        if (confirmacao) { // se for sim remove
            mangasSalvos = mangasSalvos.filter(m => m.id !== idClicado);
            localStorage.setItem("meusMangas", JSON.stringify(mangasSalvos));
            atualizarTela();
        }
    }
    }
});


atualizarTela();