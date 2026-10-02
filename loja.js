// loja.js — catálogo da produtos.html (usa produtos-dados.js e carrinho.js)
(function setupLoja() {
  const grade = document.getElementById('grade');
  if (!grade) return;

  const P = window.PRODUTOS;
  const C = window.Carrinho;
  let categoria = 'Todos';
  let termo = '';

  const pedida = new URLSearchParams(location.search).get('cat');
  if (pedida && P.some((p) => p.cat === pedida)) categoria = pedida;

  function renderFiltros() {
    const cats = ['Todos', ...new Set(P.map((p) => p.cat))];
    document.getElementById('filtros').innerHTML = cats
      .map((c) => `<button type="button" data-cat="${c}" aria-pressed="${c === categoria}">${c}</button>`)
      .join('');
  }

  function renderProdutos() {
    const lista = P.filter((p) => (categoria === 'Todos' || p.cat === categoria) && p.nome.toLowerCase().includes(termo));
    grade.innerHTML = lista.length
      ? lista.map((p) => `
      <article class="card produto" aria-labelledby="p${p.id}">
        <a class="thumb" href="produto.html?id=${p.id}" aria-label="Ver ${p.nome}">${C.thumb(p)}</a>
        <h3 id="p${p.id}"><a href="produto.html?id=${p.id}">${p.nome}</a></h3>
        <p>${p.desc}</p>
        <span class="preco">${C.real(p.preco)}</span>
        <button type="button" data-add="${p.id}">Adicionar ao carrinho</button>
      </article>`).join('')
      : '<p class="vazio">Nenhum produto encontrado. Tente outra busca ou categoria.</p>';
  }

  document.getElementById('filtros').addEventListener('click', (e) => {
    if (!e.target.dataset.cat) return;
    categoria = e.target.dataset.cat;
    renderFiltros();
    renderProdutos();
  });

  document.getElementById('busca').addEventListener('input', (e) => {
    termo = e.target.value.trim().toLowerCase();
    renderProdutos();
  });

  grade.addEventListener('click', (e) => {
    if (!e.target.dataset.add) return;
    C.add(e.target.dataset.add);
    C.abrir(true);
  });

  renderFiltros();
  renderProdutos();
})();
