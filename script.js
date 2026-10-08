// Saldo inicial do terminal. Cada saque bem-sucedido desconta daqui.
const SALDO_INICIAL = 1000;
const NOTAS = [100, 50, 20, 10, 5, 2];

let saldo = SALDO_INICIAL;

const elSaldo = document.getElementById("saldo");
const elValor = document.getElementById("valor-saque");
const elResultado = document.getElementById("resultado");

elSaldo.textContent = formatarReais(saldo);

document.getElementById("form-saque").addEventListener("submit", function (event) {
  event.preventDefault();
  const resultado = realizarSaque(saldo, elValor.value);

  if (!resultado.ok) {
    mostrarErro(resultado.mensagem);
    return;
  }

  saldo = resultado.novoSaldo;
  elSaldo.textContent = formatarReais(saldo);
  elValor.value = "";
  mostrarSucesso(resultado);
});

// Converte o texto digitado em um inteiro, ou explica por que não serve.
function interpretarValor(texto) {
  const limpo = texto.trim().replace(/^R\$\s*/i, "").trim();

  if (limpo === "") {
    return { ok: false, mensagem: "Informe um valor para saque." };
  }

  if (/^-\d+$/.test(limpo)) {
    return { ok: false, mensagem: "O valor deve ser maior que zero." };
  }

  const inteiro = /^\d+$/;
  const milhar = /^\d{1,3}(\.\d{3})+$/;
  if (!inteiro.test(limpo) && !milhar.test(limpo)) {
    return { ok: false, mensagem: "O valor deve ser inteiro." };
  }

  const valor = Number(limpo.replaceAll(".", ""));
  if (!Number.isSafeInteger(valor)) {
    return { ok: false, mensagem: "O valor deve ser inteiro." };
  }

  if (valor <= 0) {
    return { ok: false, mensagem: "O valor deve ser maior que zero." };
  }

  return { ok: true, valor: valor };
}

// Prefere notas grandes. Valor ímpar reserva uma nota de R$ 5;
// R$ 1 e R$ 3 não podem ser formados.
function calcularNotas(valor) {
  if (valor === 1 || valor === 3) return null;

  const quantidadePorNota = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0 };
  let restante = valor;

  if (restante % 2 !== 0) {
    quantidadePorNota[5] = 1;
    restante -= 5;
  }

  [100, 50, 20, 10, 2].forEach(function (nota) {
    const quantidade = Math.floor(restante / nota);
    if (quantidade > 0) {
      quantidadePorNota[nota] = quantidade;
      restante -= quantidade * nota;
    }
  });

  if (restante !== 0) return null;

  return NOTAS.filter(function (nota) {
    return quantidadePorNota[nota] > 0;
  }).map(function (nota) {
    return { valor: nota, quantidade: quantidadePorNota[nota] };
  });
}

function realizarSaque(saldoAtual, texto) {
  const interpretado = interpretarValor(texto);
  if (!interpretado.ok) return interpretado;

  if (interpretado.valor > saldoAtual) {
    return { ok: false, mensagem: "Saldo insuficiente." };
  }

  const notas = calcularNotas(interpretado.valor);
  if (!notas) {
    return { ok: false, mensagem: "Não é possível realizar este saque com as notas disponíveis." };
  }

  return {
    ok: true,
    valor: interpretado.valor,
    notas: notas,
    novoSaldo: saldoAtual - interpretado.valor,
  };
}

function formatarReais(valor) {
  const inteiro = Math.trunc(valor);
  const comMilhar = inteiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + comMilhar + ",00";
}

function paragrafo(texto, destaque) {
  const p = document.createElement("p");
  p.textContent = texto;
  if (destaque) p.className = "destaque";
  return p;
}

function mostrarErro(mensagem) {
  elResultado.className = "painel erro";
  elResultado.setAttribute("role", "alert");
  elValor.setAttribute("aria-invalid", "true");
  elValor.setAttribute("aria-describedby", "resultado");
  elResultado.replaceChildren(paragrafo(mensagem, true));
}

function mostrarSucesso(resultado) {
  elResultado.className = "painel sucesso";
  elResultado.setAttribute("role", "status");
  elValor.removeAttribute("aria-invalid");
  elValor.setAttribute("aria-describedby", "ajuda-valor");

  const lista = document.createElement("ul");
  resultado.notas.forEach(function (nota) {
    const item = document.createElement("li");
    item.textContent = nota.quantidade + " × R$ " + nota.valor;
    lista.append(item);
  });

  const bloco = document.createElement("div");
  bloco.className = "linhas";
  bloco.append(
    paragrafo("Saque realizado com sucesso!", true),
    paragrafo("Valor sacado: " + formatarReais(resultado.valor)),
    paragrafo("Notas entregues:"),
    lista,
    paragrafo("Novo saldo: " + formatarReais(resultado.novoSaldo), true),
  );
  elResultado.replaceChildren(bloco);
}
