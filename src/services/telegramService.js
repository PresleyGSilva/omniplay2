const axios = require("axios");

async function enviarAcessoTelegram(dados) {
  const { nome, username, password, plano, validade, telefone } = dados;

  const botToken = "8493250500:AAHQ8huuPttNVVFV_iIMbzBfd79QKItTy5Q";
  const chatId = "-1003327352005"; // GRUPO/TÓPICO
  const topicId = null; // coloque um ID de tópico se quiser

  const msg = `
📢 *Novo acesso OmniPlay!*

👤 *Nome:* ${nome}
🔑 *Usuário:* \`${username}\`
🔒 *Senha:* \`${password}\`
📦 *Plano:* ${plano}
⏳ *Validade:* ${validade || "Não informado"}
📱 *Telefone:* ${telefone || "Não informado"}

🟢 Criado e liberado com sucesso.
  `.trim();

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const payload = {
      chat_id: chatId,
      text: msg,
      parse_mode: "Markdown"
    };

    // Se você quiser enviar para um tópico:
    if (topicId) payload.message_thread_id = topicId;

    const response = await axios.post(url, payload);

    console.log("📲 [TELEGRAM] Enviado com sucesso:", response.data);

    return true;
  } catch (err) {
    console.error("❌ Erro ao enviar para o Telegram:", err.response?.data || err);
    return false;
  }
}

module.exports = { enviarAcessoTelegram };
