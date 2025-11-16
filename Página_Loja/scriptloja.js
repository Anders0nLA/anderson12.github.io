(function () {
  const listaCarrinho = document.getElementById("lista-carrinho");
  const totalElement = document.getElementById("total");
  const limparBtn = document.getElementById("limpar");
  const finalizarBtn = document.getElementById("finalizar");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  function formatBRL(value) {
    return "R$ " + value.toFixed(2).replace(".", ",");
  }

  function atualizarCarrinho() {
    if (!listaCarrinho) return;
    listaCarrinho.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {
      listaCarrinho.innerHTML = "<p style='color:#cfcfcf'>Seu carrinho está vazio.</p>";
    }

    carrinho.forEach((item, index) => {
      const qtd = item.qtd || 1;
      const subtotal = item.preco * qtd;
      total += subtotal;

      const itemDiv = document.createElement("div");
      itemDiv.className = "item-carrinho";
      itemDiv.innerHTML = `
        <div class="info">
          <strong class="nome">${item.nome}</strong>
          <div class="meta">
            Preço unit: ${formatBRL(item.preco)} · Qtd:
            <button class="menos" data-index="${index}">-</button>
            <span class="qtd">${qtd}</span>
            <button class="mais" data-index="${index}">+</button>
          </div>
        </div>
        <div class="acoes">
          <span class="subtotal">${formatBRL(subtotal)}</span>
          <button class="remover" data-index="${index}" aria-label="Remover item">X</button>
        </div>
      `;

      listaCarrinho.appendChild(itemDiv);
    });

    totalElement.textContent = formatBRL(total);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  function adicionarAoCarrinho(nome, preco) {
    const idx = carrinho.findIndex(i => i.nome === nome);
    if (idx > -1) {
      carrinho[idx].qtd = (carrinho[idx].qtd || 1) + 1;
    } else {
      carrinho.push({ nome, preco: parseFloat(preco), qtd: 1 });
    }
    atualizarCarrinho();
  }

  function setupAddButtons() {
    document.querySelectorAll(".adicionar").forEach(btn => {
      btn.addEventListener("click", () => {
        const nome = btn.getAttribute("data-nome");
        const preco = parseFloat(btn.getAttribute("data-preco"));
        if (!nome || isNaN(preco)) return;
        adicionarAoCarrinho(nome, preco);
      });
    });
  }

  if (listaCarrinho) {
    listaCarrinho.addEventListener("click", (e) => {
      const target = e.target;
      const idx = target.getAttribute("data-index");
      if (target.classList.contains("remover")) {
        carrinho.splice(idx, 1);
        atualizarCarrinho();
        return;
      }
      if (target.classList.contains("mais")) {
        carrinho[idx].qtd = (carrinho[idx].qtd || 1) + 1;
        atualizarCarrinho();
        return;
      }
      if (target.classList.contains("menos")) {
        carrinho[idx].qtd = Math.max(1, (carrinho[idx].qtd || 1) - 1);
        atualizarCarrinho();
        return;
      }
    });
  }

  if (limparBtn) {
    limparBtn.addEventListener("click", () => {
      if (!confirm("Deseja esvaziar o carrinho?")) return;
      carrinho = [];
      atualizarCarrinho();
    });
  }

  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
      }

      const orders = JSON.parse(localStorage.getItem("zenflow_orders") || "[]");
      orders.push({ itens: carrinho, total: carrinho.reduce((s, i) => s + i.preco * i.qtd, 0), date: new Date().toISOString() });
      localStorage.setItem("zenflow_orders", JSON.stringify(orders));

      carrinho = [];
      atualizarCarrinho();
      alert("Compra finalizada (demo). Pedido salvo localmente.");
    });
  }

  function init() {
    setupAddButtons();
    atualizarCarrinho();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
