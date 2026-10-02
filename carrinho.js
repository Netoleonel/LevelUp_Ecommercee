// carrinho.js — carrinho global. Basta incluir em qualquer página (depois do produtos-dados.js).
(function () {
  const P = window.PRODUTOS || [];
  const real = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const ouvintes = [];
  let itens = {};
  try { itens = JSON.parse(localStorage.getItem('carrinho')) || {}; } catch (e) { itens = {}; }

  const lista = () =>
    Object.entries(itens).map(([id, qtd]) => ({ p: P.find((x) => x.id == id), qtd })).filter((i) => i.p);
  const total = () => lista().reduce((s, i) => s + i.p.preco * i.qtd, 0);
  const qtdTotal = () => lista().reduce((s, i) => s + i.qtd, 0);

  function thumb(p) {
    return p.img ? `<img src="${p.img}" alt="${p.nome}" onerror="this.replaceWith('${p.emoji}')">` : p.emoji;
  }

  function salvar() {
    try { localStorage.setItem('carrinho', JSON.stringify(itens)); } catch (e) {}
    desenhar();
    ouvintes.forEach((f) => f());
  }

  function mudar(id, delta) {
    itens[id] = (itens[id] || 0) + delta;
    if (itens[id] <= 0) delete itens[id];
    salvar();
  }

  function limpar() { itens = {}; salvar(); }

  function abrir(sim) {
    const gaveta = document.getElementById('carrinho');
    if (!gaveta) return;
    const estavaAberta = gaveta.classList.contains('aberto');
    gaveta.classList.toggle('aberto', sim);
    document.getElementById('fundo').classList.toggle('aberto', sim);
    gaveta.setAttribute('aria-hidden', !sim);
    if (sim) document.getElementById('fechar-carrinho').focus();
    else if (estavaAberta) document.getElementById('abrir-carrinho').focus();
  }

  function desenhar() {
    const contador = document.getElementById('qtd-carrinho');
    if (!contador) return;
    const l = lista();
    contador.textContent = qtdTotal();
    document.getElementById('total').textContent = real(total());
    document.getElementById('finalizar').hidden = !l.length;
    document.getElementById('carrinho-lista').innerHTML = l.length
      ? l.map(({ p, qtd }) => `
        <li>
          <span>${p.emoji} <a href="produto.html?id=${p.id}">${p.nome}</a><br><small>${real(p.preco)}</small></span>
          <span class="qtd">
            <button type="button" data-menos="${p.id}" aria-label="Diminuir ${p.nome}">−</button>
            ${qtd}
            <button type="button" data-mais="${p.id}" aria-label="Aumentar ${p.nome}">+</button>
          </span>
        </li>`).join('')
      : '<li class="vazio">Seu carrinho está vazio. Escolha um produto para começar.</li>';
  }

  function montar() {
    const botao = document.createElement('button');
    botao.id = 'abrir-carrinho';
    botao.type = 'button';
    botao.className = 'btn-carrinho';
    botao.setAttribute('aria-label', 'Abrir carrinho');
    botao.innerHTML = '🛒 Carrinho (<span id="qtd-carrinho">0</span>)';

    const menu = document.querySelector('.menu');
    if (menu) {
      const li = document.createElement('li');
      li.appendChild(botao);
      menu.appendChild(li);
    } else {
      const nav = document.querySelector('nav');
      if (nav) nav.appendChild(botao);
    }

    document.body.insertAdjacentHTML('beforeend', `
      <div id="fundo" class="fundo-escuro"></div>
      <aside id="carrinho" class="carrinho" aria-label="Carrinho de compras" aria-hidden="true">
        <div class="carrinho-topo">
          <h2>Seu carrinho</h2>
          <button id="fechar-carrinho" type="button" aria-label="Fechar carrinho">✕</button>
        </div>
        <ul id="carrinho-lista" class="carrinho-lista"></ul>
        <div class="carrinho-rodape">
          <p class="total"><span>Total</span> <span id="total">R$ 0,00</span></p>
          <a id="finalizar" class="btn-link" href="checkout.html">Finalizar compra</a>
        </div>
      </aside>`);

    botao.addEventListener('click', () => abrir(true));
    document.getElementById('fechar-carrinho').addEventListener('click', () => abrir(false));
    document.getElementById('fundo').addEventListener('click', () => abrir(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrir(false); });
    document.getElementById('carrinho-lista').addEventListener('click', (e) => {
      if (e.target.dataset.mais) mudar(e.target.dataset.mais, 1);
      if (e.target.dataset.menos) mudar(e.target.dataset.menos, -1);
    });
    desenhar();
  }

  window.Carrinho = {
    add: (id, q = 1) => mudar(id, q), mudar, limpar, abrir, lista, total, qtdTotal, real, thumb,
    aoMudar: (f) => ouvintes.push(f),
  };
  document.addEventListener('DOMContentLoaded', montar);
})();
