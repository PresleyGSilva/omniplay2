require("dotenv").config();

const { enviarEmailAcesso } = require("./emailService");

async function testarEnvio() {
  try {
    console.log("📨 Enviando email de teste...");

    await enviarEmailAcesso({
      email: "presleygs.dev@gmail.com",
      nome: "Teste OmniPlay",
      username: "usuarioTeste",
      password: "123456",
      expires_at: "30/12/2025"
    });

    console.log("✅ Email enviado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao enviar email:", err);
  }
}

testarEnvio();
