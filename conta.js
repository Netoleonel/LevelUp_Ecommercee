// conta.js — login e cadastro SIMULADOS, guardados no navegador (localStorage).
// ⚠️ Só para a demonstração: a senha fica salva sem proteção e qualquer pessoa com acesso
// ao navegador consegue ler. Na loja real isso precisa ir para um back-end (senha com hash).
(function () {
  const ler = (chave, padrao) => {
    try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch (e) { return padrao; }
  };
  const gravar = (chave, valor) => {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {}
  };
  const norm = (email) => email.trim().toLowerCase();

  function cadastrar({ nome, email, senha, newsletter }) {
    const lista = ler('usuarios', []);
    if (lista.some((u) => u.email === norm(email))) {
      return { ok: false, erro: 'Este e-mail já está cadastrado. Faça login.' };
    }
    lista.push({ nome: nome.trim(), email: norm(email), senha, newsletter: !!newsletter });
    gravar('usuarios', lista);
    return { ok: true };
  }

  function entrar(email, senha) {
    const u = ler('usuarios', []).find((x) => x.email === norm(email) && x.senha === senha);
    if (!u) return { ok: false, erro: 'E-mail ou senha incorretos.' };
    gravar('sessao', { nome: u.nome, email: u.email });
    return { ok: true };
  }

  const usuario = () => ler('sessao', null);
  const sair = () => { try { localStorage.removeItem('sessao'); } catch (e) {} };

  // Só aceita voltar para uma página .html do próprio site
  function destino() {
    const v = new URLSearchParams(location.search).get('voltar') || '';
    return /^[a-z-]+\.html$/.test(v) ? v : 'index.html';
  }

  window.Conta = { cadastrar, entrar, usuario, sair, destino };

  function aviso(texto, erro) {
    const el = document.getElementById('mensagem');
    if (!el) return;
    el.className = erro ? 'error-msg' : '';
    el.textContent = texto;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Menu: "Login" vira "Sair (Nome)" quando há sessão
    const u = usuario();
    if (u) {
      document.querySelectorAll('a[href="login.html"]').forEach((a) => {
        a.textContent = `Sair (${u.nome.split(' ')[0]})`;
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          sair();
          location.href = 'index.html';
        });
      });
      const menu = document.querySelector('.menu');
      if (menu) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="pedidos.html">Meus pedidos</a>';
        menu.appendChild(li);
      }
    }

    // Login
    const formLogin = document.getElementById('login-form');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        if (e.defaultPrevented) return; // o captcha (main_menu.js) já barrou
        e.preventDefault();
        const r = entrar(document.getElementById('usuario').value, document.getElementById('senha').value);
        if (!r.ok) {
          aviso(r.erro, true);
          document.getElementById('captchaInput').value = '';
          gerarCaptcha();
          return;
        }
        location.href = destino();
      });
    }

    // Cadastro (o main_menu.js valida campos e captcha antes)
    const formCadastro = document.getElementById('cadastro-form');
    if (formCadastro) {
      formCadastro.addEventListener('submit', (e) => {
        if (e.defaultPrevented) return;
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) return aviso('Digite um e-mail válido.', true);
        if (senha.length < 6) return aviso('A senha precisa ter pelo menos 6 caracteres.', true);

        const r = cadastrar({
          nome: document.getElementById('nome').value,
          email,
          senha,
          newsletter: document.getElementById('newsletter').checked,
        });
        if (!r.ok) return aviso(r.erro, true);
        entrar(email, senha);
        location.href = destino();
      });
    }
  });
})();
