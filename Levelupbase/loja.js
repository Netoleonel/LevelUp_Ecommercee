// loja.js — catálogo, filtros e carrinho (funciona só na produtos.html)
(function setupLoja() {
  const grade = document.getElementById('grade');
  if (!grade) return;

  // Troque emoji/imagem pelos seus produtos reais. "img" é opcional.
  const produtos = [
    { id: 1, nome: 'Peruca Roxa', cat: 'Cosplay', preco: 129.9, emoji: '💜', img: 'imagens/peruca_roxa-genshin_impact.jpg', desc: 'Fibra japonesa resistente ao calor.' },
    { id: 2, nome: 'Armadura EVA', cat: 'Cosplay', preco: 349.0, emoji: '🛡️', img: 'imagens/armadura_EVA.jpg', desc: 'Sob medida, com pintura metálica.' },
    { id: 3, nome: 'Action Figure Samurai', cat: 'Colecionáveis', preco: 219.9, emoji: '🗡️', desc: 'Articulada, 18 cm, com base.' },
    { id: 4, nome: 'Set de Dados RPG', cat: 'RPG', preco: 59.9, emoji: '🎲', desc: '7 dados de resina com bolsinha.' },
    { id: 5, nome: 'Caneca Mágica', cat: 'Casa', preco: 49.9, emoji: '☕', desc: 'Revela a arte ao receber líquido quente.' },
    { id: 6, nome: 'Mousepad Gamer XL', cat: 'Games', preco: 89.9, emoji: '🖱️', desc: '90x40 cm, base antiderrapante.' },
    { id: 7, nome: 'Camiseta Geek', cat: 'Roupas', preco: 79.9, emoji: '👕', desc: '100% algodão, estampa durável.' },
    { id: 8, nome: 'Luminária 3D Lua', cat: 'Casa', preco: 99.9, emoji: '🌙', desc: 'LED com 16 cores e controle.' },
  ];

  const real = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const el = (id) => document.getElementById(id);

  let carrinho = {};
  try { carrinho = JSON.parse(localStorage.getItem('carrinho')) || {}; } catch (e) { carrinho = {}; }

  let categoria = 'Todos';
  const pedida = new URLSearchParams(location.search).get('cat');
  if (pedida && produtos.some((p) => p.cat === pedida)) categoria = pedida;
  let termo = '';

  /* ---------- Catálogo ---------- */
  function renderFiltros() {
    const cats = ['Todos', ...new Set(produtos.map((p) => p.cat))];
    el('filtros').innerHTML = cats
      .map((c) => `<button type="button" data-cat="${c}" aria-pressed="${c === categoria}">${c}</button>`)
      .join('');
  }

  function renderProdutos() {
    const lista = produtos.filter(
      (p) => (categoria === 'Todos' || p.cat === categoria) && p.nome.toLowerCase().includes(termo)
    );
    if (!lista.length) {
      grade.innerHTML = '<p class="vazio">Nenhum produto encontrado. Tente outra busca ou categoria.</p>';
      return;
    }
    grade.innerHTML = lista
      .map(
        (p) => `
      <article class="card produto" aria-labelledby="p${p.id}">
        <div class="thumb">${p.img ? `<img src="${p.img}" alt="${p.nome}" onerror="this.replaceWith('${p.emoji}')">` : p.emoji}</div>
        <h3 id="p${p.id}">${p.nome}</h3>
        <p>${p.desc}</p>
        <span class="preco">${real(p.preco)}</span>
        <button type="button" data-add="${p.id}">Adicionar ao carrinho</button>
      </article>`
      )
      .join('');
  }

  /* ---------- Carrinho ---------- */
  function salvar() {
    try { localStorage.setItem('carrinho', JSON.stringify(carrinho)); } catch (e) {}
  }

  function renderCarrinho() {
    const itens = Object.entries(carrinho).map(([id, qtd]) => ({ p: produtos.find((x) => x.id == id), qtd }));
    const total = itens.reduce((s, i) => s + i.p.preco * i.qtd, 0);
    const qtdTotal = itens.reduce((s, i) => s + i.qtd, 0);

    el('qtd-carrinho').textContent = qtdTotal;
    el('total').textContent = real(total);
    el('finalizar').disabled = !qtdTotal;

    el('carrinho-lista').innerHTML = itens.length
      ? itens
          .map(
            ({ p, qtd }) => `
        <li>
          <span>${p.emoji} ${p.nome}<br><small>${real(p.preco)}</small></span>
          <span class="qtd">
            <button type="button" data-menos="${p.id}" aria-label="Diminuir ${p.nome}">−</button>
            ${qtd}
            <button type="button" data-mais="${p.id}" aria-label="Aumentar ${p.nome}">+</button>
          </span>
        </li>`
          )
          .join('')
      : '<li class="vazio">Seu carrinho está vazio. Escolha um produto para começar.</li>';
  }

  function mudar(id, delta) {
    carrinho[id] = (carrinho[id] || 0) + delta;
    if (carrinho[id] <= 0) delete carrinho[id];
    salvar();
    renderCarrinho();
  }

  function abrir(abrirAgora) {
    el('carrinho').classList.toggle('aberto', abrirAgora);
    el('fundo').classList.toggle('aberto', abrirAgora);
    el('carrinho').setAttribute('aria-hidden', !abrirAgora);
    if (abrirAgora) el('fechar-carrinho').focus();
  }

  /* ---------- Eventos ---------- */
  el('filtros').addEventListener('click', (e) => {
    const c = e.target.dataset.cat;
    if (!c) return;
    categoria = c;
    renderFiltros();
    renderProdutos();
  });

  el('busca').addEventListener('input', (e) => {
    termo = e.target.value.trim().toLowerCase();
    renderProdutos();
  });

  grade.addEventListener('click', (e) => {
    const id = e.target.dataset.add;
    if (!id) return;
    mudar(id, 1);
    abrir(true);
  });

  el('carrinho-lista').addEventListener('click', (e) => {
    if (e.target.dataset.mais) mudar(e.target.dataset.mais, 1);
    if (e.target.dataset.menos) mudar(e.target.dataset.menos, -1);
  });

  el('abrir-carrinho').addEventListener('click', () => abrir(true));
  el('fechar-carrinho').addEventListener('click', () => abrir(false));
  el('fundo').addEventListener('click', () => abrir(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrir(false); });

  el('finalizar').addEventListener('click', () => {
    // Próximo passo: exigir login e enviar o pedido para um back-end.
    alert('Pedido pronto para finalizar! Falta ligar o pagamento e o login.');
  });

  renderFiltros();
  renderProdutos();
  renderCarrinho();
})();
