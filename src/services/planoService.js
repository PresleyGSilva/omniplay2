// 🔵 Tabela dos planos + packageId do SIGMA
const planos = [
  { nome: 'Mensal', valor: 24.90, packageId: "rdqLkQWAE9" },
  { nome: 'Trimestral', valor: 43.90, packageId: "bOxLAQLZ7a" },
  { nome: 'Semestral', valor: 72.90, packageId: "z2BDvoWrkj" },
  { nome: 'Anual', valor: 137.90, packageId: "EMeWepDnN9" }
];

// 🔎 Identificar plano pelo valor da venda
function identificarPlano(valor) {
  return planos.find(p => Number(p.valor) === Number(valor)) || null;
}

module.exports = { identificarPlano, planos };
