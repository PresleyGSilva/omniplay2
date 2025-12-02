// =======================================================
// 🔵 TABELA DE PLANOS (Átomo Pay → SIGMA)
// Suporta vários checkouts que têm o mesmo valor
// =======================================================

const planos = [
  // 💠 MENSAL – 1 Mês
  { 
    nome: "Mensal",
    valores: [24.90],               // vários checkouts → mesmo plano
    packageId: "RYAWRk1jlx"
  },

  // 💠 TRIMESTRAL – 3 Meses
  { 
    nome: "Trimestral",
    valores: [43.90, 44.90],        // você possui 2 valores diferentes
    packageId: "ANKWPKDPRq"
  },

  // 💠 SEMESTRAL – 6 Meses
  { 
    nome: "Semestral",
    valores: [72.90, 74.90],        // também tem 2 preços diferentes
    packageId: "o231qzL4qz"
  },

  // 💠 ANUAL – 12 Meses
  { 
    nome: "Anual",
    valores: [138.90],              // 2 checkouts, 1 valor
    packageId: "VpKDaJWRAa"
  },

  // 💠 BLACK FRIDAY – 3 anos
  {
    nome: "Black Friday 3 anos",
    valores: [97.90],
    packageId: "VpKDaJWRAa"   // coloque o ID do Sigma
  }
];


// =======================================================
// 🔍 FUNÇÃO PARA IDENTIFICAR O PLANO PELO VALOR
// Aceita múltiplos valores e retorna o plano certo
// =======================================================

function identificarPlano(valorRecebido) {
  const valor = Number(valorRecebido);

  // Procura um plano onde a lista de valores contenha o valor recebido
  const planoEncontrado = planos.find(p => p.valores.includes(valor));

  return planoEncontrado || null;
}


// =======================================================
// 📤 EXPORTAÇÃO
// =======================================================

module.exports = {
  planos,
  identificarPlano
};
