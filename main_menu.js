
const images = [
  'imagens/castle_crasher.jpg',
  'imagens/ashley-levinson.jpg',
  'imagens/morgana_cosplay.jpg',
];

(function setupCarousel() {
  const preview = document.getElementById('preview');
  const counter = document.getElementById('counter');
  const btnPrev = document.getElementById('prev');
  const btnNext = document.getElementById('next');

  if (!preview || !counter || !btnPrev || !btnNext) return;

  let index = 0;

  function updateGallery() {
    preview.src = images[index] || '';
    preview.alt = `Foto ${index + 1} de ${images.length} da galeria Cosverse`;
    counter.textContent = `${index + 1} / ${images.length}`;
  }

  btnNext.addEventListener('click', () => {
    index = (index + 1) % images.length;
    updateGallery();
  });

  btnPrev.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    updateGallery();
  });

  updateGallery();
})();
(function setupCadastroValidation() {
  const form = document.querySelector('form[action="#"]'); // Form do cadastro

  if (!form) return; // Se não é a página de cadastro, ignora

  form.addEventListener('submit', function (e) {
    let valido = true;

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const termos = document.getElementById("termos");

    if (!nome.value.trim()) { valido = false; nome.classList.add("error"); }
    if (!email.value.trim()) { valido = false; email.classList.add("error"); }
    if (!senha.value.trim()) { valido = false; senha.classList.add("error"); }
    if (!termos.checked) { valido = false; termos.classList.add("error-msg"); }

    const captchaInput = document.getElementById("captchaInput");
    if (captchaInput.value.trim() !== codigoGerado) {
      valido = false;
      alert("❌ CAPTCHA incorreto!");
      gerarCaptcha();
    }

    if (!valido) {
      e.preventDefault();
      alert("Preencha todos os campos corretamente.");
    }
  });
})();
//captcha login e casdrasto
let codigoGerado = "";

function gerarCaptcha() {
  const canvas = document.getElementById("captchaCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  codigoGerado = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  ctx.font = "32px Arial";
  ctx.fillStyle = "#000";

  for (let i = 0; i < codigoGerado.length; i++) {
    const x = 30 + i * 30;
    const y = 40;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() * 0.5) - 0.25);
    ctx.fillText(codigoGerado[i], 0, 0);
    ctx.restore();
  }
}

window.onload = () => gerarCaptcha();
//valida o login
(function setupLogin() {
  const formLogin = document.getElementById("login-form");
  if (!formLogin) return;

  formLogin.addEventListener("submit", function (e) {
    const digitado = document.getElementById("captchaInput").value.trim();

    if (digitado !== codigoGerado) {
      e.preventDefault();
      alert("❌ CAPTCHA incorreto!");
      gerarCaptcha();
    }
  });
})();
//preto e branco
const button = document.getElementById("toggle-theme");
const body = document.body;

if (button) {

  // Carregar tema ativo
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }

  button.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    localStorage.setItem("theme", 
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
  });
}

// rótulo e estado do botão de tema (acessibilidade)
(function rotuloTema() {
  const botaoTema = document.getElementById("toggle-theme");
  if (!botaoTema) return;
  const atualizar = () => {
    const escuro = document.body.classList.contains("dark-mode");
    botaoTema.textContent = escuro ? "☀️ Modo claro" : "🌙 Modo escuro";
    botaoTema.setAttribute("aria-pressed", String(escuro));
  };
  atualizar();
  botaoTema.addEventListener("click", atualizar);
})();
