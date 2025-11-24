const axios = require("axios");
const { gerarNumero } = require("../utils/gerar");

const API_URL   = process.env.API_URL;      // ex: https://cineflix.allpanel.top/api
const API_TOKEN = process.env.API_TOKEN;    // token do painel
const USER_ID   = process.env.USER_ID;      // BV4D3rLaqZ

// 🔧 Criar usuário no Sigma/QPanel
async function criarUsuarioSigma({ nome, email, whatsapp, plano }) {
  const username = gerarNumero(10);
  const password = gerarNumero(6);

  console.log("🛠 Criando usuário no QPanel...");

  const response = await axios.post(
    `${API_URL}/webhook/customer/create`,
    {
      userId: USER_ID,
      packageId: plano.packageId,
      username,
      password,
      name: nome,
      email,
      whatsapp,
      note: ""
    },
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      }
    }
  );

  // Se o painel devolver expires_at, usamos. Se não, fica null.
  const expiresAt = response.data?.expires_at || null;

  return {
    usuario: username,
    senha: password,
    expiracao: expiresAt
  };
}

module.exports = { criarUsuarioSigma };
