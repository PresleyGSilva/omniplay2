function calcularValidade(plano) {
  const hoje = new Date();

  let dias = 0;

  switch (plano.toLowerCase()) {
    case "mensal":
      dias = 30;
      break;

    case "trimestral":
      dias = 90;
      break;

    case "semestral":
      dias = 180;
      break;

    case "anual":
      dias = 365;
      break;

    default:
      dias = 30; // fallback padrão
  }

  const validade = new Date(hoje);
  validade.setDate(validade.getDate() + dias);

  return validade;
}

module.exports = { calcularValidade };
