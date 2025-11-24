// Aqui você depois troca para enviar de verdade pelo bot (axios na API do Telegram etc.)
async function enviarAcessoTelegram(dados) {
  const { nome, username, password, plano, validade, telefone } = dados;

  const msg = `
Novo acesso OmniPlay via Telegram:

Nome: ${nome}
Usuário: ${username}
Senha: ${password}
Plano: ${plano}
Validade: ${validade || "Não informado"}
Telefone: ${telefone || "Não informado"}
`.trim();

  console.log("📲 [TELEGRAM] Mensagem que seria enviada:");
  console.log(msg);

  // TODO: implementar envio real pro bot
  return true;
}

module.exports = { enviarAcessoTelegram };
