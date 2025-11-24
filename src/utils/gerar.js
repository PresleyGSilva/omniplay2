// 🔢 Gerar números aleatórios
function gerarNumero(len = 8) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += Math.floor(Math.random() * 10);
  }
  return out;
}

module.exports = { gerarNumero };
