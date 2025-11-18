const form = document.querySelector(".contact-form");

const campos = {
  nome: document.querySelector("#nome"),
  documento: document.querySelector("#documento"),
  email: document.querySelector("#email"),
  telefone: document.querySelector("#telefone"),
  automacao: document.querySelector("#automacao")
};

function criarMensagemErro(campo) {
  const msg = document.createElement("small");
  msg.style.color = "#ff5555";
  msg.style.marginTop = "4px";
  msg.style.display = "none";
  campo.insertAdjacentElement("afterend", msg);
  return msg;
}

const mensagensErro = {
  nome: criarMensagemErro(campos.nome),
  documento: criarMensagemErro(campos.documento),
  email: criarMensagemErro(campos.email),
  telefone: criarMensagemErro(campos.telefone),
  automacao: criarMensagemErro(campos.automacao)
};

function validar() {
  let valido = true;
  if (campos.nome.value.trim().length < 3) {
    mensagensErro.nome.textContent = "Digite seu nome completo";
    mensagensErro.nome.style.display = "block";
    valido = false;
  } else mensagensErro.nome.style.display = "none";

  if (campos.documento.value.trim().length < 11) {
    mensagensErro.documento.textContent = "Informe um CPF ou CNPJ válido";
    mensagensErro.documento.style.display = "block";
    valido = false;
  } else mensagensErro.documento.style.display = "none";

  if (!campos.email.value.includes("@") || !campos.email.value.includes(".")) {
    mensagensErro.email.textContent = "E-mail inválido";
    mensagensErro.email.style.display = "block";
    valido = false;
  } else mensagensErro.email.style.display = "none";

  if (campos.telefone.value.trim().length < 10) {
    mensagensErro.telefone.textContent = "Digite um telefone válido";
    mensagensErro.telefone.style.display = "block";
    valido = false;
  } else mensagensErro.telefone.style.display = "none";

  if (campos.automacao.value === "") {
    mensagensErro.automacao.textContent = "Selecione uma opção";
    mensagensErro.automacao.style.display = "block";
    valido = false;
  } else mensagensErro.automacao.style.display = "none";

  return valido;
}


form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validar()) {
    alert("Formulário enviado com sucesso!");

    const historico = JSON.parse(localStorage.getItem("formulario")) || [];
    historico.push({
      nome: campos.nome.value,
      documento: campos.documento.value,
      email: campos.email.value,
      telefone: campos.telefone.value,
      automacao: campos.automacao.value,
      data: new Date().toLocaleString()
    });

    localStorage.setItem("formulario", JSON.stringify(historico));

    form.reset();
  }
});

Object.values(campos).forEach(campo => {
  campo.addEventListener("blur", validar);
});

const cepInput = document.getElementById("cep");
const endereco = document.getElementById("endereco");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const uf = document.getElementById("uf");

cepInput.addEventListener("blur", () => {
  let cep = cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    alert("CEP inválido. Digite apenas números.");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(data => {

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      // preencher os campos automaticamente
      endereco.value = data.logradouro;
      bairro.value = data.bairro;
      cidade.value = data.localidade;
      uf.value = data.uf;
    })
    .catch(() => {
      alert("Erro ao consultar CEP.");
    });
});

