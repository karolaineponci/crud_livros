const API = 'http://localhost:3000/livro';

const form = document.getElementById('form-livro');
const inputId = document.getElementById('livro-id');
const inputTitulo = document.getElementById('titulo');
const inputPreco = document.getElementById('preco');
const inputEstoque = document.getElementById('estoque');
const inputCriadoem = document.getElementById('criadoem');
const btnCancelar = document.getElementById('btn-cancelar');
const tbody = document.querySelector('#tabela-livros tbody');

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function criarBotao(rotulo, classe, id) {
  const botao = document.createElement('button');
  botao.textContent = rotulo;
  botao.className = classe;
  botao.dataset.id = id;
  return botao;
}

async function listarLivros() {
  const resposta = await fetch(API);
  const livros = await resposta.json();

  tbody.replaceChildren();
  livros.forEach((p) => {
    const tr = document.createElement('tr');
    const dataFormatada = p.criado_em ? new Date(p.criado_em).toLocaleDateString('pt-BR') : '---';

    tr.append(
      criarCelula(p.id),
      criarCelula(p.titulo), 
      criarCelula(`R$ ${Number(p.preco).toFixed(2)}`),
      criarCelula(p.estoque),
      criarCelula(dataFormatada) 
    );

    const tdAcoes = document.createElement('td');
    tdAcoes.append(
      criarBotao('Editar', 'btn-editar', p.id),
      criarBotao('Excluir', 'btn-excluir', p.id),
    );
    tr.append(tdAcoes);
    tbody.append(tr);
  });
}

async function salvarLivros(evento) {
  evento.preventDefault();

  const dados = {
    titulo: inputTitulo.value, 
    preco: parseFloat(inputPreco.value),
    estoque: parseInt(inputEstoque.value, 10),
  };

  const id = inputId.value;

  if (id) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  }

  resetarFormulario();
  listarLivros();
}

async function editarLivros(id) {
  const resposta = await fetch(`${API}/${id}`);
  const livro = await resposta.json();

  inputId.value = livro.id;
  inputTitulo.value = livro.titulo;
  inputPreco.value = livro.preco;
  inputEstoque.value = livro.estoque;
  
  if (inputCriadoem && livro.criado_em) {
    inputCriadoem.value = new Date(livro.criado_em).toLocaleDateString('pt-BR');
  } else if (inputCriadoem) {
    inputCriadoem.value = '';
  }

  btnCancelar.hidden = false;
}

async function excluirLivros(id) {
  if (!confirm('Deseja excluir este livro?')) return;

  await fetch(`${API}/${id}`, { method: 'DELETE' });
  listarLivros();
}

function resetarFormulario() {
  if (form) form.reset();
  if (inputId) inputId.value = '';
  if (inputEstoque) inputEstoque.value = '0';
  if (inputCriadoem) inputCriadoem.value = ''; 
  if (btnCancelar) btnCancelar.hidden = true;
}

// Vincula os eventos do formulário apenas se eles existirem na página atual
if (form) form.addEventListener('submit', salvarLivros);
if (btnCancelar) btnCancelar.addEventListener('click', resetarFormulario);
if (tbody) {
  tbody.addEventListener('click', (evento) => {
    const id = evento.target.dataset.id;
    if (!id) return;

    if (evento.target.classList.contains('btn-editar')) {
      editarLivros(id);
    } else if (evento.target.classList.contains('btn-excluir')) {
      excluirLivros(id);
    }
  });
}

// Função global de logout
async function logout() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

if (tbody) {
  listarLivros();
}